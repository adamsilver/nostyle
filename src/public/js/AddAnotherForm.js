function AddAnotherForm(container) {
	this.container = $(container);
	this.container.on('click', '.addAnother-removeButton', $.proxy(this, 'onRemoveButtonClick'));
	this.container.on('click', '.addAnother-addButton', $.proxy(this, 'onAddButtonClick'));
	this.createStatusBox();
}

AddAnotherForm.prototype.createStatusBox = function() {
	this.status = $('<div role="status" aria-live="polite"></div>');
	this.container.append(this.status);
};

AddAnotherForm.prototype.onAddButtonClick = function(e) {
	e.preventDefault();
	var item = this.getNewItem();
	this.updateAttributes(this.getItems().length, item);
	// this.resetItem(item);
	var firstItem = this.getItems().first();
	if(!this.hasRemoveButton(firstItem)) {
		this.createRemoveButton(firstItem);	
	}
	this.getItems().last().after(item);
	// this.focusField(item);
};

AddAnotherForm.prototype.hasRemoveButton = function(item) {
	return item.find('.addAnother-removeButton').length;
};

AddAnotherForm.prototype.getItems = function() {
	return this.container.find('.addAnother-item');
};

AddAnotherForm.prototype.getNewItem = function() {
	var item = this.getItems().first().clone();
	if(!this.hasRemoveButton(item)) {
		this.createRemoveButton(item);
	}
	return item;
};

AddAnotherForm.prototype.updateAttributes = function(index, item) {
	item.find('[data-name]').each(function(i, el) {
		el.name = $(el).attr('data-name').replace(/%index%/, index);
		el.id = $(el).attr('data-id').replace(/%index%/, index);
		($(el).prev('label')[0] || $(el).parents('label')[0]).htmlFor = el.id;
	});
};

AddAnotherForm.prototype.createRemoveButton = function(item) {
	item.append('<button type="button" class="secondaryButton addAnother-removeButton">Remove</button>');
};

AddAnotherForm.prototype.updateAllAttributes = function() {
	this.container.find('.addAnother-item').each($.proxy(function(index, el) {
		this.updateAttributes(index, $(el));
	}, this));
};

AddAnotherForm.prototype.resetItem = function(item) {
	item.find('[data-name], [data-id]').each(function(index, el) {
		if(el.type == 'checkbox' || el.type == 'radio') {
			el.checked = false;
		} else {
			el.value = '';
		}
	});
};

AddAnotherForm.prototype.focusField = function(item) {
	item.find('.field').first().find('input, textarea, select').focus();
};

AddAnotherForm.prototype.onRemoveButtonClick = function(e) {
	e.preventDefault();
	var items = this.getItems();
	$(e.currentTarget).parents('.addAnother-item').remove();
	if(items.length == 2) {
		items.find('.addAnother-removeButton').remove();
	}
	this.updateAllAttributes();
	this.focusHeading();
};

AddAnotherForm.prototype.focusHeading = function() {
	this.container.find('.addAnother-heading').focus();
};