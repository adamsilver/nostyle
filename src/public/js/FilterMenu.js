function FilterMenu() {
	this.container = $('.filter');
	this.setupOptions();
	this.createToggleButton();
	this.setupResponsiveChecks();
	// $(window).on('scroll', $.proxy(this, 'onScroll'));
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
	this.menuButton = $('<button class="filter-button secondaryButton" type="button" aria-haspopup="true" aria-expanded="false">Filter...</button>');
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
	// this.fit();
};

FilterMenu.prototype.toggle = function() {
	if(this.menuButton.attr('aria-expanded') == 'false') {
		this.showMenu();
	} else {
		this.hideMenu();
	}
};

FilterMenu.prototype.onScroll = function(e) {
	// this.fit();
};

FilterMenu.prototype.fit = function() {
	var vh = $(window).height();
	var top = $('.filter-wrapper').offset().top;
	var scrollTop = $(window).scrollTop();

	console.log($('.filter').offset().top);


	var paddingTop = parseInt($('.filter-wrapper').css('paddingTop'), 10);
	var paddingBottom = parseInt($('.filter-wrapper').css('paddingBottom'),10);
	$('.filter-wrapper').height(vh-top-paddingTop-paddingBottom-30);
};