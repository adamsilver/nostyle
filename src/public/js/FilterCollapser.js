function FilterCollapser(fieldset) {
	this.fieldset = fieldset;
	this.options = this.fieldset.find('.field-options');
	this.legend = this.fieldset.find('legend');
	this.createButton();
	this.hide();
}

FilterCollapser.prototype.createButton = function() {
	this.button = $('<button type="button" aria-expanded="true">'+this.legend.text()+'<svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><rect class="vert" height="8" width="2" y="1" x="4" /> <rect height="2" width="8" y="4" x="1" /></svg></button>');
	this.button.on('click', $.proxy(this, 'onButtonClick'));
	this.legend.html(this.button);
};

FilterCollapser.prototype.onButtonClick = function(e) {
	 this[this.button.attr('aria-expanded') == 'true' ? 'hide' : 'show']();
};

FilterCollapser.prototype.hide = function() {
	this.button.attr('aria-expanded', 'false');
	this.options.addClass('hidden');
};

FilterCollapser.prototype.show = function() {
	this.button.attr('aria-expanded', 'true');
	this.options.removeClass('hidden');
};