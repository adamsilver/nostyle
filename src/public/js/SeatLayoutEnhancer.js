function SeatLayoutEnhancer() {
	this.checkboxes = $('.plane-seat input');
	this.checkboxes.on('focus', $.proxy(this, 'onCheckboxFocus'));
	this.checkboxes.on('blur', $.proxy(this, 'onCheckboxBlur'));
	this.checkboxes.on('click', $.proxy(this, 'onCheckboxClick'));
}

SeatLayoutEnhancer.prototype.onCheckboxFocus = function(e) {
	$(e.target).parents('.plane-seat').addClass('plane-seat-isFocussed');
};

SeatLayoutEnhancer.prototype.onCheckboxBlur = function(e) {
	$(e.target).parents('.plane-seat').removeClass('plane-seat-isFocussed');
};

SeatLayoutEnhancer.prototype.check = function(checkbox) {
	checkbox.parents('.plane-seat').addClass('plane-seat-isSelected');
};

SeatLayoutEnhancer.prototype.uncheck = function(checkbox) {
	checkbox.parents('.plane-seat').removeClass('plane-seat-isSelected');
};

SeatLayoutEnhancer.prototype.onCheckboxClick = function(e) {
	this.checkboxes.each($.proxy(function(index, el){
		if(el.checked) {
			this.check($(el));
		} else {
			this.uncheck($(el));
		}
	}, this))
};

