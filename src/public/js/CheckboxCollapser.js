function CheckboxCollapser(checkbox, container) {
	this.checkbox = checkbox;
	this.container = $(container);
	this.check();
	$(this.checkbox).on('click', $.proxy(this, 'onCheckboxClick'));
};

CheckboxCollapser.prototype.onCheckboxClick = function(e) {
	this.check();
};

CheckboxCollapser.prototype.check = function() {
	this.container[this.checkbox.checked ? 'hide' : 'show']();
};