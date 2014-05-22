/**
 * Utilities Functions
 * Events
 **/
define([
  'jquery',
  'underscore',
  'backbone',
  'vm',
  'select2helper',
  'bootstrap',
  'jquery.select2',
  'jquery.spinner',
  'jquery.birthdaypicker',
  'jquery.placeholder',
  'jquery.expose',
  'jquery.zclip',
  'jquery.stupidtable',
  'xdr'
], function($, _, Backbone, Vm, Select2Helper) {

  /**
   * Setup DependOn Options (Values)
   **/

  function setValueDependOn(el, visibleOnObj, formData) {
    _.each(visibleOnObj, function(value) {
      if (formData.fields[value.name]) {
        $(el)
          .on('visibleOnRenderComplete', ':input[name="' + value.name + '"]', function() {
            $(this)
              .val(formData.fields[value.name])
              .trigger('change');
          });
        // Need to trigger the value
        $(':input[name="' + value.options.visibleon.name + '"]')
          .trigger('change');
      }
    });
  }

  return {
    renderError: function($container, err) {
      $container.html('<div class="alert alert-danger"><i class="icon-wrench"></i> <strong>Error: Please refresh this page and try again.</strong> <br> ' + err + '</div>');
    },
    /**
     * Check Browser Agent
     **/
    checkBrowser: function() {
      if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { //test for MSIE x.x;
        var ieversion = parseInt(RegExp.$1);
        if (ieversion < 7) {
          ieversion = 7;
        }
        $('body')
          .addClass('ie' + ieversion);
      }
    },
    /**
     * Some Older Browser might not have these methods build in
     **/
    setupOldBrowser: function() {
      // Object Method
      Object.keys = Object.keys || function(o) {
        var result = [],
          name;
        for (name in o) {
          if (o.hasOwnProperty(name))
            result.push(name);
        }
        return result;
      };
      // Array Method
      if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(obj, start) {
          for (var i = (start || 0), j = this.length; i < j; i++) {
            if (this[i] === obj) {
              return i;
            }
          }
          return -1;
        };
      }
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
      return (str + '')
        .replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1) {
          return $1.toUpperCase();
        });
    },

    /**
     * Looking for {{words}} will return an array if founded, otherwise return null
     * @param  string str
     * @return mixed
     */
    parseTemplateString: function(str) {
      var _reg = /\w+=\{\{(\w|\.)+\}\}/ig;
      return str.match(_reg);
    },

    parseTemplateStringGet: function(str) {
      var _reg = /\w+=(\w|\.)+/ig;
      return str.match(_reg);
    },

    /**
     * Need to find the required field for label
     **/
    checkRequireFields: function(field, validation) {
      var _name;
      switch (field.type.toLowerCase()) {
        case 'multifiles':
          _name = field.name + '[]';
          if (typeof validation[_name] !== 'undefined' && validation[_name].required) {
            return true;
          }
          return false;

        case 'address':
          _name = field.name + '_address_street';
          if (typeof validation[_name] !== 'undefined' && validation[_name].required) {
            return true;
          }

          _name = field.name + '_address_city';
          if (typeof validation[_name] !== 'undefined' && validation[_name].required) {
            return true;
          }

          _name = field.name + '_address_state';
          if (typeof validation[_name] !== 'undefined' && validation[_name].required) {
            return true;
          }

          _name = field.name + '_address_zip';
          if (typeof validation[_name] !== 'undefined' && validation[_name].required) {
            return true;
          }

          _name = field.name + '_address_country';
          if (typeof validation[_name] !== 'undefined' && validation[_name].required) {
            return true;
          }

          return false;

        case 'fullname':
          _name = field.name + '_fullname_middle_name';
          if (typeof validation[_name] !== 'undefined' && validation[_name].required) {
            return true;
          }

          _name = field.name + '_fullname_first_name';
          if (typeof validation[_name] !== 'undefined' && validation[_name].required) {
            return true;
          }

          _name = field.name + '_fullname_last_name';
          if (typeof validation[_name] !== 'undefined' && validation[_name].required) {
            return true;
          }

          return false;
      }
      return (typeof validation[field.name] !== 'undefined' && validation[field.name].required) ? true : false;
    },
    /**
     * Prevalidation, on blur event
     **/
    preValidate: function(e, model) {
      var $e = $(e.currentTarget),
        _name = $e.attr('name'),
        _isFile = $e.is(':file'),
        _val;

      _val = (_isFile) ? $e.val() : $.trim($e.val());

      if (!_isFile) {
        // Convert to lowercase
        if ($e.hasClass('tolowercase')) {
          _val = _val.toLowerCase();
          _val = _val.replace(/^([0-9]\w+)|\s+([0-9]\w+)/g, function($1) {
            return $1.toUpperCase();
          });
          _val = _val.replace(/^(us\s)|\s+(us)\s/gi, function($1) {
            return $1.toUpperCase();
          });
        }
        // Convert to ucwords
        if ($e.hasClass('toucwords')) {
          _val = this.ucwords(_val);
        }

        $e.val(_val)
          .trigger('change');
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
      $('input, textarea', el)
        .placeholder();
    },
    /**
     * Setup FileInput default value
     **/
    setupFileInput: function(el) {
      $(':file', el)
        .trigger('change');
    },
    /**
     * Setup Email Events
     **/
    setupEmailInput: function(el) {
      $('.emailpicker', el)
        .each(function() {
          var $server = $('.emailpicker_server', this),
            $username = $('.emailpicker_username', this),
            $hidden = $(':input[type="hidden"]', this),
            $notsending = $('.not_sending', this);
          if (typeof $server.attr('data-value') !== 'undefined' && $server.attr('data-value')) {
            $server.val($server.attr('data-value'))
              .trigger('change');
          }
          if ($hidden.val() !== '') {
            var _token = $hidden.val()
              .split("@");
            if (_token.length === 2) {
              $username.val(_token[0])
                .trigger('change');
              $server.val(_token[1])
                .trigger('change');
            }
          }
          $('.emailpicker_server, .emailpicker_username', this)
            .on('change', this, function(e) {
              if ($username.val() !== '' && $server.val() !== '') {
                $hidden.val($.trim($username.val() + '@' + $server.val()))
                  .trigger('change');
              } else {
                $hidden.val('')
                  .trigger('change');
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
    setupBDateInput: function(el, model) {
      $('.birthdaypicker', el)
        .each(function() {
          $(this)
            .birthdaypicker($(this)
              .attr('data-options'));
          var $hidden = $(':input[type="hidden"]', this),
            _token, $month, $day, $year;
          if ($hidden.val() !== '' && model.get($hidden.attr('name')) !== '') {
            _token = $hidden.val()
              .split("/");
            if (_token.length === 3) {
              if (_token[0][0] === '0') {
                _token[0] = _token[0].substr(1);
              }
              if (_token[1][0] === '0') {
                _token[1] = _token[1].substr(1);
              }

              $month = $('.birth-month', this)
                .val(_token[0]);
              $day = $('.birth-day', this)
                .val(_token[1]);
              $year = $('.birth-year', this)
                .val(_token[2]);

              model.set($month.attr('name'), _token[0]);
              model.set($day.attr('name'), _token[1]);
              model.set($year.attr('name'), _token[2]);
            }
          }
        });
    },
    /**
     * Set the value of hidden field that contain data-value
     **/
    setHiddenField: function(el) {
      $(':hidden[data-value!=""]', el)
        .each(function() {
          var $this = $(this);
          if (typeof $this.attr('data-value') !== 'undefined' && $this.attr('data-value')) {
            $this.val($this.attr('data-value'))
              .trigger('change');
          }
        });
    },
    /**
     * Get BDate Values
     **/
    getBDateinput: function(el, model) {
      $('fieldset.birthday-picker', el)
        .each(function() {
          var _nan = /NaN/i,
            $bdateInput = $(':input[type="hidden"]', this),
            $day = $('.not_sending.birth-day', this),
            $month = $('.not_sending.birth-month', this),
            $year = $('.not_sending.birth-year', this),
            _day = parseInt($day.val()),
            _month = parseInt($month.val()),
            _year = parseInt($year.val()),
            _error = false,
            _val;

          if (String(_day)
            .match(_nan)) {
            $day.val('');
            _error = true;
          }
          if (String(_month)
            .match(_nan)) {
            $month.val('');
            _error = true;
          }
          if (String(_year)
            .match(_nan)) {
            $year.val('');
            _error = true;
          }

          if (_error) {
            $bdateInput.val('');
          } else {
            if (_month < 10) {
              _month += 0 + _month;
            }
            if (_day < 10) {
              _day += 0 + _day;
            }
            _val = _month + '/' + _day + '/' + _year
            $bdateInput.val();
          }

          model.set($bdateInput.attr('name'), $bdateInput.val());
        });
    },
    /**
     * If this is Select2 need to work on the model.
     */
    getUserId: function(el, model) {
      var $select2 = $('.select2-offscreen', el);
      $select2.each(function() {
        var $this = $(this);
        model.set($this.attr('name'), $this.val())
          .trigger('change');
      });
    },
    /**
     * Some select, check might have default value need to send change event
     **/
    getDefaultValues: function(el) {
      $('.has-default-val', el)
        .each(function() {
          var $this = $(this);
          if ($this.is(':disabled')) {
            return;
          }
          if ($this.val() === '') {
            $this.trigger('change');
          } else if ($this.hasClass('data-clean')) {
            $this.trigger('change')
              .removeClass('data-clean');
          }
        });
    },
    /**
     * Setup Date Input
     **/
    setupDateInput: function(el) {
      $('.datepicker', el)
        .each(function() {
          var _options = {}, maxDate, nowTemp;
          if ($(this)
            .attr('data-maxdate')) {
            switch ($(this)
              .attr('data-maxdate')
              .toLowerCase()) {
              case 'today':
                nowTemp = new Date();
                maxDate = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
                _options.onRender = function(date) {
                  return date.valueOf() > maxDate.valueOf() ? 'disabled' : '';
                };
                break;
            }
          }
          if ($(this)
            .attr('data-mindate')) {
            switch ($(this)
              .attr('data-mindate')
              .toLowerCase()) {
              case 'today':
                nowTemp = new Date();
                maxDate = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
                _options.onRender = function(date) {
                  return date.valueOf() < maxDate.valueOf() ? 'disabled' : '';
                };
                break;
            }
          }
          $(this)
            .datepicker(_options)
            .on('changeDate', function(e) {
              var _dateInput = $(e.currentTarget)
                .removeClass('invalid')
                .trigger('change');
              _dateInput.datepicker('hide');
            })
            .on('click', function(e) {
              $('div.datepicker.dropdown-menu')
                .css('display', 'none');
              $(e.currentTarget)
                .datepicker('show');
            });
        });
    },
    /**
     * Setup Spinner
     **/
    setupSpinner: function(el) {
      $('.spinner', el)
        .each(function() {
          // Be Default, will render as 1
          // Unless has data-default-value set up
          var $spinnerInput = $(':input.spinner-input', this),
            _dataDefaultValue = ($spinnerInput.attr('data-default-value') !== undefined) ? $spinnerInput.attr('data-default-value') : 1,
            _number = ($spinnerInput.val() !== '') ?
              $spinnerInput.val() :
              _dataDefaultValue,
            _opt = {
              value: parseInt(_number, 10),
              min: _dataDefaultValue
            };
          $(this)
            .spinner(_opt);
        });
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
      var val = $(e.currentTarget).val();
      if (e.keyCode === 8 || e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 46 || e.keyCode === 9) {
        return true;
      } else if (e.shiftKey || (!(e.keyCode === 46 || e.keyCode === 190 || e.keyCode === 110) ||
        val.indexOf('.') !== -1) && (e.keyCode < 48 || (e.keyCode > 57 && e.keyCode < 96) || e.keyCode > 105)) {
        e.preventDefault();
      }
    },
    /**
     * Allow only valid +/- Floating Point
     */
    allowRational: function(e) {
      var val = $(e.currentTarget).val();
      if (e.keyCode === 8 || e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 46 || e.keyCode === 9) {
        return true;
      } else if ((e.keyCode === 45 || e.keyCode === 109 || e.keyCode === 189) && val === '') {
        // Ignore Filter
      } else if (e.shiftKey || (!(e.keyCode === 46 || e.keyCode === 190 || e.keyCode === 110) ||
        val.indexOf('.') !== -1) && (e.keyCode < 48 || (e.keyCode > 57 && e.keyCode < 96) || e.keyCode > 105)) {
        e.preventDefault();
      }
    },
    /**
     * Allow Only natural Number in Keypress Event
     **/
    allowNaturalNumber: function(e) {
      if (e.keyCode === 8 || e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 46 || e.keyCode === 9) {
        return true;
      } else if (e.shiftKey || (!(e.keyCode === 46 || e.keyCode === 110)) && (e.keyCode < 48 || (e.keyCode > 57 && e.keyCode < 96) || e.keyCode > 105) || (e.keyCode === 48 && $(e.currentTarget)
        .val()
        .length === 0)) {
        e.preventDefault();
      }
    },
    /**
     * Allow Only Integer Number in Keypress Event
     **/
    allowZipCode: function(e) {
      if (e.keyCode === 8 || e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 46 || e.keyCode === 9) {
        return true;
      } else if (e.shiftKey || e.keyCode < 48 || (e.keyCode > 57 && e.keyCode < 96) || e.keyCode > 105) {
        e.preventDefault();
      }
    },
    /**
     * Allow Only Integer Number in Keypress Event but will render as XXXXX-XXXX
     **/
    allowZipCodePlusFour: function(e) {
      var $currentTarget = $(e.target),
        _val = $currentTarget.val(),
        _tmp = '';

      if (e.type === 'keydown' && (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {

        switch (_val.length) {
          case 0:
            if (e.keyCode === 48 || e.keyCode === 105) {
              e.preventDefault();
              return;
            }
            break;

          case 5:
            $currentTarget.val(_val + '-');
        }
        if (e.update) {
          $currentTarget.val($currentTarget.val() + String.fromCharCode(e.keyCode));
        }
      } else {
        for (var i = 0, j = _val.length; i < j; i++) {
          if (!isNaN(parseInt(_val[i]))) {
            _tmp += _val[i];
          }
        }
        _val = '';
        for (var i = 0, j = _tmp.length; i < j; i++) {
          switch (i) {
            case 5:
              if (j > 6) {
                _val += '-';
              }
              break;
          }
          _val += _tmp[i];
        }
        $currentTarget.val(_val);
      }
    },
    /**
     * Convert Unix TimeStamp to Human Readable
     **/
    getHumanTime: function(unixTime) {
      var time = (typeof unixTime !== 'object') ? new Date(unixTime * 1000) : new Date(unixTime.$date),
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        year = time.getFullYear(),
        month = months[time.getMonth()],
        date = time.getDate(),
        hour = time.getHours(),
        min = time.getMinutes(),
        sec = time.getSeconds(),
        format = 'AM';

      if (hour >= 12) {
        hour = hour - 12;
        if (hour === 0) {
          hour = 12;
        }
        format = "PM";
      }

      if (hour < 10) {
        hour = '0' + hour;
      }

      if (min < 10) {
        min = '0' + min;
      }

      if (sec < 10) {
        sec = '0' + sec;
      }

      return month + ' ' + date + ', ' + year + ' ' + hour + ':' + min + ':' + sec + ' ' + format;
    },
    /**
     * Return Special Fields Name Type
     **/
    getSpecialFieldsName: function(name, type) {
      var _fields = [];
      switch (type.toLowerCase()) {
        case 'fullname':
          _fields.push(name + '_fullname_first_name');
          _fields.push(name + '_fullname_middle_name');
          _fields.push(name + '_fullname_last_name');
          break;

        case 'address':
          _fields.push(name + '_address_street');
          _fields.push(name + '_address_city');
          _fields.push(name + '_address_state');
          _fields.push(name + '_address_zip');
          _fields.push(name + '_address_country');
          break;

        default:
          _fields.push(name);
      }
      return _fields;
    },
    /**
     * Set Values from Fields Name
     **/
    setFieldsValues: function(el, model, names, values) {
      values = values || false;
      _.each(names, function(element, index) {
        var _val = (values && values[index]) ? values[index] : '',
          $input = $(':input[name="' + element + '"]', el)
            .val(_val)
            .trigger('change');
        model.set(element, _val);
        if (model.isValid(element)) {
          $input.removeClass('invalid');
        }
      });
    },
    /**
     * Setup Class Attr for Field
     **/
    setupClassAttr: function(classAttr, appendClass) {
      classAttr = classAttr || false;
      appendClass = appendClass || '';
      appendClass.toLowerCase();
      if (classAttr) {
        classAttr = classAttr.toLowerCase();
        var reg = new RegExp(appendClass, "i");
        if (reg.test(classAttr)) {
          return classAttr;
        } else {
          return classAttr + ' ' + appendClass;
        }
      }
      return appendClass;
    },
    /**
     * Final Setup before Render the form
     **/
    finalSetup: function(view) {
      var that = this,
        $select = $('select.has-default-val', view.el),
        $form = $(view.el);
      if (view.options.mode === 'update' && view._visibleOn.length > 0 && view.options.formData) {
        setValueDependOn(view.el, view._visibleOn, view.options.formData);
      }

      if (view.options.mode === 'create' && $select.length > 0) {
        $select.each(function() {
          var $option = $('option[selected=""],option[selected="selected"]', this);
          if ($option.length > 0 && $option.val() !== '') {
            $(this)
              .val($option.val());
          } else {
            if ($(this)
              .hasClass('us-state')) {
              $(this)
                .val('NV');
            } else if ($(this)
              .hasClass('us-country')) {
              $(this)
                .val('US');
            }
          }
        });
      }

      if (view._multiFiles.length > 0) {
        _.each(view._multiFiles, function(value) {
          require(['views/file-upload/multifiles'], function(MultifilesView) {
            var multifilesView = Vm.create(that, 'MultiFilesView' + value.name, MultifilesView, {
              field: value,
              name: view.el,
              model: view.model,
              validation: view.options.formSchema.validation
            });
            multifilesView.render();
          });
        });
      }

      // Setup Ajax Call for fields
      if (view._ajaxDataCall.length > 0) {
        this.setupAjaxCall(view, $form);
      }

      // Setup UserId Field
      if (view._hasUserId) {
        this.setupUserIdAjaxCall($form);
      }

      // Setup BooleanInput Type
      if (view._hasBooleanInput) {
        this.setupBooleanInput($form, view);
      }

      // Setup Radio Button Group
      if (view._hasRadioBtnGroup) {
        this.setupRadioBtnGroup($form);
        this.setupRadioBtnGroupValue($form);
      }

      // Setup SelectAll and ClearAll for CheckBox
      if (view._hasSelectAllCheckBox || view._hasClearAllCheckBox) {
        this.setupCheckBoxSelectAndClear($form);
      }

      // Setup Other Textbox for Checkbox
      if (view._hasOtherTextBox) {
        this.setupCheckBoxOtherTextBox($form);
      }

      // Setup ButtonCondition
      // By Default, will require all data to be valid
      // Default Success Call Back must return JSON with key = "value"
      if (view._buttonDecision.length > 0) {
        _.each(view._buttonDecision, function(element) {
          var $btn_decision = $('a#' + element.name, view.el),
            _html_tmp = '<input type="hidden" name="' + element.name + '" id="' + element.name + '_btn_condition"/>';
          if (!element.url || !element.data) {
            throw 'ButtonDecision require Url and Data options!';
          } else if (view.options.mode === 'update') {
            $btn_decision.after(_html_tmp);
            if (view.options.formData.fields[element.name]) {
              $btn_decision.next('input[type="hidden"]')
                .val(view.options.formData.fields[element.name])
                .trigger('change');
            }
          }

          // If this is internal, will not render the button. Will render only hidden input.
          if (view.options.internal === true) {
            var $btnContainer = $btn_decision.parents('.control-group');
            ($btnContainer.length > 0) ? $btnContainer.hide() : $btn_decision.hide();
            return true;
          }

          $btn_decision.click(function(e) {
            e.preventDefault();
            var $currentTarget = $(e.currentTarget);
            if ($currentTarget.attr('disabled')) {
              return false;
            }
            var _url = element.url + '?',
              _data = {}, _error = false,
              _opt, $invalidObj = [],
              _canEmpty = (element.options.datacanempty) ? element.options.datacanempty : [],
              _success = element.options.events || function(e) {
                var $hiddenInput = $('#' + element.name + '_btn_condition', $form);
                // If there is an error
                if (e.status && e.status === 'error') {
                  $currentTarget.attr('disabled', false)
                    .popover('destroy');
                  $currentTarget.next('.popover')
                    .remove();

                  _opt = {
                    html: true,
                    placement: 'top',
                    trigger: 'manual',
                    title: '<i class="icon-edit"></i> Error',
                    content: e.error_message
                  };
                  $currentTarget.attr('disabled', true)
                    .popover(_opt)
                    .popover('show');

                  window.setTimeout(
                    function() {
                      $currentTarget.attr('disabled', false)
                        .popover('destroy');
                      $currentTarget.next('.popover')
                        .remove();
                    }, 3000);

                  return false;
                }
                if (!e.value) {
                  throw 'Result JSON must have "value" key';
                }
                if ($hiddenInput.length === 0) {
                  $currentTarget.after(_html_tmp);
                }
                // If the return JSON has "data" key, it will loop through data to build the select table for user.
                if (element.options.renderresult && e.data) {
                  view.model.set(element.name, '');
                  // Render Data for User to Select.
                  require(['views/subform-layouts/buttondecision'], function(ButtonDecisionView) {
                    var buttonDecisionView = Vm.create(that, element.name + 'View', ButtonDecisionView, {
                      model: view.model,
                      el: $currentTarget,
                      name: element.name
                    });
                    buttonDecisionView.render(e.data);
                  });
                } else {
                  // If this field has options renderresult we might need to remove that markup as well.
                  $currentTarget.parent()
                    .find('div.btn-decision-data-wrapper')
                    .remove();
                  view.model.set(element.name, e.value);
                }
                window.setTimeout(
                  function() {
                    $currentTarget.attr('disabled', false)
                      .popover('destroy');
                    $currentTarget.next('.popover')
                      .remove();
                  }, 1000);
              };

            _.each(element.data, function(el, key) {
              if (typeof el !== 'string') {
                if (typeof _error === 'boolean') {
                  _error = [];
                }
                var _elementError;
                _.each(el, function(elArray, keyArray) {
                  _elementError = that.setUpButtonDecision(elArray, keyArray, _data, view.el, _canEmpty, $invalidObj);
                });
                _error.push(_elementError);
              } else {
                _error = that.setUpButtonDecision(el, key, _data, view.el, _canEmpty);
              }
            });

            if (typeof _error !== 'boolean' && _error.indexOf(false) > -1) {
              _error = false;
            }

            if (_error) {
              _opt = {
                html: true,
                placement: 'top',
                trigger: 'manual',
                title: '<i class="icon-edit"></i> Error',
                content: 'Please correct the form'
              };
              $currentTarget.attr('disabled', true)
                .popover(_opt)
                .popover('show');

              window.setTimeout(
                function() {
                  $currentTarget.attr('disabled', false)
                    .popover('destroy');
                  $currentTarget.next('.popover')
                    .remove();
                }, 2000);

              return false;
            }

            _.each($invalidObj, function($el) {
              $el.removeClass('invalid');
            });

            // Get the query object, will send to the url
            _url += $.param(_data);

            // Languages
            var _t_1, _t_2;
            switch (view.options.lang) {
              case 'sp':
                _t_1 = 'Por Favor Espere';
                _t_2 = 'Bajando Informaci&oacute;n';
                break;
              default:
                _t_1 = 'Please wait';
                _t_2 = 'Loading data';
            }

            _opt = {
              html: true,
              placement: 'top',
              trigger: 'manual',
              title: '<i class="icon-time"></i> ' + _t_1 + '.',
              content: '<i class="icon-spinner icon-spin icon-large"></i> ' + _t_2 + ' ...'
            };
            $currentTarget.attr('disabled', true)
              .popover(_opt)
              .popover('show');

            $.getJSON(_url, _success);
          });
        });
      }
    },

    isRenderVisibleOn: function(view, value, typeLowerCase) {
      if (value.options.visibleon && typeLowerCase !== 'html') {
        var _visibleOnName = value.options.visibleon.name;
        if (_visibleOnName.match(/\[\]$/gi)) {
          _visibleOnName = _visibleOnName.substr(0, _visibleOnName.length - 2);
        }
        if (_.isArray(view.options.formData.fields[_visibleOnName])) {
          var _found = false;
          _.each(view.options.formData.fields[_visibleOnName], function(element) {
            if (_found) {
              return;
            }
            _found = value.options.visibleon.values.indexOf(element) !== -1;
          });
          if (!_found) {
            return false;
          }
        } else {
          if (value.options.visibleon.values.indexOf(view.options.formData.fields[_visibleOnName]) === -1) {
            return false;
          }
        }
      }
      return true;
    },
    /**
     * Final Setup for Read Mode
     **/
    finalReadSetup: function(view) {
      var $form = $(view.el);
      // Attach Click Event to Copy to the Clipboard
      if (view._buttonClipboards.length > 0) {
        _.each(view._buttonClipboards, function(element) {
          $('button#' + element.name)
            .zclip({
              path: '//public.southernnevadahealthdistrict.org/assets/js/apps/formrender/libs/copy/ZeroClipboard.swf',
              copy: function() {
                var _txt = '';
                _.each(element.values, function(elementValue) {
                  _txt += $('#' + elementValue)
                    .text() + "\r\n";
                });
                return _txt;
              }
            });
        });
      }
      // If there is any lightbox markup, will need to check if this a valid photo or not
      $('a[rel^=lightbox], area[rel^=lightbox], a[data-lightbox], area[data-lightbox]')
        .each(function() {
          var $this = $(this);
          $("<img>", {
            src: $this.attr('href'),
            error: function() {
              $this.hide();
              $this.next('.btn')
                .show();
            }
          });
        });

      // Setup Confirm Button
      var $btnConfirmed = $('[data-popover-confirm^="{"]', view.el);
      if ($btnConfirmed.length) {
        $form.on('click', '.btn-confirmed', function(e) {
          e.preventDefault();
          var $this = $(this);
          _yes = $this.attr('data-href') || false;
          if (!_yes) {
            $btnConfirmed.each(function(_index) {
              $(this)
                .popover('hide');
            });
            return;
          }
          $btnConfirmed.each(function(_index) {
            $(this)
              .popover('destroy');
          });
          window.location = _yes;
        });
        $btnConfirmed.each(function(index) {
          var $this = $(this),
            _opts = $.parseJSON($this.attr('data-popover-confirm'));
          $this.popover(_opts)
            .click(function(e) {
              e.preventDefault();
              $btnConfirmed.each(function(_index) {
                if (_index === index) {
                  return;
                }
                $(this)
                  .popover('hide');
              });
            });
        });
      }

      // Look for .btn-auto-refresh
      $form.on('click', '.btn-auto-refresh', function(e) {
        var _delay = $(e.target)
          .attr('data-refresh-delay');
        e.stopPropagation();
        setTimeout(function() {
          location.reload();
        }, _delay);
      });

      // Make the subform be able to sort by column
      var stupidtable = $('table.stupidtable').stupidtable();
      if (stupidtable.length) {
        stupidtable.on('aftertablesort', function(event, data) {
          var th = $(this).find("th");
          th.find(".dir-icon").remove();
          var arrow = data.direction === "asc" ? "icon-arrow-up" : "icon-arrow-down";
          th.eq(data.column).append('<i class="dir-icon ' + arrow + '" style="position:relative; left: 10px; top: -3px;"></i>');
        });
      }
    },
    /**
     * Setup Read Mode
     * Check for valid data to be rendered
     **/
    isRenderReadMode: function(view, value) {

      var _type = value.type.toLowerCase();

      if (value.options.internal && (value.options.internal !== view.options.internal)) {
        return false;
      } else if (_type === 'buttonclipboard') {
        return true;
      } else if (view.options.formData.fields[value.name] === '') {
        return false;
      } else if (_type === 'fullname') {
        var _name = this.getSpecialFieldsName(value.name, value.type),
          _result = false;
        _.each(_name, function(element) {
          if (!_result && view.options.formData.fields[element] && view.options.formData.fields[element] !== '') {
            _result = true;
          }
        });
        return _result;
      } else if (typeof view.options.formData.fields[value.name] === 'undefined') {
        switch (_type) {
          case 'fieldsetstart':
          case 'fieldsetend':
          case 'html':
          case 'action':
          case 'submit':
          case 'clear':
          case 'address':
            break;

          case 'button':
            var _btnName = value.description.toLowerCase();
            if (view.options.internal && view.options.mode === 'read' && _btnName === 'delete' && view.options.formSchema.deleteenabled) {

              if (!view.options.formData.createddate.$date) {
                throw 'In order to used "DeleteEnabled", form data must have "CreatedDate".';
              }

              // If this has FieldExists
              if (view.options.formSchema.deleteenabled.fieldexists) {
                var _fieldToCheck = view.options.formSchema.deleteenabled.fieldexists;
                // This guard will prevent internal user to delete before file get downloaded.
                if (!view.options.formData.fields[_fieldToCheck]) {
                  return false;
                }
              }

              // If this has AfterXDays
              if (view.options.formSchema.deleteenabled.afterxdays) {
                var _currentDate = new Date(),
                  _createdDate = new Date(view.options.formData.createddate.$date),
                  _dateDiff = this.calculateDateDiffByDays(_currentDate, _createdDate);

                // If current date is less than the required date, will not render.
                if (_dateDiff < view.options.formSchema.deleteenabled.afterxdays) {
                  return false;
                }
              }

            }
            break;

          default:
            return false;
        }
      }

      return true;
    },
    /**
     * Reset Placeholder in older browser
     **/
    resetPlaceHolderValue: function(el) {
      _isSetting = $(':input.placeholder', el);
      _isSetting.each(function() {
        var $this = $(this);
        if ($this.attr('placeholder') === $this.val()) {
          $this.val('');
        }
      });
    },
    /**
     * Function to create hidden form
     **/
    createHiddenForm: function(data) {
      require(['views/hiddenForm'], function(HiddenFormView) {
        var hiddenFormView = Vm.create({}, 'FormView', HiddenFormView);
        hiddenFormView.render(data);
      });
    },
    /**
     * Function to set up for Ajax Call
     **/
    setupAjaxCall: function(view, $form) {
      _.each(view._ajaxDataCall, function(element) {
        var _type = element.type.toLowerCase(),
          _input = [],
          _request = {};

        if (typeof element.options.data === 'undefined') {
          throw 'In order to use ajax call, we need Options.Data.';
        }

        _.each(element.options.data, function(dataObj) {
          _.each(dataObj, function(dataVal) {
            _request[dataVal] = '';
          });
        });

        switch (_type) {
          case 'fullname':
            _input.push(element.name + '_fullname_first_name');
            _input.push(element.name + '_fullname_middle_name');
            _input.push(element.name + '_fullname_last_name');
            break;
          default:
            _input.push(element.name);
        }

        _.each(_input, function(elementName) {
          $form.on('change', ':input[name="' + elementName + '"]', function(e) {
            var $thisInput = $(this),
              _val = $thisInput.val(),
              _error = false;

            if (_val !== '') {
              _request[elementName] = _val;
            }

            _.each(_request, function(dataVal, dataKey) {
              if (dataVal === '') {
                _error = true;
              }
            });

            if (!_error) {
              var _param = {}, _url = element.options.url + '?';
              _.each(element.options.data, function(dataObj) {
                _.each(dataObj, function(dataVal, dataKey) {
                  _param[dataKey] = _request[dataVal];
                });
              });
              $.getJSON(_url + $.param(_param), function(respond) {
                if (respond.data) {
                  _.each(respond.data, function(respVal, respKey) {
                    if (typeof _request[respKey] === 'undefined') {
                      var $_input = $(':input[name="' + respKey + '"]')
                        .val(respVal)
                        .trigger('change'),
                        $_parent;
                      if ($_input.attr('type') === 'hidden') {
                        $_parent = $_input.parent('.emailpicker');
                        if ($_parent.length > 0) {
                          var _email = respVal.split('@');
                          $(':input.not_sending', $_parent)
                            .each(function(index, ele) {
                              $(ele)
                                .val(_email[index]);
                            });
                        }
                      }
                    }
                  });
                }
              });
            }
          })
        });

      });
    },
    /**
     * Function to setup Button Decision
     **/
    setUpButtonDecision: function(el, key, data, form, canEmpty, invalidObj) {
      canEmpty = canEmpty || [];
      invalidObj = invalidObj || false;
      var $currentElement = $('#' + el),
        $bDate = $currentElement.parent('.birthday-picker'),
        $bDateSelect, error = false,
        $input;
      if ($bDate.length > 0) {
        $bDateSelect = $('.not_sending', $bDate)
          .trigger('change');
      }
      var _val = $currentElement.val();
      if ((_val !== '' && _val.search(/NaN/) === -1) || canEmpty.indexOf(key) > -1) {
        data[key] = _val;
      } else {
        error = true;
        $input = $(':input[name="' + el + '"]', form)
          .addClass('invalid');
        if (invalidObj) {
          invalidObj.push($input);
        }
        if ($bDate.length > 0) {
          var _index = _val.split('/');
          _.each(_index, function(date, index) {
            if (date === 'NaN') {
              $input = $($bDateSelect[index])
                .addClass('invalid');
              if (invalidObj) {
                invalidObj.push($input);
              }
            }
          });
        }
      }
      return error;
    },

    /**
     * Setup Ajax Call if the form has URL in options
     * For Dynamic AJAX look up
     * @param  object $form
     * @return
     */
    setupUrlAjaxCall: function($form, $scope) {
      $scope = $scope || null;
      var $urlEndPoint = ($scope) ? $scope : $(':input[data-url]'),
        that = this;
      if ($urlEndPoint.length === 0 || !$urlEndPoint.attr('data-url')) {
        return;
      }

      $urlEndPoint.each(function() {
        var $this = $(this),
          _url = $this.attr('data-url');
        // console.log(_url);
        // Detect the {{}} Template, then this will be look up dynamic
        var _tokens = that.parseTemplateString(_url);
        if (_tokens) {
          var _tokensStatic = that.parseTemplateStringGet(_url);
          if (_tokensStatic) {
            // If there is some GET data that do not match with {{Template}}
            var _staticResult = {};
            _.each(_tokensStatic, function(element) {
              var _keyVal = element.split('=');
              if (_keyVal.length !== 2) {
                return;
              }
              _staticResult[_keyVal[0]] = _keyVal[1];
            });
          }
          // Then we will be using select2 (Dynamic Lookup)
          if (!$this.select2) {
            throw 'Error: select2 is not yet loaded. Please refresh this page again! (Setup "' + $this.attr('id') + '"")';
          }
          // Select2 does not work on select element for Ajax Call
          var _domStr = '<input type="hidden" name="' + $this.attr('name') + '" id="' + $this.attr('id') + '" class="' + $this.attr('class') + ' has-select2-dynamic" />',
            _value = $this.attr('data-select-key-value'),
            _text = $this.attr('data-select-key-text'),
            _fieldValue = $this.attr('data-select-value');
          $this.replaceWith(_domStr);
          $this = $(':input[name="' + $this.attr('name') + '"]');
          if (_fieldValue) {
            $this.val(_fieldValue);
          }

          // Default Parameters for Select2
          var _ajaxObj = {
            url: _url.match(/^(\w|\.|\/|:)+\(?/ig).shift(),
            data: function(term, page) {
              var _result = _staticResult || {};
              _.each(_tokens, function(element) {
                var _keyVal = element.split('='),
                  _rep = _keyVal.pop().replace(/(\{\{|\}\})/ig, ''),
                  _val;
                switch (_rep) {
                  case 'this':
                    _val = term;
                    break;
                  default:
                    // Look up name value
                    var $obj = $(':input[name="' + _rep + '"]');
                    _val = $obj.val();
                }
                _result[_keyVal] = _val;
              });
              return _result;
            },
            results: function(data, page) {
              // By Default will use id and text, otherwise will need to parse the data
              if (_value || _text) {
                var _tmp = [];
                _.each(data, function(element) {
                  var _tmpObj = {};
                  if (_value && _text) {
                    _tmpObj.id = element[_value];
                    _tmpObj.text = element[_text];
                    _tmp.push(_tmpObj);
                  } else if (_value) {
                    _tmpObj.id = element[_value];
                    _tmpObj.text = element.text;
                    _tmp.push(_tmpObj);
                  } else if (_text) {
                    _tmpObj.id = element.id;
                    _tmpObj.text = element[_text];
                    _tmp.push(_tmpObj);
                  }
                });
                data = _tmp;
              }
              return {
                more: false,
                results: data
              };
            }
          },
            _opts = {
              placeholder: '--- Please Select ---',
              minimumInputLength: 3,
              initSelection: function(element, callback) {
                if (_fieldValue) {
                  // Will statically set the
                  $.ajax({
                    url: _ajaxObj.url,
                    data: _ajaxObj.data(_fieldValue),
                    success: function(data, textStatus, jqXHR) {
                      if (data.length === 1) {
                        var element = data.pop(),
                          _tmpObj = {};
                        if (_value && _text) {
                          _tmpObj.id = element[_value];
                          _tmpObj.text = element[_text];
                        } else if (_value) {
                          _tmpObj.id = element[_value];
                          _tmpObj.text = element.text;
                        } else if (_text) {
                          _tmpObj.id = element.id;
                          _tmpObj.text = element[_text];
                        }
                        callback(_tmpObj);
                      } else {
                        callback({
                          id: _fieldValue,
                          text: _fieldValue
                        });
                      }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                      callback({
                        id: _fieldValue,
                        text: _fieldValue
                      });
                    }
                  });
                }
              },
              ajax: _ajaxObj
            };
          // Setup Select2 for Dynamic Lookup
          $this.select2(_opts);
        } else {
          // Static Lookup
          // $.support.cors = true;
          $.ajax({
            // crossDomain: true,
            url: _url,
            dataType: "json",
            success: function(data, textStatus) {
              if (textStatus === 'success') {
                var _opts = '<option value="">--- Please Select ---</option>',
                  _type = $urlEndPoint.prop('type'),
                  _dataArray = [];
                _.each(data, function(element) {
                  switch (_type) {
                    case 'select-one':
                      _opts += '<option value="' + element + '">' + element + '</option>';
                      $this.find('option')
                        .remove();
                      $this.append(_opts);
                      $this.select2({
                        containerCssClass: 'span12'
                      });
                      $('#s2id_' + $this.attr('id') + ' .select2-drop', $form)
                        .hide();
                      break;
                    default:
                      _dataArray.push(element[$this.attr('id')]);
                  }
                });
                if (_dataArray.length) {
                  $this.attr({
                    "autocomplete": "off"
                  });
                  $this.typeahead({
                    minLength: 3,
                    source: _dataArray
                  });
                  // If this value has change, we need to auto populate the data
                  var _dataCallback = function(e) {
                    var _val = $this.val(),
                      _matchData = _.find(data, function(element) {
                        if (_val === element[$this.attr('id')]) {
                          return true;
                        }
                      }),
                      _attachEvent = true;
                    if (_matchData) {
                      _.each(_matchData, function(value, key) {
                        if (value === '') {
                          return;
                        } else if (typeof value === 'object') {
                          // If there is the View and Data in them means we need to render the view for user to select

                          if (value.length) {

                            var _listName;
                            _.some(value[0], function(listValue, listKey) {
                              _listName = listKey.split('_')
                                .shift();
                              return true;
                            });
                            $('#subform_' + _listName, $form)
                              .trigger('subform_' + _listName + '.ajaxUpdate', [value]);

                          } else if (value.data && value.view && value.title) {
                            var _listName;
                            _.some(value.data[0], function(listValue, listKey) {
                              _listName = listKey.split('_')
                                .shift();
                              return true;
                            });
                            _attachEvent = false;
                            // This is special case and need to render View and Data
                            require(['views/' + value.view + 'AjaxView'], function(AjaxView) {
                              var _opts = {
                                $form: $form,
                                collection: new Backbone.Collection(value.data),
                                id: key + '_AjaxView',
                                $input: $this,
                                input_callback: _dataCallback,
                                title: value.title,
                                listName: _listName
                              },
                                ajaxView = Vm.create(that, 'AjaxView', AjaxView, _opts);
                              ajaxView.render();
                            });
                          }

                        } else {
                          var $targetInput = $(':input[name="' + key + '"]', $form);
                          if ($targetInput) {
                            $targetInput.val(value)
                              .trigger('change');
                          }
                        }
                      });
                    }
                    if (_attachEvent) {
                      $this.one('change', _dataCallback);
                    }
                  };
                  $this.one('change', _dataCallback);
                }
                // Trigger dataloaded event
                $this.trigger('dataloaded');
              }
            },
            error: function(jqXHR, textStatus, errorThrown) {
              alert('Error: when trying to request AJAX data to "' + _url + '" for "' + $this.attr('id') + '".');
            }
          });
        }
      });
    },

    /**
     * Set up select2 for select type
     * @param  object $container
     * @return
     */
    setupSelect2: function(form) {
      $(form.el + ' .selecttwo-render').each(function() {
        var $this = $(this);
        if ($this.hasClass('tags')) {
          Select2Helper.renderTags($this, form);
        }
      });
    },

    /**
     * Setup Select and Clear Button for Check Box
     * @param  object $form
     * @return
     */
    setupCheckBoxSelectAndClear: function($form) {
      $form.on('click', '.checkbox-container button', function(e) {
        e.preventDefault();
        var $this = $(e.target),
          $parent = $this.closest('.checkbox-container'),
          $checkboxs = $parent.find('input:checkbox');
        if ($this.hasClass('btn-primary')) {
          $checkboxs.prop('checked', true);
          $checkboxs.filter('.checkbox-other')
            .click()
            .prop('checked', true);
        } else {
          $checkboxs.prop('checked', false);
          $checkboxs.filter('.checkbox-other')
            .click()
            .prop('checked', false);
        }
      });
    },

    /**
     * Setup Checkbox Other Options
     * @param  object $form
     * @return
     */
    setupCheckBoxOtherTextBox: function($form) {
      $form.on('click', '.checkbox-container input[type="checkbox"].checkbox-other', function(e) {
        var $this = $(e.target),
          $textarea = $this.parent()
            .next('.other-textbox');
        if ($this.is(':checked')) {
          $textarea.removeClass('not_sending')
            .show('slow');
        } else {
          $textarea.addClass('not_sending')
            .hide('slow');
        }
      });
    },

    /**
     * Function to Setup BooleanInput
     */
    setupBooleanInput: function($form, view) {
      $form.on('click', '.form-render_booleaninput button', function(e) {
        var $this = $(this),
          _val = $this.attr('data-value'),
          _id = $this.attr('data-id'),
          _txt;

        $('#' + _id, $this.parent())
          .removeClass('invalid')
          .val(_val)
          .trigger('change');
        _txt = '<span class="text-' + ((_val === 'true') ? 'success' : 'error') + '">' + $this.html() + '<span>';
        $this.parent()
          .next()
          .html(_txt)
          .show('slow');
      });

      // If there is a default value in the input
      var $booleanInput = $('.form-render_booleaninput input[type="hidden"]', $form);
      $booleanInput.each(function() {
        var $this = $(this),
          _val = $this.val();
        if (_val === '') {
          return;
        }
        switch (_val) {
          case 'true':
            $this.parent()
              .find('button.btn-yes')
              .click();
            break;

          case 'false':
            $this.parent()
              .find('button.btn-no')
              .click();
            break;
        }
      });
    },

    /**
     * Function to set up Radio Button Group
     * @param  object $form
     * @return
     */
    setupRadioBtnGroup: function($form) {
      $form.on('click', '.radio-container button', function(e) {
        e.preventDefault();
        var $this = $(e.target),
          _val = $this.attr('value'),
          $container = $this.closest('.radio-container'),
          $input = $container.find('input[type="hidden"]');
        $input.val(_val).trigger('change');
        $container.find('.radio-value-render').html(_val).show('slow');
      });
      //If this is edit, will need to render this as well.
      var $radioContainer = $form.find('.radio-container');
      $radioContainer.each(function() {
        var $this = $(this),
          $hidden = $this.find('input[type="hidden"]'),
          _val = $.trim($hidden.val());
        if (_val === '') {
          return;
        }
        $this.find('button[value="' + _val + '"]').trigger('click');
      });
    },

    /**
     * Function to set up Radio Button Group default values
     * @param  object $form
     * @return
     */
    setupRadioBtnGroupValue: function($form) {
      var $hidden = $('.radio-container input.has-default-val', $form);
      $hidden.each(function() {
        var $this = $(this),
          $target = $this.closest('.radio-container')
            .find('button[value="' + $this.val() + '"]');
        if ($target) {
          $target.addClass('active');
        } else {
          $this.val('');
        }
        $this.removeClass('has-default-val');
      });
    },

    /**
     * Function to setup UserId Look Up from Ajax
     */
    setupUserIdAjaxCall: function($form) {
      var endpoint = '/user?$filter=Username eq ',
        $idInput = $(':input.userid-lookup', $form),
        that = this;
      $idInput.each(function() {
        var $input = $(this);
        // If this is render as select (will use select2)
        if ($input.is('select')) {
          if ($input.is('[data-url]')) {
            // Ajax-Call
            $.getJSON($input.attr('data-url'), function(data, textStatus) {
              if (textStatus === 'success') {
                var _opts = '';
                _.each(data, function(element) {
                  _opts += '<option value="' + element.Id + '">' + element.Username + '</option>';
                });
                $input.append(_opts);
                $input.select2({
                  containerCssClass: 'span12'
                })
                  .on('change', function(e) {
                    if (e.val && e.val !== '') {
                      $input.removeClass('invalid');
                    }
                  });
              } else {
                that.setUpErrorNotice($input, 'Please refresh this page!', 10000);
              }
            });
          } else {
            // Default Select
            $input.select2({
              containerCssClass: 'span12'
            });
          }
        } else {
          $(this)
            .change(function(e) {
              var $this = $(this),
                _val = $this.val(),
                tmp_endpoint = $this.attr('data-url') || endpoint,
                _opt = {
                  dataType: "json",
                  complete: function(jqXHR, textStatus) {
                    $this.removeAttr('data-send');
                    if ($this.hasClass('invalid')) {
                      return;
                    }
                    if (textStatus === 'success') {
                      var result = $.parseJSON(jqXHR.responseText);
                      switch (typeof result) {
                        case 'boolean':
                          if (result) {
                            $this.addClass('invalid')
                              .val('');
                            that.setUpErrorNotice($this, 'Username "' + $this.val() + '" is already existed!');
                          }
                          break;
                      }
                    } else {
                      that.setUpErrorNotice($this, 'Could not get information!');
                    }
                  }
                };

              if (_val === '') {
                return;
              }

              if (tmp_endpoint.search(/\?/) === -1) {
                tmp_endpoint += '?';
              }

              if (typeof username !== 'undefined') {
                _opt.username = username;
                _opt.password = password;
              }

              if ($this.is('[data-url-data]')) {
                var _data = '',
                  _lookup = $.parseJSON($this.attr('data-url-data'));
                _.each(_lookup, function(value, key) {
                  _data += key + '=' + $(':input[name="' + value + '"]')
                    .val() + '&';
                });
                _data = encodeURI(_data.substr(0, _data.length - 1));
                tmp_endpoint += _data;
              }

              _opt.url = tmp_endpoint;

              if (!$this.is('[data-send]')) {
                $this.attr('data-send', true);
                $.ajax(_opt);
              }
            });
        }
      });
    },
    /**
     * Setup Address Event
     */
    setupAddressEvent: function(el, view) {
      var $form = $('form', el);
      $form.on('change', '.country', function(e) {
        e.preventDefault();
        var $this = $(this),
          $parent = $this.parentsUntil('form', 'div.address-fieldset'),
          $select = $parent.find('select.us-state'),
          $input = $parent.find('input.us-state'),
          $zip = $parent.find('input.postal-code');
        _val = $this.val();
        if (_val === $this.attr('data-value')) {
          return;
        }
        $this.attr('data-value', _val);
        switch (_val) {
          case '':
          case 'US':
            if ($select.is(':hidden')) {
              $input.attr('disabled', true)
                .hide('slow', function() {
                  $select.attr('disabled', false)
                    .show('slow');
                });
            }
            // If this Zip Code doesnot have class allowzipcodeplusfour
            if (!$zip.hasClass('allowzipcodeplusfour')) {
              $zip.addClass('allowzipcode')
                .attr('maxlength', 5);
            }
            break;
          default:
            if ($input.is(':hidden')) {
              $select.attr('disabled', true)
                .hide('slow', function() {
                  $input.attr('disabled', false)
                    .val('')
                    .show('slow');
                  if ($input.is("[data-default-value]")) {
                    $input.val($input.attr('data-default-value'))
                      .removeAttr('data-default-value');
                  }
                });
            }
            $zip.removeClass('allowzipcode')
              .removeAttr('maxlength');
        }
      });
      if (view.options.mode === 'update') {
        var $addresses = $('div.address-fieldset', $form);
        $addresses.each(function() {
          var $this = $(this);
          $('.country', this)
            .trigger('change');
        });
      }
    },
    /**
     * Popover is error
     */
    setUpErrorNotice: function($currentTarget, text, duration, lang) {
      // Languages
      lang = lang || 'en';
      duration = duration || 3000;
      text = text || '';
      var _t_1, _t_2;
      switch (lang) {
        case 'sp':
          _t_1 = 'Error';
          _t_2 = 'Por favor, vuelve a intentarlo';
          break;
        default:
          _t_1 = 'Error';
          _t_2 = 'Please try again.';
      }

      _opt = {
        html: true,
        placement: 'top',
        trigger: 'manual',
        title: '<i class="icon-edit"></i> ' + _t_1 + '.',
        content: '<i class="icon-spinner icon-spin icon-large"></i> ' + _t_2 + ' ...' + ((text !== '') ? '<br>' + text : '')
      };

      $currentTarget.attr('disabled', true)
        .popover(_opt)
        .popover('show');

      window.setTimeout(
        function() {
          $currentTarget.attr('disabled', false)
            .popover('destroy');
          $currentTarget.next('.popover')
            .remove();
        }, duration);
    },
    /**
     * Check Internal Fields and append _internal to field name
     * @param  object $form
     * @param  array internalFields
     * @return
     */
    parseInternalFieldsBeforeSubmit: function($form, internalFields) {
      // console.log('===== parseInternalFieldsBeforeSubmit ======');
      var _nameTxt;
      if (!internalFields.length) {
        return;
      }
      _.each(internalFields, function(element) {
        var $input = $(':input[name="' + element + '"]', $form);
        if (!$input.length) {
          return;
        }
        _nameTxt = element.match(/\[\]$/gi);
        if (_nameTxt) {
          _nameTxt = element.substr(0, element.length - 2) + '_internal[]';
        } else {
          _nameTxt = element + '_internal';
        }
        $input.attr('name', _nameTxt);
      });
    },

    setupPopover: function($context) {
      var $popover = $('[data-toggle="popover"]', $context);
      $popover.popover();
    },

    destroyPopover: function($context) {
      var $popover = $('[data-toggle="popover"]', $context);
      $popover.popover('destroy');
    },

    /**
     * Calculate Date Diff
     * http://stackoverflow.com/questions/2627473/how-to-calculate-the-number-of-days-between-two-dates-using-javascript
     * @return
     */
    calculateDateDiffByDays: function(date1, date2) {
      // The number of milliseconds in one day
      var ONE_DAY = 1000 * 60 * 60 * 24;

      // Convert both dates to milliseconds
      var date1_ms = date1.getTime(),
        date2_ms = date2.getTime();

      // Calculate the difference in milliseconds
      var difference_ms = Math.abs(date1_ms - date2_ms);

      // Convert back to days and return
      return Math.round(difference_ms / ONE_DAY);
    },

    /**
     * Convert field value to array str "[value1, value2]"
     * @param  {[type]} formId [description]
     * @return {[type]}        [description]
     */
    convertDataToArrayString: function($form) {
      var checkClass = ['value-as-array'];
      _.each(checkClass, function(element) {
        var $inputEl = $(':input.' + element, $form);
        $inputEl.each(function() {
          var $this = $(this);
          var val = $inputEl.val();
          if (val && val !== '') {
            val = val.split(',');
          } else {
            // Make it as emptied Array
            val = [];
          }
          $this.val(JSON.stringify(val));
        });
      });
    }
  };
});