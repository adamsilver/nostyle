function FilterMenu() {
	this.container = $('.filter');
	this.setupOptions();
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
	this.menuButton = $('<button class="menu-button" type="button" aria-haspopup="true" aria-expanded="false">Filter...</button>');
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
};

FilterMenu.prototype.enableBigMode = function() {
	this.menuButton.detach();
	this.showMenu();
};

FilterMenu.prototype.hideMenu = function() {
	this.menuButton.attr('aria-expanded', 'false');
};

FilterMenu.prototype.showMenu = function(first_argument) {
	this.menuButton.attr('aria-expanded', 'true');
};

FilterMenu.prototype.onMenuButtonClick = function() {
	this.toggle();
};

FilterMenu.prototype.toggle = function() {
	if(this.menuButton.attr('aria-expanded') == 'false') {
		this.showMenu();
	} else {
		this.hideMenu();
	}
};