function RadioRevealer(container) {
  this.radios = container.find('[type="radio"]');
  this.radios.on('click', $.proxy(this, 'onRadioButtonClick'));
  this.setupHtml();
};

RadioRevealer.prototype.setupHtml = function() {
  this.radios.each($.proxy(function(i, el) {
    var panelId = $(el).attr('data-aria-controls')
    if(panelId) {
      if(!el.checked) {
        $('#'+panelId).addClass('hidden');
      }
    }
  }, this));
};

RadioRevealer.prototype.onRadioButtonClick = function(e) {
  this.radios.each($.proxy(function(i, el) {
    var panelId = $(el).attr('data-aria-controls')
    if(panelId) {
      if(!el.checked) {
        $('#'+panelId).addClass('hidden');
      } else {
        $('#'+panelId).removeClass('hidden');
      }
    }
  }, this));
};