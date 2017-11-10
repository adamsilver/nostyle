/*
value.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
*/
function Autocomplete(select) {
	this.select = select;
	this.container = $(select).parent();
	this.wrapper = $('<div class="autocomplete"></div>');
	this.container.append(this.wrapper);
	this.createTextBox();
	this.createArrowIcon();
	this.createOptionsUl();
	this.hideSelectBox();
	this.createStatusBox();
	this.setupKeys();
	$(document).on('click', $.proxy(this, 'onDocumentClick'));
};

Autocomplete.prototype.onDocumentClick = function(e) {
	if(!$.contains(this.container[0], e.target)) {
        this.hideMenu();
        this.removeTextBoxFocus();
    }
};

Autocomplete.prototype.setupKeys = function() {
	this.keys = {
		enter: 13,
		esc: 27,
		space: 32,
		up: 38,
		down: 40,
		tab: 9,
		left: 37,
		right: 39
   };
};

Autocomplete.prototype.addTextBoxEvents = function() {
	this.textBox.on('click', $.proxy(this, 'onTextBoxClick'));
	this.textBox.on('keyup', $.proxy(this, 'onTextBoxKeyUp'));
	this.textBox.on('keydown', $.proxy(function(e) {
		switch (e.keyCode) {
			// this ensures that when users tabs away
			// from textbox that the normal tab sequence
			// is adhered to. We hide the options, which
			// removes the ability to focus the options
			case this.keys.tab:
				this.hideMenu();
				this.removeTextBoxFocus();
				break;
		}
	}, this));
	this.textBox.on('focus', $.proxy(this, 'onTextBoxFocus'));
};

Autocomplete.prototype.onTextBoxFocus = function() {
	this.textBox.addClass('autocomplete-isFocused');
};

Autocomplete.prototype.removeTextBoxFocus = function() {
	this.textBox.removeClass('autocomplete-isFocused');
};

Autocomplete.prototype.onTextBoxClick = function(e) {
	this.clearOptions();
	var options = this.getAllOptions();
	this.buildMenu(options);
	this.updateStatus(options.length);
	this.showMenu();
	if(typeof e.currentTarget.select === 'function') {
        e.currentTarget.select();
    }
};

Autocomplete.prototype.addSuggestionEvents = function() {
	this.optionsUl.on('click', '.autocomplete-option', $.proxy(this, 'onSuggestionClick'));
	this.optionsUl.on('keydown', $.proxy(this, 'onSuggestionsKeyDown'));
};

Autocomplete.prototype.onTextBoxKeyUp = function(e) {
	switch (e.keyCode) {
		case this.keys.esc:
			// we ignore when users presses escape
			break;
		case this.keys.up:
			// we ignore when the user presses up when on textbox
			break;
		case this.keys.left:
			// we ignore when the user presses left when on textbox
			break;
		case this.keys.right:
			// we ignore when the user presses right when on textbox
			break;
		case this.keys.down:
			// we want to handle this one
			this.onTextBoxDownPressed(e);
			break;
		case this.keys.space:
			// ignore this because otherwise the
			// the menu will show again.
			break;
		case this.keys.enter:
			// we ignore when the user presses enter here,
			// otherwise the menu will show briefly before
			// submission completes
			break;
		default:
			// show suggestion
			this.onTextBoxType(e);
	}
};

Autocomplete.prototype.onSuggestionsKeyDown = function(e) {
	switch (e.keyCode) {
		case this.keys.up:
			// want to highlight previous option
			this.onSuggestionUpArrow(e);
			break;
		case this.keys.down:
			// want to highlight next suggestion
			this.onSuggestionDownArrow(e);
			break;
		case this.keys.enter:
			// want to select the suggestion
			this.onSuggestionEnter(e);
			break;
		case this.keys.space:
			// want to select the suggestion
			this.onSuggestionSpace(e);
			break;
		case this.keys.esc:
			// want to hide options
			this.onSuggestionEscape(e);
			break;
		case this.keys.tab:
			this.hideMenu();
			this.removeTextBoxFocus();
			break;
		default:
			this.textBox.focus();
	}
};

Autocomplete.prototype.onTextBoxType = function(e) {
	if(this.textBox.val().trim().length > 0) {
		var options = this.getOptions(this.textBox.val().trim().toLowerCase());
		this.buildMenu(options);
		this.showMenu();
		this.updateStatus(options.length);
	} else {
		this.hideMenu();
	}
	this.updateSelectBox();
};

Autocomplete.prototype.updateSelectBox = function() {
	var value = this.textBox.val().trim();
	var option = this.getMatchingOption(value);
	if(option) {
		$(this.select).val(option.value);
	} else {
		$(this.select).val('');
	}
};

Autocomplete.prototype.onSuggestionEscape = function(e) {
	this.clearOptions();
	this.hideMenu();
	this.focusTextBox();
};

