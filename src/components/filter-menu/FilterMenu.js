function FilterMenu(options) {
	this.container = $('.filter');
	this.setupOptions(options);
	this.createToggleButton();
	this.setupResponsiveChecks();
}

FilterMenu.prototype.setupOptions = function(options) {
	options = options || {};
	options.mq = options.mq || '(min-width: 50em)';
	this.options = options;
};

FilterMenu.prototype.setupResponsiveChecks = function() {
	this.mq = window.matchMedia(this.options.mq);
	this.mq.addListener($.proxy(this, 'checkMode'));
	this.checkMode(this.mq);
};

FilterMenu.prototype.createToggleButton = function() {
	this.menuButton = $('<button class="filter-button secondaryButton" type="button" aria-haspopup="true" aria-expanded="false">Filter</button>');
	this.menuButton.on('click', $.proxy(this, 'onMenuButtonClick'));
};

FilterMenu.prototype.checkMode = function(mq) {
	if(mq.matches) {
		this.enableBigMode();
	} else {
		this.enableSmallMode();
	}
};

FilterMenu.prototype.enableSmallMode = function() {
	this.container.prepend(this.menuButton);
	this.hideMenu();
	this.addCloseButton();
};

FilterMenu.prototype.addCloseButton = function() {
	var wrapper = $('.filter-wrapper');
	this.closeButton = $('<button class="filter-close" type="button" aria-label="close filters" aria-hidden="true" focusable="false"><svg viewBox="0 0 10 10"><path d="m7.1 1.4 1.4 1.4-5.6 5.6-1.4-1.4zm-4.2 0l5.6 5.6-1.4 1.4-5.6-5.6z"/></svg></button>');
	this.closeButton.on('click', $.proxy(this, 'onCloseClick'));
	wrapper.prepend(this.closeButton);
};

FilterMenu.prototype.onCloseClick = function() {
	this.hideMenu();
	this.menuButton.focus();
};

FilterMenu.prototype.enableBigMode = function() {
	this.menuButton.detach();
	this.showMenu();
	if(this.closeButton) {
		this.closeButton.remove();
	}
};

FilterMenu.prototype.hideMenu = function() {
	this.menuButton.attr('aria-expanded', 'false');
};

FilterMenu.prototype.showMenu = function() {
	this.menuButton.attr('aria-expanded', 'true');
};

FilterMenu.prototype.onMenuButtonClick = function() {
	this.toggle();
	this.closeButton.focus();
};

FilterMenu.prototype.toggle = function() {
	if(this.menuButton.attr('aria-expanded') == 'false') {
		this.showMenu();
	} else {
		this.hideMenu();
	}
};