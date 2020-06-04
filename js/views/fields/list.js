/**
 * SubForm Layout
 **/
define([
    "jquery",
    "lodash",
    "backbone",
    "models/model",
    "modelbinder",
    "validation",
    "vm",
    "utils",
    "events",
    "text!templates/subform-layouts/default.html",
    "jquery.expose",
    "bootstrap"
], function(
    $,
    _,
    Backbone,
    Model,
    Modelbinder,
    Validation,
    Vm,
    Utils,
    Events,
    subFormLayoutTemplate
) {
    var DEBUG = false;

    function formatModel(view) {
        _.each(view.options.formSchema.fields, function(element) {
            if (!element.name || !element.type) {
                return;
            }
            var _type = element.type.toLowerCase(),
                _valModel = view.model.get(element.name);
            switch (_type) {
                case "number":
                    _valModel = parseFloat(_valModel);
                    if (!isNaN(_valModel)) {
                        if (element.options && element.options.decimals) {
                            _valModel *= Math.pow(10, element.options.decimals);
                        }
                        view.model.set(element.name, _valModel);
                    }
                    break;
            }
        });
    }

    function reFormatModel(view) {
        // var DEBUG = true;
        if (DEBUG) {
            console.log("[*] list.reFormatModel - start");
            if (view.model && view.model.toJSON) {
                console.log(view.model.toJSON());
            }
        }
        _.each(view.options.formSchema.fields, function(element) {
            if (!element.name || !element.type) {
                return;
            }
            var _type = element.type.toLowerCase(),
                _valModel = view.model.get(element.name);
            switch (_type) {
                case "number":
                    _valModel = parseFloat(_valModel);
                    if (!isNaN(_valModel)) {
                        if (element.options && element.options.decimals) {
                            _valModel /= Math.pow(10, element.options.decimals);
                        }
                        view.model.set(element.name, _valModel);
                    }
                    break;
            }
        });
        if (DEBUG) {
            console.log("[*] list.reFormatModel - end");
            if (view.model && view.model.toJSON) {
                console.log(view.model.toJSON());
            }
        }
    }
    return Backbone.View.extend({
        _modelBinder: undefined,
        // Clean Data Binding
        clean: function() {
            var that = this;
            // Unbind Validation
            Backbone.Validation.unbind(this);
            if (typeof this._modelBinder !== "undefined") {
                this._modelBinder.unbind();
            }
            if (this._hasVisibleOn) {
                // Need to remove all VisibleOn Event!
                var keys = _.keys(this._visibleOnEvents);
                if (keys && keys.length) {
                    // console.log('keys:', keys);
                    // console.log('this._visibleOnEvents:', this._visibleOnEvents);
                    _.each(keys, function(key) {
                        // console.log('key:', key);
                        that._visibleOnEvents[key].unbind();
                        // console.log('unbind:', key);
                    });
                }
            }
            // Destroy Popover
            Utils.destroyPopover(this.$el);
        },
        removeContent: function() {
            this.$el
                .html("")
                .removeAttr("class")
                .fadeIn();
        },
        /**
         * Init List View
         **/
        initialize: function(opts) {
            opts = opts || {};
            // console.log('*** initialize ***');
            // console.log(arguments);
            // Setup BB Binder
            this._modelBinder = new Modelbinder();
            var _tmp;
            if (!this.options) {
                this.options = {};
            }
            this.options._id = opts.formId;
            if (!this.options.options) {
                this.options.options = {};
            }
            var _lang = this.options.options.lang;
            if (typeof this.options.model === "undefined") {
                if (DEBUG) {
                    console.log("[*] list.initialize: Insert");
                }
                // console.log('this.options.formSchema:', this.options.formSchema);

                // console.log('[list] start setting up model');

                this.model = new Model(
                    _.extend(this.options.formSchema, {
                        is_internal: this.options.internal,
                        render_mode: this.options.mode,
                        is_list_field: true
                    })
                );
                // console.log(this.options);
                switch (_lang) {
                    case "sp":
                        this._btn_title = "Agregar";
                        break;
                    default:
                        this._btn_title = "Add";
                }
            } else {
                if (DEBUG) {
                    console.log("[*] list.initialize: Edit");
                    console.log(this.options.model.toJSON());
                    console.log(this.model);
                }
                switch (_lang) {
                    case "sp":
                        this._btn_title = "Hecho";
                        break;
                    default:
                        this._btn_title = "Done";
                }
            }
            this.options.formSchema.view = this.options.formSchema.view || "";
            // Load Correct SubView Render
            switch (this.options.formSchema.view.toLowerCase()) {
                default: _tmp = subFormLayoutTemplate;
                break;
            }
            this.template = _.template(_tmp);
            // this is a list
            this._isListFieldType = true;
            // console.log('this._hasVisibleOn:', this._hasVisibleOn);

            this._hasVisibleOn = false;
            // console.log('this._hasVisibleOn:', this._hasVisibleOn);

            this._visibleOnEvents = {};
        },
        render: function(firstTime, readMode) {
            var visibleOnArray = [];
            var fieldsType = {};
            var that = this,
                _defaultEmail = "";
            if (!this.options) {
                this.options = {};
            }
            if (!this.options.options) {
                this.options.options = {};
            }
            // console.log('[list] start render ****', that.cid);

            // Render Fields
            require(["views/baseField"], function(BaseField) {
                // console.log('*** Start : List ***');
                // var DEBUG = true;
                // console.log(that.options);
                // console.log('[list] start BaseField');

                // console.log("- that.model.validation:", JSON.stringify(_.keys(that.model.validation)));
                var _id = that.options._id;
                var _html = "",
                    _required,
                    formView = Vm.create(that, "BaseField", BaseField, {
                        formSchema: that.options.formSchema,
                        lang: that.options.options.lang
                    }),
                    _options = that.options;
                // var DEBUG = true;
                if (DEBUG) {
                    console.log("[*] list.render");
                    console.log(that.options);
                    if (that.model && that.model.toJSON) {
                        console.log(that.model.toJSON());
                        console.log("- that.model.validation:", JSON.stringify(_.keys(that.model.validation)));
                    }
                    if (that.options && that.options.model && that.options.model.toJSON) {
                        console.log(that.options.model.toJSON());
                    }
                }
                // var DEBUG = true;
                _.each(that.options.formSchema.fields, function(value, key, list) {
                    var _temp = '';
                    var _typeLowerCase = (value.type) ? value.type.toLowerCase(): null;
                    // console.log('- _options:', _options);
                    // Check for Show On Mode

                    var currentModelValue = that.model.get(value.name);

                    // console.log('- currentModelValue:', currentModelValue);

                    if (value && value.type && value.type.toLowerCase() === "file" && currentModelValue) {
                        return;
                    }

                    if (!BaseField.prototype.checkShowOnMode.call(
                            that,
                            value,
                            _options.options.mode,
                            _options.options.formData.status
                        )) {
                        // console.log('- that.model.bindings:', that.model.bindings);
                        if (that.model.bindings && that.model.bindings[value.name]) {
                            delete that.model.bindings[value.name];
                        }
                        var _name = value.name + "[]";
                        if (that.model.bindings && that.model.bindings[_name]) {
                            delete that.model.bindings[_name];
                        }
                        return "";
                    }

                    if (
                        typeof value.description !== "undefined" &&
                        _.indexOf(formView.notRenderLabel, value.type.toLowerCase()) === -1
                    ) {
                        _required = Utils.checkRequireFields(
                            value,
                            that.options.formSchema.validation
                        );
                        _temp += formView.renderLabel(value, _required);
                    }

                    if (
                        value.type.toLowerCase() === "email" &&
                        value.options.autocomplete
                    ) {
                        if (currentModelValue !== "") {
                            var _strArray = currentModelValue.split("@");
                            that.model.set(value.name + "_username", _strArray[0]);
                            that.model.set(value.name + "_server", _strArray[1]);
                            if (value.options["default"]) {
                                _defaultEmail = value.options["default"];
                                value.options["default"] = _strArray[1];
                            } else {
                                _defaultEmail = "";
                            }
                        }
                    }
                    if (DEBUG) {
                        console.log("    - Loop: " + key);
                        console.log(value);
                        if (value.name) {
                            console.log(currentModelValue);
                        }
                    }

                    _temp += formView.render(value);

                    if (_defaultEmail !== "") {
                        value.options["default"] = _defaultEmail;
                    }
                    if (value.options.visibleon && !(_typeLowerCase === 'button' || _typeLowerCase === 'submit')) {
                        // console.log('_temp:', _temp);
                        _temp = '<div class="options-visible-on-' + value.name + '" style="display:none">' + _temp + '</div>';

                        visibleOnArray.unshift({
                            value: value,
                            html: _temp
                        });
                    } else {
                        _html += _temp;
                    }

                    // Mapping the input type
                    if (value && value.name && value.type) {
                        fieldsType[value.name] = $.trim(value.type.toLowerCase());
                    }
                });
                // DEBUG = false;
                var _btn_opts = _.clone(that.options.formSchema.formoptions);
                _btn_opts.submitbutton = that._btn_title;
                _btn_opts.subForm = true;
                // console.log(that.options.options.lang);
                switch (that.options.options.lang) {
                    case "sp":
                        _btn_opts.resetbutton = "Cancelar";
                        break;
                }
                // console.log(_btn_opts);
                _html += formView.renderButton(_btn_opts);
                if (that.el) {
                    $(that.el).html(
                        that.template(
                            _.extend({
                                    html: _html
                                },
                                that.options.formSchema
                            )
                        )
                    );
                }
                // console.log(' - formView:', formView);
                // console.log(' - that.model:', that.model.toJSON());
                // If there are radio buttons.
                if (formView._radioFieldName.length) {
                    // console.log('- Setup : setupRadioButtonsValue');
                    // Utils.setupRadioButtonsValue(that, that.model, true);
                    Utils.setupRadioButtonsValueWithModel(that, formView._radioFieldName);
                }
                // Found that it could replace the model value
                var $inputs = that.$(':input[value!=""]').not(":button");
                $inputs.each(function() {
                    // var DEBUG = true;
                    var $this = $(this);
                    var _thisName = $this.attr("name");
                    var _thisVal = $this.val();
                    if (!that.model.has($this.attr("name"))) {
                        if (DEBUG) {
                            console.log("- set:", $this.attr("name"));
                        }
                        that.model.set($this.attr("name"));
                    }
                    if (DEBUG) {
                        console.log("    $inputs.each - start");
                        console.log($this);
                        console.log("Name: " + _thisName);
                        console.log("Value: " + _thisVal);
                        console.log(
                            "Model Current Value: " + that.model.get($this.attr("name"))
                        );
                    }
                    if ($this.is(":radio")) {
                        return;
                    }
                    if (_thisVal) {
                        that.model.set(_thisName, _thisVal);
                    }
                    var _modelVal = that.model.get(_thisName);
                    var _dataFieldType = $this.attr("data-field-type");
                    if (_dataFieldType && !!_modelVal) {
                        if (DEBUG) {
                            console.log('    data-field-type = "' + _dataFieldType + '"');
                        }
                        switch (_dataFieldType) {
                            case "is-buttons-radio":
                                var $btnGrp = $this.closest(".btn-group");
                                if ($btnGrp.length) {
                                    var $targetBtn = $btnGrp.find(
                                        ':button[value="' + _modelVal + '"]'
                                    );
                                    if ($targetBtn.length) {
                                        $targetBtn.click();
                                        if (DEBUG) {
                                            console.log($targetBtn);
                                            console.log(
                                                '    Click Button with Value = "' + _modelVal + '"'
                                            );
                                        }
                                    }
                                }
                                break;
                            default:
                                if (console && console.warn) {
                                    console.warn(
                                        '[!] list.render not implement "data-field-type" = "' +
                                        _dataFieldType +
                                        '" yet'
                                    );
                                }
                        }
                    }
                    if (DEBUG) {
                        console.log($this);
                        console.log("Model After Set Value: " + _modelVal);
                    }
                });
                // Format Values
                if (that.options.model) {
                    reFormatModel(that);
                }
                // console.log('that.model:', that.model);
                // console.log('that.model.validation:', that.model.validation);
                // console.log('that.options.model:', that.options.model);


                // console.log('- current model:', JSON.stringify(that.options.model));
                // Bind Model
                try {
                    if (that.el) {
                        // var DEBUG = true;
                        if (DEBUG) {
                            console.log(
                                "    Binding Model in List.js [" +
                                that.options.formSchema.name +
                                "]"
                            );
                            console.log(that);
                            console.log(that.model.toJSON());
                            console.log(that.model.bindings);
                        }

                        var _modelDataJson =
                            that.model && that.model.toJSON ? that.model.toJSON() : null;

                        if (visibleOnArray && visibleOnArray.length) {
                            that._hasVisibleOn = true;
                            // console.log('[list] that._visibleOnEvents:', that._visibleOnEvents);

                            // console.log('[list] setupVisibleOn:', that.cid);

                            _.each(visibleOnArray, function(ele) {
                                // console.log('[list] start: BaseField.prototype.setupVisibleOn', ele.value.name);
                                BaseField.prototype.setupVisibleOn.call(that, ele.value, ele.html, null, fieldsType, formView);
                            });
                            // console.log('[list] after setupVisibleOn: that.model.bindings', that.model.bindings);

                            if (_modelDataJson) {
                                // console.log('that.el:', that.el);
                                // console.log('that.$el:', that.$el);

                                // console.log('_modelDataJson:', _modelDataJson);
                                _.each(_modelDataJson, function(value, name) {
                                    if (!value) {
                                        return;
                                    }
                                    var $input = $(':input[name="' + name + '"]', that.$el);

                                    if ($input.is(':radio')) {
                                        $input = $(':input[name="' + name + '"]:checked', that.$el);
                                    }

                                    $input.trigger(
                                        "change"
                                    );
                                });
                            }
                        }

                        // console.log('- current model:', JSON.stringify(that.options.model));
                        that._modelBinder.bind(that.model, that.el, that.model.bindings);
                        // console.log('- current model:', JSON.stringify(that.options.model));
                        // Some Element

                        if (!_.isEmpty(_modelDataJson)) {
                            _.each(_modelDataJson, function(_modelVal, _modelKey) {
                                // var DEBUG = true;
                                if (DEBUG) {
                                    console.log("    Model." + _modelKey + " = " + _modelVal);
                                }
                                var $modelKeyInput = that.$el.find(
                                    ':input[name="' + _modelKey + '"]'
                                );
                                if ($modelKeyInput.is(":radio")) {
                                    return;
                                }
                                if ($modelKeyInput.length) {
                                    var _mVal = $modelKeyInput.val();
                                    if (DEBUG) {
                                        console.log(_mVal);
                                    }
                                    if ((_modelVal && !_mVal) || _mVal === "") {
                                        if (DEBUG) {
                                            console.log(
                                                '    Set :input[name="' +
                                                _modelKey +
                                                '"] = ' +
                                                _modelVal
                                            );
                                        }
                                        // $modelKeyInput.val(_modelVal);
                                    }
                                }
                            });
                        }
                        // console.log('- current model:', JSON.stringify(that.options.model));
                    }
                } catch (err) {
                    if (window.console && window.console.log) {
                        window.console.log(
                            'Warning in list.js: "' + err + '" continue running.'
                        );
                    }
                }
                // console.log('- current model:', JSON.stringify(that.options.model));
                // console.log('Bind Validation <-------------------------');

                Backbone.Validation.bind(that, {
                    forceUpdate: true
                });
                // console.log('- current model:', JSON.stringify(that.options.model));
                // Attached Events
                if (formView._hasEmailPicker) {
                    that.setupEmailInput();
                }
                // Placeholder Setup for Older Browser
                Utils.setupPlaceHolder(that.el);
                // Set Up Popover
                Utils.setupPopover(that.$el);
                // Set up the BooleanButton
                if (formView._hasBooleanInput) {
                    Utils.setupBooleanInput(that.$el, formView);
                }
                // Setup Radio Button Group
                if (formView._hasRadioBtnGroup) {
                    Utils.setupRadioBtnGroup(that.$el, that.model);
                    Utils.setupRadioBtnGroupValue(that.$el);
                }
                // If there are BirthDayPicker
                // var DEBUG = true;
                if (DEBUG) {
                    console.log("[*] Check for BirthDayPicker");
                    console.log(that);
                    console.log(that.options);
                    console.log(formView);
                }
                if (formView._hasBDate) {
                    Utils.setupBDateInput(that.$el, that.model, true);
                }
                // If there are DatePicker
                if (formView._hasDate) {
                    // console.log('- Here');
                    Utils.setupDateInput(that.$el, formView, false);
                }
                if (formView._hasTime) {
                    // console.log('- Here');
                    Utils.setupTimeInput(that.$el, formView);
                }
                // If this is the first time need to click cancel button
                if (firstTime) {
                    that.$(".form-actions button.btn-cancel").click();
                }
                // console.log('- current model:', JSON.stringify(that.options.model));
                // var DEBUG = true;
                // Will need to loop through the value and trigger change
                // console.log(' - that.model.toJSON():', JSON.stringify(that.model.toJSON()));
                // console.log('- firstTime: ', firstTime);
                _.each(that.model.toJSON(), function(value, key) {
                    if (value === "") {
                        return;
                    }
                    var _inputName = that.$el.find(':input[name="' + key + '"]'),
                        _val = _inputName.val(),
                        _modelVal = that.model.get(key);
                    var DEBUG = false;
                    if (DEBUG) {
                        console.log("    - " + key);
                        console.log(_val);
                        console.log(_modelVal);
                        console.log(_inputName);
                    }
                    if (_inputName.is(":radio")) {
                        // console.log(' - is radio:', _inputName);
                        // Skipped, if this is radio
                        return;
                    }
                    if (_inputName.hasClass('timepicker')) {
                        if (_val !== _modelVal) {
                            if (DEBUG) {
                                console.log('updated timepicker:', _val, _modelVal);

                            }
                            _inputName.val(_modelVal)
                        }
                        return;
                    }
                    if (_val === "" || _.isNull(_val)) {
                        // console.log(_inputName.is('select'));
                        if (_inputName.is("select")) {
                            if (_inputName.attr("data-url")) {
                                // When the data comeback from AJAX Call will loaded the value in
                                _inputName.one("dataloaded", function() {
                                    _inputName
                                        .find("option")
                                        .filter(function() {
                                            return $(this).text() === value;
                                        })
                                        .attr("selected", true)
                                        .trigger("change");
                                });
                            } else if (_modelVal) {
                                // console.log(_inputName);
                                _inputName.attr("data-select-value", _modelVal);
                            }
                        } else {
                            _inputName.val(value);
                        }
                    }
                });
                // console.log('- current model:', JSON.stringify(that.options.model));
                // console.log(' - that.model.toJSON():', JSON.stringify(that.model.toJSON()));
                // Set Up Ajax Call
                Utils.setupUrlAjaxCall(that.$el, null, that.model);
                // Set Up Select2
                try {
                    // console.log(that);
                    // console.log(that.model.toJSON());
                    Utils.setupSelect2(formView, "#" + _id);
                    // console.log(that.model.toJSON());
                } catch (err) {
                    if (console && console.error) {
                        console.error(err);
                    }
                }
                // Find the first input in the form
                /* var $fInput = that
                    .$(":input")
                    .not(":hidden")
                    .first()
                    .focus();
                if ($fInput.length && that.$el.length) {
                    $("html, body").animate({
                            scrollTop: that.$el.offset().top - 30
                        },
                        1000
                    );
                } */
                // If this is read mode
                if (readMode) {
                    var $allInput = that.$(":input").not(":button.btn-cancel");
                    $allInput.each(function() {
                        $(this).attr("disabled", true);
                    });
                    var $btnDone = that.$(":button.btn-submit");
                    var $btnCancel = that.$(":button.btn-cancel");
                    $btnDone.hide();
                    $btnCancel.text("Close");
                }

                // console.log('- formView: ', formView);

                // console.log('- formView: ', formView);
                // console.log('Fired: ' + _id + '.listViewShowed');
                formView.trigger(_id + ".listViewShowed", formView);
                // console.log('- current model:', JSON.stringify(that.options.model));

                setTimeout(function() {
                    Utils.focusOnFirstInput(that, true);
                }, 300);
            });
        },
        /**
         * Events
         **/
        events: {
            "keypress div.sub_form_render :input": "preventEnterPressed",
            "click div.form-actions .btn-submit": "sendForm",
            "click div.form-actions .btn-cancel": "clickCancel",
            "blur :input:not(:button)": "preValidate"
        },
        /**
         * User pressed a key
         **/
        preventEnterPressed: function(e) {
            if (e.keyCode === 13) {
                if ($(e.currentTarget).is("input")) {
                    e.stopPropagation();
                    return false;
                }
            }
        },
        preValidate: function(e) {
            e.stopPropagation();
            var DEBUG = false;
            var that = this;
            if (DEBUG) {
                console.log("[list] list.preValidate ********");
                // console.log('this.model.toJSON()', this.model.toJSON());
                // console.log('this.model', this.model);
                console.log('[list] this.model.validation', JSON.stringify(_.keys(this.model.validation)));
                console.log('[list] this.model.bindings', this.model.bindings);
                // console.log('this.options', this.options);
                console.log('[list] this._hasVisibleOn:', this._hasVisibleOn);
            }
            if (false && this._hasVisibleOn) {
                if (DEBUG) {
                    // console.log('[list] Backbone.Validation.bind <-------------------------');
                    console.log('[list] this.model:', this.model);
                }
                // Backbone.Validation.bind(this, {
                //     forceUpdate: true
                // });

                // Need to delay a bit for visible on to finished
                setTimeout(function() {
                    if (DEBUG) {
                        console.log('[list:setTimeout] that.model.validation', JSON.stringify(_.keys(that.model.validation)));
                    }
                    Utils.preValidate(e, that.model);
                }, 800);
            } else {
                Utils.preValidate(e, this.model);
            }
        },
        /**
         * This function will call when using click on "Add"
         * @param  object e
         * @return
         */
        sendForm: function(e) {
            // var DEBUG = true;
            e.preventDefault();
            var that = this,
                _submitBtn = $(".form-actions .btn-submit", this.$el);
            if (_submitBtn.hasClass("submitted")) {
                return;
            }

            var forceInvalid = false;
            // console.log('- current model:', JSON.stringify(that.options.model));
            _submitBtn.addClass("submitted");
            Utils.setHiddenField(this.el);
            // Before anything need to read the birthdate field
            var $bdayPicker = this.$(".birthdaypicker");
            if ($bdayPicker && $bdayPicker.length) {
                if (DEBUG) {
                    console.log("    BdatePicker: " + $bdayPicker.length);
                    console.log($bdayPicker);
                }
                $bdayPicker.each(function() {
                    // Need to trigger the select
                    var $bdayWrapper = $(this);
                    var $bdayPickerMonth = $bdayWrapper.find(".birth-month");
                    if (DEBUG) {
                        console.log($bdayPickerMonth);
                    }
                    $bdayPickerMonth.trigger("change");
                    // Need to make sure it is a valid date
                    var $hiddenInput = $bdayWrapper.find(':input[type="hidden"]');
                    if (DEBUG) {
                        console.log($hiddenInput);
                    }
                    if ($hiddenInput.val().match(/nan/i)) {
                        $hiddenInput.val("");
                    }
                });
            }
            // Set the Values to Model
            var $inputs = that.$(':input[value!=""]').not(":button");
            $inputs.each(function() {
                var $this = $(this);
                if ($this.is(":radio")) {
                    return;
                }
                if ($this.is(":file")) {
                    if (!('FileReader' in window)) {
                        throw new Error('No FileReader, please use modern browser like Chrome!');
                    }
                    var currentFile = $this[0].files[0];

                    if (!currentFile) {
                        // forceInvalid = true;
                        that.model.set($this.attr("name"), '');
                        return;
                    }

                    var reader = new FileReader();
                    reader.onload = function() {
                        // console.log('- onload:', arguments);
                        // return;

                        // var base64encoded = Utils.Base64.encode(reader.result);
                        var base64encoded = reader.result;
                        // Get the File Name
                        var fileInfo = {
                            fileName: currentFile.name,
                            fileSize: currentFile.size,
                            fileType: currentFile.type,
                            base64Data: base64encoded
                        };
                        var fileInfoData = JSON.stringify(fileInfo);
                        that.model.set($this.attr("name"), fileInfoData);
                    };

                    reader.readAsDataURL(currentFile);
                    return;
                }
                // console.log($this.attr('name'));
                // console.log($this.val());
                that.model.set($this.attr("name"), $this.val());
            });
            // If this is select could be different
            that.$(":input.tags").each(function() {
                var $this = $(this);
                var _v = $this.val();
                var _n = $this.attr("name");
                if (_v === "") {
                    _v = null;
                }
                that.model.set(_n, _v);
            });
            // Set Radio Values
            Utils.setModelButtonRadioValues(this.$el, this, false);
            Utils.setModelRadioValues(this.$el, this, false);

            // Perform Calculate Logic
            Utils.performCalculateLogic(this.$el, this);

            // console.log('[list] sendForm *****');
            // console.log('that.el:', that.el);
            // console.log('that.cid:', that.cid);
            // console.log('[list] this.model.validation', JSON.stringify(_.keys(this.model.validation)));
            // console.log('[list] this.model.bindings', this.model.bindings);

            // Need to format the value
            formatModel(this);
            /*if (this.model) {
              if (this.model.toJSON) {
                console.log(this.model.toJSON());
              }
            }*/

            if (!forceInvalid && this.model.isValid(true)) {
                // var DEBUG = true;
                var $not_sending = $(".not_sending", this.el)
                    .trigger("change")
                    .attr("disabled", true);
                $not_sending.each(function() {
                    that.model.unset($(this).attr("name"));
                });
                this.removeAttachedEvents();
                // Add Model to the parent
                _submitBtn.removeClass("submitted");
                // Trigger Add Event for List
                if (DEBUG) {
                    console.log("- this.model:", JSON.stringify(this.model.toJSON()));
                }
                this.$el.trigger(this.options.formId + ".add", this);
            } else {
                // If this is the Boolean Input need to inform user
                this.model.triggerError(this);
                // Error Message
                var _opt = {
                    html: true,
                    placement: "top",
                    trigger: "manual",
                    title: '<i class="icon-edit"></i> Validation Error',
                    content: "Please complete the required fields"
                };
                _submitBtn.popover(_opt).popover("show");
                window.setTimeout(function() {
                    _submitBtn.removeClass("submitted").popover("destroy");
                    _submitBtn.next(".popover").remove();
                }, 2000);
            }
        },
        clickCancel: function(e) {
            this.removeAttachedEvents();
            e.preventDefault();
            // Format Values
            if (this.options.model) {
                formatModel(this);
            }
            Vm.remove("SubFormView" + this.options.formId, true);
            Vm.remove("SubFormViewEdit" + this.options.formId, true);
            this.$el.trigger(this.options.formId + ".close", this);
        },
        /**
         * Init Emailinput
         **/
        setupEmailInput: function() {
            Utils.setupEmailInput(this.el);
        },
        removeAttachedEvents: function() {
            var debug = false;
            // var DEBUG = false;
            var $el = this.$el;
            if (DEBUG) {
                console.log("[*] removeAttachedEvents");
                console.log($el.hasClass("attached-e-radio-container"));
                console.log($el);
            }
            if ($el.hasClass("attached-e-radio-container")) {
                $el.off("click", ".radio-container button");
                $el.removeClass("attached-e-radio-container");
            }
            if (DEBUG) {
                console.log($el.hasClass("attached-e-radio-container"));
                console.log('[*] removeAttachedEvents <--------');
                console.log(this);
            }
            Utils.removeTimeInput(this.el, this, debug);
        }
    });
});