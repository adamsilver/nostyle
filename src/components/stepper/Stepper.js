function Stepper(input, options) {
	this.input = $(input);
	this.container = this.input.parent();
	this.setOptions(options);
	this.wrapper = $('<div class="stepper"></div>');
	this.wrapper.append(this.input);
	this.container.append(this.wrapper);
	this.createRemoveButton();
	this.createAddButton();
	this.createStatusBox();
	this.wrapper.on('click', '.stepper-removeButton', $.proxy(this, 'onRemoveClick'));
	this.wrapper.on('click', '.stepper-addButton', $.proxy(this, 'onAddClick'));
}

Stepper.prototype.createStatusBox = function() {
	this.statusBox = $('<div role="status" aria-live="polite" class="visually-hidden" />');
	this.wrapper.append(this.statusBox);
};

Stepper.prototype.setOptions = function(options) {
	var defaults = {
		removeLabel: 'Remove',
		addLabel: 'Add'
	};
	this.options = $.extend(defaults, options);
};

Stepper.prototype.createRemoveButton = function() {
	this.removeButton = $('<button class="stepper-removeButton" type="button" aria-label="'+this.options.removeLabel+'">&minus;</button>');
	if(this.options.labelId) {
		this.removeButton.attr('aria-describedby', this.options.labelId);
	}
	this.wrapper.prepend(this.removeButton);
};

Stepper.prototype.createAddButton = function() {
	this.addButton = $('<button class="stepper-addButton" type="button" aria-label="'+this.options.addLabel+'">&#43;</button>');
	if(this.options.labelId) {
		this.addButton.attr('aria-describedby', this.options.labelId);
	}
	this.wrapper.append(this.addButton);
};

Stepper.prototype.getInputValue = function() {
	var val = parseInt(this.input.val(), 10);
	if(isNaN(val)) {
		val = 0;
	}
	return val;
};

Stepper.prototype.onRemoveClick = function(e) {
	var newVal = this.getInputValue() - 1;
	if(newVal >= parseInt(this.input.attr('min'), 10)) {
		this.input.val(newVal);
		this.updateStatusBox(newVal);
	}
};

Stepper.prototype.onAddClick = function(e) {
	var newVal = this.getInputValue() + 1;
	if(newVal <= parseInt(this.input.attr('max'), 10)) {
		this.input.val(newVal);
		this.updateStatusBox(newVal);
	}
};

Stepper.prototype.updateStatusBox = function(val) {
	this.statusBox.html(val);
};