function FormValidator(form) {
  this.form = form;
  this.errors = [];
  this.validators = [];
  $(this.form).on("submit", $.proxy(this, "onFormSubmit"));
  this.summary = $(".errorSummary");
  this.summary.on('click', 'a', $.proxy(this, 'onErrorClicked'));
};

FormValidator.prototype.onErrorClicked = function(e) {
    e.preventDefault();
    var href = e.target.href;
    href = href.substring(href.indexOf("#")+1, href.length);
    document.getElementById(href).focus();
};

FormValidator.prototype.showSummary = function () {
  this.summary.html(this.getSummaryHtml());
  this.summary.removeClass('hidden');
  this.summary.focus();
};

FormValidator.prototype.getSummaryHtml = function() {
  var html = '<h2>Fix the following errors</h2>';
  html += '<ul>';
  for (var i = 0, j = this.errors.length; i < j; i++) {
    var error = this.errors[i];
    html += '<li>';
    html +=   '<a href="#' + error.fieldName + '">';
    html +=     error.message;
    html +=   '</a>';
    html += '</li>';
  }
  html += '</ul>';
  return html;
};

FormValidator.prototype.hideSummary = function() {
    this.summary.addClass('hidden');
};

FormValidator.prototype.onFormSubmit = function (e) {
  this.removeInlineErrors();
  this.hideSummary();
  if(!this.validate()) {
    e.preventDefault();
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
  var errorSpan = '<span class="field-error">'+error.message+'</span>';
  var fieldContainer = $("#" + error.fieldName).parents(".field");
  fieldContainer.addClass('field-hasError');
  var label = fieldContainer.find('label');
  var legend = fieldContainer.find("legend");
  var errorContainer = fieldContainer.find(".error");
  errorContainer.remove();
  if(legend.length) {
    legend.append(errorSpan);
  } else {
    label.append(errorSpan);
  }
};

FormValidator.prototype.removeInlineErrors = function () {
  $(this.form).find(".field .field-error").remove();
  $(this.form).find(".field-hasError").removeClass('field-hasError');
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