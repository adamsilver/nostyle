function AddAnotherForm(container) {
	this.container = $(container);
	this.container.on('click', '.addAnother-removeButton', $.proxy(this, 'onRemoveButtonClick'));
	this.container.on('click', '.addAnother-addButton', $.proxy(this, 'onAddButtonClick'));
	this.setupRemoveButtons();
	this.createStatusBox();
}

AddAnotherForm.prototype.createStatusBox = function() {
	this.status = $('<div role="status" aria-live="polite"></div>');
	this.container.append(this.status);
};

AddAnotherForm.prototype.setupRemoveButtons = function(e) {
	var items = this.container.find('.addAnother-item');
	items.each(function(i, el) {
		if(i != 0) {
			$(el).append('<button class="addAnother-removeButton" type="button">- Remove</button>');
		}
	});
};

AddAnotherForm.prototype.onAddButtonClick = function(e) {
	e.preventDefault();
	this.cloneItem();
	this.checkFirstItemRemoveButton();
};

AddAnotherForm.prototype.cloneItem = function(items) {
	var items = this.container.find('.addAnother-item');
	var newItem = items.first().clone();
	this.appendRemoveButton(newItem);
	this.updateItemAttributes(newItem, items.length);
	this.resetItem(newItem);
	items.last().after(newItem);
	this.focusField(newItem);
};

AddAnotherForm.prototype.updateItemAttributes = function(item, index) {
	item.find('[data-name], [data-id]').each(function(i, el) {
		el.name = $(el).attr('data-name').replace(/%index%/, index);
		el.id = $(el).attr('data-id').replace(/%index%/, index);
		var label = $(el).parents('label');
		if(label.length) {
			label[0].htmlFor = el.id;
		} else {
			label = $(el).prev('label');
			label[0].htmlFor = el.id;
		}
	});
};

AddAnotherForm.prototype.checkFirstItemRemoveButton = function() {
	var items = this.container.find('.addAnother-item');
	if(items.length === 2) {
		this.appendRemoveButton(items.first());
	}
};

AddAnotherForm.prototype.appendRemoveButton = function(item) {
	item.append('<button type="button" class="secondaryButton addAnother-removeButton">Remove</button>');
};

AddAnotherForm.prototype.updateAttributes = function() {
	this.container.find('.addAnother-item').each(function(index, el) {
		$(el).find('[data-name], [data-id]').each(function(index2, el) {
			el.name = $(el).attr('data-name').replace(/%index%/, index);
			el.id = $(el).attr('data-id').replace(/%index%/, index);
			var label = $(el).parents('label');
			if(label.length) {
				label[0].htmlFor = el.id;
			} else {
				label = $(el).prev('label');
				label[0].htmlFor = el.id;
			}
		});
	});
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
	var items = this.container.find('.addAnother-item');
	$(e.currentTarget).parents('.addAnother-item').remove();
	if(items.length == 2) {
		items.find('.addAnother-removeButton').remove();
	}
	this.updateAttributes();
	this.focusHeading();
};

AddAnotherForm.prototype.focusHeading = function() {
	this.container.find('.addAnother-heading').focus();
};