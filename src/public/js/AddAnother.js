function AddAnother(container) {
	this.container = $(container);
	this.container.on('click', '.addAnother-removeButton', $.proxy(this, 'onRemoveButtonClick'));
	this.container.on('click', '.addAnother-addButton', $.proxy(this, 'onAddButtonClick'));
	this.addRemoveButtons();
	this.createStatusBox();
}

AddAnother.prototype.createStatusBox = function() {
	this.status = $('<div role="status" aria-live="polite"></div>');
	this.container.append(this.status);
};

AddAnother.prototype.addRemoveButtons = function(e) {
	var items = this.container.find('.addAnother-item');
	items.each(function(i, el) {
		if(i != 0) {
			$(el).append('<button class="addAnother-removeButton" type="button">- Remove</button>');
		}
	});
};

AddAnother.prototype.onAddButtonClick = function(e) {
	e.preventDefault();
	this.cloneItem();
	this.updateItems();
	this.focusLastItem();
};

AddAnother.prototype.cloneItem = function() {
	var items = this.container.find('.addAnother-item');
	var item = this.container.find('.addAnother-item')[0];
	var newItem = $(item).clone();
	this.appendRemoveButton(newItem);
	if(items.length === 1) {
		this.appendRemoveButton($(item));
	}
	this.container.find('.addAnother-items').append(newItem);

	// reset value and checked states
	newItem.find('[data-name], [data-id]').each(function(index, el) {
		if(el.type == 'checkbox' || el.type == 'radio') {
			el.checked = false;
		} else {
			el.value = '';
		}
	});
};

AddAnother.prototype.appendRemoveButton = function(item) {
	item.append('<input type="submit" class="secondaryButton addAnother-removeButton" value="Remove">');
};

AddAnother.prototype.updateItems = function() {
	this.container.find('.addAnother-item').each(function(index, el) {
		$(el).find('[data-name], [data-id]').each(function(index2, el) {
			// var idAttr = $(el).attr('data-name');
			el.name = $(el).attr('data-name').replace(/%index%/, index);
			el.id = $(el).attr('data-id').replace(/%index%/, index);

			var label = $(el).parents('label');
			if(label[0]) {
				label[0].htmlFor = el.id;
				// el.checked = false;
			} else {
				label = $(el).prev('label');
				label[0].htmlFor = el.id;
				// el.value = '';
			}
		});
	});
};

AddAnother.prototype.focusLastItem = function() {
	this.container.find('.addAnother-item:last .field:first').find('input, textarea, select').focus();
};

AddAnother.prototype.onRemoveButtonClick = function(e) {
	e.preventDefault();
	var items = this.container.find('.addAnother-item');
	$(e.currentTarget).parents('.addAnother-item').remove();
	if(items.length == 2) {
		items.find('.addAnother-removeButton').remove();
	}
	this.updateItems();
	this.focusHeading();
};

AddAnother.prototype.focusHeading = function() {
	this.container.find('.addAnother-heading').focus();
};