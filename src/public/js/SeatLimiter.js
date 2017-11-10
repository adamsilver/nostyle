function SeatLimiter(max) {
	this.max = max;
	this.checkboxes = $('.plane-seat input');
	this.checkboxes.on('click', $.proxy(this, 'onCheckboxClick'));
}

SeatLimiter.prototype.onCheckboxClick = function(e) {
	var checkbox = e.target;
	var selected = this.checkboxes.filter(':checked');
	if(checkbox.checked && selected.length > this.max) {
		selected.not(checkbox)[0].checked = false;
	}
};