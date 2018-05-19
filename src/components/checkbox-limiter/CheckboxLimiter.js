function CheckboxLimiter(max) {
	this.max = max;
	this.checkboxes = $('.plane-seat input');
	this.checkboxes.on('click', $.proxy(this, 'onCheckboxClick'));
	this.lastChecked = null;
}

CheckboxLimiter.prototype.onCheckboxClick = function(e) {
	var checkbox = e.target;
	var selected = this.checkboxes.filter(':checked');
	if(selected.length > this.max) {
		selected
			.not(checkbox)
			.not(this.lastChecked)[0].checked = false;
	}
	this.lastChecked = checkbox;
};