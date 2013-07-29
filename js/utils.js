/**
 * Utilities Functions
 * Events
 **/
define([
  'jquery',
  'underscore',
  'backbone',
  'jquery.spinner',
  'jquery.birthdaypicker'
], function($, _, Backbone){
	return {
		/**
		 * Some Older Browser might not have these methods build in
		 **/
		setupOldBrowser: function() {
			// Object Method
			Object.keys = Object.keys || function(o) {
				var result = [], name;
				for(name in o) {
					if (o.hasOwnProperty(name))
					result.push(name);
				}
				return result;
			};
		},
		// http://kevin.vanzonneveld.net
		// +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
		// +   improved by: Waldo Malqui Silva
		// +   bugfixed by: Onno Marsman
		// +   improved by: Robin
		// +      input by: James (http://www.james-bell.co.uk/)
		// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// *     example 1: ucwords('kevin van  zonneveld');
		// *     returns 1: 'Kevin Van  Zonneveld'
		// *     example 2: ucwords('HELLO WORLD');
		// *     returns 2: 'HELLO WORLD'
		ucwords: function(str) {
			return (str + '').replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
				return $1.toUpperCase();
			});
		},
		/**
		 * Prevalidation, on blur event
		 **/
		preValidate: function(e, model) {
			var $e = $(e.currentTarget)
			, _name = $e.attr('name')
			, _isFile = $e.is(':file')
			, _val;

			_val = (_isFile) ? $e.val(): $.trim($e.val());

			if ( ! _isFile) {
				// Convert to lowercase
				if ($e.hasClass('tolowercase')) {
					_val = _val.toLowerCase();
				}
				// Convert to ucwords
				if ($e.hasClass('toucwords')) {
					_val = this.ucwords(_val);
				}

				$e.val(_val).trigger('change');
			}

			model.set(_name, _val);
			if (model.isValid(_name, _val)) {
				$e.removeClass('invalid');
			} else {
				$e.addClass('invalid');
			}
		},
		/**
		 * Setup Placeholder in older browser
		 **/
		setupPlaceHolder: function(el) {
			$('input, textarea', el).placeholder();
		},
		/**
		 * Setup Email Events
		 **/
		setupEmailInput: function(el) {
			$('.emailpicker', el).each(function () {
				var $server = $('.emailpicker_server', this)
				, $notsending = $('.not_sending', this);
				$server.val($server.attr('data-value')).trigger('change');
				$notsending.on('change', this, function(e) {
					var $hidden = $(':hidden', e.data)
					, $username = $('.emailpicker_username', e.data)
					, $server = $('.emailpicker_server', e.data);
					if ($username.val() !== '' && $server.val() !== '') {
						$hidden.val($.trim($username.val()+'@'+$server.val())).trigger('change');
					} else {
						$hidden.val('').trigger('change');
					}
				})
				.on('keydown', function(e) {
					if (e.keyCode === 32) {
						e.preventDefault();
						return false;
					}
				});
			});
		},
		/**
		 * Init BDate
		 **/
		setupBDateInput: function(el) {
			$('.birthdaypicker', el).each(function () {
				if (typeof $(this).birthdaypicker !== 'function') {
					var that = this;
					window.setTimeout(function() { $(that).birthdaypicker($(that).attr('data-options')); }, 2000);
				} else {
					$(this).birthdaypicker($(this).attr('data-options'));
				}
			});
		},
		/**
		 * Set the value of hidden field that contain data-value
		 **/
		setHiddenField: function(el) {
			$(':hidden[data-value!=""]', el).each(function() {
				var $this = $(this);
				$this.val($this.attr('data-value')).trigger('change');
			});
		},
		/**
		 * Get BDate Values
		 **/
		getBDateinput: function(el, model) {
			$('fieldset.birthday-picker', el).each(function() {
				$('.not_sending', this).trigger('change');
				var _nan =/NaN/i
				, $bdateInput = $(':input[type="hidden"]', this);
				if ($bdateInput.val().match(_nan)) {
					$bdateInput.val('');
				}
				model.set($bdateInput.attr('name'), $bdateInput.val());
			});
		},
		/**
		 * Some select, check might have default value need to send change event
		 **/
		getDefaultValues: function(el) {
			$('.has-default-val', el).trigger('change');
		},
		/**
		 * Setup Date Input
		 **/
		setupDateInput: function(el) {
			$('.datepicker', el).each(function () {
			var _options = {}, maxDate, nowTemp;
			if ($(this).attr('data-maxdate')) {
				switch ($(this).attr('data-maxdate').toLowerCase()) {
					case 'today':
					nowTemp = new Date();
					maxDate = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
					_options.onRender = function(date) {
						return date.valueOf() > maxDate.valueOf() ? 'disabled' : '';
					};
					break;
				}
			}
			$(this).datepicker(_options)
				.on('changeDate', function(e){
					var _dateInput = $(e.currentTarget).removeClass('invalid').trigger('change');
					_dateInput.datepicker('hide');
				})
				.on('click', function(e){
					$('div.datepicker.dropdown-menu').css('display', 'none');
					$(e.currentTarget).datepicker('show');
				});
			});
		},
		/**
		 * Setup Spinner
		 **/
		setupSpinner: function(el) {
			$('.spinner', el).spinner();
		},
		/**
		 * Prevent Space in Keypress Event
		 **/
		preventSpace: function(e) {
			if (e.keyCode === 32) {
				e.preventDefault();
				return false;
			}
		},
		/**
		 * Allow Only valid Number in Keypress Event
		 **/
		allowNumber: function(e) {
			if (e.keyCode === 8 || e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 46
				|| e.keyCode === 9) {
				return true;
			} else if ( e.shiftKey || ( ! ( e.keyCode === 46 || e.keyCode === 190 || e.keyCode === 110) || $(e.currentTarget).val().indexOf('.') !== -1 )
				&& ( e.keyCode < 48 || ( e.keyCode > 57 && e.keyCode < 96) || e.keyCode > 105 ) ) {
				e.preventDefault();
			}
		},
		/**
		 * Allow Only Integer Number in Keypress Event
		 **/
		allowZipCode: function(e) {
			if (e.keyCode === 8 || e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 46
				|| e.keyCode === 9) {
				return true;
			} else if ( e.shiftKey || e.keyCode < 48 || ( e.keyCode > 57 && e.keyCode < 96) || e.keyCode > 105 ) {
				e.preventDefault();
			}
		},
		/**
		 * Convert Unix TimeStamp to Human Readable
		 **/
		getHumanTime: function(unixTime) {
			var time = new Date(unixTime*1000)
			, months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
			, year = time.getFullYear()
			, month = months[time.getMonth()]
			, date = time.getDate()
			, hour = time.getHours()
			, min = time.getMinutes()
			, sec = time.getSeconds()
			, format = 'AM';

			if (hour >= 12) {
				hour = hour-12;
				format = "PM";
			}

			if (hour < 10) {
				hour = '0'+hour;
			}

			if (min < 10) {
				min = '0'+min;
			}

			if (sec < 10) {
				sec = '0'+sec;
			}

			return month+' '+date+', '+year+' '+hour+':'+min+':'+sec+' '+format;
		}
	};
});
