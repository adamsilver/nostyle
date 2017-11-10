function SearchForm() {
	this.header = $('header');
	this.form = $('.searchForm');
	this.createButton();
	this.form.addClass('hidden');
}

SearchForm.prototype.createButton = function() {
	this.button = $('<button type="button" aria-haspopup="true" aria-expanded="false"><img src="/public/img/magnifying-glass.png" width="20" height="20"></button>');
	this.button.on('click', $.proxy(this, 'onButtonClick'));
	this.header.append(this.button);
};

SearchForm.prototype.onButtonClick = function() {
	if(this.button.attr('aria-expanded') == 'false') {
		this.button.attr('aria-expanded', 'true');
		this.form.removeClass('hidden');
		this.form.find('input').first().focus();
	} else {
		this.form.addClass('hidden');
		this.button.attr('aria-expanded', 'false');
	}
};