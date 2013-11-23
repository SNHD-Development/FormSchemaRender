/**
 * Utilities Functions
 * Events
 **/
define([
    'jquery',
    'underscore',
    'backbone',
    'vm',
    'bootstrap',
    'jquery.select2',
    'jquery.spinner',
    'jquery.birthdaypicker',
    'jquery.placeholder',
    'jquery.expose',
    'jquery.zclip',
    'xdr'
], function($, _, Backbone, Vm) {

    /**
     * Setup DependOn Options (Values)
     **/

    function setValueDependOn(el, visibleOnObj, formData) {
        _.each(visibleOnObj, function(value) {
            if (formData.fields[value.name]) {
                $(el).on('visibleOnRenderComplete', ':input[name="' + value.name + '"]', function() {
                    $(this).val(formData.fields[value.name]).trigger('change');
                });
                // Need to trigger the value
                $(':input[name="' + value.options.visibleon.name + '"]').trigger('change');
            }
        });
    }

    return {
        /**
         * Check Browser Agent
         **/
        checkBrowser: function() {
            if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { //test for MSIE x.x;
                var ieversion = parseInt(RegExp.$1);
                if (ieversion < 7) {
                    ieversion = 7;
                }
                $('body').addClass('ie' + ieversion);
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
            return (str + '').replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1) {
                return $1.toUpperCase();
            });
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
         * Setup FileInput default value
         **/
        setupFileInput: function(el) {
            $(':file', el).trigger('change');
        },
        /**
         * Setup Email Events
         **/
        setupEmailInput: function(el) {
            $('.emailpicker', el).each(function() {
                var $server = $('.emailpicker_server', this),
                    $username = $('.emailpicker_username', this),
                    $hidden = $(':input[type="hidden"]', this),
                    $notsending = $('.not_sending', this);
                if (typeof $server.attr('data-value') !== 'undefined' && $server.attr('data-value')) {
                    $server.val($server.attr('data-value')).trigger('change');
                }
                if ($hidden.val() !== '') {
                    var _token = $hidden.val().split("@");
                    if (_token.length === 2) {
                        $username.val(_token[0]).trigger('change');
                        $server.val(_token[1]).trigger('change');
                    }
                }
                $('.emailpicker_server, .emailpicker_username', this).on('change', this, function(e) {
                    if ($username.val() !== '' && $server.val() !== '') {
                        $hidden.val($.trim($username.val() + '@' + $server.val())).trigger('change');
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
        setupBDateInput: function(el, model) {
            $('.birthdaypicker', el).each(function() {
                $(this).birthdaypicker($(this).attr('data-options'));
                var $hidden = $(':input[type="hidden"]', this),
                    _token, $month, $day, $year;
                if ($hidden.val() !== '' && model.get($hidden.attr('name')) !== '') {
                    _token = $hidden.val().split("/");
                    if (_token.length === 3) {
                        if (_token[0][0] === '0') {
                            _token[0] = _token[0].substr(1);
                        }
                        if (_token[1][0] === '0') {
                            _token[1] = _token[1].substr(1);
                        }

                        $month = $('.birth-month', this).val(_token[0]);
                        $day = $('.birth-day', this).val(_token[1]);
                        $year = $('.birth-year', this).val(_token[2]);

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
            $(':hidden[data-value!=""]', el).each(function() {
                var $this = $(this);
                if (typeof $this.attr('data-value') !== 'undefined' && $this.attr('data-value')) {
                    $this.val($this.attr('data-value')).trigger('change');
                }
            });
        },
        /**
         * Get BDate Values
         **/
        getBDateinput: function(el, model) {
            $('fieldset.birthday-picker', el).each(function() {
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

                if (String(_day).match(_nan)) {
                    $day.val('');
                    _error = true;
                }
                if (String(_month).match(_nan)) {
                    $month.val('');
                    _error = true;
                }
                if (String(_year).match(_nan)) {
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
                model.set($this.attr('name'), $this.val()).trigger('change');
            });
        },
        /**
         * Some select, check might have default value need to send change event
         **/
        getDefaultValues: function(el) {
            $('.has-default-val', el).each(function() {
                var $this = $(this);
                if ($this.is(':disabled')) {
                    return;
                }
                if ($this.val() === '') {
                    $this.trigger('change');
                } else if ($this.hasClass('data-clean')) {
                    $this.trigger('change').removeClass('data-clean');
                }
            });
        },
        /**
         * Setup Date Input
         **/
        setupDateInput: function(el) {
            $('.datepicker', el).each(function() {
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
                    .on('changeDate', function(e) {
                        var _dateInput = $(e.currentTarget).removeClass('invalid').trigger('change');
                        _dateInput.datepicker('hide');
                    })
                    .on('click', function(e) {
                        $('div.datepicker.dropdown-menu').css('display', 'none');
                        $(e.currentTarget).datepicker('show');
                    });
            });
        },
        /**
         * Setup Spinner
         **/
        setupSpinner: function(el) {
            $('.spinner', el).each(function() {
                var _opt = {
                    value: parseInt($(':input.spinner-input', this).val()) || 1
                };
                $(this).spinner(_opt)
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
            if (e.keyCode === 8 || e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 46 || e.keyCode === 9) {
                return true;
            } else if (e.shiftKey || (!(e.keyCode === 46 || e.keyCode === 190 || e.keyCode === 110) || $(e.currentTarget).val().indexOf('.') !== -1) && (e.keyCode < 48 || (e.keyCode > 57 && e.keyCode < 96) || e.keyCode > 105)) {
                e.preventDefault();
            }
        },
        /**
         * Allow Only natural Number in Keypress Event
         **/
        allowNaturalNumber: function(e) {
            if (e.keyCode === 8 || e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 46 || e.keyCode === 9) {
                return true;
            } else if (e.shiftKey || (!(e.keyCode === 46 || e.keyCode === 110)) && (e.keyCode < 48 || (e.keyCode > 57 && e.keyCode < 96) || e.keyCode > 105) || (e.keyCode === 48 && $(e.currentTarget).val().length === 0)) {
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
                    $input = $(':input[name="' + element + '"]', el).val(_val).trigger('change');
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
                        $(this).val($option.val());
                    } else {
                        if ($(this).hasClass('us-state')) {
                            $(this).val('NV');
                        } else if ($(this).hasClass('us-country')) {
                            $(this).val('US');
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
                            $btn_decision.next('input[type="hidden"]').val(view.options.formData.fields[element.name]).trigger('change');
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
                                    $currentTarget.attr('disabled', false).popover('destroy');
                                    $currentTarget.next('.popover').remove();

                                    _opt = {
                                        html: true,
                                        placement: 'top',
                                        trigger: 'manual',
                                        title: '<i class="icon-edit"></i> Error',
                                        content: e.error_message
                                    };
                                    $currentTarget.attr('disabled', true).popover(_opt).popover('show');

                                    window.setTimeout(
                                        function() {
                                            $currentTarget.attr('disabled', false).popover('destroy');
                                            $currentTarget.next('.popover').remove();
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
                                    $currentTarget.parent().find('div.btn-decision-data-wrapper').remove();
                                    view.model.set(element.name, e.value);
                                }
                                window.setTimeout(
                                    function() {
                                        $currentTarget.attr('disabled', false).popover('destroy');
                                        $currentTarget.next('.popover').remove();
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
                            $currentTarget.attr('disabled', true).popover(_opt).popover('show');

                            window.setTimeout(
                                function() {
                                    $currentTarget.attr('disabled', false).popover('destroy');
                                    $currentTarget.next('.popover').remove();
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
                        $currentTarget.attr('disabled', true).popover(_opt).popover('show');

                        $.getJSON(_url, _success);
                    });
                });
            }
        },
        /**
         * Final Setup for Read Mode
         **/
        finalReadSetup: function(view) {
            // Attach Click Event to Copy to the Clipboard
            if (view._buttonClipboards.length > 0) {
                _.each(view._buttonClipboards, function(element) {
                    $('button#' + element.name).zclip({
                        path: '//public.southernnevadahealthdistrict.org/assets/js/apps/formrender/libs/copy/ZeroClipboard.swf',
                        copy: function() {
                            var _txt = '';
                            _.each(element.values, function(elementValue) {
                                _txt += $('#' + elementValue).text() + "\r\n";
                            });
                            return _txt;
                        }
                    });
                });
            }
            // If there is any lightbox markup, will need to check if this a valid photo or not
            $('a[rel^=lightbox], area[rel^=lightbox], a[data-lightbox], area[data-lightbox]').each(function() {
                var $this = $(this);
                $("<img>", {
                    src: $this.attr('href'),
                    error: function() {
                        $this.hide();
                        $this.next('.btn').show();
                    }
                });
            });
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
                    case 'button':
                    case 'submit':
                    case 'clear':
                    case 'address':
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
                                            var $_input = $(':input[name="' + respKey + '"]').val(respVal).trigger('change'),
                                                $_parent;
                                            if ($_input.attr('type') === 'hidden') {
                                                $_parent = $_input.parent('.emailpicker');
                                                if ($_parent.length > 0) {
                                                    var _email = respVal.split('@');
                                                    $(':input.not_sending', $_parent).each(function(index, ele) {
                                                        $(ele).val(_email[index]);
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
                $bDateSelect = $('.not_sending', $bDate).trigger('change');
            }
            var _val = $currentElement.val();
            if ((_val !== '' && _val.search(/NaN/) === -1) || canEmpty.indexOf(key) > -1) {
                data[key] = _val;
            } else {
                error = true;
                $input = $(':input[name="' + el + '"]', form).addClass('invalid');
                if (invalidObj) {
                    invalidObj.push($input);
                }
                if ($bDate.length > 0) {
                    var _index = _val.split('/');
                    _.each(_index, function(date, index) {
                        if (date === 'NaN') {
                            $input = $($bDateSelect[index]).addClass('invalid');
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
         * @param  {[type]} $form [description]
         * @return {[type]}       [description]
         */
        setupUrlAjaxCall: function($form, $scope) {
            $scope = $scope || null;
            var $urlEndPoint = ($scope) ? $scope : $(':input[data-url]');
            if ($urlEndPoint.length === 0) {
                return;
            }
            $urlEndPoint.each(function() {
                var $this = $(this),
                    _url = $this.attr('data-url');
                // console.log(_url);
                // $.support.cors = true;
                $.ajax({
                    // crossDomain: true,
                    url: _url,
                    dataType: "json",
                    success: function(data, textStatus) {
                        if (textStatus === 'success') {
                            var _opts = '';
                            _.each(data, function(element) {
                                _opts += '<option value="' + element + '">' + element + '</option>';
                            });
                            $this.find('option').remove();
                            $this.append(_opts);
                            $this.select2({
                                containerCssClass: 'span12'
                            });
                            $('#s2id_' + $this.attr('id') + ' .select2-drop', $form).hide();
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        window.location.reload();
                    }
                });
                // $.getJSON(_url, function(data, textStatus) {
                //     if (textStatus === 'success') {
                //         var _opts = '';
                //         _.each(data, function(element) {
                //             _opts += '<option value="' + element + '">' + element + '</option>';
                //         });
                //         $this.find('option').remove();
                //         $this.append(_opts);
                //         $this.select2({
                //             containerCssClass: 'span12'
                //         });
                //         $('#s2id_' + $this.attr('id') + ' .select2-drop', $form).hide();
                //     }
                // }).fail(function(jqXHR, textStatus, errorThrown) {
                //     debugger;
                //     console.log('jqXHR');
                //     console.log(jqXHR);
                //     console.log('errorThrown');
                //     console.log(errorThrown);
                // });
            });
        },

        /**
         * Function to Setup BooleanInput
         */
        setupBooleanInput: function ($form, view) {
            $form.on('click', '.form-render_booleaninut button', function (e) {
                var $this = $(this), _val = $this.attr('data-value'), _id = $this.attr('data-id');
                $('#'+_id, $this.parent()).removeClass('invalid').val(_val).trigger('change');
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
                                }).on('change', function(e) {
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
                    $(this).change(function(e) {
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
                                                    $this.addClass('invalid').val('');
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
                                _data += key + '=' + $(':input[name="' + value + '"]').val() + '&';
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
                            $input.attr('disabled', true).hide('slow', function() {
                                $select.attr('disabled', false).show('slow');
                            });
                        }
                        $zip.addClass('allowzipcode').attr('maxlength', 5);
                        break;
                    default:
                        if ($input.is(':hidden')) {
                            $select.attr('disabled', true).hide('slow', function() {
                                $input.attr('disabled', false).val('').show('slow');
                                if ($input.is("[data-default-value]")) {
                                    $input.val($input.attr('data-default-value')).removeAttr('data-default-value');
                                }
                            });
                        }
                        $zip.removeClass('allowzipcode').removeAttr('maxlength');
                }
            });
            if (view.options.mode === 'update') {
                var $addresses = $('div.address-fieldset', $form);
                $addresses.each(function() {
                    var $this = $(this);
                    $('.country', this).trigger('change');
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

            $currentTarget.attr('disabled', true).popover(_opt).popover('show');

            window.setTimeout(
                function() {
                    $currentTarget.attr('disabled', false).popover('destroy');
                    $currentTarget.next('.popover').remove();
                }, duration);
        }
    };
});