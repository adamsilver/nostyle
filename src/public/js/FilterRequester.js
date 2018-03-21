function FilterRequester() {
	this.url = '/examples/filter-form';
	this.form = $('.filter form');
	this.products = $('.products');
	this.form.find('input').on('change', $.proxy(this, 'onInputChange'));
	$(window).on('popstate', $.proxy(this, 'onPopState'));
	this.form.find('[type=submit]').addClass('visually-hidden').attr('tabindex', '-1');
	history.replaceState({query: '', productsHtml: JSON.stringify($('.products').html()) }, null, this.url);
}

FilterRequester.prototype.onInputChange = function(e) {
	var query = this.form.serialize();
	this.requestResults(query);
};

FilterRequester.prototype.requestResults = function(query) {
	$.ajax({
		url: this.url,
		type: 'get',
		data: query,
		success: $.proxy(this, 'onRequestSuccess', query)
	});
};

FilterRequester.prototype.onRequestSuccess = function(query, response) {
	history.pushState(response, null, this.url+'?'+query);
	this.renderUpdates(response);
};

FilterRequester.prototype.renderUpdates = function(data) {
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
	var state = e.originalEvent.state;
	if(state) {
		this.renderUpdates(state);
	}
};
