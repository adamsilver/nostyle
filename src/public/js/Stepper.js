function Stepper(input, options) {
	this.input = $(input);
	this.container = this.input.parent();
	this.setOptions(options);
	this.wrapper = $('<div class="stepper"></div>');
	this.wrapper.append(this.input);
	this.container.append(this.wrapper);
	this.createDecrementButton();
	this.createIncrementButton();
	this.createStatusBox();
	this.wrapper.on('click', '.stepper-decrementButton', $.proxy(this, 'onDecrementClick'));
	this.wrapper.on('click', '.stepper-incrementButton', $.proxy(this, 'onIncrementClick'));
}

Stepper.prototype.createStatusBox = function() {
	this.statusBox = $('<div role="status" aria-live="polite" class="vh" />');
	this.wrapper.append(this.statusBox);
};

Stepper.prototype.setOptions = function(options) {
	var defaults = {
		decrementLabel: 'Decrement',
		incrementLabel: 'Increment'
	};
	this.options = $.extend(defaults, options);
};

Stepper.prototype.createDecrementButton = function() {
	this.decrementButton = $('<button class="stepper-decrementButton" type="button" aria-label="'+this.options.decrementLabel+'">&minus;</button>');
	if(this.options.labelId) {
		this.decrementButton.attr('aria-describedby', this.options.labelId);
	}
	this.wrapper.prepend(this.decrementButton);
};

Stepper.prototype.createIncrementButton = function() {
	this.incrementButton = $('<button class="stepper-incrementButton" type="button" aria-label="'+this.options.incrementLabel+'">&#43;</button>');
	if(this.options.labelId) {
		this.incrementButton.attr('aria-describedby', this.options.labelId);
	}
	this.wrapper.append(this.incrementButton);
};

Stepper.prototype.getInputValue = function() {
	var val = parseInt(this.input.val(), 10);
	if(isNaN(val)) {
		val = 0;
	}
	return val;
};

Stepper.prototype.onDecrementClick = function(e) {
	var newVal = this.getInputValue() - 1;
	if(newVal >= parseInt(this.input.attr('min'), 10)) {
		this.input.val(newVal);
		this.updateStatusBox(newVal);
	}
};

Stepper.prototype.onIncrementClick = function(e) {
	var newVal = this.getInputValue() + 1;
	if(newVal <= parseInt(this.input.attr('max'), 10)) {
		this.input.val(newVal);
		this.updateStatusBox(newVal);
	}
};

Stepper.prototype.updateStatusBox = function(val) {
	this.statusBox.html(val);
};