Autocomplete.prototype.focusTextBox = function() {
	this.textBox.focus();
};

Autocomplete.prototype.onSuggestionEnter = function(e) {
	if(this.isOptionSelected()) {
		this.selectOption();
	}
	// we don't want form to submit
	e.preventDefault();
};

Autocomplete.prototype.onSuggestionSpace = function(e) {
	if(this.isOptionSelected()) {
		this.selectOption();
		// we don't want a space to be added to text box
		e.preventDefault();
	}
};

Autocomplete.prototype.onSuggestionClick = function(e) {
	var suggestion = $(e.currentTarget);
	this.selectSuggestion(suggestion);
};

Autocomplete.prototype.selectOption = function() {
	var suggestion = this.getActiveOption();
	this.selectSuggestion(suggestion);
};

Autocomplete.prototype.selectSuggestion = function(suggestion) {
	var value = suggestion.attr('data-option-value');
	this.textBox.val(value);
	this.setValue(value);
	this.hideMenu();
	this.focusTextBox();
};

Autocomplete.prototype.onTextBoxDownPressed = function(e) {
	var option;
	var options;
	var value = this.textBox.val().trim();
	// Empty value or exactly matches an option 
	// then show all the options
	if(value.length === 0 || this.isExactMatch(value)) {
		options = this.getAllOptions();
		this.buildMenu(options);
		this.showMenu();
		option = this.getFirstOption();
		this.highlightOption(option);
	} else {
		options = this.getOptions(this.textBox.val().trim());
		if(options.length > 0) {
			this.buildMenu(options);
			this.showMenu();
			option = this.getFirstOption();
			this.highlightOption(option);
		}
	}
};

Autocomplete.prototype.onSuggestionDownArrow = function(e) {
	var option = this.getNextOption();
	if(option[0]) {
		this.highlightOption(option);
	}
	e.preventDefault();
};

Autocomplete.prototype.onSuggestionUpArrow = function(e) {
	if(this.isOptionSelected()) {
		option = this.getPreviousOption();
		if(option[0]) {
			this.highlightOption(option);

		} else {
			this.focusTextBox();
			this.hideMenu();
		}
	}
	e.preventDefault();
};

Autocomplete.prototype.isOptionSelected = function() {
	return this.activeOptionId;
};

Autocomplete.prototype.getActiveOption = function() {
	return $('#'+this.activeOptionId);
};

Autocomplete.prototype.getFirstOption = function() {
	return this.optionsUl.find('li').first();
};

Autocomplete.prototype.getPreviousOption = function() {
	return $('#'+this.activeOptionId).prev();
};

Autocomplete.prototype.getNextOption = function() {
	return $('#'+this.activeOptionId).next();
};

Autocomplete.prototype.highlightOption = function(option) {
	if(this.activeOptionId) {
		var activeOption = this.getOptionById(this.activeOptionId);
		activeOption.removeClass('autocomplete-option-isActive');
		activeOption.attr('aria-selected', 'false');
	}

	option.addClass('autocomplete-option-isActive');
	option.attr('aria-selected', 'true');

	if(!this.isElementVisible(option.parent(), option)) {
		option.parent().scrollTop(option.parent().scrollTop() + option.position().top);
	}

	this.activeOptionId = option[0].id;
	option.focus();
};

Autocomplete.prototype.getOptionById = function(id) {
	return $('#'+id);
};

Autocomplete.prototype.showMenu = function() {
	this.optionsUl.removeClass('autocomplete-options-isHidden');
	this.optionsUl.attr('aria-hidden', 'false');
	this.textBox.attr('aria-expanded', 'true');
	this.textBox.attr('tabindex', '0');
};

Autocomplete.prototype.hideMenu = function() {
	this.optionsUl.addClass('autocomplete-options-isHidden');
	this.optionsUl.attr('aria-hidden', 'true');
	this.textBox.attr('aria-expanded', 'false');
	this.activeOptionId = null;
	this.clearOptions();
	this.textBox.removeAttr('tabindex', '-1');
};

Autocomplete.prototype.clearOptions = function() {
	this.optionsUl.empty();
};

Autocomplete.prototype.getOptions = function(value) {
	var options = [];
	var selectOptions = this.select.options;
	var optionText;
	var optionValue;
	for(var i = 0; i < selectOptions.length; i++) {
		optionText = $(selectOptions[i]).text();
		optionValue = $(selectOptions[i]).val();
		if(optionValue.trim().length > 0 && optionText.toLowerCase().indexOf(value.toLowerCase()) > -1) {
			options.push({ 
				text: optionText, 
				value: optionValue 
			});
		}
	}
	return options;
};

