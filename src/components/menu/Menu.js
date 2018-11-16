function Menu(container, mq) {
	this.container = container;
	this.menu = this.container.find('.menu-wrapper');
	this.menu.attr('role', 'menu');
	this.container.find('.menu-item').attr('role', 'menuitem');
	this.mq = mq;
	this.keys = { esc: 27, up: 38, down: 40, tab: 9 };
	this.menu.on('keydown', '[role=menuitem]', $.proxy(this, 'onButtonKeydown'));
	this.createToggleButton();
	this.setupResponsiveChecks();
}

Menu.prototype.createToggleButton = function() {
	this.menuButton = $('<button type="button" aria-haspopup="true" aria-expanded="false">Actions</button>');
	this.menuButton.on('click', $.proxy(this, 'onMenuButtonClick'));
	this.menuButton.on('keydown', $.proxy(this, 'onMenuKeyDown'));
};

Menu.prototype.setupResponsiveChecks = function() {
	this.mql = window.matchMedia(this.mq);
	this.mql.addListener($.proxy(this, 'checkMode'));
	this.checkMode(this.mql);
};

Menu.prototype.checkMode = function(mql) {
	if(mql.matches) {
		this.enableBigMode();
	} else {
		this.enableSmallMode();
	}
};

Menu.prototype.enableSmallMode = function() {
	this.container.prepend(this.menuButton);
	this.hideMenu();
};

Menu.prototype.enableBigMode = function() {
	this.menuButton.detach();
	this.showMenu();
};

Menu.prototype.hideMenu = function() {
	this.menuButton.attr('aria-expanded', 'false');
};

Menu.prototype.showMenu = function(first_argument) {
	this.menuButton.attr('aria-expanded', 'true');
};

Menu.prototype.onMenuButtonClick = function() {
	this.toggle();
};

Menu.prototype.toggle = function() {
	if(this.menuButton.attr('aria-expanded') == 'false') {
		this.showMenu();
		this.menu.find('input').first().focus();
	} else {
		this.hideMenu();
		this.menuButton.focus();
	}
};

Menu.prototype.onMenuKeyDown = function(e) {
	switch (e.keyCode) {
		case this.keys.down:
			this.toggle();
			break;
	}
};

Menu.prototype.onButtonKeydown = function(e) {
	switch (e.keyCode) {
		case this.keys.up:
			e.preventDefault();
			this.focusPrevious(e.currentTarget);
			break;
		case this.keys.down:
			e.preventDefault();
			this.focusNext(e.currentTarget);
			break;
		case this.keys.esc:
			if(!this.mq.matches) {
				this.menuButton.focus();
				this.hideMenu();
			}
			break;
		case this.keys.tab:
			if(!this.mq.matches) {
				this.hideMenu();
			}
	}
};

Menu.prototype.focusNext = function(currentButton) {
	var next = $(currentButton).next();
	if(next[0]) {
		next.focus();
	} else {
		this.container.find('input').first().focus();
	}
};

Menu.prototype.focusPrevious = function(currentButton) {
	var prev = $(currentButton).prev();
	if(prev[0]) {
		prev.focus();
	} else {
		this.container.find('input').last().focus();
	}
};