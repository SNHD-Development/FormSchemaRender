// Field Base Class
"use strict";
define([
    "jquery",
    "underscore",
    "backbone",
    "bootstrap",
    "events",
    "vm",
    "utils",
    "models/model",
    "collections/collections",
    "modelbinder",
    "validation",
    "views/fields/list",
    "text!data/email.json",
    "text!data/schooles.json",
    "text!data/schoolclarkcounty.json",
    "text!data/county.json",
    "text!data/country.json",
    "text!templates/fields/html.html",
    "text!templates/fields/label.html",
    "text!templates/fields/text.html",
    "text!templates/fields/password.html",
    "text!templates/fields/telephone.html",
    "text!templates/fields/socialsecurity.html",
    "text!templates/fields/hidden.html",
    "text!templates/fields/timestamp.html",
    "text!templates/fields/useraccount.html",
    "text!templates/fields/fraction.html",
    "text!templates/fields/booleaninput.html",
    "text!templates/fields/radio.html",
    "text!templates/fields/file.html",
    "text!templates/fields/multifiles.html",
    "text!templates/fields/filerepository.html",
    "text!templates/fields/read-filerepository.html",
    "text!templates/fields/state.html",
    "text!templates/fields/county.html",
    "text!templates/fields/zipcode.html",
    "text!templates/fields/country.html",
    "text!templates/fields/fullname.html",
    "text!templates/fields/address.html",
    "text!templates/fields/textarea.html",
    "text!templates/fields/number.html",
    "text!templates/fields/email.html",
    "text!templates/fields/date.html",
    "text!templates/fields/select.html",
    "text!templates/fields/check.html",
    "text!templates/fields/birthdate.html",
    "text!templates/fields/button.html",
    "text!templates/fields/buttongroup.html",
    "text!templates/fields/list.html",
    "text!templates/fields/uneditableinput.html",
    "text!templates/fields/uneditablecheck.html",
    "text!templates/fields/uneditabletag.html",
    "text!templates/fields/uneditabletel.html",
    "text!templates/fields/uneditablefile.html",
    "text!templates/fields/uneditableimage.html",
    "text!templates/fields/buttonclipboard.html",
    "text!templates/subform-layouts/table.html",
    "text!templates/subform-layouts/card.html",
    "text!templates/update-on-read/default-input.html",
    "text!templates/update-on-read/default-input-radio.html",
    "text!templates/update-on-read/default-input-textarea.html",
    "text!templates/update-on-read/default-input-date.html",
    "jquery.expose",
    "jquery.datepicker",
    "jquery.birthdaypicker",
    "bootstrap",
    "jquery.timepicker"
], function(
    $,
    _,
    Backbone,
    Bootstrap,
    Events,
    Vm,
    Utils,
    Model,
    Collections,
    Modelbinder,
    Validation,
    listView,
    emailData,
    schoolesData,
    schoolclarkcountyData,
    countyData,
    countryData,
    htmlTemplate,
    labelTemplate,
    textTemplate,
    passwordTemplate,
    telephoneTemplate,
    socialsecurityTemplate,
    hiddenTemplate,
    timestampTemplate,
    useraccountTemplate,
    fractionTemplate,
    booleanInputTemplate,
    radioTemplate,
    fileTemplate,
    multifilesTemplate,
    filerepositoryTemplate,
    readFilerepositoryTemplate,
    stateTemplate,
    countyTemplate,
    zipcodeTemplate,
    countryTemplate,
    fullnameTemplate,
    addressTemplate,
    textareaTemplate,
    numberTemplate,
    emailTemplate,
    dateTemplate,
    selectTemplate,
    checkTemplate,
    bdateTemplate,
    buttonTemplate,
    buttongroupTemplate,
    listTemplate,
    uneditableinputTemplate,
    uneditablecheckTemplate,
    uneditabletagTemplate,
    uneditabletelTemplate,
    uneditablefileTemplate,
    uneditableimageTemplate,
    buttonclipboardTemplate,
    tableTemplate,
    cardTemplate,
    readModeUpdatedefaultInputTemplate,
    readModeUpdatedefaultInputRadioTemplate,
    readModeUpdatedefaultInputTextAreaTemplate,
    readModeUpdatedefaultInputDateTemplate
) {
    // Debug Flag
    var DEBUG = false;
    // Cache Template
    var UPDATE_ON_READ_TEMPLATE = {
        "default-input": _.template(readModeUpdatedefaultInputTemplate),
        "default-input-radio": _.template(readModeUpdatedefaultInputRadioTemplate),
        "default-input-textarea": _.template(
            readModeUpdatedefaultInputTextAreaTemplate
        ),
        "default-input-date": _.template(readModeUpdatedefaultInputDateTemplate)
    };
    // Function to build simple HTML form markup
    function buildHtmlBasicFormMarkup(field, templates) {
        var html,
            defaultLabel = true;
        if (DEBUG) {
            console.log("[*] buildHtmlBasicFormMarkup");
            console.log(arguments);
        }
        if (!field.attributes) {
            field.attributes = {};
        }
        if (!field.description) {
            throw 'Expected a "description" in buildHtmlBasicFormMarkup parameter.';
        }
        if (!field.name) {
            throw 'Expected a "name" in buildHtmlBasicFormMarkup parameter.';
        }
        if (!field.type) {
            throw 'Expected a "type" in buildHtmlBasicFormMarkup parameter.';
        }
        var typeLower = field.type.toLowerCase();
        var className = "";
        field.options = field.options || {};
        field._required = true;

        switch (typeLower) {
            case "hidden":
                defaultLabel = false;
                var _val = field.attributes.value;

                html =
                    '<input type="hidden" name="' +
                    field.name +
                    '" value="' +
                    _val +
                    '"/>';
                break;
            case "textarea":
                html =
                    '<textarea name="' +
                    field.name +
                    '" class="' +
                    className +
                    '" id="' +
                    field.name +
                    '"></textarea>';
                break;
            case "textbox":
                html =
                    '<input name="' +
                    field.name +
                    '" type="text" class="' +
                    className +
                    '" id="' +
                    field.name +
                    '"/>';
                break;
            case "checkbox":
            case "check":
                //console.log(templates);
                //console.log(typeLower);

                if (field.options.numcolumns) {
                    if (!_.isNumber(field.options.numcolumns)) {
                        throw "NumColumns must be a valid number for " + field.name;
                    }
                    if (field.options.numcolumns > 4) {
                        field.options.numcolumns = 4;
                    } else if (field.options.numcolumns < 1) {
                        field.options.numcolumns = 1;
                    }
                } else {
                    field.options.numcolumns = 1;
                }

                html = templates["check"](
                    _.extend({
                            _attr: {},
                            _lang: "en",
                            _renderMode: "edit"
                        },
                        field
                    )
                );
                break;
            default:
                throw 'Not implement "' +
                    field.type +
                    '" yet in buildHtmlBasicFormMarkup.';
        }
        if (defaultLabel) {
            html =
                '<label for="' +
                field.name +
                '">' +
                field.description +
                "</label>" +
                html;
        }
        // Wrap in Div
        return '<div class="form-markup-field">' + html + "</div>";
    }
    return Backbone.View.extend({
        _modelBinder: undefined,
        // Clean Data Binding
        clean: function() {
            // Unbind Validation
            Backbone.Validation.unbind(this);
            if (typeof this._modelBinder !== "undefined") {
                this._modelBinder.unbind();
            }
        },
        initialize: function() {
            var that = this;
            this._div = 0; // Number of Open Div
            this._hasUserId = false; // Tracking the UserId Field
            this._hasDate = false; // Tracking the dateinput element
            this._hasTime = false; // Tracking the time element
            this._hasBDate = false; // Tracking the Birthdate element
            this._DatePickerLogicArr = {}; // Keep Logic in for Validation
            this._hasEmailPicker = false; // Tracking the EmailPicker element
            this._hasBooleanInput = false;
            this._hasRadioBtnGroup = false; // For Radio Button Group
            this._hasSelectAllCheckBox = false;
            this._hasClearAllCheckBox = false;
            this._hasOtherTextBox = false;
            this._internalFields = []; // Internal Fields Array
            this._visibleOn = []; // Field that has visibleOn Options
            this._multiFiles = []; // MultiFiles Field
            this._buttonClipboards = []; //Clipboards Button
            this._buttonDecision = []; //Decision Button
            this._ajaxDataCall = []; // Some Fields can call ajax call to auto populate data
            this._javaUpload = []; // Java Upload Object
            this._elementData = {}; // Use for Element Data
            this._ajaxSubmit = true;
            this._radioFieldName = []; // List of Field that is a radio field.
            this._lookupValues = {}; // Hold the new value mapping to use with VisibleOn
            this._listSchema = {};
            this._getValueFrom = {}; // Hash for getValueFrom
            // If the visibleOn already Attached, will no longer do it
            this._visibleonEventAttached = {};
            // Wizard View Counters
            this._stepDiv = 0; // Count number of open div for step (wizard view)
            this._currentStep = 1; // Current Step
            this._stepValidated = []; // Hold the field names for each validation step
            this._modelBinder = new Modelbinder();
            // Setup Keys
            this.options.formSchema.validation =
                this.options.formSchema.validation || {};
            // Setup Model
            this.model = new Model(
                _.extend(this.options.formSchema, {
                    is_internal: this.options.internal,
                    render_mode: this.options.mode,
                    status: this.options.mode === "update" &&
                        this.options.formData &&
                        this.options.formData.status ?
                        this.options.formData.status : null
                })
            );
            if (
                this.options.formData &&
                !_.isEmpty(this.options.formData) &&
                this.model.multiFilesDefaultValue &&
                !_.isEmpty(this.model.multiFilesDefaultValue)
            ) {
                // console.log('FormData', this.options.formData);
                // console.log('Before: this.model.multiFilesDefaultValue', this.model.multiFilesDefaultValue);
                this.model.multiFilesDefaultValue = _.reduce(
                    this.model.multiFilesDefaultValue,
                    function(carry, el, index) {
                        // console.log('L244', 'el:', el, 'index:', index);
                        var _newName = index.replace(/[\[\]]/gi, "");
                        // console.log('index', index);
                        // console.log('_newName', _newName);
                        if (
                            that.options.formData &&
                            that.options.formData.fields &&
                            that.options.formData.fields[_newName]
                        ) {
                            // console.log('that.options.formData.fields[_newName]', that.options.formData.fields[_newName]);
                            carry[index] = that.options.formData.fields[_newName];
                        }
                        return carry;
                    }, {}
                );
                // console.log('After: this.model.multiFilesDefaultValue', this.model.multiFilesDefaultValue);
            }
            // If user pass in formData
            if (!$.isEmptyObject(this.options.formData)) {
                _.each(this.model.attributes, function(element, index) {
                    if (typeof element === "object") {} else {
                        var _obj = {};
                        _obj[index] = that.options.formData.fields[index];
                        that.model.set(_obj);
                    }
                });
            }
            // Prefixed Name
            this.prefixedName = {
                list: "subform_",
                listdisplayid: "_form_content",
                collectiondisplayid: "_form_collection"
            };
            // Not render label
            this.notRenderLabel = [
                "html",
                "list",
                "button",
                "submit",
                "clear",
                "fieldset",
                "fieldsetstart",
                "fieldsetend",
                "step",
                "check",
                "checkbox",
                "timestamp",
                "hidden"
            ];
            // Not render label for read
            this.notRenderLabelRead = [
                "html",
                "list",
                "button",
                "submit",
                "clear",
                "fieldset",
                "fieldsetstart",
                "fieldsetend",
                "step",
                "check",
                "checkbox"
            ];
            // Set up the input template
            this.inputTemplate = {
                html: _.template(htmlTemplate),
                label: _.template(labelTemplate),
                text: _.template(textTemplate),
                password: _.template(passwordTemplate),
                telephone: _.template(telephoneTemplate),
                socialsecurity: _.template(socialsecurityTemplate),
                hidden: _.template(hiddenTemplate),
                timestamp: _.template(timestampTemplate),
                useraccount: _.template(useraccountTemplate),
                fraction: _.template(fractionTemplate),
                booleaninput: _.template(booleanInputTemplate),
                radio: _.template(radioTemplate),
                file: _.template(fileTemplate),
                multifiles: _.template(multifilesTemplate),
                filerepository: _.template(filerepositoryTemplate),
                "read-filerepository": _.template(readFilerepositoryTemplate),
                state: _.template(stateTemplate),
                county: _.template(countyTemplate),
                zipcode: _.template(zipcodeTemplate),
                country: _.template(countryTemplate),
                fullname: _.template(fullnameTemplate),
                address: _.template(addressTemplate),
                textarea: _.template(textareaTemplate),
                number: _.template(numberTemplate),
                email: _.template(emailTemplate),
                date: _.template(dateTemplate),
                select: _.template(selectTemplate),
                check: _.template(checkTemplate),
                birthdate: _.template(bdateTemplate),
                button: _.template(buttonTemplate),
                buttongroup: _.template(buttongroupTemplate),
                list: _.template(listTemplate),
                uneditableinput: _.template(uneditableinputTemplate),
                uneditablecheck: _.template(uneditablecheckTemplate),
                uneditabletag: _.template(uneditabletagTemplate),
                uneditabletel: _.template(uneditabletelTemplate),
                uneditablefile: _.template(uneditablefileTemplate),
                uneditableimage: _.template(uneditableimageTemplate),
                buttonclipboard: _.template(buttonclipboardTemplate),
                "subform-table": _.template(tableTemplate),
                "subform-card": _.template(cardTemplate),
            };
            // Init Form Options
            var formOptions = {
                submitbutton: "Submit",
                resetbutton: "Cancel"
            };
            this.options.formSchema.formoptions =
                _.extend(formOptions, this.options.formSchema.formoptions) ||
                formOptions;
        },
        /**
         * Search for the Form Validation Data, Return {} if not success
         **/
        getFormValidationData: function(name) {
            this.options.formSchema.validation =
                this.options.formSchema.validation || {};
            return typeof this.options.formSchema.validation[name] === "undefined" ? {} :
                this.options.formSchema.validation[name];
        },
        /**
         * Closed Open Div
         **/
        closeOpenDiv: function(property) {
            property = property || "_div";
            var _html = "",
                i = 0,
                j = this[property];
            for (; i < j; ++i) {
                _html += "</div>";
            }
            this._div = 0;
            return _html;
        },
        /**
         * Render HTML
         **/
        render: function(field, readMode) {
            // if (field && field.name) {
            //   console.log(field.name);
            //   console.log('');
            // }
            var _debug = false;
            var that = this,
                _html = "",
                _name = [field.name],
                _type = field.type.toLowerCase(),
                _attr = "";
            var countryOptions = $.parseJSON(countryData);
            field.lang = this.options.lang; // Set up default lang for each field for simple work in template
            field.attributes = field.attributes || {};
            // Auto Set to not autocomplete
            if (!field.attributes.autocomplete) {
                field.attributes.autocomplete = "off";
            }
            field.options = field.options || {};
            this.options.formSchema.validation =
                this.options.formSchema.validation || {};
            this.options.formData = this.options.formData || {};
            // Check to see if this is render internal, external and match with the current display mode or not
            // In options keys: internal
            if (!this.options.internal && field.options.internal) {
                return "";
            } else if (
                (_type === "button" || _type === "submit") &&
                !field.options.internal &&
                this.options.internal
            ) {
                return "";
            }
            // Check for Options.RenderAs
            if (field.options.renderas) {
                switch (_type) {
                    case "date":
                        if (
                            this.options.formData &&
                            this.options.formData.fields &&
                            this.options.formData.fields[field.name]
                        ) {
                            if (this.options.formData.fields[field.name].$date) {
                                this.options.formData.fields[
                                    field.name
                                ] = Utils.formatDateAsString(
                                    this.options.formData.fields[field.name].$date
                                );
                            }
                        }
                        break;
                    case "number":
                        break;
                    default:
                        throw 'Not Implement Options.RenderAs for "' + _type + '" yet!';
                }
                _type = field.options.renderas.toLowerCase();
                // console.log('[*] Options.RenderAs for ' + field.name);
                // console.log(_type);
            }
            switch (_type) {
                case "calculate":
                    _type = "hidden";
                    if (!field.options || !field.options.logic) {
                        throw new Error(
                            "In order to use " + _type + ", please set up the Options.Logic"
                        );
                    }
                    // console.log('- this.options: ', this.options);
                    field.attributes["data-logic"] = field.options.logic;
                    if (field.options.type) {
                        field.attributes["data-type"] = field.options.type;
                    }
                    break;
                case "booleaninput":
                    this._hasBooleanInput = true;
                    break;
                case "radio":
                    this._radioFieldName.push(field.name);
                    if (!this._hasRadioBtnGroup && field.options.render) {
                        this._hasRadioBtnGroup = true;
                    }
                    if (
                        this.options.formData.fields &&
                        this.options.formData.fields[field.name]
                    ) {
                        // Copy by reference
                        if (
                            this.options.mode === "read" &&
                            field.values &&
                            _.isObject(field.values)
                        ) {
                            // Need to save this as well.
                            this._lookupValues[field.name] = {
                                value: this.options.formData["fields"][field.name],
                                text: field.values[this.options.formData["fields"][field.name]]
                            };
                            if (!_.isArray(field.values)) {
                                this.options.formData["fields"][field.name] =
                                    field.values[this.options.formData["fields"][field.name]];
                            }
                        }
                        field._data = this.options.formData["fields"][field.name];
                    }
                    // If there is an Options.OrderBy will need to sort Values
                    if (field.options.orderby) {
                        this.sortOrderBy(field);
                    }
                    break;
                case "multifiles":
                    if (!(
                            this.options.internal &&
                            typeof field.options.internalcanupdate !== "undefined" &&
                            !field.options.internalcanupdate
                        )) {
                        $("form" + this.el).attr("enctype", "multipart/form-data");
                    }
                    this._multiFiles.push(field);
                    var _validation_tmp = this.getFormValidationData(field.name + "[]");
                    if (
                        typeof this._stepValidated[this._currentStep - 2] !== "undefined" &&
                        !$.isEmptyObject(_validation_tmp)
                    ) {
                        this._stepValidated[this._currentStep - 2].push(field.name + "[]");
                    }
                    if (this.options.mode === "read") {
                        _type = "file";
                    }
                    break;
                case "filerepository":
                    // Need URL Parameter
                    if (!field.options.url) {
                        throw 'Expected Url parameter in Options Key for "' +
                            field.name +
                            '".';
                    }
                    break;
                case "image":
                    field.attributes.accept = "image/*";
                case "file":
                    if (!(
                            this.options.internal &&
                            typeof field.options.internalcanupdate !== "undefined" &&
                            !field.options.internalcanupdate
                        )) {
                        // console.log('- this.el:', this.el);
                        // debugger;
                        if (typeof this.el === "string") {
                            $("form" + this.el).attr("enctype", "multipart/form-data");
                        }
                    }
                    // console.log("- field.options:", field.options);
                    var hasWebcamOption =
                        field.options &&
                        "usewebcam" in field.options &&
                        !_.isEmpty(field.options.usewebcam);
                    // console.log('- hasWebcamOption:', hasWebcamOption);
                    // console.log('- field.options.usewebcam:', field.options.usewebcam);
                    var webcamUrl =
                        hasWebcamOption && field.options.usewebcam.url ?
                        field.options.usewebcam.url :
                        null;
                    var _validation_tmp = this.getFormValidationData(field.name);
                    if (_validation_tmp.accept) {
                        field.attributes.accept = _validation_tmp.accept;
                    }
                    if (field.options.javaupload) {
                        var _jObject = {
                            name: field.name,
                            id: field.name,
                            code: "com.elementit.JavaPowUpload.Manager",
                            archive: "//public.southernnevadahealthdistrict.org/assets/jar/jupload/JavaPowUpload.jar, //public.southernnevadahealthdistrict.org/assets/jar/jupload/skinlf.jar, //public.southernnevadahealthdistrict.org/assets/jar/jupload/commons-httpclient.jar, //public.southernnevadahealthdistrict.org/assets/jar/jupload/commons-compress.jar",
                            width: 500,
                            height: 350,
                            mayscript: "true",
                            alt: "JavaPowUpload by www.element-it.com"
                        };
                        this._javaUpload.push(_jObject);
                    }

                    if (!field.attributes) {
                        field.attributes = {};
                    }
                    field.attributes.class = field.attributes.class ?
                        field.attributes.class :
                        "";
                    // console.log("- hasWebcamOption:", hasWebcamOption);
                    if (hasWebcamOption) {
                        field.attributes.class += " form-render-has-webcam ";
                    }
                    // console.log('- webcamUrl', webcamUrl);
                    if (webcamUrl) {
                        field.attributes["data-webcam-url"] = webcamUrl;
                    }
                    // console.log("- field.attributes.class:", field.attributes.class);

                    // Check to see if this contain markDownloadDateTimeOf
                    if (
                        field.options.markdownloaddatetimeof &&
                        this.options.mode &&
                        this.options.mode === "read"
                    ) {
                        var _txt = this.options.internal ? "internal" : "external",
                            _markdownload = field.options.markdownloaddatetimeof.toLowerCase();
                        if (_markdownload === "*" || _markdownload === _txt) {
                            field.attributes["class"] =
                                (field.attributes["class"] ? field.attributes["class"] : "") +
                                " btn-auto-refresh ";
                            if (!field.attributes["data-refresh-delay"]) {
                                field.attributes["data-refresh-delay"] = "2000";
                            }
                        }
                    }
                    break;
                case "userid":
                    this._hasUserId = true;
                    // Make this compatible with LookUp Key
                    if (
                        field.options &&
                        field.options.lookup &&
                        field.options.lookup.url
                    ) {
                        field.options.url = field.options.lookup.url;
                    }
                    if (field.options.url) {
                        field.attributes["data-url"] = field.options.url;
                    }
                    if (field.options.data) {
                        field.attributes["data-url-data"] = JSON.stringify(
                            field.options.data
                        );
                    }
                    field.attributes["placeholder"] =
                        field.attributes["placeholder"] || "Valid E-mail as Username";
                    field.attributes["class"] =
                        (field.attributes["class"] || "") + " userid-lookup";
                    _type = field.options.render ?
                        field.options.render.toLowerCase() :
                        "text";
                    if (_type === "select") {
                        field.values = [];
                    }
                    field.attributes["class"] = Utils.setupClassAttr(
                        field.attributes["class"],
                        "span12"
                    );
                    break;
                case "fraction":
                    break;
                case "textbox":
                    _type = "text";
                case "selectsingle":
                    if (_type === "selectsingle") {
                        _type = "select";
                    }
                case "select":
                    // if (_debug) {
                    //   console.log('- field:', field);
                    // }
                    // If this is read mode and have the value for this field
                    if (
                        this.options.mode === "update" &&
                        this.options.formData.fields[field.name]
                    ) {
                        field.attributes[
                            "data-select-value"
                        ] = this.options.formData.fields[field.name];
                    }
                    // Make this compatible with LookUp Key
                    if (
                        field.options &&
                        field.options.lookup &&
                        field.options.lookup.url
                    ) {
                        field.options.url = field.options.lookup.url;
                        // Setup Key of Text or Value to look up.
                        if (field.options.lookup.value) {
                            field.attributes["data-select-key-value"] =
                                field.options.lookup.value;
                        }
                        if (field.options.lookup.text) {
                            field.attributes["data-select-key-text"] =
                                field.options.lookup.text;
                        }
                    } else if (field.options) {
                        if (field.options.tags) {
                            field.attributes["class"] =
                                (field.attributes["class"] ? field.attributes["class"] : "") +
                                " selecttwo-render tags value-as-array";
                        } else if (field.options.render) {
                            // If these is an render tag
                            var _render = field.options.render.toLowerCase();
                            switch (_render) {
                                case "select2":
                                    field.attributes["class"] =
                                        (field.attributes["class"] ?
                                            field.attributes["class"] :
                                            "") + " selecttwo-render";
                                    break;
                            }
                        }
                        // If there is an events
                        if (field.options.events) {
                            // Field Name, Key, Value
                            this.addDataToElementData(
                                field.name,
                                "events",
                                field.options.events
                            );
                        }
                        // If there is an Options.OrderBy will need to sort Values
                        if (field.options.orderby) {
                            this.sortOrderBy(field);
                        }
                        // Set "GetValueFrom"
                        if (field.options.getvaluefrom && field.name) {
                            if (!this._getValueFrom[field.options.getvaluefrom]) {
                                this._getValueFrom[field.name] = field.options.getvaluefrom;
                            }
                        }
                    }
                    if (field.options.url) {
                        field.attributes["data-url"] = field.options.url.replace(
                            /'/gi,
                            "&#39;"
                        );
                    }
                    if (field.options.data) {
                        field.attributes["data-url-data"] = JSON.stringify(
                            field.options.data
                        );
                    }
                    field.attributes["class"] = Utils.setupClassAttr(
                        field.attributes["class"],
                        "span12"
                    );
                    // Set the Data
                    if (
                        this.options.formData &&
                        this.options.formData.fields &&
                        this.options.formData.fields[field.name]
                    ) {
                        if (_.isArray(this.options.formData.fields[field.name])) {
                            this.options.formData.fields[field.name].sort(function(a, b) {
                                return a - b;
                            });
                        }
                        // Copy by reference
                        if (
                            this.options.mode === "read" &&
                            field.values &&
                            _.isObject(field.values)
                        ) {
                            field._data =
                                field.values[this.options.formData["fields"][field.name]];
                        }
                        this.addDataToElementData(
                            field.name,
                            "value",
                            this.options.formData.fields[field.name]
                        );
                    }
                    break;
                case "country":
                    var classNameToAdd = "selecttwo-render";
                    if (!field.attributes["class"]) {
                        field.attributes["class"] = classNameToAdd;
                    } else if (field.attributes["class"].indexOf(classNameToAdd) < 0) {
                        // console.log('Add Class');
                        field.attributes["class"] += " " + classNameToAdd;
                    }
                    field._optionsValue = _.extend({}, countryOptions);
                    if (field.options.excludecountry) {
                        // console.log('- countryOptions:', countryOptions.US);
                        _.each(field.options.excludecountry, function(c) {
                            delete field._optionsValue[c];
                        });
                        // console.log('- countryOptions:', countryOptions.US);
                        // console.log('- field._optionsValue:', field._optionsValue.US);
                    }
                    break;
                case "county":
                    // Normal Case
                    if (typeof countyData === "string") {
                        countyData = $.parseJSON(countyData);
                    }
                    field._options = countyData;
                    if (!field.attributes.id) {
                        field.attributes.id = field.name;
                    }
                    var classNameToAdd = "select2-county";
                    // If there is a default ID to look value up will attached that event
                    if (field.options.filterbyid) {
                        classNameToAdd = "select2-county-lookup";
                    }
                    if (!field.attributes["class"]) {
                        field.attributes["class"] = classNameToAdd;
                    } else {
                        field.attributes["class"] += " " + classNameToAdd;
                    }
                    // If there is default data
                    if (
                        this.options.formData &&
                        this.options.formData.fields &&
                        this.options.formData.fields[field.name]
                    ) {
                        field.attributes["data-countyvalue"] = this.options.formData.fields[
                            field.name
                        ];
                    }
                    break;
                case "checkbox":
                case "check":
                    if (field.options.numcolumns) {
                        if (!_.isNumber(field.options.numcolumns)) {
                            throw "NumColumns must be a valid number for " + field.name;
                        }
                        if (field.options.numcolumns > 4) {
                            field.options.numcolumns = 4;
                        } else if (field.options.numcolumns < 1) {
                            field.options.numcolumns = 1;
                        }
                    } else {
                        field.options.numcolumns = 1;
                    }
                    // Add Select All
                    if (!this._hasSelectAllCheckBox && field.options.addselectall) {
                        this._hasSelectAllCheckBox = true;
                    }
                    // Add Clear All
                    if (!this._hasClearAllCheckBox && field.options.addclearall) {
                        this._hasClearAllCheckBox = true;
                    }
                    // If there is an Options.OrderBy will need to sort Values
                    if (field.options.orderby) {
                        this.sortOrderBy(field);
                    }
                    // If there is an OtherTextBox then we will need to added this in as well.
                    if (field.options.othertextbox) {
                        this._hasOtherTextBox = true;
                    }
                    // Parse Form Data to render in the update mode.
                    if (this.options.mode === "update") {
                        if (
                            this.options.formData.fields &&
                            this.options.formData["fields"][field.name]
                        ) {
                            // Copy by reference
                            field._data = this.options.formData["fields"][field.name];
                        }
                    }
                    // In general case if there is formData (setup other to render)
                    if (
                        this.options.formData.fields &&
                        this.options.formData["fields"][field.name + "_other"]
                    ) {
                        field._otherValue = this.options.formData["fields"][
                            field.name + "_other"
                        ];
                    }
                    // Check Validation
                    if (
                        typeof this.options.formSchema.validation[field.name + "[]"] !==
                        "undefined"
                    ) {
                        field._required = true;
                        if (!field.attributes) {
                            field.attributes = {};
                        }
                        // If this is Required, need to double check
                        field.attributes["data-check-required"] = true;
                        var _validation_tmp = this.getFormValidationData(field.name + "[]");
                        if (
                            typeof this._stepValidated[this._currentStep - 2] !==
                            "undefined" &&
                            !$.isEmptyObject(_validation_tmp)
                        ) {
                            this._stepValidated[this._currentStep - 2].push(
                                field.name + "[]"
                            );
                        }
                    } else {
                        field._required = false;
                    }
                    _type = "check";
                    if (!field.values) {
                        throw "In order to use CheckBox, please set Values.";
                    }
                    break;
                case "password":
                    field.attributes["class"] = Utils.setupClassAttr(
                        field.attributes["class"],
                        "span12"
                    );
                    break;
                case "telephone":
                    field.attributes["class"] = Utils.setupClassAttr(
                        field.attributes["class"],
                        "integer telephone span12"
                    );
                    if (
                        this.options.formData.fields &&
                        this.options.formData.fields[field.name + "_provider"]
                    ) {
                        field["_providerValue"] = this.options.formData.fields[
                            field.name + "_provider"
                        ];
                    }
                    break;
                case "socialsecurity":
                    field.attributes["class"] = Utils.setupClassAttr(
                        field.attributes["class"],
                        "integer socialsecurity span12"
                    );
                    break;
                case "textarea":
                    field.attributes["class"] = Utils.setupClassAttr(
                        field.attributes["class"],
                        "span12"
                    );
                    break;
                case "action":
                    this._div++;
                    return '<div class="form-actions">';
                case "fieldsetstart":
                    return "<fieldset><legend>" + field.description + "</legend>";
                case "fieldsetend":
                    return "</fieldset>";
                case "hr":
                    return "<hr>";
                case "time":
                    this._hasTime = true;
                    _type = "text";
                    field.attributes["class"] = Utils.setupClassAttr(
                        field.attributes["class"],
                        "timepicker"
                    );
                    if (field.attributes && !field.attributes.placeholder) {
                        field.attributes.placeholder = "HH:MM AM/PM";
                    }
                    if (!field.options) {
                        field.options = {};
                    }
                    var timeConfig = field.options.configuration;
                    if (timeConfig && !_.isEmpty(timeConfig) && _.isObject(timeConfig)) {
                        field.attributes["data-timepicker-options"] = JSON.stringify(
                            timeConfig
                        );
                    }
                    break;
                case "dateinput":
                    _type = "date";
                case "date":
                    var _debug_date = false;
                    // Check for $date
                    if (this.options.formData && this.options.formData.fields) {
                        var _currentDateValue = this.options.formData.fields[field.name];
                        if (
                            _currentDateValue &&
                            typeof _currentDateValue === "object" &&
                            _currentDateValue.$date
                        ) {
                            var _tmpDate = new Date(_currentDateValue.$date);
                            var _month = _tmpDate.getMonth() + 1;
                            if (_month < 10) {
                                _month = "0" + _month;
                            }
                            _month += "/";
                            var _date = _tmpDate.getDate();
                            if (_date < 10) {
                                _date = "0" + _date;
                            }
                            _date += "/";
                            this.options.formData.fields[field.name] =
                                _month + _date + _tmpDate.getFullYear();
                            if (field.options.render && this.options.mode === "read") {
                                switch (field.options.render.toLowerCase()) {
                                    case "datetime":
                                        this.options.formData.fields[field.name] +=
                                            " " + Utils.formatAMPM(_tmpDate);
                                        break;
                                }
                            }
                            field.attributes["value"] = this.options.formData.fields[
                                field.name
                            ];
                        } else if (
                            this.options.mode === "create" &&
                            typeof this.options.formData.fields[field.name] === "undefined"
                        ) {
                            // Fix auto set date to current day if value is not existed
                            field._noDefaultValue = true;
                        }
                    }
                    if (field.attributes && !field.attributes.placeholder) {
                        field.attributes.placeholder = "mm/dd/yyyy";
                    }
                    // If pass in options.render, by default will render as 'DatePicker'
                    if (
                        field.options.render &&
                        field.options.render.toLowerCase() === "select"
                    ) {
                        _type = "birthdate";
                        this._hasBDate = true;
                        field.attributes["class"] = Utils.setupClassAttr(
                            field.attributes["class"],
                            "birthdaypicker"
                        );
                        var _validation_tmp = this.getFormValidationData(field.name),
                            _options = {
                                id: field.name
                            };
                        if (field.lang !== "en") {
                            _options.lang = field.lang;
                        }
                        if (typeof this.options.formData.fields !== "undefined") {
                            _options["defaultdate"] = this.options.formData.fields[
                                field.name
                            ];
                        }
                        if (field._noDefaultValue) {
                            // Prevent auto fill the date to today.
                            _options["nodefaultvalue"] = true;
                        }
                        field.attributes["data-options"] = JSON.stringify(
                            _.extend(_options, _validation_tmp)
                        );
                        // For Wizard View
                        if (
                            typeof this._stepValidated[this._currentStep - 2] !==
                            "undefined" &&
                            !$.isEmptyObject(_validation_tmp)
                        ) {
                            this._stepValidated[this._currentStep - 2].push(
                                field.name + "_birth[month]"
                            );
                            this._stepValidated[this._currentStep - 2].push(
                                field.name + "_birth[day]"
                            );
                            this._stepValidated[this._currentStep - 2].push(
                                field.name + "_birth[year]"
                            );
                        }
                    } else {
                        this._hasDate = true;
                        field.attributes["class"] = Utils.setupClassAttr(
                            field.attributes["class"],
                            "datepicker"
                        );
                        var _validation_tmp = this.getFormValidationData(field.name);
                        // Setup Max Date
                        _.each(_validation_tmp, function(valValue, valKey) {
                            delete _validation_tmp[valKey];
                            _validation_tmp[valKey.toLowerCase()] = valValue;
                        });
                        if (_validation_tmp.maxdate) {
                            field.attributes["data-maxdate"] = _validation_tmp.maxdate;
                        }
                        if (_validation_tmp.mindate) {
                            // console.log('- _validation_tmp.mindate:', _validation_tmp.mindate);
                            field.attributes["data-mindate"] = _validation_tmp.mindate;
                        }
                        if (field.options && field.options.datepickeroptions) {
                            // If has the special validation, will add to logic
                            // console.log('[_DatePickerLogicArr] adding:', field.name);

                            this._DatePickerLogicArr[field.name] =
                                field.options.datepickeroptions;
                            field.attributes["data-has-datepicker-options"] = true;
                        }

                        if (field.options.render && this.options.mode !== "read") {
                            if (_debug_date) {
                                console.log("[*] field.name:", field.name);
                                console.log("  - field.options.render:", field.options.render);
                                console.log("  - this.options.mode:", this.options.mode);
                            }

                            field.attributes[
                                "data-options-render"
                            ] = field.options.render.toLowerCase();
                        }
                    }
                    break;
                case "email":
                    field.attributes["class"] = Utils.setupClassAttr(
                        field.attributes["class"],
                        "tolowercase tolowercase_email span12"
                    );
                    if (
                        typeof field.options.autocomplete !== "undefined" &&
                        field.options.autocomplete
                    ) {
                        this._hasEmailPicker = true;
                        field.attributes = {};
                        field.attributes["data-provide"] = "typeahead";
                        field.attributes["autocomplete"] = "off";
                        field.attributes["style"] = "width:45%;";
                        field.attributes["class"] =
                            "not_sending emailpicker_server tolowercase tolowercase_email";
                        field.attributes["data-source"] = emailData
                            .replace(/\n/g, "")
                            .replace(/'/g, "&#39");
                        if (typeof field.options["default"] !== "undefined") {
                            field.attributes["data-value"] = field.options["default"];
                        }
                        _name.push(field.name + "_username");
                        _name.push(field.name + "_server");
                    }
                    break;
                case "address":
                    delete field.attributes["class"];
                    delete field.attributes["placeholder"];
                    _name = [];
                    _name.push(field.name + "_address_street");
                    _name.push(field.name + "_address_city");
                    _name.push(field.name + "_address_state");
                    _name.push(field.name + "_address_zip");
                    _name.push(field.name + "_address_country");
                    if (field.options.showstreetnumber) {
                        _name.push(field.name + "_address_street_number");
                    }
                    if (field.options.showunitnumber) {
                        _name.push(field.name + "_address_unit_number");
                    }
                    // Format Data
                    if (
                        typeof readMode !== "undefined" &&
                        typeof this.options.formData !== "undefined"
                    ) {
                        var _currentFormDataAddress = this.options.formData.fields;
                        // console.log('- _currentFormDataAddress:', _currentFormDataAddress);
                        // Build Address String
                        _currentFormDataAddress[
                                field.name + "_address_country"
                            ] = _currentFormDataAddress[field.name + "_address_country"] ?
                            Vm.getCountry(
                                _currentFormDataAddress[field.name + "_address_country"]
                            ) :
                            null;
                        if (
                            _currentFormDataAddress[field.name + "_address_street"] &&
                            _currentFormDataAddress[field.name + "_address_street"].charAt(
                                _currentFormDataAddress[field.name + "_address_street"].length -
                                1
                            ) !== "."
                        ) {
                            _currentFormDataAddress[field.name + "_address_street"] += ".";
                        }
                        if (_currentFormDataAddress[field.name + "_address_street"]) {
                            _currentFormDataAddress[field.name + "_address_street"] += "<br>";
                        }
                        if (_currentFormDataAddress[field.name + "_address_city"]) {
                            _currentFormDataAddress[field.name + "_address_city"] += ",";
                        }
                        if (_currentFormDataAddress[field.name + "_address_state"]) {
                            _currentFormDataAddress[field.name + "_address_state"] += "<br>";
                        }
                        if (_currentFormDataAddress[field.name + "_address_zip"]) {
                            _currentFormDataAddress[field.name + "_address_zip"] += "<br>";
                        }
                    } else if (
                        this.options.mode === "update" &&
                        this.options.formData.fields[field.name + "_address_country"] !==
                        "US"
                    ) {
                        var _currentFormDataAddress = this.options.formData.fields;
                        // Will Render Input
                        field["default_value_state"] =
                            _currentFormDataAddress[field.name + "_address_state"];
                    } else if (this.options.mode === "create") {
                        this.model.set(field.name + "_address_state", "NV"); // Default to NV for create mode
                        this.model.set(field.name + "_address_country", "US"); // Default to USA for create mode
                    }
                    // If there is "Options.ZipCodeFormat" option
                    if (field.options.zipcodeformat) {
                        var _zipcodeformat = field.options.zipcodeformat.toLowerCase();
                        switch (_zipcodeformat) {
                            case "zip+4":
                                field["_zipmax"] = 10;
                                break;
                        }
                    }
                    // console.log('- _name:', _name);
                    break;
                case "number":
                    var _num_class;
                    if (!field.options.numbertype || field.options.decimals) {
                        _num_class = field.options.decimals ? "number" : "natural";
                        if (field.options.decimals) {
                            field.attributes["data-decimal"] = field.options.decimals;
                        }
                    } else if (
                        field.options.numbertype &&
                        !field.options.limitinputvalue
                    ) {
                        switch (field.options.numbertype.toLowerCase()) {
                            case "currency":
                                _num_class = "number";
                                break;
                            case "double":
                                _num_class = "rational";
                                break;
                            default:
                                _num_class = "natural";
                        }
                    } else {
                        _num_class = "natural";
                    }
                    if (field.options.limitinputvalue) {
                        _num_class = field.options.limitinputvalue;
                    }
                    if (!_num_class || typeof _num_class !== "string") {
                        throw new Error(
                            'Could not be able to find matching class name for "' +
                            field.name +
                            '" for a number input type.'
                        );
                    }
                    field.attributes["class"] = Utils.setupClassAttr(
                        field.attributes["class"],
                        _num_class + " span12"
                    );
                    // Check to see how to render this
                    if (
                        field.options.decimals &&
                        this.options.formData.fields &&
                        this.options.formData.fields[field.name]
                    ) {
                        var _float_pts = parseFloat(
                            this.options.formData.fields[field.name] /
                            Math.pow(10, parseInt(field.options.decimals, 10))
                        );
                        if (!isNaN(_float_pts)) {
                            this.options.formData.fields[field.name] = _float_pts.toFixed(
                                field.options.decimals
                            );
                            field.attributes["value"] = this.options.formData.fields[
                                field.name
                            ];
                            if (this.model.has(field.name)) {
                                this.model.set(
                                    field.name,
                                    this.options.formData.fields[field.name]
                                );
                            }
                        }
                    }
                    if (
                        typeof field.options.spinner !== "undefined" &&
                        field.options.spinner
                    ) {
                        field.attributes["class"] = field.attributes["class"].replace(
                            / span12/,
                            "",
                            "gi"
                        );
                        field.attributes["class"] = Utils.setupClassAttr(
                            field.attributes["class"],
                            "spinner-input"
                        );
                        if (
                            this.options.mode === "update" &&
                            this.options.formData.fields[field.name]
                        ) {
                            field.attributes["data-value"] = this.options.formData.fields[
                                field.name
                            ];
                        }
                    }
                    break;
                case "fullname":
                    delete field.attributes["class"];
                    delete field.attributes["placeholder"];
                    _name = [];
                    _name.push(field.name + "_fullname_first_name");
                    if (
                        typeof field.options.middlename === "undefined" ||
                        field.options.middlename
                    ) {
                        _name.push(field.name + "_fullname_middle_name");
                    }
                    _name.push(field.name + "_fullname_last_name");
                    if (field.options.url) {
                        this._ajaxDataCall.push(field);
                    }
                    if (
                        this.options.mode === "read" &&
                        field.options &&
                        field.options.highlight
                    ) {
                        var _highlight = field.options.highlight.toLowerCase().split(",");
                        _.each(_highlight, function(element) {
                            var _tmp_name = field.name + "_fullname_" + element;
                            if (!that.options.formData.fields[_tmp_name]) {
                                return;
                            }
                            that.options.formData.fields[_tmp_name] =
                                "<u>" + that.options.formData.fields[_tmp_name] + "</u>";
                        });
                    }
                    break;
                case "clear":
                    _type = "button";
                    field.attributes["class"] = Utils.setupClassAttr(
                        field.attributes["class"],
                        "btn btn-clear-form"
                    );
                    break;
                case "submit":
                    field.attributes["class"] = Utils.setupClassAttr(
                        field.attributes["class"],
                        "btn"
                    );
                    _type = "button";
                    field["_submit"] = true;
                    // If this is submit button will override the action of this form
                    if (typeof field.url === "undefined") {
                        field.url = "";
                        // throw 'In order to use submit button, must pass the Url value in the formSchema';
                    }
                    // AppendId
                    if (
                        field.options.appendid &&
                        this.options.formData._id &&
                        this.options.formData._id["$oid"]
                    ) {
                        field.url =
                            (field.url ? field.url : "") +
                            (field.url.indexOf("?") > -1 ? "&id=" : "/") +
                            this.options.formData._id["$oid"];
                    }
                    $(this.el).attr("action", field.url);
                    // Check for Ajax Submit
                    if (typeof field.options.ajaxsubmit !== "undefined") {
                        this._ajaxSubmit = field.options.ajaxsubmit;
                    }
                    break;
                case "buttonclipboard":
                    field.attributes["class"] = Utils.setupClassAttr(
                        field.attributes["class"],
                        "btn btn-primary"
                    );
                    this._buttonClipboards.push({
                        name: field.name,
                        values: field.values
                    });
                    break;
                case "buttondecision":
                    if (!readMode) {
                        field.attributes["class"] = Utils.setupClassAttr(
                            field.attributes["class"],
                            "btn btn-primary"
                        );
                        _type = "button";
                        this._buttonDecision.push(field);
                    }
                    break;
                case "button":
                    // Before Render will check for Options.ShowOnUser First
                    if (!Utils.shouldRenderShowOnUser(field)) {
                        return "";
                    }
                    field.attributes["class"] = Utils.setupClassAttr(
                        field.attributes["class"],
                        "btn"
                    );
                    // AppendId
                    if (
                        this.options &&
                        this.options.formData &&
                        this.options.formData._id &&
                        this.options.formData._id["$oid"]
                    ) {
                        if (field.options.appendid) {
                            field.url =
                                (field.url ? field.url : "") +
                                (field.url.indexOf("?") > -1 ? "&id=" : "/") +
                                this.options.formData._id["$oid"];
                        } else if (field.url && field.url.search(/{\w+}/gi) > -1) {
                            field.url = Utils.formatUriSegment(
                                field.url,
                                this.options.formData
                            );
                        }
                    }
                    // Parse Template
                    if (field.url) {
                        field.url = Utils.changeURLGetTemplateString(
                            field.url,
                            this.options.formData
                        );
                    }
                    if (
                        this.options.internal &&
                        this.options.mode === "read" &&
                        field.name === "BtnMarkAsUnacceptable" &&
                        $.fn.remodal
                    ) {
                        // Need to find the Fields Name "UnacceptableReason"
                        // console.log(this.options);
                        var _unacceptableReasonSchema = _.find(
                            this.options.formSchema.fields,
                            function(val) {
                                if (!val || !val.name || !val.type) {
                                    return;
                                }
                                if (val.name === "UnacceptableReason") {
                                    return val;
                                }
                            }
                        );
                        if (_unacceptableReasonSchema) {
                            // If there are formData
                            var _currentReasonVal =
                                this.options.formData &&
                                this.options.formData.fields &&
                                this.options.formData.fields["UnacceptableReason"] ?
                                this.options.formData.fields["UnacceptableReason"] :
                                null;
                            // If there are ' in the value, it will need to escape
                            if (_currentReasonVal && _currentReasonVal.replace) {
                                _currentReasonVal = _currentReasonVal.replace(/'/gi, "\\'");
                            }
                            // Adding the alert to ask for remodal
                            var currentTimestamp = new Date().getTime();
                            field.options["data-remodal-target"] =
                                "btnmarkasunacceptable_" + currentTimestamp;
                            field.options["data-remodal-current-value"] = _currentReasonVal;
                            field.options[
                                "data-current-form-id"
                            ] = this.options.formData._id.$oid;
                            field.options["data-url-mark-as-unacceptable"] = field.url;
                            // Generate HTML Mark Up for remodal
                            switch (_unacceptableReasonSchema.type.toLowerCase()) {
                                case "radio":
                                    if (!_unacceptableReasonSchema.values) {
                                        throw new Error("Expected a values key!");
                                    }
                                    field._customHtml = _.reduce(
                                        _unacceptableReasonSchema.values,
                                        function(str, v, index, list) {
                                            var _id = "UnacceptableReason_" + index;
                                            var _k = _.isArray(list) ? v : index;
                                            var _checked =
                                                _currentReasonVal && _currentReasonVal === _k ?
                                                'checked="true"' :
                                                "";
                                            if (_k && _k.replace) {
                                                _k = _k.replace(/"/gi, "&quot;");
                                            }
                                            var lab =
                                                '<label class="radio"><input ' +
                                                _checked +
                                                ' name="UnacceptableReason" id="' +
                                                _id +
                                                '" value="' +
                                                _k +
                                                '" type="radio">' +
                                                v +
                                                "</label>";
                                            return str + lab;
                                        },
                                        ""
                                    );
                                    break;
                                case "textarea":
                                    field._customHtml =
                                        '<textarea autocomplete="off" name="UnacceptableReason" id="UnacceptableReason"></textarea>';
                                    break;
                                default:
                                    throw new Error(
                                        "Not implement " + _unacceptableReasonSchema.type + " yet!"
                                    );
                            }
                            field.options.confirmed = null;
                        }
                    }
                    // Adding the Confirmation Popover
                    if (field.options.confirmed) {
                        // If there is ConfirmedText then will override the standard text.
                        var _std_text = field.options.confirmedtext ?
                            field.options.confirmedtext :
                            "Please confirm your selection.",
                            _popoverOptions = {
                                html: true,
                                placement: "top",
                                title: '<span class="text-info">' + _std_text + "</span>",
                                content: '<a class="btn btn-success btn-confirmed" data-href="' +
                                    field.url +
                                    '">Yes</button><a class="btn btn-danger btn-confirmed">No</button>'
                            };
                        field.attributes["data-popover-confirm"] = JSON.stringify(
                            _popoverOptions
                        );
                    } else if (field.options.subbuttons) {
                        if (!field.name) {
                            field.name =
                                "subbuttons_" +
                                field.description.replace(/ /g, "").toLowerCase();
                            if (!field.attributes.id) {
                                field.attributes.id = field.name;
                            }
                        }
                        // Since this will have the SubButtons in the options, will need to build this UI
                        require(["views/subform-layouts/subbuttons"], function(
                            SubButtonsView
                        ) {
                            var _subBtnId = field.attributes.id ?
                                field.attributes.id :
                                field.name;
                            var subButtonsView = Vm.create(this, _subBtnId, SubButtonsView, {
                                subbuttons: field.options.subbuttons,
                                internal: that.options.internal ? that.options.internal : false,
                                mode: that.options.mode,
                                status: that.options.formData && that.options.formData.status ?
                                    that.options.formData.status : null,
                                _id: _subBtnId,
                                button: $(".form-render #" + _subBtnId),
                                _oid: that.options.formData &&
                                    that.options.formData._id &&
                                    that.options.formData._id["$oid"] ?
                                    that.options.formData._id["$oid"] : null
                            });
                        });
                    } else if (field.options.subform) {
                        // Working on SubForm inside Button (Simple Form)
                        // If this is read mode, we need to have the current form ID as well.
                        if (this.options.mode !== "read") {
                            // Only have this option in read mode!
                            return "";
                        }
                        if (!field.name) {
                            throw "Expected a valid Name for SubForm Button.";
                        }
                        var _currentFormId =
                            this.options.formData &&
                            this.options.formData._id &&
                            this.options.formData._id.$oid ?
                            this.options.formData._id.$oid :
                            null;
                        if (!_currentFormId) {
                            throw "Expected a valid ID for SubForm Button.";
                        }
                        var subFormBtnOptions = field.options.subform;
                        if (!subFormBtnOptions.url ||
                            typeof subFormBtnOptions.url !== "string"
                        ) {
                            throw "Please pass in URL key as a string in SubForm options.";
                        }
                        if (!subFormBtnOptions.fields ||
                            !_.isArray(subFormBtnOptions.fields)
                        ) {
                            throw "Please pass in URL key as an array in SubForm options.";
                        }
                        // Validated, build HTML
                        var htmlSubFormBtn = "";
                        var validationSubFormBtn = field.options.subform.validation;
                        _.each(subFormBtnOptions.fields, function(fieldSubFormBtn) {
                            // Simple HTML Render
                            htmlSubFormBtn += buildHtmlBasicFormMarkup(
                                fieldSubFormBtn,
                                that.inputTemplate
                            );
                        });
                        htmlSubFormBtn =
                            '<div class="subform-button-wrapper">' +
                            htmlSubFormBtn +
                            '<div class="text-center"><a class="btn btn-primary subform-btn-submit" data-button-name="' +
                            field.name +
                            '">Submit</a></div></div>';
                        // Then add this html as a bs popover.
                        $("div#app").on(
                            this.options.formSchema.name + ".renderCompleted",
                            function(e, view) {
                                // Need to bind click event
                                var $currentBtn = $(this).find("button#" + field.name);
                                if ($currentBtn.length !== 1) {
                                    throw "Invalid SubForm Button, please make sure that the name is unique.";
                                }
                                // Attached Click Event
                                $currentBtn.popover({
                                    html: true,
                                    placement: "top",
                                    trigger: "manual",
                                    title: '<span class="text-info">Please complete this form.</span>',
                                    content: htmlSubFormBtn
                                });
                                $currentBtn.on("click", function(e) {
                                    if ($currentBtn.hasClass("submitted")) {
                                        return false;
                                    }
                                    if ($currentBtn.hasClass("shown")) {
                                        $currentBtn.removeClass("shown").popover("hide");
                                    } else {
                                        $currentBtn.addClass("shown").popover("show");
                                    }
                                });
                                // Form Submit Event
                                $currentBtn
                                    .parent()
                                    .on("click", ".subform-btn-submit", function(e) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        var currentDataBtnName = $(e.target).attr(
                                            "data-button-name"
                                        );
                                        if (
                                            currentDataBtnName !==
                                            $currentBtn.attr("data-button-name")
                                        ) {
                                            if (
                                                $currentBtn
                                                .next(".popover")
                                                .find(".subform-btn-submit")
                                                .attr("data-button-name") !== currentDataBtnName
                                            ) {
                                                return false;
                                            }
                                        }
                                        // Validate against the validation
                                        var $subFormWrapper = $currentBtn
                                            .next(".popover")
                                            .find(".subform-button-wrapper");
                                        var $inputs = $subFormWrapper.find(":input");
                                        var resultObj = {};
                                        var error = false;
                                        // Build Form in body
                                        $inputs.each(function() {
                                            var $this = $(this);
                                            var n = $this.attr("name");
                                            var v = $this.val();
                                            if (!n || n === "") {
                                                throw "expect valid input name!";
                                            }
                                            if (validationSubFormBtn && validationSubFormBtn[n]) {
                                                // Check for Validation
                                                if (validationSubFormBtn[n].required && v === "") {
                                                    $this.addClass("invalid");
                                                    error = true;
                                                } else {
                                                    $this.removeClass("invalid");
                                                }
                                            }
                                            resultObj[n] = v;
                                        });
                                        if (!error) {
                                            var currentFormId =
                                                "subform-btn-" + new Date().getTime().toString();
                                            var _hidden = "";
                                            var _getParameters = _.extend({}, subFormBtnOptions.get);
                                            _.each(resultObj, function(_v, _k) {
                                                // Need to check for possible GET Request
                                                var _kLower = _k.toLowerCase();
                                                if (_getParameters.hasOwnProperty(_kLower)) {
                                                    delete _getParameters[_kLower];
                                                    _getParameters[_k] = _v;
                                                } else {
                                                    _hidden +=
                                                        '<input type="hidden" name="' +
                                                        _k +
                                                        '" value="' +
                                                        _v +
                                                        '"/>';
                                                }
                                            });
                                            if (
                                                field.options.subform.url[
                                                    field.options.subform.url.length - 1
                                                ] !== "/"
                                            ) {
                                                field.options.subform.url += "/";
                                            }
                                            var currentAction =
                                                field.options.subform.url + _currentFormId;
                                            if (_getParameters) {
                                                currentAction += "?" + $.param(_getParameters);
                                            }
                                            // Validate Pass
                                            $("body").append(
                                                '<form id="' +
                                                currentFormId +
                                                '" action="' +
                                                currentAction +
                                                '" method="POST">' +
                                                _hidden +
                                                "</form>"
                                            );
                                            // console.log('- $currentBtn:', $currentBtn);
                                            $currentBtn.removeClass("shown").popover("destroy");
                                            // Show Loader UI
                                            $currentBtn
                                                .popover({
                                                    html: true,
                                                    placement: "top",
                                                    trigger: "manual",
                                                    title: '<span class="text-info">Sending Information</span>',
                                                    content: '<div class="text-center subform-button-wrapper"><i class="icon-spinner icon-spin icon-large"></i> Sending</div>'
                                                })
                                                .addClass("submitted")
                                                .popover("show");
                                            $currentBtn
                                                .closest(".form-actions")
                                                .find(":button")
                                                .attr("disabled", true);
                                            window.setTimeout(function() {
                                                $("body")
                                                    .find("#" + currentFormId)
                                                    .submit();
                                            }, 1000);
                                        }
                                        return false;
                                    });
                            }
                        );
                    }
                    break;
                case "schooles":
                case "schoolclarkcounty":
                    var schoolType = _type;
                    _type = "text";
                    field.attributes["class"] = Utils.setupClassAttr(
                        field.attributes["class"],
                        "span12"
                    );
                    field.attributes["data-provide"] = "typeahead";
                    field.attributes["autocomplete"] = "off";
                    var schoolData;
                    switch (schoolType) {
                        case "schooles":
                            schoolData = schoolesData;
                            break;
                        case "schoolclarkcounty":
                            schoolData = schoolclarkcountyData;
                            // schoolData = schoolesData;
                            break;
                        default:
                            throw new Error(
                                'Not mapped school data for "' + schoolType + '" yet!'
                            );
                    }
                    field.attributes["data-source"] = schoolData
                        .replace(/\r\n/g, "")
                        .replace(/\n/g, "")
                        .replace(/'/g, "&#39")
                        .replace(/,/g, "&#44");
                    break;
                    // Step Field Type only render for wizard view
                case "step":
                    if (
                        "view" in this.options.formSchema &&
                        this.options.formSchema.view === "wizard"
                    ) {
                        if (this._stepDiv !== 0) {
                            _html += "</div>";
                            this._stepDiv--;
                        }
                        if (
                            typeof this._stepValidated[this._currentStep - 1] === "undefined"
                        ) {
                            this._stepValidated[this._currentStep - 1] = [];
                        }
                        var _active =
                            "step-pane" + (this._currentStep === 1 ? " active" : "");
                        _html +=
                            '<div class="' +
                            _active +
                            '" id="wizard_step' +
                            this._currentStep +
                            '">';
                        this._stepDiv++;
                        this._currentStep++;
                    } else {
                        return "";
                    }
                    break;
                case "useraccount":
                    field["data_value"] = "";
                    if (field.options.getvaluefromid) {
                        field["data_value"] = $("#" + field.options.getvaluefromid).text();
                    }
                    break;
                    // Sub Form, will need to render new view to handle the event
                case "list":
                    field.attributes.id =
                        this.prefixedName["list"] +
                        (typeof field.attributes.id !== "undefined" ?
                            field.attributes.id :
                            field.name);
                    field.attributes["class"] = Utils.setupClassAttr(
                        field.attributes["class"],
                        "subform-container"
                    );
                    // Attached Event
                    var _validation =
                        typeof this.options.formSchema.validation[field.name] !==
                        "undefined" ?
                        this.options.formSchema.validation[field.name] : {};
                    this.attachSubFormEvent(field.attributes.id, field, _validation);
                    // Save the Schema to be used later.
                    this._listSchema[field.name] = field;
                    // this.setupSubFormListenValueEvent(field);
                    break;
                case "hidden":
                    var _hiddenAllowMode = ["update", "create"];
                    // console.log('===');
                    // console.log(field.name);
                    // console.log(this.options.formData.fields[field.name]);
                    if (
                        _.indexOf(_hiddenAllowMode, this.options.mode) > -1 &&
                        this.options.formData &&
                        this.options.formData.fields &&
                        this.options.formData.fields[field.name]
                    ) {
                        if (!field.attributes) {
                            field.attributes = {};
                        }
                        field.attributes.value = this.options.formData.fields[field.name];
                    }
                    break;
            }
            // Check to see if this is button or submit
            if (_type === "button" && field.options.visibleon) {
                var _btnVisibleOnChanged = function(e) {
                    if (
                        e.type === "change" &&
                        field.options.visibleon.values.indexOf($(this).val()) > -1
                    ) {
                        $("#" + field.name, that.el).show("slow");
                    } else {
                        $("#" + field.name, that.el).hide("slow");
                    }
                };
                // Listen to changed event and update the display
                $(this.el)
                    .on(
                        "change",
                        ':input[name="' + field.options.visibleon.name + '"]',
                        _btnVisibleOnChanged
                    )
                    .on(
                        "removeVisibleOn",
                        ':input[name="' + field.options.visibleon.name + '"]',
                        _btnVisibleOnChanged
                    );
            }
            // Check to see if step validation has been init (wizard view)
            if (
                typeof this._stepValidated[this._currentStep - 2] !== "undefined" &&
                !(_type === "step" || _type === "list") &&
                Utils.checkRequireFields(field, this.options.formSchema.validation)
            ) {
                _.each(_name, function(element) {
                    that._stepValidated[that._currentStep - 2].push(element);
                });
            }
            //=============== READ MODE ===============//
            // If this is read mode will need to render read template
            if (
                typeof readMode !== "undefined" &&
                readMode &&
                typeof _name[0] !== "undefined" &&
                !(_type === "button" || _type === "buttonclipboard")
            ) {
                var _field_data = "",
                    _href = "";
                _.each(_name, function(element) {
                    var _currentFormDataValue = that.options.formData.fields[element];
                    // console.log('- _currentFormDataValue:', _currentFormDataValue, typeof _currentFormDataValue);
                    if (typeof _currentFormDataValue !== "object") {
                        _field_data +=
                            (typeof _currentFormDataValue !== "undefined" ?
                                _currentFormDataValue :
                                "") + " ";
                    } else if (
                        _.isArray(_currentFormDataValue) ||
                        typeof _currentFormDataValue === "object"
                    ) {
                        _field_data = _currentFormDataValue;
                    } else if (
                        _currentFormDataValue !== undefined &&
                        _currentFormDataValue !== null
                    ) {
                        _field_data += _currentFormDataValue;
                        // console.log('- _field_data:', _field_data, 'append with string');
                    }
                });
                // console.log('- _field_data:', _field_data, '- _name:', _name);
                if (typeof _field_data === "string") {
                    _field_data = $.trim(_field_data);
                }
                if (_type === "file" || _type === "image") {
                    if (_type === "image") {
                        if (that.options.formData.fields[field.name] === "deleted") {
                            _href = null;
                        } else {
                            field.attributes["src"] =
                                (typeof field.attributes["src"] !== "undefined" ?
                                    field.attributes["src"] :
                                    "/form/getFile/") +
                                that.options.formData.fields[field.name];
                            _href = field.attributes["src"];
                        }
                    } else {
                        field.attributes["target"] = "_blank";
                        field.attributes["class"] = Utils.setupClassAttr(
                            field.attributes["class"],
                            "btn btn-primary"
                        );
                        field.attributes["href"] =
                            (typeof field.attributes["href"] !== "undefined" ?
                                field.attributes["href"] :
                                "/form/getFile/") + that.options.formData.fields[field.name];
                        if (!field.attributes.id) {
                            field.attributes.id = field.name;
                        }
                        // Check for other options
                        if (
                            field.options.markdownloaddatetimeof &&
                            this.options.formData._id &&
                            this.options.formData._id["$oid"]
                        ) {
                            var _markDownloadDateTime = field.options.markdownloaddatetimeof.toLowerCase();
                            if (
                                _markDownloadDateTime === "*" ||
                                (this.options.internal &&
                                    _markDownloadDateTime === "internal") ||
                                (!this.options.internal && _markDownloadDateTime === "external")
                            ) {
                                field.attributes["href"] +=
                                    "?formid=" + this.options.formData._id["$oid"];
                            }
                        } else if (
                            field.options.appendid &&
                            this.options.formData._id &&
                            this.options.formData._id["$oid"]
                        ) {
                            field.attributes["href"] +=
                                "?formid=" + this.options.formData._id["$oid"];
                        }
                    }
                    delete field.attributes["accept"];
                    _.each(field.attributes, function(value, key) {
                        if (value.search("'")) {
                            value = value.replace(/\'/gi, '"');
                        }
                        _attr += " " + key + "='" + value + "'";
                    });
                    // console.log('- name:', field.name, _field_data);
                    _html += that.inputTemplate["uneditable" + _type]({
                        name: field.name,
                        value: _field_data,
                        text: field.description,
                        _attr: _attr,
                        id: field.name,
                        href: _href,
                        css_class: field.attributes.class ? field.attributes.class : "",
                        internal: field.options.internal ? 'data-internal="true"' : "",
                        mongo_id: this.options.formData &&
                            this.options.formData._id &&
                            this.options.formData._id.$oid ?
                            this.options.formData._id.$oid : null,
                        data_webcam: "data-webcam-url" in field.attributes &&
                            field.attributes["data-webcam-url"] ?
                            ' data-webcam-url="' +
                            field.attributes["data-webcam-url"] +
                            '" ' : null
                    });
                } else if (_type === "list") {
                    // If this is 'list' type
                    if (
                        typeof this.options.formData.fields[field.name] !== "undefined" &&
                        (this.options.formData.fields[field.name].length > 0 ||
                            _.size(this.options.formData.fields[field.name]) > 0)
                    ) {
                        // Read Mode: List Rendering Logic
                        var _labels = [],
                            _sortBy = [],
                            _sortByVal = [],
                            _keys = {},
                            _cnt = 0,
                            _values = new Array(
                                this.options.formData.fields[field.name].length ||
                                _.size(this.options.formData.fields[field.name])
                            );
                        _.each(field.fields, function(element, index) {
                            element.options = element.options || {};
                            // console.log('element.options:', element.options);
                            var notshowontable = element.options.showontable === false;
                            // Make sure about "Options"."TableTitle"
                            if (notshowontable) {
                                // console.log('element:', element.name);

                                return;
                            }
                            var _currentLabel;
                            if (element.options.tabletitle) {
                                _currentLabel = element.options.tabletitle;
                                _currentLabel =
                                    '<a data-content="' +
                                    $("<p>" + element.description + "</p>").text() +
                                    '" data-original-title="' +
                                    _currentLabel +
                                    '" data-placement="top" data-toggle="popover" data-trigger="hover" data-html="true">' +
                                    _currentLabel +
                                    "</a>";
                            } else {
                                _currentLabel = element.description;
                            }
                            _labels.push(_currentLabel);
                            if (
                                element.options.sortby &&
                                element.options.sortby.toLowerCase() === "date"
                            ) {
                                _sortBy.push('data-sort="int"');
                            } else {
                                _sortBy.push(
                                    element.options.sortby ?
                                    'data-sort="' + element.options.sortby + '"' :
                                    'data-sort="string"'
                                );
                            }

                            var currentFieldFormData = Utils.getModelValueForViewModel(
                                that.options.formData,
                                field.name
                            );

                            _.each(currentFieldFormData, function(modelData, index) {
                                var _fullName;
                                if (!_.isNumber(index)) {
                                    if (_keys[element.name]) {
                                        _cnt++;
                                        index = _cnt;
                                    } else {
                                        _cnt = 0;
                                        _keys[element.name] = true;
                                        index = _cnt;
                                    }
                                }
                                if (typeof _values[index] === "undefined") {
                                    _values[index] = [];
                                    _sortByVal[index] = [];
                                }
                                // Setup Sort By Element
                                if (
                                    element.options.sortby &&
                                    element.options.sortby.toLowerCase() === "date"
                                ) {
                                    var _dateTime = Date.parseString(
                                        modelData[element.name],
                                        "M/d/yyyy h:mm:ss a"
                                    );
                                    _sortByVal[index].push(
                                        'data-sort-value="' + _dateTime.getTime() + '"'
                                    );
                                } else {
                                    _sortByVal[index].push(null);
                                }
                                switch (element.type.toLowerCase()) {
                                    case "timestamp":
                                        var _tLabel;
                                        if (element.options && element.options.tabletitle) {
                                            _tLabel = element.options.tabletitle;
                                        } else {
                                            _tLabel = "Timestamps";
                                        }
                                        _labels[_labels.length - 1] = _tLabel;
                                        // Convert to Human Readable Time
                                        _values[index].push(
                                            Utils.getHumanTime(modelData[element.name])
                                        );
                                        break;
                                    case "useraccount":
                                        _labels[_labels.length - 1] = "User";
                                        _values[index].push(modelData[element.name]);
                                        break;
                                    case "fullname":
                                        _fullName =
                                            modelData[element.name + "_fullname_first_name"];
                                        if (
                                            typeof modelData[
                                                element.name + "_fullname_middle_name"
                                            ] !== "undefined"
                                        ) {
                                            _fullName +=
                                                " " + modelData[element.name + "_fullname_middle_name"];
                                        }
                                        _fullName +=
                                            " " + modelData[element.name + "_fullname_last_name"];
                                        _values[index].push(_fullName);
                                        break;
                                    case "booleaninput":
                                        _values[index].push(modelData[element.name] ? "Yes" : "No");
                                        break;
                                    case "date":
                                        var _tempDate = modelData[element.name];
                                        if (_tempDate && _tempDate.$date) {
                                            _tempDate = moment(_tempDate.$date);
                                            if (!_tempDate.isValid()) {
                                                throw new Error(
                                                    'Invalid Date Value for "' +
                                                    element.name +
                                                    '" with "' +
                                                    modelData[element.name] +
                                                    '"'
                                                );
                                            }
                                            _tempDate = _tempDate.format("MM/DD/YYYY");
                                        }
                                        _values[index].push(_tempDate);
                                        break;
                                    case "file":
                                        // console.log('- hello');
                                        _values[index].push({
                                            value: modelData[element.name],
                                            valueObj: JSON.parse(modelData[element.name]),
                                            valueBase64: Utils.Base64.encode(modelData[element.name]),
                                            // valueBase64: modelData[element.name].valueBase64,
                                            renderAs: "downloadFromJS"
                                        });
                                        break;
                                    case "number":
                                        if (
                                            element.options &&
                                            element.options.decimals &&
                                            modelData[element.name]
                                        ) {
                                            modelData[element.name] = (
                                                modelData[element.name] /
                                                Math.pow(10, element.options.decimals)
                                            ).toFixed(element.options.decimals);
                                        }
                                    default:
                                        if (typeof modelData[element.name] === "undefined") {
                                            delete _labels[_labels.length - 1];
                                            return;
                                        }
                                        _values[index].push(modelData[element.name]);
                                }
                            });
                        });
                        // console.log('_values:', _values);

                        var readListTemplate = "subform-table";

                        if (Utils.isMobileDevice()) {
                            readListTemplate = 'subform-card';
                        }

                        // console.log('readListTemplate:', readListTemplate, '_values:', _values);

                        // Render Table View for List
                        _html += that.inputTemplate[readListTemplate]({
                            labels: _labels,
                            values: _values,
                            mode: readMode,
                            sortBy: _sortBy,
                            sortByVal: _sortByVal,
                            heading: typeof field.options.readmodedescription === "undefined" ?
                                field.description : field.options.readmodedescription
                        });
                    } else {
                        // console.log('- set html to blank!', field.name);
                        _html += "";
                    }
                } else if (_type === "telephone" && field._providerValue) {
                    // This is telephone with provider
                    _html += that.inputTemplate["uneditabletel"]({
                        value: _field_data,
                        label: field.description,
                        id: field.name,
                        providerValue: field._providerValue,
                        css_class: field.attributes.class
                    });
                } else if (_type === "check") {
                    // This is check box and need to render to make it look easy to read
                    _html += that.inputTemplate["uneditablecheck"]({
                        value: _field_data,
                        label: field.description,
                        id: field.name,
                        otherValue: field._otherValue ? field._otherValue : "",
                        css_class: field.attributes.class
                    });
                } else if (_type === "select" && field.options && field.options.tags) {
                    // console.log('- field:', field, '- _field_data:', _field_data);
                    // Sort Tag by Numerical
                    if (_.isArray(_field_data)) {
                        _field_data.sort(function(a, b) {
                            return a - b;
                        });
                    }
                    // This is check box and need to render to make it look easy to read
                    _html += that.inputTemplate["uneditabletag"]({
                        value: _field_data,
                        id: field.name,
                        css_class: field.attributes.class
                    });
                } else if (_type === "filerepository") {
                    // Render File Repository Here
                    // XXX: working on reder this field
                    _html += that.inputTemplate["read-filerepository"](
                        _.extend({
                                data: this.options.formData.fields[field.name],
                                formId: this.options.formData._id.$oid,
                                Utils: Utils,
                                css_class: field.attributes.class
                            },
                            field
                        )
                    );
                } else {
                    var _textarea = "";
                    switch (_type) {
                        case "textarea":
                        case "address":
                            _textarea = " uneditable-input-textarea";
                            break;
                        case "timestamp":
                            _field_data = Utils.getHumanTime(_field_data);
                            break;
                        case "select":
                            if (field._data) {
                                _field_data = field._data;
                            }
                            break;
                        case "booleaninput":
                            _field_data =
                                _field_data === "true" || _field_data === true ? "Yes" : "No";
                            break;
                    }
                    // Special Case for render
                    var linkBackToParentForm = ["ParentFormId", "FormRecordId"];
                    if (
                        field.name &&
                        this.options.internal &&
                        _.indexOf(linkBackToParentForm, field.name) > -1
                    ) {
                        // Render as Special Button
                        // Can add any other options
                        var _tmpInternalViewUrl = Utils.config.internalViewUrl;
                        // This could be more than one
                        var formIdArr = [];
                        if (that.options.formData.fields.MultipleFormRecordId) {
                            formIdArr = that.options.formData.fields.MultipleFormRecordId.split(
                                ","
                            );
                        } else {
                            formIdArr.push(_field_data);
                        }
                        _.each(formIdArr, function(v) {
                            _html +=
                                '<a class="btn btn-primary" title="View FormId = ' +
                                v +
                                '" href="' +
                                _tmpInternalViewUrl +
                                "/" +
                                v +
                                '" style="margin-right:20px;">View</a>';
                        });
                    } else if (_type === "html") {
                        // Adding for Render HTML
                        _html += field.description;
                    } else {
                        // console.log('- field.name:', field.name, '- value:', _field_data);

                        _html += that.inputTemplate["uneditableinput"]({
                            value: _field_data,
                            css_class: _textarea,
                            id: field.name
                        });
                    }
                }
            } else if (
                _type === "image" &&
                typeof field.options.internalcanupdate !== "undefined" &&
                this.options.internal &&
                field.options.internalcanupdate === false
            ) {
                // Start render the Image here
                // Render Image As Read Mode, (Depending on the Options.InternalCanUpdate value)
                var _field_data = "",
                    _href = "";
                // console.log('that.options:', that.options);
                // console.log('that.options.formData:', that.options.formData);

                try{
                    var hasFileFieldValue = that.options.formData && that.options.formData.fields && that.options.formData.fields[field.name];
                } catch (err) {
                    console.log('Error: when trying to set hasFileFieldValue!')
                    throw err;
                }


                if (hasFileFieldValue) {
                    _.each(_name, function(element) {
                        if (typeof that.options.formData.fields[element] !== "object") {
                            _field_data +=
                                (typeof that.options.formData.fields[element] !== "undefined" ?
                                    that.options.formData.fields[element] :
                                    "") + " ";
                        } else {
                            _field_data = that.options.formData.fields[element];
                        }
                    });
                }

                if (typeof _field_data === "string") {
                    _field_data = $.trim(_field_data);
                }
                if (hasFileFieldValue && that.options.formData.fields[field.name] === "deleted") {
                    _href = null;
                } else if (hasFileFieldValue) {
                    field.attributes["src"] =
                        (typeof field.attributes["src"] !== "undefined" ?
                            field.attributes["src"] :
                            "/form/getFile/") + that.options.formData.fields[field.name];
                    _href = field.attributes["src"];
                }
                delete field.attributes["accept"];
                _.each(field.attributes, function(value, key) {
                    if (value.search("'")) {
                        value = value.replace(/\'/gi, '"');
                    }
                    _attr += " " + key + "='" + value + "'";
                });
                _html += that.inputTemplate["uneditable" + _type]({
                    mongo_id: this.options.formData &&
                        this.options.formData._id &&
                        this.options.formData._id.$oid ?
                        this.options.formData._id.$oid : null,
                    value: _field_data,
                    text: field.description,
                    _attr: _attr,
                    id: field.name,
                    href: _href,
                    css_class: field.attributes.class,
                    data_webcam: "data-webcam-url" in field.attributes &&
                        field.attributes["data-webcam-url"] ?
                        ' data-webcam-url="' +
                        field.attributes["data-webcam-url"] +
                        '" ' : null
                });
            } else {
                //*** Create and Update Mode ***//
                // Check if this is internal and has InternalCanUpdate Options
                if (
                    this.options.internal &&
                    typeof field.options.internalcanupdate !== "undefined" &&
                    !field.options.internalcanupdate
                ) {
                    _type = "hidden";
                } else {
                    _.each(field.attributes, function(value, key) {
                        // value might be a JSON, that why we escape as '' not ""
                        _attr += " " + key + "='" + value + "'";
                    });
                }
                // Convert to file type
                if (_type === "image") {
                    _type = "file";
                }
                // var DEBUG = true;
                // Save HTML Mark UP Here!
                if (DEBUG) {
                    console.log("");
                    console.log("[*] Render HTML Field");
                    console.log(field);
                    console.log(_attr);
                }
                // Check for Undefined Type
                if (DEBUG && typeof this.inputTemplate[_type] === "undefined") {
                    throw 'Template of "' + _type + '" not found!';
                }

                // console.log('- _type: ', _type, ' _attr: ', _attr);
                _html +=
                    typeof this.inputTemplate[_type] !== "undefined" ?
                    this.inputTemplate[_type](
                        _.extend({
                                _attr: _attr,
                                _lang: this.options.lang,
                                _renderMode: this.options.mode,
                                css_class: field.attributes.class
                            },
                            field
                        )
                    ) :
                    "";
            }
            // Checking for the VisibleOn options, if it is existed will need to check for the depend value
            if (field.options.visibleon) {
                if (!field.options.visibleon.name ||
                    !$.isArray(field.options.visibleon.values)
                ) {
                    throw field.name + ".Options.VisibleOn need Name and Values!";
                }
                this._visibleOn.push(field);
            }
            // Just Show Warning
            if (
                field &&
                field.type &&
                !this.inputTemplate[_type] &&
                console &&
                console.warn
            ) {
                console.warn('[x] Template for "' + field.type + '" does not existed.');
            }
            // Return HTML Here.
            // Check to see if we allow to render update on read mode.
            if (field.options.updateonreadmode) {
                // Will add this class and attach event to the form, looking for .update-on-read-mode
                _html =
                    '<div class="update-on-read-mode" data-field-name="' +
                    field.name +
                    '">' +
                    _html +
                    this.generateMarkUpForUpdateOnReadMode(field) +
                    "</div>";
            }
            return _html;
        },
        /**
         * Render Label
         **/
        renderLabel: function(field, required, cssClass) {
            required = required || false;
            field.attributes = field.attributes || {};
            field.options = field.options || {};
            // cssClass = 'hello';
            var _type = field.type.toLowerCase(),
                _cssClass = typeof cssClass !== "undefined" && cssClass ? cssClass : "";
            // If has RenderAs
            if (field.options.renderas) {
                _type = field.options.renderas.toLowerCase();
            }
            // console.log('- _type: ', _type);
            switch (_type) {
                case "calculate":
                    return "";

                case "hidden":
                    if (this.options.mode === "create") {
                        return "";
                    }
                    break;
                case "buttondecision":
                    return "";
            }
            // console.log('- Date.now(): ' + Date.now());
            var name = field.name ? field.name : Date.now();
            _cssClass += " label-for-" + field.name;
            // console.log('- _cssClass:', _cssClass);

            _cssClass = $.trim(_cssClass);

            if (
                _cssClass &&
                _cssClass.match &&
                !_cssClass.match(/class.*=.*("|').+/gi)
            ) {
                _cssClass = 'class="' + _cssClass + '"';
            }
            return this.inputTemplate["label"](
                _.extend({
                        _cssClass: _cssClass,
                        _required: required
                    },
                    field
                )
            );
        },
        /**
         * Render Button
         **/
        renderButton: function(formOptions) {
            var _html = "";
            if (formOptions.submitbutton || formOptions.resetbutton) {
                _html += '<div class="form-actions">';
            }
            if (formOptions.submitbutton && !formOptions.subForm) {
                _html +=
                    '<button type="submit" class="btn btn-primary btn-submit">' +
                    formOptions.submitbutton +
                    "</button>";
            } else {
                _html +=
                    '<button type="button" class="btn btn-primary btn-submit">' +
                    formOptions.submitbutton +
                    "</button>";
            }
            if (formOptions.resetbutton) {
                _html +=
                    '<button type="button" class="btn btn-cancel">' +
                    formOptions.resetbutton +
                    "</button>";
            }
            if (_html.length > 0) {
                _html += "</div>";
            }
            return _html;
        },
        /**
         * Show On Mode
         **/
        checkShowOnMode: function(value, readMode, status) {
            var DEBUG = false;
            // var DEBUG_NAME = "BillAnotherDept";
            var DEBUG_NAME = "SubmittedFirstTimeNotification";
            var locationCnt = 0;
            var _type = value.type.toLowerCase();
            if (DEBUG && value && value.name) {
                console.log("checkShowOnMode: ", value.name);
                console.log("");
            }
            // First Check to see if rendering for internal or external
            if (
                value.options.internal != undefined &&
                value.options.internal !== this.options.internal
            ) {
                return false;
            }
            // If this is internal fields, we need to push to _internalFields array
            if (
                value.options.internal === true &&
                value.name &&
                _type !== "buttonclipboard"
            ) {
                var _internalName;
                switch (_type) {
                    case "check":
                    case "checkbox":
                        _internalName = value.name + "[]";
                        break;
                    default:
                        _internalName = value.name;
                }
                this._internalFields.push(_internalName);
            }
            if (DEBUG && value.name === DEBUG_NAME) {
                locationCnt++;
                console.log("Location: " + locationCnt);
            }
            if (
                this.options.hideButtons &&
                (_type === "button" ||
                    _type === "submit" ||
                    _type === "reset" ||
                    _type === "action")
            ) {
                return false;
            }
            if (DEBUG && value.name === DEBUG_NAME) {
                locationCnt++;
                console.log("Location: " + locationCnt, "- _type:", _type);
            }
            // If this is type VisibleOn and in Read Mode will not render if does not have data
            if (this.options.mode === "read") {
                if (!$.isEmptyObject(value.options.visibleon)) {
                    if (
                        typeof this.options.formData.fields[value.name] === "undefined" &&
                        !(
                            _type === "fullname" ||
                            _type === "address" ||
                            _type === "buttonclipboard" ||
                            _type === "html"
                        )
                    ) {
                        if (DEBUG && value.name === DEBUG_NAME) {
                            locationCnt++;
                            console.log(
                                "Location: " + locationCnt,
                                " : ",
                                this.options.formData.fields[value.name]
                            );
                        }
                        return false;
                    }
                }
            }
            if (DEBUG && value.name === DEBUG_NAME) {
                locationCnt++;
                console.log("Location: " + locationCnt);
            }
            readMode = readMode || false;
            status = status || false;
            if (
                readMode !== "read" &&
                value.type.toLowerCase() === "buttonclipboard"
            ) {
                if (DEBUG && value.name === DEBUG_NAME) {
                    locationCnt++;
                    console.log("Location: " + locationCnt);
                }
                return false;
            } else if (
                readMode === "read" &&
                !this.options.internal &&
                value.options.hideonexternalread
            ) {
                if (DEBUG && value.name === DEBUG_NAME) {
                    locationCnt++;
                    console.log("Location: " + locationCnt);
                }
                return false;
            } else if (
                typeof value.options.showonmode !== "undefined" &&
                value.options.showonmode.indexOf(readMode) === -1
            ) {
                if (DEBUG && value.name === DEBUG_NAME) {
                    locationCnt++;
                    console.log("Location: " + locationCnt);
                }
                return false;
            } else if (typeof value.options.showonstatus !== "undefined") {
                if (DEBUG && value.name === DEBUG_NAME) {
                    locationCnt++;
                    console.log("Location: " + locationCnt);
                }
                var _showOnStatus = _.map(value.options.showonstatus, function(
                    element
                ) {
                    return element.toLowerCase();
                });
                // 0.1.7: This has been added if this is the create mode, will ignore this featured.
                if (
                    this.options.mode !== "create" &&
                    (status === false ||
                        _showOnStatus.indexOf(status.toLowerCase()) === -1)
                ) {
                    return false;
                }
            } else if (
                this.options.internal &&
                readMode === "update" &&
                typeof value.options.internalcanupdate !== "undefined" &&
                !value.options.internalcanupdate
            ) {
                if (_type !== "image") {
                    return false;
                }
            }
            if (DEBUG && value.name === DEBUG_NAME) {
                locationCnt++;
                console.log("Location: " + locationCnt, "before return true");
            }
            return true;
        },
        /**
         * Subform Events
         **/
        attachSubFormEvent: function(id, field, validation) {
            field = _.extend(field, {
                validation: validation
            });
            // Click add button
            var that = this,
                _options = {
                    el: "#" + id + this.prefixedName["listdisplayid"],
                    formSchema: field,
                    formId: id,
                    options: this.options
                },
                _listView = _.extend({}, Backbone.Events);
            // console.log('- this:', this);
            // var _listOptions = _options.options;
            // console.log('- _listOptions:', _listOptions);
            $(this.el)
                .on("click", "#" + id + "_add_btn", _options, this.displaySubForm)
                // User click cancel button
                .on(id + ".close", this.closeSubForm)
                // User added a model
                .on(
                    id + ".add",
                    _.extend({
                            formId: id
                        },
                        this
                    ),
                    this.addSubformData
                );
            // If there are subform data
            // console.log('- that:', that);
            // console.log('- that._listSchema:', that._listSchema);
            // console.log('- that.el:', that.el);
            // console.log('- id:', id);
            if (
                this.options.mode === "update" &&
                typeof this.options.formData.fields[field.name] !== "undefined" &&
                this.options.formData.fields[field.name].length > 0
            ) {
                _listView.on(_options.formId + ".listViewCreated", function(list) {
                    // console.log("- " + _options.formId + ".listViewCreated");
                    // console.log(" - that.el:", that.el);
                    // console.log(" - id:", id);
                    // console.log(" - list:", list);
                    // console.log(
                    //   " - that.options.formData.fields[field.name]:",
                    //   that.options.formData.fields[field.name]
                    // );
                    var currentFieldFormData = Utils.getModelValueForViewModel(
                        that.options.formData,
                        field.name
                    );
                    $(that.el).trigger(id + ".add", [list, currentFieldFormData]);
                    _listView.off();
                });
            } else {
                _listView.on(_options.formId + ".listViewCreated", function(list) {
                    var $subFormList = $("#" + _options.formId, that.el),
                        _callback = function(e, data) {
                            // console.log('- that.el:', that.el);
                            // console.log('- id:', id);
                            // console.log('- list:', list);
                            // console.log('- data:', data);
                            $(that.el).trigger(id + ".add", [list, data, true]);
                            $subFormList.one(_options.formId + ".ajaxUpdate", _callback);
                        };
                    // console.log('- _options.formId:', _options.formId);
                    $subFormList.one(_options.formId + ".ajaxUpdate", _callback);
                    _listView.off();
                });
            }
            // Show Subform
            // console.log('- _options:', _options);
            // console.log('- _listView:', _listView);
            _listView.on(_options.formId + ".listViewCreated", function(list) {
                // console.log(' - Fired : ' + _options.formId + '.listViewCreated!');
                if (_.isEmpty(that._listSchema)) {
                    return;
                }
                // console.log(that._listSchema);
                _.each(that._listSchema, function(value, key) {
                    that.setupSubFormListenValueEvent(
                        that,
                        value,
                        key,
                        _options,
                        _listView,
                        id,
                        list
                    );
                });
            });
            this.displaySubForm({
                    data: _options
                }, {},
                true,
                _listView
            );
        },
        /**
         * Show Modal List View
         * This will be called when List View (Sub Form) Render
         */
        displaySubForm: function(e, model, hidden, listView, read) {
            read = read || false;
            if (!e.data) {
                return;
            }
            // var DEBUG = true;
            if (DEBUG) {
                console.log("[*] baseField.displaySubForm");
                if (model && model.toJSON) {
                    console.log(model.toJSON());
                }
                console.log(hidden);
                console.log(listView);
                console.log(read);
            }
            // debugger;
            model = model || {};
            hidden = hidden || false;
            listView = listView || false;
            var _id,
                _data = _.clone(e.data);
            // Load Subform View
            if ($.isEmptyObject(model)) {
                _id = "SubFormView" + e.data.formId;
            } else {
                _data.model = model;
                _id = "SubFormViewEdit" + e.data.formId;
            }
            var that = this;
            $(this)
                .parents("div.actions")
                .fadeOut();
            require(["views/fields/list"], function(SubFormView) {
                var $expose;
                // var DEBUG = true;
                if (DEBUG) {
                    console.log("*** displaySubForm: Render List ***");
                    console.log('hidden:', hidden);

                    if (_data.model) {
                        console.log(JSON.stringify(_data.model));
                    }
                }
                var subFormView = Vm.create(that, _id, SubFormView, _data),
                    $subFormView = $(subFormView.el);
                if (hidden) {
                    $subFormView.hide();
                }
                if (DEBUG) {
                    console.log('subFormView:', subFormView);
                }
                subFormView.render(hidden, read);
                if (DEBUG) {
                    console.log('After: subFormView.render', subFormView.cid);
                    console.log('subFormView:', subFormView);

                }
                if (!hidden) {
                    $subFormView.show({
                        complete: function() {
                            // console.log('*** SubForm.show.complete ***', subFormView.cid);

                            // console.log('Fired: ' + e.data.formId + ' show complete');
                            // setTimeout(function() {
                            //   Utils.setupDateInput($subFormView, subFormView, true);
                            // }, 2000);

                            Utils.finalSetup(subFormView);
                        },
                        done: function() {
                            // console.log('Fired: ' + e.data.formId + ' show done');
                            // Utils.setupDateInput($subFormView, subFormView);
                        }
                    });
                    $subFormView.addClass("active");
                    $expose = $subFormView.expose({
                        closeOnEsc: false,
                        closeOnClick: false,
                        color: "#000",
                        zIndex: 1025,
                        renderBody: false
                    });
                }
                if (listView) {
                    // console.log('Fired: ' + e.data.formId + '.listViewCreated');
                    listView.trigger(e.data.formId + ".listViewCreated", subFormView);
                }
                /*if (!hidden) {
                  console.log('Fired: ' + e.data.formId + '.listViewShowed');
                  subFormView.trigger(e.data.formId + '.listViewShowed', subFormView);
                }*/
                /*if (!hidden) {
                  setTimeout(function() {
                    console.log('- subFormView: ', subFormView);
                    console.log('- $subFormView: ', $subFormView);
                    Utils.setupDateInput($subFormView, subFormView, true);
                  }, 1000);
                }*/
            });
        },
        /**
         * Set Up SubForm events when contain
         */
        setupSubFormListenValueEvent: function(
            view,
            field,
            key,
            options,
            listEvent,
            id,
            list
        ) {
            // debugger
            // var DEBUG = true;
            if (field.options) {
                if (field.options.copyvaluesfrom) {
                    // Need to listen for the model change event form the parent form
                    var fieldsToListen = field.options.copyvaluesfrom;
                    if (fieldsToListen && fieldsToListen.length) {
                        if (DEBUG) {
                            console.log("- Set Up setupSubFormListenValueEvent");
                            console.log(field);
                            console.log(fieldsToListen);
                        }
                        var $app = $("div#app");
                        _.each(fieldsToListen, function(value, index) {
                            if (DEBUG) {
                                console.log(" - ", arguments);
                            }
                            /*$('div#app').on(_opts.formSchema.name + '.renderCompleted', function() {
                              moduleView.render();
                            });*/
                            _.each(value, function(parentKey, listKey) {
                                var _name = ':input[name="' + parentKey + '"]';
                                if (DEBUG) {
                                    console.log(
                                        "- attached event _name:",
                                        _name,
                                        " listKey:",
                                        listKey
                                    );
                                }
                                $app.on("change", _name, function(e) {
                                    var $e = $(e.target),
                                        _val = $e.val();
                                    if (_val) {
                                        _val = $.trim(_val);
                                    }
                                    // var DEBUG = true;
                                    if (DEBUG) {
                                        console.log('[baseField] setupSubFormListenValueEvent on change');

                                        console.log("- on change fired! " + _name);
                                        // console.log(arguments);
                                        // console.log('  - $e:', $e);
                                        // console.log('  - Value:', _val);
                                        // console.log('  - view:', view);
                                        // console.log('  - view.model:', view.model.toJSON());
                                        // console.log('  - options:', options);
                                    }
                                    if (!view.model.has(key)) {
                                        return;
                                    }
                                    var currentListModel = view.model.get(key);
                                    if (DEBUG) {
                                        console.log(
                                            "  - currentListModel.length:",
                                            currentListModel.length
                                        );
                                    }
                                    // Empty List
                                    var _model = Backbone.Model.extend({});
                                    var _element;
                                    if (!currentListModel.length) {
                                        _element = new _model();
                                        _element.set(listKey, _val);
                                        currentListModel.push(_element);
                                    } else {
                                        // console.log('- index:',index);
                                        _element = currentListModel.at(index);
                                        if (!_element) {
                                            throw new Error(
                                                "Please look at List CopyValuesFrom logic!"
                                            );
                                        }
                                        if (_element.get(listKey) === _val) {
                                            return;
                                        }
                                        _element.set(listKey, _val);
                                    }
                                    if (DEBUG) {
                                        console.log(
                                            "  - currentListModel.length:",
                                            currentListModel.length
                                        );
                                        console.log("  - Fired: add event!");
                                    }
                                    $(view.el).trigger(id + ".add", [
                                        list,
                                        currentListModel.toJSON(),
                                        true
                                    ]);
                                    // Values Change Update Table
                                    /*view.displaySubForm({
                                      data: options
                                    }, _element, true);*/
                                    // $(view.el).trigger(id + '.add', [list, that.options.formData.fields[field.name]]);
                                });
                            });
                        });
                    }
                }
            }
        },
        /**
         * Closed Sub Form
         **/
        closeSubForm: function(e, list) {
            // var DEBUG = true;
            if (DEBUG) {
                console.log("[baseField] closeSubForm <-------");
            }
            list.$el.fadeOut();
            // Close mask bg
            $.mask.close();
            $(".actions", list.$el.parent(".subform-container")).fadeIn("slow");
            Vm.remove("SubFormView" + list.options.formId, true);
            Vm.remove("SubFormViewEdit" + list.options.formId, true);
        },
        /**
         * Add model to List
         * This will load table.js to render table view
         **/
        addSubformData: function(e, list, models, reset) {
            // var DEBUG = true;
            if (DEBUG) {
                console.log("[*] baseField.addSubformData");
                console.log(arguments);
            }
            // console.log('***** addSubformData *****');

            // console.log(list)
            // console.log(arguments);
            // console.log(this);
            reset = reset || false;
            models = models || false;
            var _view = !list.options.formSchema.view ?
                "table" :
                list.options.formSchema.view,
                _key = list.options.formSchema.name;
            var currentModel = e.data.model.get(_key);
            if (DEBUG) {
                console.log("- addSubformData:currentModel");
                console.log(_key);
                // console.log(currentModel);
                console.log("- currentModel: ", currentModel, typeof currentModel);
                if (currentModel.toJSON) {
                    console.log(currentModel.toJSON());
                }
            }
            if (typeof currentModel !== "object") {
                if (DEBUG) {
                    console.log("- currentModel is not object!");
                    console.log(e.data.model);
                }
                // console.log(arguments);
                if (e.data.model._listFieldType[_key]) {
                    if (DEBUG) {
                        console.log(
                            "- e.data.model._listFieldType[_key]: ",
                            e.data.model._listFieldType[_key]
                        );
                    }
                    e.data.model.set(_key, e.data.model._listFieldType[_key]);
                    currentModel = e.data.model.get(_key);
                }
            }
            if (reset) {
                currentModel.reset();
            }
            if (models) {
                var _model = Backbone.Model.extend({});
                _.each(models, function(element) {
                    var _element = new _model();
                    _element.set(element);
                    currentModel.add(_element);
                });
                if (DEBUG) {
                    console.log("- addSubformData:");
                    console.log(currentModel.toJSON());
                }
            } else {
                if (DEBUG) {
                    console.log("- addSubformData:list.model.toJSON()");
                    console.log(list.model.toJSON());
                }
                currentModel.add(list.model);
            }
            // console.log('- models:',models)
            var subFormOptions = list.options.formSchema.options || {};
            if (subFormOptions.copyvaluesfrom && !models) {
                var _listModelCid = list.model.cid;
                // var DEBUG = true;
                if (_.isArray(subFormOptions.copyvaluesfrom)) {
                    var targetModelIndex, targetModel;
                    for (var i = 0; i < currentModel.length; i++) {
                        var temp = currentModel.at(i);
                        if (DEBUG) {
                            console.log(
                                " - cid:",
                                temp.cid,
                                " = _listModelCid:",
                                _listModelCid
                            );
                        }
                        if (temp.cid === _listModelCid) {
                            targetModelIndex = i;
                            targetModel = temp;
                            break;
                        }
                    }
                    if (
                        typeof targetModelIndex !== "undefined" &&
                        typeof targetModelIndex !== "null" &&
                        subFormOptions.copyvaluesfrom[targetModelIndex]
                    ) {
                        // console.log('- subFormOptions.copyvaluesfrom[targetModelIndex]:', subFormOptions.copyvaluesfrom[targetModelIndex]);
                        // Update Value!
                        if (!_.isEmpty(subFormOptions.copyvaluesfrom[targetModelIndex])) {
                            var $parentForm = $("#" + list.options.options.formSchema.name);
                            // console.log('- $parentForm:', $parentForm);
                            _.each(subFormOptions.copyvaluesfrom[targetModelIndex], function(
                                parentKey,
                                listKey
                            ) {
                                var $currentInput = $parentForm.find(
                                        ':input[name="' + parentKey + '"]'
                                    ),
                                    value,
                                    modelValue = targetModel.get(listKey);
                                // console.log('- $currentInput:', $currentInput);
                                if ($currentInput.length > 1) {
                                    // console.log('- $currentInput:', $currentInput);
                                    $($currentInput).each(function(el) {
                                        var $el = $(this);
                                        // console.log(' - el:', el);
                                        // console.log(' - $el:', $el);
                                        var value = $el.val();
                                        // console.log(' - value:', value);
                                        if (value === modelValue) {
                                            if ($el.is(":radio")) {
                                                $el.attr("checked", true);
                                            } else {
                                                throw new Error(
                                                    "Not implement Radio in List - CopyValuesFrom yet!"
                                                );
                                            }
                                        } else {
                                            if ($el.is(":radio")) {
                                                // $el.removeAttr('checked');
                                            } else {
                                                throw new Error(
                                                    "Not implement Radio in List - CopyValuesFrom yet!"
                                                );
                                            }
                                        }
                                    });
                                } else {
                                    value = $currentInput.val();
                                    // console.log('- modelValue:', modelValue, ' value:', value);
                                    if (modelValue !== value) {
                                        $currentInput.val(modelValue).trigger("change");
                                    }
                                }
                            });
                        }
                    }
                }
            }
            // console.log('- subFormOptions:', subFormOptions);
            // Render SubForm List View
            require(["views/subform-layouts/" + _view], function(CollectionView) {
                // var DEBUG = true;
                if (DEBUG) {
                    console.log('    in "views/subform-layouts/' + _view + '"');
                    // console.log(arguments);
                    console.log(currentModel.toJSON());
                }
                // console.log('list:', list);

                var _data = {
                        el: "#" +
                            list.options.formId +
                            e.data.prefixedName["collectiondisplayid"],
                        formSchema: list.options.formSchema,
                        collection: currentModel,
                        options: list.options.options
                    },
                    collectionView = Vm.create(
                        this,
                        "CollectionView" + e.data.formId,
                        CollectionView,
                        _data
                    );
                collectionView.render();
                // Closed Subform
                e.data.closeSubForm(e, list);
                // Render Table View for Sub Form
                if (
                    list.options.formSchema.options &&
                    list.options.formSchema.options.permission
                ) {
                    var _currentUserId = Utils.getUserIdFormHtml().replace("\\", "\\\\"),
                        _reg = new RegExp(_currentUserId, "ig");
                    switch (list.options.formSchema.options.permission.toLowerCase()) {
                        case "readwriteselfcreated":
                            collectionView.$el.find("table tr").each(function() {
                                var $tr = $(this),
                                    _found = false;
                                $tr.find("td").each(function() {
                                    var $td = $(this);
                                    if ($td.text().match(_reg)) {
                                        _found = true;
                                    }
                                });
                                if (!_found) {
                                    $tr.find("td.subform-actions button.btn").remove();
                                }
                            });
                            break;
                        default:
                            throw list.options.formSchema.options.permission +
                                " not implement yet!";
                    }
                }
            });
        },
        /**
         * Setup the VisibleOn Options
         * This is the function to handle all of logic for VisibleOn
         **/
        setupVisibleOn: function(field, htmlTmpl, parentContainer, fieldsType, subformViewObj) {
            var DEBUG = false;
            var DEBUG_VS_ON = false;
            subformViewObj = subformViewObj || {};
            // console.log('[*] setupVisibleOn:', field);
            parentContainer = parentContainer || false;
            var that = this,
                _typeLowerCase = field.type.toLowerCase();
            if (!field.name) {
                throw "In order to use VisibleOn option, we need to pass in the Name";
            }

            // console.log('[baseField] setupVisibleOn:start *****', that.cid);

            if (!parentContainer) {
                // Check if this VisibleOn define the ParentContainer
                if (field.options.visibleon.parentcontainer) {
                    parentContainer = field.options.visibleon.parentcontainer;
                } else if (_typeLowerCase === "booleaninput") {
                    parentContainer = ".form-render_booleaninput_wrapper";
                } else {
                    // Check to see the delegate element
                    if (
                        field.options.visibleon &&
                        field.options.visibleon.name &&
                        _.indexOf(this._radioFieldName, field.options.visibleon.name) > -1
                    ) {
                        parentContainer = ".radio-container";
                    }
                }
            }
            // Overwrite the parentcontainer key.
            if (
                parentContainer &&
                field.options &&
                field.options.visibleon &&
                field.options.visibleon.parentcontainer
            ) {
                if (field.options.visibleon.parentcontainer !== parentContainer) {
                    parentContainer = field.options.visibleon.parentcontainer;
                }
            }
            // console.log('- _typeLowerCase: ', _typeLowerCase, field.name);
            switch (_typeLowerCase) {
                case "fullname":
                    delete this.model.validation[field.name + "_fullname_first_name"];
                    delete this.model.validation[field.name + "_fullname_last_name"];
                    break;
                case "address":
                    delete this.model.validation[field.name + "_address_street"];
                    delete this.model.validation[field.name + "_address_city"];
                    delete this.model.validation[field.name + "_address_state"];
                    delete this.model.validation[field.name + "_address_zip"];
                    delete this.model.validation[field.name + "_address_country"];
                    delete this.model.validation[field.name + "_address_street_number"];
                    delete this.model.validation[field.name + "_address_unit_number"];
                    break;
                case "multifiles":
                    delete this.model.validation[field.name + "[]"];
                    break;
                default:
                    // console.log("- that.model.validation:", JSON.stringify(_.keys(that.model.validation)));
                    // console.log('[baseField] delete:', field.name);

                    delete this.model.validation[field.name];
            }
            // Attched Event to these input.
            // var DEBUG = true;

            var _vsbName = field.options.visibleon.name,
                _shouldAttachedTheVSB = true;

            // if (!this._visibleonEventAttached[_vsbName]) {
            //   _shouldAttachedTheVSB = true;
            //   this._visibleonEventAttached[_vsbName] = true;
            // }
            // If should attached Event?
            if (_shouldAttachedTheVSB) {
                if (DEBUG) {
                    console.log(
                        '- Attached "' + field.options.visibleon.name + '", _vsbName = ',
                        _vsbName
                    );
                }
                // If this is a checkbox, will need to append []
                if (DEBUG) {
                    console.log("- fieldsType:", fieldsType);
                }

                var keyStrToCheck = !this.options.mode || this.options.mode !== "read" ?
                    ':input[name="' :
                    'span[id="';

                var _inputNameQ =
                    fieldsType &&
                    fieldsType[_vsbName] &&
                    fieldsType[_vsbName] === "checkbox" ?
                    keyStrToCheck + _vsbName + '[]"]' :
                    keyStrToCheck + _vsbName + '"]';

                if (DEBUG) {
                    console.log("- _inputNameQ:", _inputNameQ);
                }

                var hashLut = _inputNameQ + field.name + that.cid;

                // console.log('[baseField] hashLut:', hashLut, 'that.cid:', that.cid, 'subformViewObj.cid:', subformViewObj.cid);


                var shouldAttachedVisibleOn = true;
                var $visibleOnEl = $(this.el);
                // $visibleOnEl.off('change', _inputNameQ);

                // console.log('[baseField] this.el:', this.el);


                if (this._isListFieldType && this._hasVisibleOn) {
                    // console.log('[baseField] _inputNameQ:', _inputNameQ, 'hashLut:', hashLut);
                    // console.log(arguments);
                    if (!(hashLut in this._visibleOnEvents)) {

                        this._visibleOnEvents[hashLut] = $visibleOnEl;
                        // shouldAttachedVisibleOn = false;
                        // console.log('if - this._visibleOnEvents[_inputNameQ]:', this._visibleOnEvents[_inputNameQ]);
                    } else {
                        this._visibleOnEvents[hashLut].off('change.' + hashLut, _inputNameQ);
                        delete this._visibleOnEvents[hashLut];
                        // console.log('else - this._visibleOnEvents[_inputNameQ]:', this._visibleOnEvents[_inputNameQ]);
                    }
                }

                // console.log('[baseField] shouldAttachedVisibleOn:', shouldAttachedVisibleOn);
                // console.log('[baseField] this:', this);
                // console.log('[baseField] this._isListFieldType:', this._isListFieldType);
                // console.log('[baseField] this._hasVisibleOn:', this._hasVisibleOn);
                // console.log('[baseField] $visibleOnEl:', $visibleOnEl, '_inputNameQ:', _inputNameQ);

                if (shouldAttachedVisibleOn) {
                    // console.log('[baseField] Attached VisibleOn change event:', hashLut);
                    // console.log("- that.model.validation:", JSON.stringify(_.keys(that.model.validation)));

                    // console.log('[baseField] attached change event:', that.cid);

                    var eventNameToAdd = (this._isListFieldType && this._hasVisibleOn) ? '.' + hashLut: '';
                    $visibleOnEl.on("change" + eventNameToAdd, _inputNameQ, function(e) {
                        // console.log('[baseField] Start', _inputNameQ, 'change event fire! _vsbName:', _vsbName, field.name);

                        var DEBUG_VS_ON = false;
                        var debug_keys = [
                            // "HaveYouHadAnyOf",
                            // "OnWhatDateDidYour"
                        ];
                        var _visibleOnName = field.options.visibleon.name;

                        // console.log('[baseField] _visibleOnName:', _visibleOnName);
                        // console.log("- that.model.validation:", JSON.stringify(_.keys(that.model.validation)));

                        if (debug_keys && _.indexOf(debug_keys, _visibleOnName) >= 0) {
                            DEBUG_VS_ON = true;
                            // console.log("_visibleOnName:", _visibleOnName);

                        }
                        var DEBUG_VISIBLE_ON_ONLY = false;
                        if (DEBUG_VS_ON) {
                            console.log(
                                "*** Input [" + _visibleOnName + "] changed ***"
                            );
                        }
                        var $currentTarget = $(e.currentTarget),
                            $container = parentContainer ?
                            $currentTarget.parents(parentContainer) :
                            $currentTarget,
                            $containerOptions,
                            $nextContainer,
                            _addressArray = [],
                            _visibleVal = $currentTarget.val(),
                            _checkBindingArray = ["", "[]"],
                            debug = false;

                        // console.log('$currentTarget:', $currentTarget);


                        if (!$container.length &&
                            parentContainer === field.options.visibleon.parentcontainer
                        ) {
                            $container = $currentTarget
                                .parents(".form-render")
                                .find(parentContainer);
                        }
                        // console.log($currentTarget);
                        // if (field.name === 'ReproducedDataPublication') {
                        //   debug = true;
                        // }
                        // if (debug) {
                        //   console.log($container);
                        // }
                        var _currentInputName = $currentTarget.attr("name");

                        if (!_currentInputName) {
                            if (DEBUG_VS_ON) {
                                console.log('[x] No attribute by "Name", get by "ID"');
                                console.log("- _visibleVal:", _visibleVal, typeof _visibleVal);
                            }
                            _currentInputName = $currentTarget.attr("id");

                            if (!_visibleVal) {
                                if (DEBUG_VS_ON) {
                                    console.log("[x] There is no value to get, try get as html");
                                }

                                _visibleVal = $currentTarget.text();
                                if (!_visibleVal) {
                                    _visibleVal = $currentTarget.html();
                                }
                            }
                        }

                        if (DEBUG_VS_ON) {
                            console.log("- _currentInputName:", _currentInputName);
                        }

                        // _currentInputName = 'lol_lol';
                        var _hasBracket = _currentInputName.match(/\w+\[\]$/gi);
                        var _visibleValInArray =
                            field.options.visibleon.values === _visibleVal;
                        if (_.isArray(field.options.visibleon.values)) {
                            _visibleValInArray = _.find(
                                field.options.visibleon.values,
                                function(value) {
                                    if (DEBUG_VS_ON) {
                                        console.log(
                                            "- value:",
                                            value,
                                            ", _visibleVal:",
                                            _visibleVal,
                                            ", result = ",
                                            value === _visibleVal
                                        );
                                    }
                                    return value === _visibleVal;
                                }
                            );
                            // console.log('- _visibleValInArray:', _visibleValInArray);
                        }
                        if (_hasBracket && _hasBracket.length) {
                            _hasBracket = true;
                        }
                        if (DEBUG_VS_ON) {
                            console.log("");
                            console.log("- _visibleOnName:", _visibleOnName);
                            console.log("- $currentTarget:", $currentTarget);
                            console.log("- _currentInputName:", _currentInputName);
                            console.log("- _hasBracket:", _hasBracket);
                            // console.log('- $container:', $container);
                            console.log("- _visibleVal:", _visibleVal);
                            console.log(
                                "- field.options.visibleon.values:",
                                field.options.visibleon.values
                            );
                            console.log("- _visibleValInArray:", _visibleValInArray);
                            console.log("");
                        }
                        if (_hasBracket) {
                            var _isCurrentTargetChecked = $currentTarget.is(":checked");
                            $currentTarget
                                .closest(".checkbox-container")
                                .find(":checkbox:checked")
                                .each(function(el) {
                                    var _checkedVal = $(this).val();
                                    if (DEBUG_VS_ON) {
                                        console.log("- _checkedVal:", _checkedVal);
                                    }
                                    if (!_isCurrentTargetChecked && _visibleVal === _checkedVal) {
                                        _visibleVal = null;
                                        if (DEBUG_VS_ON) {
                                            console.log("- Set _visibleVal to :", _visibleVal);
                                        }
                                        return;
                                    }
                                    if (
                                        _visibleVal !== _checkedVal &&
                                        _.indexOf(field.options.visibleon.values, _checkedVal) > -1
                                    ) {
                                        _visibleVal = _checkedVal;
                                    }
                                });
                            if (!_isCurrentTargetChecked &&
                                _visibleVal === $currentTarget.val()
                            ) {
                                _visibleVal = null;
                            }
                            if (DEBUG_VS_ON) {
                                console.log("- _visibleVal:", _visibleVal);
                            }
                            // var DEBUG_VS_ON = false;
                        } else if (_visibleOnName.match(/\[\]$/gi)) {
                            if (!$container.length) {
                                $container = $currentTarget.closest(".checkbox-container");
                            }
                            _visibleOnName = _visibleOnName.substr(
                                0,
                                _visibleOnName.length - 2
                            );
                            $container = $container.closest(".checkbox-container");
                            if (DEBUG_VS_ON) {
                                console.log(
                                    "- this is checkbox?",
                                    $currentTarget.is(":checkbox")
                                );
                            }
                            if ($currentTarget.is(":checkbox")) {
                                _visibleVal = "";
                                $container.find(":checkbox:checked").each(function() {
                                    var _checkedVal = $(this).val();
                                    if (
                                        _.indexOf(field.options.visibleon.values, _checkedVal) > -1
                                    ) {
                                        _visibleVal = _checkedVal;
                                    }
                                });
                            }
                        } else if ($currentTarget.is(":radio") && !parentContainer) {
                            // console.log('[x] Radio Found in VisibleOn.');
                            // console.log(_visibleVal);
                            // console.log($currentTarget);
                            $container = $currentTarget.closest(".radio-container");
                        }
                        if (DEBUG_VS_ON) {
                            console.log("- $container:", $container);
                            console.log("- field.options.visibleon:", field.options.visibleon);
                            console.log("- _visibleVal:", _visibleVal);
                        }
                        // Added: Steps to Validate Logic
                        var isValidSteps = true;
                        if (field && field.options && field.options.visibleon) {
                            // debugger;
                            if (field.options.visibleon.steps) {
                                if (!_.isArray(field.options.visibleon.steps) ||
                                    !field.options.visibleon.steps.length
                                ) {
                                    throw new Error(
                                        field.name + " must not contain an empty VisibleOn.Steps"
                                    );
                                }
                                // var DEBUG = true;
                                var _steps = field.options.visibleon.steps;
                                if (DEBUG) {
                                    console.log("[*] Debug: VisibleOn with Steps");
                                    // console.log(that);
                                    console.log(_visibleVal);
                                    console.log(field.name);
                                    console.log(_steps);
                                }
                                for (var i = 0; i < _steps.length; i++) {
                                    var _currentStep = _steps[i];
                                    var _stepValues = _currentStep.values;
                                    if (!_stepValues || !_.isArray(_stepValues)) {
                                        var _tempError =
                                            typeof JSON !== "undefined" && JSON && JSON.stringify ?
                                            JSON.stringify(_currentStep) :
                                            null;
                                        throw new Error(
                                            'Expects an array for "Values" in "' + _tempError + '"'
                                        );
                                    }
                                    var $stepTargetValue = $(
                                        ':input[name="' + _currentStep.name + '"]'
                                    );
                                    var _stepVal = $.trim($stepTargetValue.val());
                                    var _inArray = _.indexOf(_stepValues, _stepVal);
                                    var _stepResult = _currentStep.notin ?
                                        _inArray < 0 :
                                        _inArray > -1;
                                    if (DEBUG) {
                                        console.log("[*] Step: " + i);
                                        console.log($stepTargetValue);
                                        console.log(_currentStep);
                                        console.log(_stepVal);
                                        console.log(_stepValues);
                                        console.log(_inArray);
                                        console.log(_stepResult);
                                    }
                                    if (!_stepResult) {
                                        isValidSteps = false;
                                        break;
                                    }
                                }
                            } else if (
                                field.options.visibleon.notin &&
                                field.options.visibleon.values
                            ) {
                                var DEBUG_NOTIN = false;
                                var $stepTargetValue = $(
                                    ':input[name="' + field.options.visibleon.name + '"]'
                                );
                                var _stepVal = $.trim($stepTargetValue.val());
                                var _inArray = _.indexOf(
                                    field.options.visibleon.values,
                                    _stepVal
                                );
                                var _stepResult = field.options.visibleon.notin ?
                                    _inArray < 0 :
                                    _inArray > -1;
                                if (!_stepResult) {
                                    isValidSteps = false;
                                }
                                if (DEBUG_NOTIN) {
                                    console.log("- $stepTargetValue:", $stepTargetValue);
                                    console.log("- _stepVal:", _stepVal);
                                    console.log("- _inArray:", _inArray);
                                    console.log("- _stepResult", _stepResult);
                                    console.log("- isValidSteps", isValidSteps);
                                }
                            }
                        }
                        if (DEBUG_VS_ON) {
                            console.log(
                                "- field.options.visibleon.values:",
                                field.options.visibleon.values
                            );
                            console.log("- _visibleVal:", _visibleVal);
                            console.log("- isValidSteps:", isValidSteps);
                        }
                        // isValidSteps: This is the variabled that determined if the VisibleOn show
                        if (
                            (!field.options.visibleon.notin &&
                                _.indexOf(field.options.visibleon.values, _visibleVal) > -1 &&
                                isValidSteps) ||
                            (field.options.visibleon.notin && isValidSteps)
                        ) {
                            if (DEBUG_VS_ON) {
                                console.log(
                                    "[x] Match Value with VisibleOn, will render [" +
                                    field.name +
                                    "]."
                                );
                                console.log($currentTarget);
                                console.log("- htmlTmpl");
                                console.log(htmlTmpl);
                                console.log(
                                    "- length:",
                                    $(".options-visible-on-" + field.name, that.el).length
                                );
                            }
                            // Insert this into markup
                            if ($(".options-visible-on-" + field.name, that.el).length < 1) {
                                if (DEBUG_VS_ON) {
                                    console.log("- $container:", $container);
                                }
                                $container.after(htmlTmpl);
                                // console.log(htmlTmpl);
                                // if (debug) {
                                //   console.log($container);
                                // }
                                if (DEBUG_VS_ON) {
                                    console.log($container);
                                }
                                $containerOptions = $container
                                    .next(".options-visible-on-" + field.name)
                                    .fadeIn("slow", function() {
                                        // console.log('[baseField] Render VisibleOn for "' + field.name + '" *****');
                                        var $_element = $(this)
                                            .addClass("visible-parent-" + _visibleOnName)
                                            .attr("data-parent", _visibleOnName);
                                        // If this is select might have select2
                                        Utils.setupSelect2($_element);
                                        // Remove the class that not belong to this visibleOn
                                        var $parent = $(
                                            ".options-visible-on-" + _visibleOnName,
                                            that.el
                                        );
                                        // Caution: this can cause the previous markup to disappear.
                                        // Fix in Release 0.1.0
                                        $('[class*="visible-parent-' + _visibleOnName + '"]', that.el)
                                            .not(
                                                ".visible-parent-" +
                                                _visibleOnName +
                                                ",.options-visible-on-" +
                                                _visibleOnName +
                                                ",.visible-parent-" +
                                                $parent.attr("data-parent")
                                            )
                                            .remove();
                                        if (_typeLowerCase === "multifiles") {
                                            $("#" + field.name + "_multifiles_wrapper", this).trigger(
                                                "visibleOnRenderComplete"
                                            );
                                        } else {
                                            $(':input[name="' + field.name + '"]', this).trigger(
                                                "visibleOnRenderComplete"
                                            );
                                        }
                                        // Need to rebind the ModelBinder
                                        // console.log('[baseField] that.model.notBinding:', that.model.notBinding);

                                        // console.log('[baseField] that.model.bindings[field.name]:', that.model.bindings[field.name]);

                                        if (!that.model.bindings[field.name] &&
                                            _.indexOf(that.model.notBinding, field.name) < 0
                                        ) {
                                            var _bindingName = field.name;
                                            // console.log('try to rebind:', _bindingName);

                                            _.each(_checkBindingArray, function(_suffix) {
                                                if (_bindingName !== field.name) {
                                                    return;
                                                }
                                                if (
                                                    $(':input[name="' + _bindingName + _suffix + '"]')
                                                    .length
                                                ) {
                                                    _bindingName = field.name + _suffix;
                                                }
                                            });

                                            // console.log('found rebind name:', _bindingName, '_typeLowerCase:', _typeLowerCase);

                                            var $targetFoundInputBinding = $(':input[name="' + _bindingName + '"]');

                                            // console.log('$targetFoundInputBinding:', $targetFoundInputBinding);
                                            // console.log('that:', that);


                                            if (
                                                $targetFoundInputBinding.length &&
                                                _typeLowerCase !== "checkbox"
                                            ) {
                                                // console.log('[x] Binding Values');
                                                // console.log(that.model.bindings);
                                                that.model.bindModelBinder(_bindingName, field.type);
                                                // console.log(that.model.bindings);
                                                // console.log('*** Before Binding for ' + _bindingName + ', Type: ' + field.type + ' Lowercase: ' + _typeLowerCase + ' ***');
                                                // console.log('that.model:', that.model);
                                                // console.log('that.el:', that.el);
                                                // console.log('that.cid:', that.cid);
                                                // console.log('subformViewObj.el:', subformViewObj.el);
                                                // console.log('subformViewObj.cid:', subformViewObj.cid);

                                                // console.log(
                                                //     "that.model.bindings:",
                                                //     that.model.bindings
                                                // );

                                                // console.log('[baseField] that._modelBinder.bind <-------------', _bindingName, field.type);
                                                // console.log('[baseField] that.model:', that.model);
                                                // console.log('[baseField] that.model.validation:', JSON.stringify(_.keys(that.model.validation)));

                                                that._modelBinder.bind(
                                                    that.model,
                                                    that.el,
                                                    that.model.bindings
                                                );
                                                // console.log(that.model.bindings);
                                                // console.log('***');
                                            }
                                        }
                                    });
                                // Some browser that still not support the placeholder
                                $nextContainer = $container.next("div");
                                if ($nextContainer.length === 0) {
                                    $nextContainer = $container.parent();
                                }
                                // DEBUG_VS_ON = "OnWhatDateDidYour" === field.name;
                                $nextContainer
                                    .find(":input")
                                    .not('input[type="hidden"]')
                                    .placeholder();

                                // var DEBUG_VS_ON = true;
                                if (DEBUG_VS_ON) {
                                    console.log("***** " + field.name + " *****");
                                    console.log("- _typeLowerCase:", _typeLowerCase);
                                    console.log("- that.model.validation:", that.model.validation);
                                }
                                // VisibleOn Debug Location for mapping field value
                                // Adding Validation Scheme, if has one
                                if (_typeLowerCase === "fullname") {
                                    var _full_name_key = field.name + "_fullname_first_name";
                                    if (that.options.formSchema.validation[_full_name_key]) {
                                        that.model.validation[_full_name_key] =
                                            that.options.formSchema.validation[_full_name_key];
                                    }
                                    _addressArray.push(_full_name_key);
                                    _full_name_key = field.name + "_fullname_last_name";
                                    if (that.options.formSchema.validation[_full_name_key]) {
                                        that.model.validation[_full_name_key] =
                                            that.options.formSchema.validation[_full_name_key];
                                    }
                                    _addressArray.push(_full_name_key);
                                } else if (_typeLowerCase === "address") {
                                    var _address_name = field.name + "_address_street";
                                    if (that.options.formSchema.validation[_address_name]) {
                                        that.model.validation[_address_name] =
                                            that.options.formSchema.validation[_address_name];
                                    }
                                    _addressArray.push(_address_name);
                                    _address_name = field.name + "_address_city";
                                    if (that.options.formSchema.validation[_address_name]) {
                                        that.model.validation[_address_name] =
                                            that.options.formSchema.validation[_address_name];
                                    }
                                    _addressArray.push(_address_name);
                                    _address_name = field.name + "_address_state";
                                    if (that.options.formSchema.validation[_address_name]) {
                                        that.model.validation[_address_name] =
                                            that.options.formSchema.validation[_address_name];
                                    }
                                    _addressArray.push(_address_name);
                                    _address_name = field.name + "_address_zip";
                                    if (that.options.formSchema.validation[_address_name]) {
                                        that.model.validation[_address_name] =
                                            that.options.formSchema.validation[_address_name];
                                    }
                                    _addressArray.push(_address_name);
                                    _address_name = field.name + "_address_country";
                                    if (that.options.formSchema.validation[_address_name]) {
                                        that.model.validation[_address_name] =
                                            that.options.formSchema.validation[_address_name];
                                    }
                                    _addressArray.push(_address_name);
                                    _address_name = field.name + "_address_street_number";
                                    if (that.options.formSchema.validation[_address_name]) {
                                        that.model.validation[_address_name] =
                                            that.options.formSchema.validation[_address_name];
                                    }
                                    _addressArray.push(_address_name);
                                    _address_name = field.name + "_address_unit_number";
                                    if (that.options.formSchema.validation[_address_name]) {
                                        that.model.validation[_address_name] =
                                            that.options.formSchema.validation[_address_name];
                                    }
                                    _addressArray.push(_address_name);
                                    if (field.options.hidecountry) {
                                        that.model.set(_address_name, "US");
                                    }
                                } else if (
                                    that.options.formSchema.validation[field.name] &&
                                    _typeLowerCase !== "html"
                                ) {
                                    that.model.validation[field.name] =
                                        that.options.formSchema.validation[field.name];
                                    _addressArray.push(field.name);
                                } else if (
                                    that.options.formSchema.validation[field.name + "[]"]
                                ) {
                                    that.model.validation[field.name + "[]"] =
                                        that.options.formSchema.validation[field.name + "[]"];
                                    _addressArray.push(field.name + "[]");
                                }
                                if (DEBUG_VS_ON) {
                                    console.log('that.model.validation:', that.model.validation);

                                    console.log(
                                        "that.options.mode:",
                                        that.options.mode
                                    );
                                }
                                if (that.options.mode === "update" && _addressArray.length > 0) {
                                    _.each(_addressArray, function(element) {
                                        if (that.options.formData.fields[element]) {
                                            // Need to set default value to the model
                                            that.model.set(
                                                element,
                                                that.options.formData.fields[element]
                                            );
                                            var $inputTmp = $(
                                                ':input[name="' + element + '"]',
                                                $containerOptions
                                            );
                                            // console.log('*** Checked ***');
                                            // console.log($inputTmp);
                                            switch (_typeLowerCase) {
                                                case "radio":
                                                case "check":
                                                case "checkbox":
                                                    $inputTmp
                                                        .filter(
                                                            '[value="' +
                                                            that.options.formData.fields[element] +
                                                            '"]'
                                                        )
                                                        .prop("checked", true);
                                                    break;
                                                default:
                                                    if (!($inputTmp.is(":radio") || $inputTmp.is(":checkbox"))) {
                                                        $inputTmp.val(that.options.formData.fields[element]);
                                                    }
                                            }
                                            // console.log($inputTmp);
                                        }
                                    });
                                } else if (that.options.mode === "update") {
                                    // var DEBUG = true;
                                    if (DEBUG) {
                                        console.log("- Check for Field. " + field.name);
                                        console.log(field.name);
                                        console.log(that.options.formData.fields);
                                    }
                                    if (DEBUG) {
                                        console.log("Current Type: ", _typeLowerCase);
                                    }
                                    switch (_typeLowerCase) {
                                        case "fullname":
                                            _.each(
                                                [
                                                    "_fullname_first_name",
                                                    "_fullname_middle_name",
                                                    "_fullname_last_name"
                                                ],
                                                function(append) {
                                                    var tKey = field.name + append;
                                                    var $inputTmp = $(
                                                        ':input[name="' + tKey + '"]',
                                                        $containerOptions
                                                    );
                                                    if (
                                                        $inputTmp.length &&
                                                        that.options.formData.fields[tKey]
                                                    ) {
                                                        $inputTmp.val(that.options.formData.fields[tKey]);
                                                    }
                                                }
                                            );
                                            break;
                                        default:
                                            if (that.options.formData.fields[field.name]) {
                                                var $inputTmp = $(
                                                    ':input[name="' + field.name + '"]',
                                                    $containerOptions
                                                );
                                                // console.log('*** Checked [' + field.name + '] ***');
                                                // console.log(that.options.formData.fields[field.name]);
                                                if ($inputTmp.is(":radio") || $inputTmp.is(":checkbox")) {
                                                    // console.log($inputTmp);
                                                    // console.log(that.model.get(field.name));
                                                    // if (!_.isObject(that.options.formData.fields[field.name])) {
                                                    //   $inputTmp.filter('[value="' + that.options.formData.fields[field.name] + '"]').prop('checked', true);
                                                    // }
                                                } else {
                                                    // console.log('field.name:', field.name);

                                                    $inputTmp.val(that.options.formData.fields[field.name]);
                                                    that.model.set(
                                                        field.name,
                                                        that.options.formData.fields[field.name]
                                                    );
                                                }
                                                // console.log($inputTmp);
                                            }
                                    }
                                }
                                // Check to see if this has UserId Field Type
                                if (_typeLowerCase === "userid") {
                                    Utils.setupUserIdAjaxCall($("form.form-render"));
                                    if (!that.model.validation[field.name].pattern &&
                                        !(
                                            field.options.render &&
                                            field.options.render.toLowerCase() === "select"
                                        )
                                    ) {
                                        that.model.validation[field.name].pattern = "email";
                                    }
                                }
                                Utils.setupUrlAjaxCall(
                                    $("form.form-render"),
                                    $("#" + field.name)
                                );
                                // If there are DatePicker
                                // var DEBUG = true;
                                if (that._hasDate) {
                                    if (DEBUG || DEBUG_VS_ON) {
                                        console.log(
                                            "[*] baseField.setupVisibleOn - _hasDate"
                                        );
                                        console.log(that.el);
                                        console.log(that.$el);
                                    }
                                    Utils.setupDateInput(
                                        that.el,
                                        that,
                                        DEBUG_VS_ON
                                    );
                                    // if ("OnWhatDateDidYour" === field.name) {
                                    //     debugger;
                                    // }
                                }
                                if (that._hasTime) {
                                    if (DEBUG || DEBUG_VS_ON) {
                                        console.log(
                                            "[*] baseField.setupVisibleOn - _hasTime"
                                        );
                                        console.log(that.el);
                                        console.log(that.$el);
                                    }
                                    Utils.setupTimeInput(that.el, that);
                                }
                                // Adding Birth Date Binder
                                if (
                                    that._hasBDate &&
                                    field &&
                                    field.type &&
                                    field.options &&
                                    field.options.render
                                ) {
                                    if (field.type.toLowerCase() === "date") {
                                        var _dateRenderVisibleOn = field.options.render;
                                        try {
                                            _dateRenderVisibleOn = _dateRenderVisibleOn.toLowerCase();
                                            var currentBDateClass = ".options-visible-on-" + field.name;
                                            if (typeof that.el === "string") {
                                                currentBDateClass = that.el + " " + currentBDateClass;
                                            }
                                            switch (_dateRenderVisibleOn) {
                                                case "select":
                                                    Utils.setupBDateInput(currentBDateClass, that.model);
                                                    break;
                                            }
                                        } catch (err) {
                                            if (console && console.error) {
                                                console.error(err);
                                            }
                                        }
                                    }
                                }
                                // If this is Radio, will need to do magic work by set the value that match with Model
                                // var modelVal = that.model.get(field.name);
                                // if (_typeLowerCase === 'radio' && that.options.mode === 'update' && modelVal) {
                                //   console.log('*** Check Model and Input Value: ' + field.name + ' ***');
                                //   console.log(modelVal);
                                //   var currentRadios = $(':input[name="' + field.name + '"]', $containerOptions);
                                //   console.log(currentRadios);
                                // }

                                // var DEBUG_VISIBLE_ON_ONLY = true;
                                // Check for Validation
                                if (DEBUG_VISIBLE_ON_ONLY) {
                                    console.log("[baseField] Check for Validation [insert element]");
                                    // console.log(that);
                                    // console.log('[baseField]', JSON.stringify(that.model.validation));
                                    console.log('[baseField]', field.name, JSON.stringify(_.keys(that.model.validation)));
                                    // console.log('[baseField] that._isListFieldType:', that._isListFieldType);
                                    // console.log('[baseField] that._hasVisibleOn:', that._hasVisibleOn);
                                }

                                if (that._isListFieldType && that._hasVisibleOn) {
                                    if (false && DEBUG_VISIBLE_ON_ONLY) {
                                        console.log('[baseField] Called Backbone.Validation.bind: <------------------------');

                                    }
                                    // that._modelBinder.bind(that.model, that.el, that.model.bindings);
                                    // Backbone.Validation.bind(that, {
                                    //     forceUpdate: true
                                    // });
                                }
                            }
                        } else {
                            // console.log('[baseField] (Start) that.model.validation:', field.name, JSON.stringify(_.keys(that.model.validation)));

                            // Trigger Event to let other objects know that this fields will go out of markup
                            // console.log('[x] Remove VisibleOn from Markup for "' + field.name + '" ' + _typeLowerCase);
                            var $removeVisibleOnElement = $("#" + field.name, that.el);
                            if ($removeVisibleOnElement && $removeVisibleOnElement.length) {
                                if ($removeVisibleOnElement.val()) {
                                    $removeVisibleOnElement.val("").trigger("change");
                                }
                            }
                            // console.log($removeVisibleOnElement);
                            // console.log($removeVisibleOnElement.val());
                            // console.log(that.model.get(field.name));
                            $removeVisibleOnElement.trigger("removeVisibleOn");
                            // Remove this out of the markup
                            $(".options-visible-on-" + field.name, that.el).remove();
                            // Need to remove the "visible-parent-{name}"

                            // console.log("_typeLowerCase:", _typeLowerCase);

                            $(".visible-parent-" + field.name, that.el).remove();
                            if (
                                _typeLowerCase === "date" &&
                                field.options &&
                                field.options.render
                            ) {
                                var _dateRenderNotVisibleOn = field.options.render;
                                try {
                                    _dateRenderNotVisibleOn = _dateRenderNotVisibleOn.toLowerCase();
                                    switch (_dateRenderNotVisibleOn) {
                                        case "select":
                                            var _bdate_select_remove_name = field.name + "_birth";
                                            if (typeof _ === "undefined" || !_) {
                                                if (console && console.error) {
                                                    console.error('Could not be able to locate "_".');
                                                }
                                            } else {
                                                // console.log(_bdate_select_remove_name);
                                                // console.log(that.model.validation);
                                                _.map(["day", "month", "year"], function(_val) {
                                                    var _currentKey =
                                                        _bdate_select_remove_name + "[" + _val + "]";
                                                    if (that.model.validation[_currentKey]) {
                                                        delete that.model.validation[_currentKey];
                                                    }
                                                });
                                                if (that.model.validation[field.name]) {
                                                    delete that.model.validation[field.name];
                                                }
                                            }
                                            break;
                                        default:
                                            throw new Error(
                                                'Not implement delete for "' +
                                                _dateRenderNotVisibleOn +
                                                '"'
                                            );
                                    }
                                } catch (err) {
                                    if (console && console.error) {
                                        console.error(err);
                                    }
                                }
                            } else if (_typeLowerCase === "fullname") {
                                _.map(["_fullname_first_name", "_fullname_last_name"], function(
                                    _val
                                ) {
                                    var _currentKey = field.name + _val;
                                    if (that.model.validation[_currentKey]) {
                                        delete that.model.validation[_currentKey];
                                    }
                                });
                            } else if (_typeLowerCase === "address") {
                                var _address_name = field.name + "_address_street";
                                that.model.set(_address_name, "");
                                if (that.options.formSchema.validation[_address_name]) {
                                    that.model.validation[_address_name] =
                                        that.options.formSchema.validation[_address_name];
                                    delete that.model.validation[_address_name];
                                }
                                _address_name = field.name + "_address_city";
                                that.model.set(_address_name, "");
                                if (that.options.formSchema.validation[_address_name]) {
                                    that.model.validation[_address_name] =
                                        that.options.formSchema.validation[_address_name];
                                    delete that.model.validation[_address_name];
                                }
                                _address_name = field.name + "_address_state";
                                that.model.set(_address_name, "");
                                if (that.options.formSchema.validation[_address_name]) {
                                    that.model.validation[_address_name] =
                                        that.options.formSchema.validation[_address_name];
                                    delete that.model.validation[_address_name];
                                }
                                _address_name = field.name + "_address_zip";
                                that.model.set(_address_name, "");
                                if (that.options.formSchema.validation[_address_name]) {
                                    that.model.validation[_address_name] =
                                        that.options.formSchema.validation[_address_name];
                                    delete that.model.validation[_address_name];
                                }
                                _address_name = field.name + "_address_country";
                                that.model.set(_address_name, "");
                                if (that.options.formSchema.validation[_address_name]) {
                                    that.model.validation[_address_name] =
                                        that.options.formSchema.validation[_address_name];
                                    delete that.model.validation[_address_name];
                                }
                                _address_name = field.name + "_address_street_number";
                                that.model.set(_address_name, "");
                                if (that.options.formSchema.validation[_address_name]) {
                                    that.model.validation[_address_name] =
                                        that.options.formSchema.validation[_address_name];
                                    delete that.model.validation[_address_name];
                                }
                                _address_name = field.name + "_address_unit_number";
                                that.model.set(_address_name, "");
                                if (that.options.formSchema.validation[_address_name]) {
                                    that.model.validation[_address_name] =
                                        that.options.formSchema.validation[_address_name];
                                    delete that.model.validation[_address_name];
                                }
                            } else if (_typeLowerCase !== "html") {
                                // console.log("_typeLowerCase:", _typeLowerCase);

                                // console.log('[*] Model values for "' + field.name + '"');
                                // console.log(that.model.get(field.name));
                                that.model.set(field.name, "");
                                // console.log(that.model.get(field.name));
                                // console.log(that.model.toJSON());
                                // console.log('that.model.validation:', JSON.stringify(_.keys(that.model.validation)));
                                if (that.model.validation[field.name]) {
                                    // console.log('[baseField] remove validation:', field.name);

                                    // Remove Validation Scheme, if has one
                                    delete that.model.validation[field.name];
                                } else if (that.model.validation[field.name + "[]"]) {
                                    // console.log('[baseField] remove validation:', field.name);
                                    delete that.model.validation[field.name + "[]"];
                                }
                                // Need to unbind the ModelBinder
                                var _bindingName = field.name;
                                // console.log('[baseField] _checkBindingArray:', _bindingName, _checkBindingArray);

                                _.each(_checkBindingArray, function(_suffix) {
                                    // if (_.indexOf(_.keys(that.model.validation), 'ContactTelephone') < 0) {
                                    //     debugger;
                                    // }
                                    // console.log('[baseField] _.keys(that.model.validation):', _.keys(that.model.validation));

                                    if (that.model.bindings[_bindingName + _suffix]) {
                                        // console.log('[baseField] unbindModelBinder');

                                        that.model.unbindModelBinder(
                                            _bindingName + _suffix,
                                            field.type
                                        );
                                        var _vsNotGood = true;
                                        while (_vsNotGood) {
                                            try {
                                                that._modelBinder.bind(
                                                    that.model,
                                                    that.el,
                                                    that.model.bindings
                                                );
                                                _vsNotGood = false;
                                            } catch (err) {
                                                _vsNotGood = false;
                                                // Need to parse the name
                                                // Bad binding found. No elements returned for binding selector [name="SpecialAccommodationRequest"]
                                                var _needToRemove = err.match(/name="(\w+)"/i);
                                                // console.log('[baseField] _needToRemove:', _needToRemove);

                                                if (!_needToRemove) {
                                                    if (console && console.error) {
                                                        console.error(err);
                                                    }
                                                }
                                                if (_needToRemove.length === 2) {
                                                    var _targetName = _needToRemove[1];
                                                    // console.log('[baseFields] that.model.validation:', JSON.stringify(_.keys(that.model.validation)));

                                                    _.each(_checkBindingArray, function(_s) {
                                                        if (that.model.bindings[_targetName + _s]) {
                                                            that.model.unbindModelBinder(
                                                                _targetName + _s,
                                                                field.type
                                                            );
                                                            if (that.model.validation[_targetName + _s]) {
                                                                // console.log('[baseField] remove validation:', _targetName + _s);

                                                                delete that.model.validation[_targetName + _s];
                                                            }
                                                            _vsNotGood = true;
                                                        }
                                                    });
                                                    // console.log('[baseFields] that.model.validation:', JSON.stringify(_.keys(that.model.validation)));
                                                }
                                            }
                                        }
                                        // For Checkbox, this caused the value to be set to empty string.
                                        if (!$currentTarget.is(":checkbox")) {
                                            var _currentTargetName = $currentTarget.attr("name");
                                            // Check the Model Value
                                            // console.log('[x] Set Value for "' + _currentTargetName + '"" with "' + _visibleVal + '"');
                                            // console.log($currentTarget);
                                            if (!$currentTarget.is(":radio")) {
                                                $currentTarget.val(_visibleVal);
                                            }
                                            if (that.model.get(_currentTargetName) !== _visibleVal) {
                                                // console.log('[*] Model value for "' + _currentTargetName + '" before, ' + that.model.get(_currentTargetName));
                                                that.model.set(_currentTargetName, _visibleVal);
                                                // console.log('[*] Model value for "' + _currentTargetName + '" after, ' + that.model.get(_currentTargetName));
                                            }
                                        }
                                    }
                                });
                                if ($currentTarget.is(":radio")) {
                                    $currentTarget.prop("checked", true);
                                }
                            }
                            // var DEBUG_VISIBLE_ON_ONLY = true;
                            // Check for Validation
                            if (DEBUG_VISIBLE_ON_ONLY) {
                                console.log("[baseField] on change ended", field.name, hashLut);
                                // console.log(that);
                                // console.log('[baseField]', JSON.stringify(that.model.validation));
                                console.log('[baseField]', field.name, JSON.stringify(_.keys(that.model.validation)));
                                // console.log('[baseField] that._isListFieldType:', that._isListFieldType);
                                // console.log('[baseField] that._hasVisibleOn:', that._hasVisibleOn);
                            }
                            if (that._isListFieldType && that._hasVisibleOn) {
                                if (false && DEBUG_VISIBLE_ON_ONLY) {
                                    console.log('[baseField] Called Backbone.Validation.bind: <------------------------');
                                }
                                // that._modelBinder.bind(that.model, that.el, that.model.bindings);
                                // Backbone.Validation.bind(that, {
                                //     forceUpdate: true
                                // });
                            }
                        }
                    });
                }

                // First Time to Fired for Update Mode
                if (DEBUG) {
                    console.log(
                        "- about to assigned: functionToExecute!",
                        this.options.mode
                    );
                }
                if (this && this.options && this.options.mode) {
                    var $targetFormContainer = $("#" + this.options.formSchema.name);
                    var functionToExecute = null;
                    switch (this.options.mode) {
                        case "update":
                            functionToExecute = function() {
                                if (field && field.options && field.options.visibleon) {
                                    _.forEach(field.options.visibleon.values, function(v) {
                                        var $inputs = $(_inputNameQ).filter(":checkbox:checked");
                                        $inputs.each(function() {
                                            var $this = $(this);
                                            var value = $this.val();
                                            // console.log(value);
                                            if (v === value) {
                                                $this.trigger("change");
                                            }
                                        });
                                    });
                                }
                            };
                            break;
                        case "read":
                            functionToExecute = function() {
                                var $readField = $(_inputNameQ);
                                if (DEBUG) {
                                    console.log(
                                        "- _inputNameQ: about to trigger change",
                                        _inputNameQ,
                                        $readField
                                    );
                                }
                                $readField.trigger("change");
                            };
                            break;
                    }

                    if (functionToExecute && typeof functionToExecute === "function") {

                        if (DEBUG) {
                            console.log("- about to add renderCompleted event!");
                        }
                        $targetFormContainer.on(
                            this.options.formSchema.name + ".renderCompleted",
                            functionToExecute
                        );
                    }
                }
            }
        },
        /**
         * Setup Copy Values From Options
         **/
        setupCopyValuesFrom: function(field) {
            if (field.type.toLowerCase() === "list") {
                // Not support for List Type
                return;
            }
            if (!field.options.copyvaluesfrom.name ||
                !field.options.copyvaluesfrom.description
            ) {
                throw "In order to use CopyValuesFrom options, need to have Name and Description";
            }
            var that = this,
                _html = "";
            _html +=
                '<div class="copy-values-from ' +
                field.options.copyvaluesfrom.name +
                '">' +
                this.inputTemplate["buttongroup"]({
                    description: field.options.copyvaluesfrom.description
                }) +
                "</div>";
            $(this.el).on(
                "click",
                ".copy-values-from." +
                field.options.copyvaluesfrom.name +
                " .btn-group button",
                function(e) {
                    var $currentTarget = $(e.currentTarget),
                        _fields,
                        _currentFields,
                        _values = [];
                    if ($currentTarget.hasClass("btn-yes")) {
                        _fields = Utils.getSpecialFieldsName(
                            field.options.copyvaluesfrom.name,
                            field.type
                        );
                        _.each(_fields, function(element) {
                            _values.push($(':input[name="' + element + '"]', that.el).val());
                        });
                        _currentFields = Utils.getSpecialFieldsName(field.name, field.type);
                        Utils.setFieldsValues(that.el, that.model, _currentFields, _values);
                    } else {
                        // If user click "No", will do nothing
                        // _currentFields = Utils.getSpecialFieldsName(field.name, field.type);
                        // Utils.setFieldsValues(that.el, that.model, _currentFields);
                    }
                }
            );
            return _html;
        },
        /**
         * Function to take care Select and Checkbox order by
         * @param  object field
         * @return
         */
        sortOrderBy: function(field) {
            var _orderBy = field.options.orderby,
                _func;
            if (!_orderBy && !field.values) {
                return;
            }
            _orderBy = _orderBy.toLowerCase();
            switch (_orderBy) {
                // Always alphabetical
                default: _func = function(a, b) {
                    return a.localeCompare(b);
                };
            }
            if (field.values.sort) {
                field.values.sort(_func);
            }
        },
        /**
         * Append Data to _elementData
         * @param string fieldName
         * @param object dataKey
         * @param object dataValue
         */
        addDataToElementData: function(fieldName, dataKey, dataValue) {
            if (!this._elementData[fieldName]) {
                this._elementData[fieldName] = {};
            }
            this._elementData[fieldName][dataKey] = dataValue;
        },
        /**
         * Generate HTML Mark Up for Update on Read Mode
         * @param  object field
         * @return string
         */
        generateMarkUpForUpdateOnReadMode: function(field) {
            if (!field.type) {
                if (console && console.warn) {
                    console.warn(
                        '[x] generateMarkUpForUpdateOnReadMode for "' +
                        field.name +
                        '" could not be able to find "Type".'
                    );
                }
                return "";
            }
            var DEBUG = false,
                _type = field.type.trim().toLowerCase(),
                _data = this.options.formData.fields[field.name],
                _html,
                _typeHtml;
            if (DEBUG) {
                console.debug("[*] UpdateOnReadMode");
                console.debug("     Name: " + field.name);
                console.debug("     Value: " + _data);
            }
            // Format Input as HTML markup
            switch (_type) {
                case "file":
                    throw "Not yet support!";
                default:
                    _typeHtml = "text";
            }
            // Perform Set Mark Up for Input
            switch (_type) {
                case "radio":
                    _html = UPDATE_ON_READ_TEMPLATE["default-input-radio"](
                        _.extend({
                                data: _data
                            },
                            field
                        )
                    );
                    break;
                case "textarea":
                    _html = UPDATE_ON_READ_TEMPLATE["default-input-textarea"](
                        _.extend({
                                data: _data
                            },
                            field
                        )
                    );
                    break;
                case "date":
                    _html = UPDATE_ON_READ_TEMPLATE["default-input-date"](
                        _.extend({
                                data: _data
                            },
                            field
                        )
                    );
                    break;
                default:
                    _html = UPDATE_ON_READ_TEMPLATE["default-input"](
                        _.extend({
                                inputType: _typeHtml,
                                data: _data
                            },
                            field
                        )
                    );
            }
            if (DEBUG) {
                console.debug("     HTML: " + _html);
            }
            return _html;
        }
    });
});