Autocomplete.prototype.getAllOptions = function() {
	var options = [];
	var selectOptions = this.select.options;
	for(var i = 0; i < selectOptions.length; i++) {
		var value = $(selectOptions[i]).val();
		if(value.trim().length > 0) {
			options.push({
				text: $(selectOptions[i]).text(),
				value: $(selectOptions[i]).val()
			});
		}
	}
	return options;
};

Autocomplete.prototype.isExactMatch = function(value) {
	return this.getMatchingOption(value);
};

Autocomplete.prototype.getMatchingOption = function(value) {
	var option = null;
	var options = this.select.options;
	for(var i = 0; i < options.length; i++) {
		if(options[i].text.toLowerCase() === value.toLowerCase()) {
			option = options[i];
			break;
		}
	}
	return option;
};

Autocomplete.prototype.buildMenu = function(options) {
	this.clearOptions();
	this.activeOptionId = null;

	if(options.length) {
		for(var i = 0; i < options.length; i++) {
			this.optionsUl.append(this.getOptionHtml(i, options[i]));
		}
	} else {
		this.optionsUl.append(this.getNoResultsOptionHtml());
	}
	this.optionsUl.scrollTop(this.optionsUl.scrollTop());
};

Autocomplete.prototype.getNoResultsOptionHtml = function() {
	return '<li class="autocomplete-optionNoResults" role="option">' + 'No results' + '</li>';
};

Autocomplete.prototype.getOptionHtml = function(i, option) {
	return '<li tabindex="-1" class="autocomplete-option" aria-selected="false" role="option" data-option-value="'+ option.value +'" id="autocomplete-option--' + i + '">' + option.text + '</li>';
};

Autocomplete.prototype.createStatusBox = function() {
	this.status = $('<div aria-live="polite" role="status" aria-atomic="true" class="autocomplete-status" />');
	this.wrapper.append(this.status);
};

Autocomplete.prototype.updateStatus = function(resultCount) {
	if(resultCount === 0) {
		this.status.text('No results.');
	} else {
		this.status.text(resultCount + ' results available.');
	}
};

Autocomplete.prototype.hideSelectBox = function() {
	$(this.select).attr('aria-hidden', 'true');
	$(this.select).attr('tabindex', '-1');
	$(this.select).addClass('vh');
	this.select.id = '';
};

Autocomplete.prototype.createTextBox = function() {
	this.textBox = $('<input autocapitalize="none" class="autocomplete-textBox" type="text" autocomplete="off">');

	this.textBox.attr('aria-owns', this.getOptionsId());
	this.textBox.attr('aria-autocomplete', 'list');
	this.textBox.attr('role', 'combobox');

	this.textBox.prop('id', this.select.id);

	var selectedVal = $(this.select).find('option:selected').val();

	if(selectedVal.trim().length > 0) {
		this.textBox.val($(this.select).find('option:selected').text());
	}

	this.wrapper.append(this.textBox);
	this.addTextBoxEvents();
};

Autocomplete.prototype.getOptionsId = function() {
	return 'autocomplete-options--'+this.select.id;
};

Autocomplete.prototype.createArrowIcon = function() {
	var arrow = $('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" class="autocomplete-downArrow"><g stroke="none" fill="none" fill-rule="evenodd"><polygon fill="#000000" points="0 0 22 0 11 17"></polygon></g></svg>');
	this.wrapper.append(arrow);
	arrow.on('click', $.proxy(this, 'onArrowClick'));
};

Autocomplete.prototype.onArrowClick = function(e) {
	this.clearOptions();
	var options = this.getAllOptions();
	this.buildMenu(options);
	this.updateStatus(options.length);
	this.showMenu();
	this.textBox.focus();
};

Autocomplete.prototype.createOptionsUl = function() {
	this.optionsUl = $('<ul id="'+this.getOptionsId()+'" role="listbox" class="autocomplete-options autocomplete-options-isHidden" aria-hidden="true"></ul>');
	this.wrapper.append(this.optionsUl);
	this.addSuggestionEvents();
};

Autocomplete.prototype.isElementVisible = function(container, element) {
	var containerHeight = $(container).height();
	var elementTop = $(element).offset().top;
	var containerTop = $(container).offset().top;
	var elementPaddingTop = parseInt($(element).css('padding-top'), 10);
	var elementPaddingBottom = parseInt($(element).css('padding-bottom'), 10);
	var elementHeight = $(element).height() + elementPaddingTop + elementPaddingBottom;
    var visible;

    if ((elementTop - containerTop < 0) || (elementTop - containerTop + elementHeight > containerHeight)) {
		visible = false;
    } else {
		visible = true;
    }
    return visible;
};

Autocomplete.prototype.getOption = function(value) {
	return $(this.select).find('option[value="'+value+'"]');
};

Autocomplete.prototype.setValue = function(val) {
	$(this.select).val(val);
	var text = this.getOption(val).text();
	if(val.trim().length > 0) {
		this.textBox.val(text);
	} else {
		this.textBox.val('');
	}
};