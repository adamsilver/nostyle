function FilterRequester() {
	this.form = $('.filter form');
	this.products = $('.products');
	this.form.find('input').on('change', $.proxy(this, 'onInputChange'));
	$(window).on('popstate', $.proxy(this, 'onPopState'));
	this.form.find('[type=submit]').addClass('vh').attr('tabindex', '-1');
}

FilterRequester.prototype.onInputChange = function(e) {
	var query = this.form.serialize();
	history.pushState(query, null, '/examples/filter-form?'+query);
	this.requestResults(query);
};

FilterRequester.prototype.requestResults = function(data) {
	$.ajax({
		url: '/examples/filter-form',
    type: 'get',
    data: data,
    error: function() {
    	console.log(arguments);
    },
    success: $.proxy(this, 'onRequestSuccess')
	});
};

FilterRequester.prototype.onRequestSuccess = function(data) {
	this.updateFilterForm(data.query);
	this.products.html(JSON.parse(data.productsHtml));
};

FilterRequester.prototype.updateFilterForm = function(query) {
	this.form.find('input[type=radio], input[type=checkbox]').prop('checked', false);
	Object.keys(query).forEach(function(key) {
		var controlValue = query[key];
		if($.isArray(controlValue)) {
			controlValue.forEach(function(value) {
				$('.filter [name='+key+']').each(function(i, input) {
					// console.log(input, value);
					if(input.value == value) {
						input.checked = true;
					}
				});
			});
		} else {
			$('.filter [name='+key+']').each(function(i, input) {
				if(input.value == controlValue) {
					input.checked = true;
				}
			});
		}
	});
};

FilterRequester.prototype.onPopState = function(e) {
	this.requestResults(e.originalEvent.state);
};