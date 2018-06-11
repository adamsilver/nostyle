function supportsDateInput() {
	var el = document.createElement('input');
	try {
		el.type = 'date';
	} catch(e) {

	}
	return el.type == 'date';
}

if(!supportsDateInput()) {
	var DatePicker = function(input, options) {
		this.input = input;
		this.container = input.parent();
		this.wrapper = $('<div class="datepicker"></div>');
		this.container.append(this.wrapper);
		this.wrapper.append(this.input);
		options = options || {};
		this.setupOptions(options);
		this.calendarClass = 'datepicker';
		this.setupKeys();
		this.setupMonthNames();
		this.monthDate = this.options.currentDate;
		this.selectedDate = null;
		this.createToggleButton();
		this.buildCalendar();
	};

	DatePicker.prototype.setupMonthNames = function() {
		this.monthNames = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		];
	};

	DatePicker.prototype.setupOptions = function(options) {
		var defaults = {};

		defaults.dateStart = (function() {
			var d = new Date();
			d.setYear(d.getFullYear()-1);
			return d;
		}());

		defaults.dateEnd = (function() {
			var d = new Date();
			d.setYear(d.getFullYear()+1);
			return d;
		}());

		defaults.currentDate = (function() {
			var d = new Date();
			d.setHours(0,0,0,0);
			return d;
		}());

		this.options = $.extend(defaults, options);
	};

	DatePicker.prototype.getCalendarHtml = function(year, month) {
		var html = '<div class="'+this.calendarClass+'-calendar" aria-label="date picker" role="group">';
		html +=		'<div class="'+this.calendarClass+'-actions">';
		html +=			'<button type="button" aria-label="previous month"><svg focusable="false" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 17 17" width="1em" height="1em"><g></g><path d="M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z"></path></svg></button>';
		html += 		'<div role="status" aria-live="polite">';
		html += 			this.monthNames[month] + " " + year;
		html += 		'</div>';
		html +=			'<button type="button" aria-label="next month"><svg focusable="false" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 17 17" width="1em" height="1em"><g></g><path d="M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z"></path></svg></button>';
		html +=		'</div>';
		html += 	'<table role="grid">';
		html += 		'<thead>';
		html += 			'<tr>';
		html += 				'<th aria-label="Sunday">Su</th>';
		html += 				'<th aria-label="Monday">Mo</th>';
		html += 				'<th aria-label="Tuesday">Tu</th>';
		html += 				'<th aria-label="Wednesday">We</th>';
		html += 				'<th aria-label="Thursday">Th</th>';
		html += 				'<th aria-label="Friday">Fr</th>';
		html += 				'<th aria-label="Saturday">Sa</th>';
		html += 			'</tr>';
		html += 		'</thead>';
		html += 		'<tbody>';
		html += 			this.getCalendarTableRows(month, year);
		html += 		'</tbody>';
		html += 	'</table>';
		return html;
	};

	DatePicker.prototype.getFirstDateOfMonth = function(month, year) {
		var d = new Date();
		d.setFullYear(year,month,1,0);
		d.setHours(0,0,0,0);
		return d;
	};

	DatePicker.prototype.getCalendarTableRows = function(month, year) {
		var html = '<tr>';
		var d = new Date();
		d.setFullYear(year,month,1,0);
		d.setHours(0,0,0,0);
		var firstDay = d.getDay();
		var i = 0;
		var tdClassDefault = this.calendarClass+'-day';
		var ariaSelected = 'false';
		var now = new Date();
		now.setHours(0,0,0,0);

		var focusableDate;
		// selected
		if(this.selectedDate && this.selectedDate.getMonth() === d.getMonth()) {
			focusableDate = this.selectedDate;
		// today
		} else if(now.getMonth() === d.getMonth()) {
			focusableDate = now;
		// 1st of month
		} else{
			focusableDate = new Date(d);
		}

		while (i < firstDay) {
			var daysToSubtract = firstDay - i;
			var paddedDate = new Date(year, month);
			paddedDate.setDate(d.getDate()-daysToSubtract);
			html += '<td class="datepicker-previousMonthDay">'+paddedDate.getDate()+'</td>';
			i++;
		}

		var daysToIgnore = i;

		while (d.getMonth() == month) {
			if (i % 7 === 0) {
				html += '</tr><tr>';
			}

			var cellOptions = {};

			var tdClass = tdClassDefault;
			if (d.getTime() === now.getTime()) {
				cellOptions.today = true;
			}

			if(focusableDate.getTime() === d.getTime()) {
				cellOptions.focusable = true;
			}

			if(this.selectedDate && this.selectedDate.getTime() === d.getTime()) {
				cellOptions.selected = true;
			}

			html += this.getCellHtml(d, cellOptions);

			d.setDate( d.getDate()+1 );

			i++;
		}

		while (i % 7 !== 0) {
			var firstDate = this.getFirstDateOfMonth(month, year);
			firstDate.setDate(firstDate.getDate()+(i-daysToIgnore));
			html += '<td class="datepicker-nextMonthDay">'+firstDate.getDate()+'</td>';
			i++;
		}
		html += '</tr>';
		return html;
	};

	DatePicker.prototype.getCellHtml = function(date, options) {
		var label = date.getDate() + ' ' + this.monthNames[date.getMonth()] + ', ' + date.getFullYear();
		var shortLabel = ' ' + this.monthNames[date.getMonth()] + ', ' + date.getFullYear();

		var tdClass = '';
		if(options.today) {
			tdClass += ' '+this.calendarClass+'-day-isToday';
		}
		if(options.focusable) {
			tdClass += ' '+this.calendarClass+'-day-isFocused';
		}

		var html = '';
		html += '<td';

		if(options.focusable) {
			html += ' tabindex="0" ';
		} else {
			html += ' tabindex="-1" ';
		}

		if(options.selected) {
			html += ' aria-selected="true" ';
		} else {
			html += ' aria-selected="false" ';
		}

		html += ' aria-label="'+label+'" ';
		html += ' role="gridcell" ';
		html += ' data-date="'+date.toString()+'" ';
		html += ' class="'+tdClass+'" ';
		html += '>';

		if(options.today) {
			html += '<span class="datepicker-today">Today</span>';
		}

		html += '<span aria-hidden="true">';
		html += date.getDate();
		html += '</span';
		html += '</td>'

		return html;
	};

	DatePicker.prototype.buildCalendar = function() {
		this.calendar = $('<div class="'+this.calendarClass+'-wrapper hidden">');
		this.calendar.html(this.getCalendarHtml(this.monthDate.getFullYear(), this.monthDate.getMonth()));
		this.addEventListeners();
		this.wrapper.append(this.calendar);
	};

	DatePicker.prototype.addEventListeners = function() {
		this.calendar.on('click', 'button:first-child', $.proxy(this, 'onPreviousClick'));
		this.calendar.on('click', 'button:last-child', $.proxy(this, 'onNextClick'));
		this.calendar.on('click', '[role=gridcell]', $.proxy(this, 'onCellClick'));
		this.calendar.on('keydown', '[role=gridcell]', $.proxy(this, 'onCellKeyDown'));
		this.calendar.on('keydown', $.proxy(this, 'onCalendarKeyDown'));
	};

	DatePicker.prototype.createToggleButton = function() {
		this.toggleButton = $('<button type="button" aria-haspopup="true">Choose</button>');
		this.wrapper.append(this.toggleButton);
		this.toggleButton.on('click', $.proxy(this, 'onToggleButtonClick'));
	};

	DatePicker.prototype.onToggleButtonClick = function() {
		if(this.toggleButton.attr('aria-expanded') == 'true') {
			this.hide();
		} else {
			this.show();
			this.calendar.find('button:first-child').focus();
		}
	};

	DatePicker.prototype.hide = function() {
		this.calendar.addClass('hidden');
		this.toggleButton.attr('aria-expanded', 'false');
	};

	DatePicker.prototype.show = function() {
		this.calendar.removeClass('hidden');
		this.toggleButton.attr('aria-expanded', 'true');
	};

	DatePicker.prototype.setupKeys = function() {
		this.keys = {
			tab:       9,
			enter:    13,
			esc:      27,
			space:    32,
			pageup:   33,
			pagedown: 34,
			end:      35,
			home:     36,
			left:     37,
			up:       38,
			right:    39,
			down:     40
	   };
	};

	DatePicker.prototype.onCalendarKeyDown = function(e) {
		switch(e.keyCode) {
			case this.keys.esc:
				this.hide();
				this.toggleButton.focus();
				break
		}
	};

	DatePicker.prototype.onCellKeyDown = function(e) {
		switch(e.keyCode) {
			case this.keys.down:
				this.onDayDownPressed(e);
				break;
			case this.keys.up:
				this.onDayUpPressed(e);
				break;
			case this.keys.left:
				this.onDayLeftPressed(e);
				break;
			case this.keys.right:
				this.onDayRightPressed(e);
				break;
			case this.keys.space:
			case this.keys.enter:
				this.onDaySpacePressed(e);
				break;
		}
	};

	DatePicker.prototype.onCellClick = function(e) {
		var d = new Date($(e.currentTarget).attr('data-date'));
		this.updateTextBoxDate(d);
		this.hide();
		this.input.focus();
		this.selectedDate = d;
		this.selectDate(d);
	};

	DatePicker.prototype.onPreviousClick = function(e) {
		this.showPreviousMonth();
	};

	DatePicker.prototype.onNextClick = function(e) {
		this.showNextMonth();
	};

	DatePicker.prototype.onDaySpacePressed = function(e) {
		e.preventDefault();
		var d = new Date($(e.currentTarget).attr('data-date'));
		this.updateTextBoxDate(d);
		this.hide();
		this.input.focus();
		this.selectedDate = d;
		this.selectDate(d);
	};

	DatePicker.prototype.selectDate = function(date) {
		this.calendar.find('[aria-selected=true]').attr('aria-selected', 'false');
		this.getDayCell(date).attr('aria-selected', 'true');
	};

	DatePicker.prototype.unhighlightCell = function(date) {
		var cell = this.getDayCell(date);
		cell.attr('tabindex', '-1');
		cell.removeClass(this.calendarClass+'-day-isFocused');
	};

	DatePicker.prototype.highlightCell = function(date) {
		this.unhighlightCell(this.getFocusedCellDate());
		var cell = this.getDayCell(date);
		cell.attr('tabindex', '0');
		cell.addClass(this.calendarClass+'-day-isFocused');
		cell.focus();
	};

	DatePicker.prototype.getFocusedCell = function() {
		return this.calendar.find('.'+this.calendarClass+'-day-isFocused');
	};

	DatePicker.prototype.getFocusedCellDate = function() {
		return new Date(this.getFocusedCell().attr('data-date'));
	};

	DatePicker.prototype.onDayDownPressed = function(e) {
		e.preventDefault();
		var date = this.getFocusedCellDate();
		var newDate = this.getSameDayNextWeek(date);
		if(newDate.getMonth() == date.getMonth()) {
			this.highlightCell(newDate);
		} else {
			this.monthDate = newDate;
			this.updateCalendarHtml(newDate.getFullYear(), newDate.getMonth());
			this.highlightCell(newDate);
		}
	};

	DatePicker.prototype.onDayUpPressed = function(e) {
		e.preventDefault();
		var date = this.getFocusedCellDate();
		var newDate = this.getSameDayLastWeek(date);
		if(newDate.getMonth() == this.monthDate.getMonth()) {
			this.highlightCell(newDate);
		} else {
			this.monthDate = newDate;
			this.updateCalendarHtml(newDate.getFullYear(), newDate.getMonth());
			this.highlightCell(newDate);
		}
	};

	DatePicker.prototype.onDayLeftPressed = function(e) {
		e.preventDefault();
		var date = this.getFocusedCellDate();
		var newDate = this.getPreviousDay(date);
		if(newDate.getMonth() == this.monthDate.getMonth()) {
			this.highlightCell(newDate);
		} else {
			this.monthDate = newDate;
			this.updateCalendarHtml(newDate.getFullYear(), newDate.getMonth());
			this.highlightCell(newDate);
		}
	};

	DatePicker.prototype.onDayRightPressed = function(e) {
		e.preventDefault();
		var date = this.getFocusedCellDate();
		var newDate = this.getNextDay(date);
		if(newDate.getMonth() == this.monthDate.getMonth()) {
			this.highlightCell(newDate);
		} else {
			this.monthDate = newDate;
			this.updateCalendarHtml(newDate.getFullYear(), newDate.getMonth());
			this.highlightCell(newDate);
		}
	};

	DatePicker.prototype.getPreviousDay = function(date) {
		var d = new Date(date);
		d.setDate(d.getDate()-1);
		return d;
	};

	DatePicker.prototype.getSameDayLastWeek = function(date) {
		var d = new Date(date);
		d.setDate(d.getDate()-7);
		return d;
	};

	DatePicker.prototype.getNextDay = function(date) {
		var d = new Date(date);
		d.setDate(d.getDate()+1);
		return d;
	};

	DatePicker.prototype.getSameDayNextWeek = function(date) {
		var d = new Date(date);
		d.setDate(d.getDate()+7);
		return d;
	};

	DatePicker.prototype.getDayCell = function(date) {
		return this.calendar.find('[data-date="'+date.toString()+'"]');
	};

	DatePicker.prototype.updateCalendarHtml = function(year, month) {
		this.calendar.find('[role=status]').html(this.monthNames[month] + ' ' + year);
		this.calendar.find("tbody").html(this.getCalendarTableRows(month, year));
	};

	DatePicker.prototype.updateTextBoxDate = function(date) {
		this.input.val(date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear());
	};

	DatePicker.prototype.showPreviousMonth = function() {
		var pm = this.getPreviousMonth();
		this.monthDate = pm;
		this.updateCalendarHtml(pm.getFullYear(), pm.getMonth());
	};

	DatePicker.prototype.showNextMonth = function() {
		var nm = this.getNextMonth();
		this.monthDate = nm;
		this.updateCalendarHtml(nm.getFullYear(), nm.getMonth());
	};

	DatePicker.prototype.getPreviousMonth = function() {
		var dayInMs = 86400000;
		var d = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth(),1);
		d = d.getTime() - dayInMs;
		d = new Date(d);
		d.setDate(1);
		return d;
	};

	DatePicker.prototype.getNextMonth = function() {
		var d = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth());
		d = d.setMonth(d.getMonth()+1);
		d = new Date(d);
		d.setDate(1);
		return d;
	};
}
