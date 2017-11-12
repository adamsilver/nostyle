function PasswordRevealer(el) {
  this.el = el;
  this.container = $(this.el).parent();
  this.container.addClass('passwordRevealer');
  this.createButton();
};

PasswordRevealer.prototype.createButton = function() {
  this.button = $('<button type="button" class="secondaryButton">Show password</button>');
  this.container.append(this.button);
  this.button.on('click', $.proxy(this, 'onButtonClick'));
};

PasswordRevealer.prototype.onButtonClick = function(e) {
  if(this.el.type === 'password') {
    this.el.type = 'text';
    this.button.text('Hide password');
  } else {
    this.el.type = 'password';
    this.button.text('Show password');
  }
};