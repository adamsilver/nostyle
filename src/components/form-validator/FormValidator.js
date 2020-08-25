var removeAttributeValue = function(el, attr, value) {
	var re, m;
	if (el.getAttribute(attr)) {
	  if (el.getAttribute(attr) == value) {
		 el.removeAttribute(attr);
	  } else {
		 re = new RegExp('(^|\\s)' + value + '(\\s|$)');
		 m = el.getAttribute(attr).match(re);
		 if (m && m.length == 3) {
			el.setAttribute(attr, el.getAttribute(attr).replace(re, (m[1] && m[2])?' ':''))
		 }
	  }
	}
 }

var addAttributeValue = function(el, attr, value) {
	var re;
	if (!el.getAttribute(attr)) {
	  el.setAttribute(attr, value);
	}
	else {
	  re = new RegExp('(^|\\s)' + value + '(\\s|$)');
	  if (!re.test(el.getAttribute(attr))) {
		 el.setAttribute(attr, el.getAttribute(attr) + ' ' + value);
	  }
	}
 };

function FormValidator(form, options) {
  this.form = form;
  this.errors = [];
  this.validators = [];
  $(this.form).on('submit', $.proxy(this, 'onSubmit'));
  this.summary = (options && options.summary) ? $(options.summary) : $('.errorSummary');
  this.summary.on('click', 'a', $.proxy(this, 'onErrorClick'));
  this.originalTitle = document.title;
};

FormValidator.entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

FormValidator.escapeHtml = function(string) {
  return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
    return FormValidator.entityMap[s];
  });
};

FormValidator.prototype.onErrorClick = function(e) {
  e.preventDefault();
  var href = e.target.href;
  var id = href.substring(href.indexOf("#"), href.length);
  $(id).focus();
};

FormValidator.prototype.resetTitle = function() {
  document.title = this.originalTitle;
};

FormValidator.prototype.updateTitle = function() {
//   document.title = "(" + this.errors.length + " errors) - " + document.title;
  document.title = 'Error - ' + document.title;
};

FormValidator.prototype.showSummary = function () {
  this.summary.html(this.getSummaryHtml());
  this.summary.removeClass('hidden');
  this.summary.attr('aria-labelledby', 'errorSummary-heading');
  this.summary.focus();
};

FormValidator.prototype.getSummaryHtml = function() {
  var html = '<h2 id="errorSummary-heading">There’s a problem</h2>';
  html += '<ul>';
  for (var i = 0, j = this.errors.length; i < j; i++) {
    var error = this.errors[i];
    html += '<li>';
    html +=   '<a href="#' + FormValidator.escapeHtml(error.fieldName) + '">';
    html +=     FormValidator.escapeHtml(error.message);
    html +=   '</a>';
    html += '</li>';
  }
  html += '</ul>';
  return html;
};

FormValidator.prototype.hideSummary = function() {
    this.summary.addClass('hidden');
    this.summary.removeAttr('aria-labelledby');
};

FormValidator.prototype.onSubmit = function (e) {
  this.removeInlineErrors();
  this.hideSummary();
  this.resetTitle();
  if(!this.validate()) {
    e.preventDefault();
    this.updateTitle();
    this.showSummary();
    this.showInlineErrors();
  }
};

FormValidator.prototype.showInlineErrors = function() {
  for (var i = 0, j = this.errors.length; i < j; i++) {
    this.showInlineError(this.errors[i]);
  }
};

FormValidator.prototype.showInlineError = function (error) {
  var errorSpanId = error.fieldName + '-error';
  var errorSpan = '<span class="field-error" id="'+ errorSpanId +'"><svg width="1.3em" height="1.3em"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#error-icon"></use></svg>'+FormValidator.escapeHtml(error.message)+'</span>';
  var control = $('#' + error.fieldName);
  var fieldContainer = control.parents('.field');
  var legend = fieldContainer.find('legend');
  var fieldset = fieldContainer.find('fieldset');
  fieldContainer.find('.field-error').remove();
  if(legend.length) {
    legend.after(errorSpan);
	 fieldContainer.attr('aria-invalid', 'true');
	 addAttributeValue(fieldset[0], 'aria-describedby', errorSpanId);
  } else {
    control.before(errorSpan);
	 control.attr('aria-invalid', 'true');
	 addAttributeValue(control[0], 'aria-describedby', errorSpanId);
  }
};

FormValidator.prototype.removeInlineErrors = function () {
  $(this.form).find(".field-error").remove();
  $(this.form).find("[aria-invalid]").attr('aria-invalid', 'false');
};

FormValidator.prototype.addValidator = function(fieldName, rules) {
  this.validators.push({
    fieldName: fieldName,
    rules: rules,
    field: this.form.elements[fieldName]
  });
};

FormValidator.prototype.validate = function() {
  this.errors = [];
  var validator = null,
    validatorValid = true,
    i,
    j;
  for (i = 0; i < this.validators.length; i++) {
    validator = this.validators[i];
    for (j = 0; j < validator.rules.length; j++) {
      validatorValid = validator.rules[j].method(validator.field,
        validator.rules[j].params);
      if (!validatorValid) {
        this.errors.push({
          fieldName: validator.fieldName,
          message: validator.rules[j].message
        });
        break;
      }
    }
  }
  return this.errors.length === 0;
};
