function AddAnotherForm(container) {
	this.container = $(container);
	this.container.on('click', '.addAnother-removeButton', $.proxy(this, 'onRemoveButtonClick'));
	this.container.on('click', '.addAnother-addButton', $.proxy(this, 'onAddButtonClick'));
	this.container.find('.addAnother-addButton, .addAnother-removeButton').prop('type', 'button');
}

AddAnotherForm.prototype.onAddButtonClick = function(e) {
	var item = this.getNewItem();
	this.updateAttributes(this.getItems().length, item);
	this.resetItem(item);
	var firstItem = this.getItems().first();
	if(!this.hasRemoveButton(firstItem)) {
    this.createRemoveButton(firstItem);
	}
	this.getItems().last().after(item);
	item.find('input, textarea, select').first().focus();
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

AddAnotherForm.prototype.resetItem = function(item) {
	item.find('[data-name], [data-id]').each(function(index, el) {
		if(el.type == 'checkbox' || el.type == 'radio') {
			el.checked = false;
		} else {
			el.value = '';
		}
	});
};

AddAnotherForm.prototype.onRemoveButtonClick = function(e) {
	$(e.currentTarget).parents('.addAnother-item').remove();
	var items = this.getItems();
	if(items.length === 1) {
		items.find('.addAnother-removeButton').remove();
	}
	items.each($.proxy(function(index, el) {
		this.updateAttributes(index, $(el));
	}, this));
	this.focusHeading();
};

AddAnotherForm.prototype.focusHeading = function() {
	this.container.find('.addAnother-heading').focus();
};