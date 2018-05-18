function CheckboxCollapser(checkbox, toggleElement) {
	this.checkbox = checkbox;
	this.toggleElement = toggleElement;
	this.check();
	this.checkbox.on('click', $.proxy(this, 'onCheckboxClick'));
};

CheckboxCollapser.prototype.onCheckboxClick = function(e) {
	this.check();
};

CheckboxCollapser.prototype.check = function() {
	if(this.checkbox.prop('checked')) {
		this.toggleElement.addClass('hidden');
	} else {
		this.toggleElement.removeClass('hidden');
	}
};