// Field Base Class
define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'events',
  'vm',
  'utils',
  'models/model',
  'modelbinder',
  'validation',
  'views/fields/list',
  'text!data/email.json',
  'text!data/schooles.json',
  'text!templates/fields/html.html',
  'text!templates/fields/label.html',
  'text!templates/fields/text.html',
  'text!templates/fields/password.html',
  'text!templates/fields/telephone.html',
  'text!templates/fields/hidden.html',
  'text!templates/fields/timestamp.html',
  'text!templates/fields/useraccount.html',
  'text!templates/fields/fraction.html',
  'text!templates/fields/booleaninput.html',
  'text!templates/fields/radio.html',
  'text!templates/fields/file.html',
  'text!templates/fields/multifiles.html',
  'text!templates/fields/state.html',
  'text!templates/fields/zipcode.html',
  'text!templates/fields/country.html',
  'text!templates/fields/fullname.html',
  'text!templates/fields/address.html',
  'text!templates/fields/textarea.html',
  'text!templates/fields/number.html',
  'text!templates/fields/email.html',
  'text!templates/fields/date.html',
  'text!templates/fields/select.html',
  'text!templates/fields/check.html',
  'text!templates/fields/birthdate.html',
  'text!templates/fields/button.html',
  'text!templates/fields/buttongroup.html',
  'text!templates/fields/list.html',
  'text!templates/fields/uneditableinput.html',
  'text!templates/fields/uneditablecheck.html',
  'text!templates/fields/uneditabletag.html',
  'text!templates/fields/uneditabletel.html',
  'text!templates/fields/uneditablefile.html',
  'text!templates/fields/uneditableimage.html',
  'text!templates/fields/buttonclipboard.html',
  'text!templates/subform-layouts/table.html',
  'jquery.expose',
  'jquery.datepicker',
  'jquery.birthdaypicker',
  'bootstrap'
], function($, _, Backbone, Bootstrap, Events, Vm, Utils, Model, Modelbinder, Validation, listView, emailData, schoolesData, htmlTemplate, labelTemplate, textTemplate, passwordTemplate, telephoneTemplate, hiddenTemplate, timestampTemplate, useraccountTemplate, fractionTemplate, booleanInputTemplate, radioTemplate, fileTemplate, multifilesTemplate, stateTemplate, zipcodeTemplate, countryTemplate, fullnameTemplate, addressTemplate, textareaTemplate, numberTemplate, emailTemplate, dateTemplate, selectTemplate, checkTemplate, bdateTemplate, buttonTemplate, buttongroupTemplate, listTemplate, uneditableinputTemplate, uneditablecheckTemplate, uneditabletagTemplate, uneditabletelTemplate, uneditablefileTemplate, uneditableimageTemplate, buttonclipboardTemplate, tableTemplate) {
  return Backbone.View.extend({
    _modelBinder: undefined,
    // Clean Data Binding
    clean: function() {
      // Unbind Validation
      Backbone.Validation.unbind(this);

      if (typeof this._modelBinder !== 'undefined') {
        this._modelBinder.unbind();
      }
    },
    initialize: function() {
      var that = this;
      this._div = 0; // Number of Open Div
      this._hasUserId = false; // Tracking the UserId Field
      this._hasDate = false; // Tracking the dateinput element
      this._hasBDate = false; // Tracking the Birthdate element
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

      // Wizard View Counters
      this._stepDiv = 0; // Count number of open div for step (wizard view)
      this._currentStep = 1; // Current Step
      this._stepValidated = []; // Hold the field names for each validation step

      this._modelBinder = new Modelbinder();

      // Setup Keys
      this.options.formSchema.validation = this.options.formSchema.validation || {};
      // Setup Model
      this.model = new Model(_.extend(this.options.formSchema, {
        is_internal: this.options.internal,
        render_mode: this.options.mode,
        status: (this.options.mode === 'update' && this.options.formData && this.options.formData.status) ? this.options.formData.status : null
      }));
      // If user pass in formData
      if (!$.isEmptyObject(this.options.formData)) {
        _.each(this.model.attributes, function(element, index) {
          if (typeof element === 'object') {} else {
            var _obj = {};
            _obj[index] = that.options.formData.fields[index];
            that.model.set(_obj);
          }
        });
      }
      // Prefixed Name
      this.prefixedName = {
        'list': 'subform_',
        'listdisplayid': '_form_content',
        'collectiondisplayid': '_form_collection'
      };
      // Not render label
      this.notRenderLabel = [
        'html', 'list', 'button', 'submit', 'clear', 'fieldset', 'fieldsetstart', 'fieldsetend', 'step', 'check', 'checkbox', 'timestamp', 'hidden'
      ];
      // Not render label for read
      this.notRenderLabelRead = [
        'html', 'list', 'button', 'submit', 'clear', 'fieldset', 'fieldsetstart', 'fieldsetend', 'step', 'check', 'checkbox'
      ];
      // Set up the input template
      this.inputTemplate = {
        "html": _.template(htmlTemplate),
        "label": _.template(labelTemplate),
        "text": _.template(textTemplate),
        "password": _.template(passwordTemplate),
        "telephone": _.template(telephoneTemplate),
        "hidden": _.template(hiddenTemplate),
        "timestamp": _.template(timestampTemplate),
        "useraccount": _.template(useraccountTemplate),
        "fraction": _.template(fractionTemplate),
        "booleaninput": _.template(booleanInputTemplate),
        "radio": _.template(radioTemplate),
        "file": _.template(fileTemplate),
        "multifiles": _.template(multifilesTemplate),
        "state": _.template(stateTemplate),
        "zipcode": _.template(zipcodeTemplate),
        "country": _.template(countryTemplate),
        "fullname": _.template(fullnameTemplate),
        "address": _.template(addressTemplate),
        "textarea": _.template(textareaTemplate),
        "number": _.template(numberTemplate),
        "email": _.template(emailTemplate),
        "date": _.template(dateTemplate),
        "select": _.template(selectTemplate),
        "check": _.template(checkTemplate),
        "birthdate": _.template(bdateTemplate),
        "button": _.template(buttonTemplate),
        "buttongroup": _.template(buttongroupTemplate),
        "list": _.template(listTemplate),
        "uneditableinput": _.template(uneditableinputTemplate),
        "uneditablecheck": _.template(uneditablecheckTemplate),
        "uneditabletag": _.template(uneditabletagTemplate),
        "uneditabletel": _.template(uneditabletelTemplate),
        "uneditablefile": _.template(uneditablefileTemplate),
        "uneditableimage": _.template(uneditableimageTemplate),
        "buttonclipboard": _.template(buttonclipboardTemplate),
        "subform-table": _.template(tableTemplate)
      };

      // Init Form Options
      var formOptions = {
        submitbutton: 'Submit',
        resetbutton: 'Cancel'
      };
      this.options.formSchema.formoptions = _.extend(formOptions, this.options.formSchema.formoptions) || formOptions;
    },
    /**
     * Search for the Form Validation Data, Return {} if not success
     **/
    getFormValidationData: function(name) {
      this.options.formSchema.validation = this.options.formSchema.validation || {};
      return ((typeof this.options.formSchema.validation[name] === 'undefined') ? {} : this.options.formSchema.validation[name]);
    },
    /**
     * Closed Open Div
     **/
    closeOpenDiv: function(property) {
      property = property || '_div';
      var _html = '',
        i = 0,
        j = this[property];
      for (; i < j; ++i) {
        _html += '</div>';
      }
      this._div = 0;
      return _html;
    },
    /**
     * Render HTML
     **/
    render: function(field, readMode) {

      var that = this,
        _html = '',
        _name = [field.name],
        _type = field.type.toLowerCase(),
        _attr = '';
      field.lang = this.options.lang; // Set up default lang for each field for simple work in template
      field.attributes = field.attributes || {};
      field.options = field.options || {};
      this.options.formSchema.validation = this.options.formSchema.validation || {};
      this.options.formData = this.options.formData || {};

      // Check to see if this is render internal, external and match with the current display mode or not
      // In options keys: internal
      if (!this.options.internal && field.options.internal) {
        return '';
      } else if ((_type === 'button' || _type === 'submit') && !field.options.internal && this.options.internal) {
        return '';
      }

      switch (_type) {

        case 'booleaninput':
          this._hasBooleanInput = true;
          break;

        case 'radio':
          if (!this._hasRadioBtnGroup && field.options.render) {
            this._hasRadioBtnGroup = true;
          }
          if (this.options.formData.fields && this.options.formData.fields[field.name]) {
            // Copy by reference
            field._data = this.options.formData['fields'][field.name];
          }
          // If there is an Options.OrderBy will need to sort Values
          if (field.options.orderby) {
            this.sortOrderBy(field);
          }
          break;

        case 'multifiles':
          if (!(this.options.internal && typeof field.options.internalcanupdate !== 'undefined' && !field.options.internalcanupdate)) {
            $('form' + this.el)
              .attr('enctype', 'multipart/form-data');
          }
          this._multiFiles.push(field);
          var _validation_tmp = this.getFormValidationData(field.name + '[]');
          if (typeof this._stepValidated[(this._currentStep) - 2] !== 'undefined' && !$.isEmptyObject(_validation_tmp)) {
            this._stepValidated[(this._currentStep) - 2].push(field.name + '[]');
          }

          if (this.options.mode === 'read') {
            _type = 'file';
          }
          break;

        case 'image':
          field.attributes.accept = 'image/*';
        case 'file':
          if (!(this.options.internal && typeof field.options.internalcanupdate !== 'undefined' && !field.options.internalcanupdate)) {
            $('form' + this.el)
              .attr('enctype', 'multipart/form-data');
          }
          var _validation_tmp = this.getFormValidationData(field.name);
          if (_validation_tmp.accept) {
            field.attributes.accept = _validation_tmp.accept;
          }
          if (field.options.javaupload) {
            var _jObject = {
              name: field.name,
              id: field.name,
              code: 'com.elementit.JavaPowUpload.Manager',
              archive: '//public.southernnevadahealthdistrict.org/assets/jar/jupload/JavaPowUpload.jar, //public.southernnevadahealthdistrict.org/assets/jar/jupload/skinlf.jar, //public.southernnevadahealthdistrict.org/assets/jar/jupload/commons-httpclient.jar, //public.southernnevadahealthdistrict.org/assets/jar/jupload/commons-compress.jar',
              width: 500,
              height: 350,
              mayscript: "true",
              alt: "JavaPowUpload by www.element-it.com"
            };
            this._javaUpload.push(_jObject);
          }
          // Check to see if this contain markDownloadDateTimeOf
          if (field.options.markdownloaddatetimeof && this.options.mode && this.options.mode === 'read') {
            var _txt = (this.options.internal) ? 'internal' : 'external',
              _markdownload = field.options.markdownloaddatetimeof.toLowerCase();
            if (_markdownload === '*' || _markdownload === _txt) {
              field.attributes['class'] = ((field.attributes['class']) ? field.attributes['class'] : '') + ' btn-auto-refresh ';
              if (!field.attributes['data-refresh-delay']) {
                field.attributes['data-refresh-delay'] = '2000';
              }
            }
          }
          break;

        case 'userid':
          this._hasUserId = true;
          // Make this compatible with LookUp Key
          if (field.options && field.options.lookup && field.options.lookup.url) {
            field.options.url = field.options.lookup.url;
          }
          if (field.options.url) {
            field.attributes['data-url'] = field.options.url;
          }
          if (field.options.data) {
            field.attributes['data-url-data'] = JSON.stringify(field.options.data);
          }
          field.attributes['placeholder'] = field.attributes['placeholder'] || 'Valid E-mail as Username';
          field.attributes['class'] = (field.attributes['class'] || '') + ' userid-lookup';
          _type = (field.options.render) ? field.options.render.toLowerCase() : 'text';
          if (_type === 'select') {
            field.values = [];
          }
          field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'span12');
          break;

        case 'fraction':

          break;

        case 'textbox':
          _type = 'text';
        case 'selectsingle':
          if (_type === 'selectsingle') {
            _type = 'select';
          }
        case 'select':
          // Make this compatible with LookUp Key
          if (field.options && field.options.lookup && field.options.lookup.url) {
            field.options.url = field.options.lookup.url;
            // Setup Key of Text or Value to look up.
            if (field.options.lookup.value) {
              field.attributes['data-select-key-value'] = field.options.lookup.value;
            }
            if (field.options.lookup.text) {
              field.attributes['data-select-key-text'] = field.options.lookup.text;
            }
            // If this is read mode and have the value for this field
            if (this.options.mode === 'update' && this.options.formData.fields[field.name]) {
              field.attributes['data-select-value'] = this.options.formData.fields[field.name];
            }
          } else if (field.options) {
            if (field.options.tags) {
              field.attributes['class'] = ((field.attributes['class']) ? field.attributes['class'] : '') + ' selecttwo-render tags value-as-array';
            }
            // If there is an events
            if (field.options.events) {
              // Field Name, Key, Value
              this.addDataToElementData(field.name, 'events', field.options.events);
            }
          }
          if (field.options.url) {
            field.attributes['data-url'] = field.options.url.replace(/'/ig, '&#39;');
          }
          if (field.options.data) {
            field.attributes['data-url-data'] = JSON.stringify(field.options.data);
          }
          field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'span12');
          // Set the Data
          if (this.options.formData && this.options.formData.fields && this.options.formData.fields[field.name]) {
            if (_.isArray(this.options.formData.fields[field.name])) {
              this.options.formData.fields[field.name].sort(function(a, b) {
                return a - b;
              });
            }
            this.addDataToElementData(field.name, 'value', this.options.formData.fields[field.name]);
          }
          break;

        case 'checkbox':
        case 'check':
          if (field.options.numcolumns) {
            if (!_.isNumber(field.options.numcolumns)) {
              throw 'NumColumns must be a valid number for ' + field.name;
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
          if (this.options.mode === 'update') {
            if (this.options.formData.fields && this.options.formData['fields'][field.name]) {
              // Copy by reference
              field._data = this.options.formData['fields'][field.name];
            }
          }
          // In general case if there is formData (setup other to render)
          if (this.options.formData.fields && this.options.formData['fields'][field.name + '_other']) {
            field._otherValue = this.options.formData['fields'][field.name + '_other'];
          }
          // Check Validation
          if (typeof this.options.formSchema.validation[field.name + '[]'] !== 'undefined') {
            field._required = true;
            var _validation_tmp = this.getFormValidationData(field.name + '[]');
            if (typeof this._stepValidated[(this._currentStep) - 2] !== 'undefined' && !$.isEmptyObject(_validation_tmp)) {
              this._stepValidated[(this._currentStep) - 2].push(field.name + '[]');
            }
          } else {
            field._required = false;
          }
          _type = 'check';
          if (!field.values) {
            throw 'In order to use CheckBox, please set Values.';
          }
          break;

        case 'password':
          field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'span12');
          break;

        case 'telephone':
          field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'integer telephone span12');
          if (this.options.formData.fields && this.options.formData.fields[field.name + '_provider']) {
            field['_providerValue'] = this.options.formData.fields[field.name + '_provider'];
          }
          break;

        case 'textarea':
          field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'span12');
          break;

        case 'action':
          this._div++;
          return '<div class="form-actions">';

        case 'fieldsetstart':
          return '<fieldset><legend>' + field.description + '</legend>';

        case 'fieldsetend':
          return '</fieldset>';

        case 'hr':
          return '<hr>';

        case 'dateinput':
          _type = 'date';
        case 'date':
          // Check for $date
          if (this.options.formData && this.options.formData.fields && typeof this.options.formData.fields[field.name] === 'object') {
            var _tmpDate = new Date(this.options.formData.fields[field.name].$date);
            var _month = _tmpDate.getMonth() + 1;
            if (_month < 10) {
              _month = '0' + _month;
            }
            _month += '/';
            var _date = _tmpDate.getDate();
            if (_date < 10) {
              _date = '0' + _date;
            }
            _date += '/';

            this.options.formData.fields[field.name] = _month + _date + _tmpDate.getFullYear();
            field.attributes['value'] = this.options.formData.fields[field.name];
          }
          if (field.attributes && !field.attributes.placeholder) {
            field.attributes.placeholder = 'mm/dd/yyyy';
          }
          // If pass in options.render, by default will render as 'DatePicker'
          if (field.options.render && field.options.render.toLowerCase() === 'select') {
            _type = 'birthdate'
            this._hasBDate = true;
            field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'birthdaypicker');
            var _validation_tmp = this.getFormValidationData(field.name),
              _options = {
                id: field.name
              };
            if (field.lang !== 'en') {
              _options.lang = field.lang;
            }
            if (typeof this.options.formData.fields !== 'undefined') {
              _options['defaultdate'] = this.options.formData.fields[field.name];
            }
            field.attributes['data-options'] = JSON.stringify(_.extend(_options, _validation_tmp));

            // For Wizard View
            if (typeof this._stepValidated[(this._currentStep) - 2] !== 'undefined' && !$.isEmptyObject(_validation_tmp)) {
              this._stepValidated[(this._currentStep) - 2].push(field.name + '_birth[month]');
              this._stepValidated[(this._currentStep) - 2].push(field.name + '_birth[day]');
              this._stepValidated[(this._currentStep) - 2].push(field.name + '_birth[year]');
            }
          } else {
            this._hasDate = true;
            field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'datepicker');
            var _validation_tmp = this.getFormValidationData(field.name);
            // Setup Max Date
            _.each(_validation_tmp, function(valValue, valKey) {
              delete _validation_tmp[valKey];
              _validation_tmp[valKey.toLowerCase()] = valValue;
            });
            if (_validation_tmp.maxdate) {
              field.attributes['data-maxdate'] = _validation_tmp.maxdate;
            }
            if (_validation_tmp.mindate) {
              field.attributes['data-mindate'] = _validation_tmp.mindate;
            }
          }
          break;

        case 'email':
          field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'tolowercase span12');
          if (typeof field.options.autocomplete !== 'undefined' && field.options.autocomplete) {
            this._hasEmailPicker = true;
            field.attributes = {};
            field.attributes['data-provide'] = 'typeahead';
            field.attributes['autocomplete'] = 'off';
            field.attributes['style'] = 'width:45%;';
            field.attributes['class'] = 'not_sending emailpicker_server tolowercase';
            field.attributes['data-source'] = emailData.replace(/\n/g, '')
              .replace(/'/g, "&#39");
            if (typeof field.options['default'] !== 'undefined') {
              field.attributes['data-value'] = field.options['default'];
            }

            _name.push(field.name + '_username');
            _name.push(field.name + '_server');
          }
          break;

        case 'address':
          delete field.attributes['class'];
          delete field.attributes['placeholder'];

          _name = [];
          _name.push(field.name + '_address_street');
          _name.push(field.name + '_address_city');
          _name.push(field.name + '_address_state');
          _name.push(field.name + '_address_zip');
          _name.push(field.name + '_address_country');

          // Format Data
          if (typeof readMode !== 'undefined' && typeof this.options.formData !== 'undefined') {
            this.options.formData.fields[field.name + '_address_country'] = Vm.getCountry(this.options.formData.fields[field.name + '_address_country']);

            if (this.options.formData.fields[field.name + '_address_street'] && this.options.formData.fields[field.name + '_address_street'].charAt(this.options.formData.fields[field.name + '_address_street'].length - 1) !== '.') {
              this.options.formData.fields[field.name + '_address_street'] += '.';
            }
            this.options.formData.fields[field.name + '_address_street'] += '<br>';
            this.options.formData.fields[field.name + '_address_city'] += ',';
            this.options.formData.fields[field.name + '_address_state'] += '<br>';
            this.options.formData.fields[field.name + '_address_zip'] += '<br>';
          } else if (this.options.mode === 'update' && this.options.formData.fields[field.name + '_address_country'] !== 'US') {
            // Will Render Input
            field['default_value_state'] = this.options.formData.fields[field.name + '_address_state'];
          } else if (this.options.mode === 'create') {
            this.model.set(field.name + '_address_state', 'NV'); // Default to NV for create mode
            this.model.set(field.name + '_address_country', 'US'); // Default to USA for create mode
          }

          // If there is "Options.ZipCodeFormat" option
          if (field.options.zipcodeformat) {
            var _zipcodeformat = field.options.zipcodeformat.toLowerCase();
            switch (_zipcodeformat) {
              case 'zip+4':
                field['_zipmax'] = 10;
                break;
            }
          }

          break;

        case 'number':
          var _num_class;
          if (!field.options.numbertype || field.options.decimals) {
            _num_class = (field.options.decimals) ? 'number' : 'natural';
          } else if (field.options.numbertype) {
            switch (field.options.numbertype.toLowerCase()) {
              case 'currency':
                _num_class = 'number';
                break;
              case 'double':
                _num_class = 'rational';
                break;
              default:
                _num_class = 'natural';
            }
          } else {
            _num_class = 'natural';
          }
          field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], _num_class + ' span12');
          // Check to see how to render this
          if (field.options.decimals && this.options.formData.fields && this.options.formData.fields[field.name]) {
            var _float_pts = parseFloat(this.options.formData.fields[field.name] / Math.pow(10, parseInt(field.options.decimals)));
            if (!isNaN(_float_pts)) {
              this.options.formData.fields[field.name] = _float_pts.toFixed(2);
            }
          }
          if (typeof field.options.spinner !== 'undefined' && field.options.spinner) {
            field.attributes['class'] = field.attributes['class'].replace(/ span12/, "", "gi");
            field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'spinner-input');
            if (this.options.mode === 'update' && this.options.formData.fields[field.name]) {
              field.attributes['data-value'] = this.options.formData.fields[field.name];
            }
          }
          break;

        case 'fullname':
          delete field.attributes['class'];
          delete field.attributes['placeholder'];
          _name = [];
          _name.push(field.name + '_fullname_first_name');
          if (typeof field.options.middlename === 'undefined' || field.options.middlename) {
            _name.push(field.name + '_fullname_middle_name');
          }
          _name.push(field.name + '_fullname_last_name');

          if (field.options.url) {
            this._ajaxDataCall.push(field);
          }
          break;

        case 'clear':
          _type = 'button';
          field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'btn btn-clear-form');
          break;

        case 'submit':
          field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'btn');
          _type = 'button';
          field['_submit'] = true;
          // If this is submit button will override the action of this form
          if (typeof field.url === 'undefined') {
            field.url = '';
            // throw 'In order to use submit button, must pass the Url value in the formSchema';
          }
          // AppendId
          if (field.options.appendid && this.options.formData._id && this.options.formData._id['$oid']) {
            field.url = ((field.url) ? field.url : '') + ((field.url.indexOf('?') > -1) ? '&id=' : '/') + this.options.formData._id['$oid'];
          }
          $(this.el)
            .attr('action', field.url);

          // Check for Ajax Submit
          if (typeof field.options.ajaxsubmit !== 'undefined') {
            this._ajaxSubmit = field.options.ajaxsubmit;
          }

          break;

        case 'buttonclipboard':
          field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'btn btn-primary');
          this._buttonClipboards.push({
            name: field.name,
            values: field.values
          });
          break;

        case 'buttondecision':
          if (!readMode) {
            field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'btn btn-primary');
            _type = 'button';
            this._buttonDecision.push(field);
          }
          break;

        case 'button':
          field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'btn');
          // AppendId
          if (field.options.appendid && this.options.formData._id && this.options.formData._id['$oid']) {
            field.url = ((field.url) ? field.url : '') + ((field.url.indexOf('?') > -1) ? '&id=' : '/') + this.options.formData._id['$oid'];
          }
          // Adding the Confirmation Popover
          if (field.options.confirmed) {
            // If there is ConfirmedText then will override the standard text.
            var _std_text = (field.options.confirmedtext) ? field.options.confirmedtext : 'Please confirm your selection.',
              _popoverOptions = {
                html: true,
                placement: "top",
                title: '<span class="text-info">' + _std_text + '</span>',
                content: '<a class="btn btn-success btn-confirmed" data-href="' + field.url + '">Yes</button><a class="btn btn-danger btn-confirmed">No</button>'
              };
            field.attributes['data-popover-confirm'] = JSON.stringify(_popoverOptions);
          }
          break;

        case 'schooles':
          _type = 'text';
          field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'span12');
          field.attributes['data-provide'] = 'typeahead';
          field.attributes['autocomplete'] = 'off';
          field.attributes['data-source'] = schoolesData.replace(/\n/g, '')
            .replace(/'/g, "&#39");
          break;

          // Step Field Type only render for wizard view
        case 'step':
          if ('view' in this.options.formSchema && this.options.formSchema.view === 'wizard') {
            if (this._stepDiv !== 0) {
              _html += '</div>';
              this._stepDiv--;
            }
            if (typeof this._stepValidated[(this._currentStep) - 1] === 'undefined') {
              this._stepValidated[this._currentStep - 1] = [];
            }
            var _active = 'step-pane' + ((this._currentStep === 1) ? ' active' : '');
            _html += '<div class="' + _active + '" id="wizard_step' + this._currentStep + '">';
            this._stepDiv++;
            this._currentStep++;
          } else {
            return '';
          }
          break;

        case 'useraccount':
          field['data_value'] = '';
          if (field.options.getvaluefromid) {
            field['data_value'] = $('#' + field.options.getvaluefromid)
              .text();
          }
          break;

          // Sub Form, will need to render new view to handle the event
        case 'list':
          field.attributes.id = this.prefixedName['list'] + ((typeof field.attributes.id !== 'undefined') ? field.attributes.id : field.name);
          field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'subform-container');
          // Attached Event

          var _validation = (typeof this.options.formSchema.validation[field.name] !== 'undefined') ? this.options.formSchema.validation[field.name] : {};
          this.attachSubFormEvent(field.attributes.id, field, _validation);
          break;
      }

      // Check to see if this is button or submit
      if (_type === 'button' && field.options.visibleon) {
        var _btnVisibleOnChanged = function(e) {
          if (e.type === 'change' && field.options.visibleon.values.indexOf($(this)
            .val()) > -1) {
            $('#' + field.name, that.el)
              .show('slow');
          } else {
            $('#' + field.name, that.el)
              .hide('slow');
          }
        };
        // Listen to changed event and update the display
        $(this.el)
          .on('change', ':input[name="' + field.options.visibleon.name + '"]', _btnVisibleOnChanged)
          .on('removeVisibleOn', ':input[name="' + field.options.visibleon.name + '"]', _btnVisibleOnChanged);
      }

      // Check to see if step validation has been init (wizard view)
      if (typeof this._stepValidated[(this._currentStep) - 2] !== 'undefined' && !(_type === 'step' || _type === 'list') && Utils.checkRequireFields(field, this.options.formSchema.validation)) {
        _.each(_name, function(element) {
          that._stepValidated[(that._currentStep) - 2].push(element);
        });
      }

      //=============== READ MODE ===============//
      // If this is read mode will need to render read template
      if (typeof readMode !== 'undefined' && readMode && typeof _name[0] !== 'undefined' && !(_type === 'button' || _type === 'buttonclipboard')) {
        var _field_data = '',
          _href = '';
        _.each(_name, function(element) {
          if (typeof that.options.formData.fields[element] !== 'object') {
            _field_data += ((typeof that.options.formData.fields[element] !== 'undefined') ? that.options.formData.fields[element] : '') + ' ';
          } else {
            _field_data = that.options.formData.fields[element];
          }
        });
        if (typeof _field_data === 'string') {
          _field_data = $.trim(_field_data);
        }
        if (_type === 'file' || _type === 'image') {
          if (_type === 'image') {
            if (that.options.formData.fields[field.name] === 'deleted') {
              _href = null;
            } else {
              field.attributes['src'] = ((typeof field.attributes['src'] !== 'undefined') ? field.attributes['src'] : '/form/getFile/') + that.options.formData.fields[field.name];
              _href = field.attributes['src'];
            }
          } else {
            field.attributes['target'] = '_blank';
            field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'btn btn-primary');
            field.attributes['href'] = ((typeof field.attributes['href'] !== 'undefined') ? field.attributes['href'] : '/form/getFile/') + that.options.formData.fields[field.name];
            // Check for other options
            if (field.options.markdownloaddatetimeof && this.options.formData._id && this.options.formData._id['$oid']) {
              var _markDownloadDateTime = field.options.markdownloaddatetimeof.toLowerCase();
              if (_markDownloadDateTime === '*' || this.options.internal && _markDownloadDateTime === 'internal' || !this.options.internal && _markDownloadDateTime === 'external') {
                field.attributes['href'] += '?formid=' + this.options.formData._id['$oid'];
              }
            }
          }
          delete field.attributes['accept'];
          _.each(field.attributes, function(value, key) {
            if (value.search('\'')) {
              value = value.replace(/\'/ig, '"');
            }
            _attr += ' ' + key + '=\'' + value + '\'';
          });
          _html += that.inputTemplate['uneditable' + _type]({
            value: _field_data,
            text: field.description,
            _attr: _attr,
            id: field.name,
            href: _href
          });
        } else if (_type === 'list') {
          // If this is 'list' type
          if (typeof this.options.formData.fields[field.name] !== 'undefined' && (this.options.formData.fields[field.name].length > 0 || _.size(this.options.formData.fields[field.name]) > 0)) {
            var _labels = [],
              _sortBy = [],
              _sortByVal = [],
              _keys = {},
              _cnt = 0,
              _values = new Array(this.options.formData.fields[field.name].length || _.size(this.options.formData.fields[field.name]));
            _.each(field.fields, function(element, index) {
              element.options = element.options || {};
              _labels.push(element.description);
              if (element.options.sortby && element.options.sortby.toLowerCase() === 'date') {
                _sortBy.push('data-sort="int"');
              } else {
                _sortBy.push((element.options.sortby) ? 'data-sort="' + element.options.sortby + '"' : 'data-sort="string"');
              }
              _.each(that.options.formData.fields[field.name], function(modelData, index) {
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
                if (typeof _values[index] === 'undefined') {
                  _values[index] = [];
                  _sortByVal[index] = [];
                }
                // Setup Sort By Element
                if (element.options.sortby && element.options.sortby.toLowerCase() === 'date') {
                  var _dateTime = Date.parseString(modelData[element.name], 'M/d/yyyy h:mm:ss a');
                  _sortByVal[index].push('data-sort-value="' + _dateTime.getTime() + '"');
                } else {
                  _sortByVal[index].push(null);
                }
                switch (element.type.toLowerCase()) {
                  case 'timestamp':
                    _labels[_labels.length - 1] = 'Time';
                    // Convert to Human Readable Time
                    _values[index].push(Utils.getHumanTime(modelData[element.name]));
                    break;

                  case 'useraccount':
                    _labels[_labels.length - 1] = 'User';
                    _values[index].push(modelData[element.name]);
                    break;

                  case 'fullname':
                    _fullName = modelData[element.name + '_fullname_first_name'];
                    if (typeof modelData[element.name + '_fullname_middle_name'] !== 'undefined') {
                      _fullName += ' ' + modelData[element.name + '_fullname_middle_name'];
                    }
                    _fullName += ' ' + modelData[element.name + '_fullname_last_name'];
                    _values[index].push(_fullName);
                    break;

                  case 'booleaninput':
                    _values[index].push((modelData[element.name] ? 'Yes' : 'No'));
                    break;

                  default:
                    if (typeof modelData[element.name] === 'undefined') {
                      delete(_labels[_labels.length - 1]);
                      return;
                    }
                    _values[index].push(modelData[element.name]);
                }
              });
            });
            _html += that.inputTemplate['subform-table']({
              labels: _labels,
              values: _values,
              mode: readMode,
              sortBy: _sortBy,
              sortByVal: _sortByVal,
              heading: ((typeof field.options.readmodedescription === 'undefined') ? field.description : field.options.readmodedescription)
            });
          } else {
            _html += '';
          }
        } else if (_type === 'telephone' && field._providerValue) {
          // This is telephone with provider
          _html += that.inputTemplate['uneditabletel']({
            value: _field_data,
            label: field.description,
            id: field.name,
            providerValue: field._providerValue
          });
        } else if (_type === 'check') {
          // This is check box and need to render to make it look easy to read
          _html += that.inputTemplate['uneditablecheck']({
            value: _field_data,
            label: field.description,
            id: field.name,
            otherValue: (field._otherValue) ? field._otherValue : ''
          });
        } else if (_type === 'select' && field.options && field.options.tags) {
          // Sort Tag by Numerical
          if (_.isArray(_field_data)) {
            _field_data.sort(function(a, b) {
              return a - b;
            });
          }
          // This is check box and need to render to make it look easy to read
          _html += that.inputTemplate['uneditabletag']({
            value: _field_data,
            id: field.name,
          });
        } else {
          var _textarea = '';
          switch (_type) {
            case 'textarea':
            case 'address':
              _textarea = ' uneditable-input-textarea';
              break;
            case 'timestamp':
              _field_data = Utils.getHumanTime(_field_data);
              break;
          }
          _html += that.inputTemplate['uneditableinput']({
            value: _field_data,
            css_class: _textarea,
            id: field.name
          });
        }
      } else if (_type === 'image' && typeof field.options.internalcanupdate !== 'undefined' && this.options.internal && field.options.internalcanupdate === false) {
        // Start render the Image here
        // Render Image As Read Mode, (Depending on the Options.InternalCanUpdate value)
        var _field_data = '',
          _href = '';
        _.each(_name, function(element) {
          if (typeof that.options.formData.fields[element] !== 'object') {
            _field_data += ((typeof that.options.formData.fields[element] !== 'undefined') ? that.options.formData.fields[element] : '') + ' ';
          } else {
            _field_data = that.options.formData.fields[element];
          }
        });
        if (typeof _field_data === 'string') {
          _field_data = $.trim(_field_data);
        }
        if (that.options.formData.fields[field.name] === 'deleted') {
          _href = null;
        } else {
          field.attributes['src'] = ((typeof field.attributes['src'] !== 'undefined') ? field.attributes['src'] : '/form/getFile/') + that.options.formData.fields[field.name];
          _href = field.attributes['src'];
        }
        delete field.attributes['accept'];
        _.each(field.attributes, function(value, key) {
          if (value.search('\'')) {
            value = value.replace(/\'/ig, '"');
          }
          _attr += ' ' + key + '=\'' + value + '\'';
        });
        _html += that.inputTemplate['uneditable' + _type]({
          value: _field_data,
          text: field.description,
          _attr: _attr,
          id: field.name,
          href: _href
        });
      } else {
        //*** Create and Update Mode ***//

        // Check if this is internal and has InternalCanUpdate Options
        if (this.options.internal && typeof field.options.internalcanupdate !== 'undefined' && !field.options.internalcanupdate) {
          _type = 'hidden';
        } else {
          _.each(field.attributes, function(value, key) {
            // value might be a JSON, that why we escape as '' not ""
            _attr += ' ' + key + '=\'' + value + '\'';
          });
        }

        // Convert to file type
        if (_type === 'image') {
          _type = 'file';
        }

        _html += (typeof this.inputTemplate[_type] !== 'undefined') ? this.inputTemplate[_type](_.extend({
          _attr: _attr,
          _lang: this.options.lang
        }, field)) : '';
      }

      // Checking for the VisibleOn options, if it is existed will need to check for the depend value
      if (field.options.visibleon) {
        if (!field.options.visibleon.name || !$.isArray(field.options.visibleon.values)) {
          throw field.name + '.Options.VisibleOn need Name and Values!';
        }
        this._visibleOn.push(field);
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
      var _type = field.type.toLowerCase(),
        _cssClass = (typeof cssClass !== 'undefined' && cssClass) ? ' class="' + cssClass + '"' : '';
      switch (_type) {
        case 'hidden':
          if (this.options.mode === 'create') {
            return '';
          }
          break;
        case "buttondecision":
          return '';
      }
      return this.inputTemplate['label'](_.extend({
        _cssClass: _cssClass,
        _required: required
      }, field));
    },
    /**
     * Render Button
     **/
    renderButton: function(formOptions) {
      var _html = '';
      if (formOptions.submitbutton || formOptions.resetbutton) {
        _html += '<div class="form-actions">';
      }

      if (formOptions.submitbutton && !formOptions.subForm) {
        _html += '<button type="submit" class="btn btn-primary btn-submit">' + formOptions.submitbutton + '</button>';
      } else {
        _html += '<button type="button" class="btn btn-primary btn-submit">' + formOptions.submitbutton + '</button>';
      }

      if (formOptions.resetbutton) {
        _html += '<button type="button" class="btn btn-cancel">' + formOptions.resetbutton + '</button>';
      }

      if (_html.length > 0) {
        _html += '</div>';
      }

      return _html;
    },
    /**
     * Show On Mode
     **/
    checkShowOnMode: function(value, readMode, status) {
      var _type = value.type.toLowerCase();

      // First Check to see if rendering for internal or external
      if (value.options.internal != undefined && (value.options.internal !== this.options.internal)) {
        return false;
      }

      // If this is internal fields, we need to push to _internalFields array
      if (value.options.internal === true && value.name && _type !== 'buttonclipboard') {
        var _internalName;
        switch (_type) {
          case 'check':
          case 'checkbox':
            _internalName = value.name + '[]';
            break;

          default:
            _internalName = value.name;
        }
        this._internalFields.push(_internalName);
      }

      if (this.options.hideButtons && (_type === 'button' || _type === 'submit' || _type === 'reset' || _type === 'action')) {
        return false;
      }

      // If this is type VisibleOn and in Read Mode will not render if does not have data
      if (this.options.mode === 'read' && !$.isEmptyObject(value.options.visibleon) && !this.options.formData.fields[value.name] && !(_type === 'fullname' || _type === 'address' || _type === 'buttonclipboard')) {
        return false;
      }

      readMode = readMode || false;
      status = status || false;

      if (readMode !== 'read' && value.type.toLowerCase() === 'buttonclipboard') {
        return false;
      } else if (readMode === 'read' && !this.options.internal && value.options.hideonexternalread) {
        return false;
      } else if (typeof value.options.showonmode !== 'undefined' && value.options.showonmode.indexOf(readMode) === -1) {
        return false;
      } else if (typeof value.options.showonstatus !== 'undefined') {
        var _showOnStatus = _.map(value.options.showonstatus, function(element) {
          return element.toLowerCase();
        });
        if (status === false || _showOnStatus.indexOf(status.toLowerCase()) === -1) {
          return false;
        }
      } else if (this.options.internal && readMode === 'update' && typeof value.options.internalcanupdate !== 'undefined' && !value.options.internalcanupdate) {
        if (_type !== 'image') {
          return false;
        }
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
          el: '#' + id + this.prefixedName['listdisplayid'],
          formSchema: field,
          formId: id,
          options: this.options
        }, _listView = _.extend({}, Backbone.Events);
      $(this.el)
        .on('click', '#' + id + '_add_btn', _options, this.displaySubForm)
      // User click cancel button
      .on(id + '.close', this.closeSubForm)
      // User added a model
      .on(id + '.add', _.extend({
        formId: id
      }, this), this.addSubformData);

      // If there are subform data
      if (this.options.mode === 'update' && typeof this.options.formData.fields[field.name] !== 'undefined' && this.options.formData.fields[field.name].length > 0) {
        _listView.on(_options.formId + '.listViewCreated', function(list) {
          $(that.el)
            .trigger(id + '.add', [list, that.options.formData.fields[field.name]]);
          _listView.off();
        });

      } else {
        _listView.on(_options.formId + '.listViewCreated', function(list) {
          var $subFormList = $('#' + _options.formId, that.el),
            _callback = function(e, data) {
              $(that.el)
                .trigger(id + '.add', [list, data, true]);
              $subFormList.one(_options.formId + '.ajaxUpdate', _callback);
            };
          $subFormList.one(_options.formId + '.ajaxUpdate', _callback);
          _listView.off();
        });
      }

      this.displaySubForm({
        data: _options
      }, {}, true, _listView);
    },
    displaySubForm: function(e, model, hidden, listView) {
      model = model || {};
      hidden = hidden || false;
      listView = listView || false;
      var _id, _data = _.clone(e.data);
      // Load Subform View
      if ($.isEmptyObject(model)) {
        _id = 'SubFormView' + e.data.formId;
      } else {
        _data.model = model;
        _id = 'SubFormViewEdit' + e.data.formId;
      }
      $(this)
        .parents('div.actions')
        .fadeOut();

      require(['views/fields/list'], function(SubFormView) {
        var subFormView = Vm.create(this, _id, SubFormView, _data),
          $subFormView = $(subFormView.el);
        if (hidden) {
          $subFormView.hide();
        }
        subFormView.render(hidden);
        if (!hidden) {
          $subFormView.show();
          $subFormView.addClass('active');
          $subFormView.expose({
            closeOnEsc: false,
            closeOnClick: false,
            color: '#000',
            zIndex: 1025,
            renderBody: false
          });
        }
        if (listView) {
          listView.trigger(e.data.formId + '.listViewCreated', subFormView);
        }
      });
    },
    /**
     * Closed Sub Form
     **/
    closeSubForm: function(e, list) {
      list.$el.fadeOut();
      // Close mask bg
      $.mask.close();
      $('.actions', list.$el.parent('.subform-container'))
        .fadeIn('slow');
      Vm.remove('SubFormView' + list.options.formId, true);
      Vm.remove('SubFormViewEdit' + list.options.formId, true);
    },
    /**
     * Add model to List
     **/
    addSubformData: function(e, list, models, reset) {
      reset = reset || false;
      models = models || false;
      var _view = (list.options.formSchema.view === '') ? 'table' : list.options.formSchema.view,
        _key = list.options.formSchema.name;

      if (reset) {
        e.data.model.get(_key)
          .reset();
      }
      if (models) {
        var _model = Backbone.Model.extend({});
        _.each(models, function(element) {
          var _element = new _model();
          _element.set(element);
          e.data.model.get(_key)
            .add(_element);
        });
      } else {
        e.data.model.get(_key)
          .add(list.model);
      }
      // Render View
      require(['views/subform-layouts/' + _view], function(CollectionView) {
        var _data = {
          el: '#' + list.options.formId + e.data.prefixedName['collectiondisplayid'],
          formSchema: list.options.formSchema,
          collection: e.data.model.get(_key),
          options: list.options.options
        }, collectionView = Vm.create(this, 'CollectionView' + e.data.formId, CollectionView, _data);
        collectionView.render();

        // Closed Subform
        e.data.closeSubForm(e, list);
      });
    },
    /**
     * Setup the VisibleOn Options
     **/
    setupVisibleOn: function(field, htmlTmpl, parentContainer) {
      parentContainer = parentContainer || false;
      var that = this,
        _typeLowerCase = field.type.toLowerCase();
      if (!field.name) {
        throw 'In order to use VisibleOn option, we need to pass in the Name';
      }
      if (!parentContainer) {
        // Check if this VisibleOn define the ParentContainer
        if (field.options.visibleon.parentcontainer) {
          parentContainer = field.options.visibleon.parentcontainer;
        } else if (_typeLowerCase === 'booleaninput') {
          parentContainer = '.form-render_booleaninput_wrapper';
        }
      }

      switch (_typeLowerCase) {
        case 'address':
          delete this.model.validation[field.name + '_address_street'];
          delete this.model.validation[field.name + '_address_city'];
          delete this.model.validation[field.name + '_address_state'];
          delete this.model.validation[field.name + '_address_zip'];
          delete this.model.validation[field.name + '_address_country'];
          break;

        case 'multifiles':
          delete this.model.validation[field.name + '[]'];
          break;

        default:
          delete this.model.validation[field.name];
      }

      $(this.el)
        .on('change', ':input[name="' + field.options.visibleon.name + '"]', function(e) {
          var $currentTarget = $(e.currentTarget),
            $container = (parentContainer) ? $currentTarget.parents(parentContainer) : $currentTarget,
            $containerOptions, $nextContainer, _addressArray = [],
            _visibleOnName = field.options.visibleon.name,
            _visibleVal = $currentTarget.val(),
            _checkBindingArray = ['', '[]'];
          if (_visibleOnName.match(/\[\]$/ig)) {
            if (!$container.length) {
              $container = $currentTarget.closest('.checkbox-container');
            }
            _visibleOnName = _visibleOnName.substr(0, _visibleOnName.length - 2);
            $container = $container.closest('.checkbox-container');
            if ($currentTarget.is(':checkbox')) {
              _visibleVal = '';
              $container.find(':checkbox:checked')
                .each(function() {
                  var _checkedVal = $(this)
                    .val();
                  if (_.indexOf(field.options.visibleon.values, _checkedVal) > -1) {
                    _visibleVal = _checkedVal;
                  }
                });
            }
          }
          if (_.indexOf(field.options.visibleon.values, _visibleVal) > -1) {
            // Insert this into markup
            if ($('.options-visible-on-' + field.name, that.el)
              .length < 1) {
              $container.after(htmlTmpl);
              $containerOptions = $container.next('.options-visible-on-' + field.name)
                .fadeIn('slow', function() {
                  $(this)
                    .addClass('visible-parent-' + _visibleOnName)
                    .attr('data-parent', _visibleOnName);

                  // Remove the class that not belong to this visibleOn
                  var $parent = $('.options-visible-on-' + _visibleOnName, that.el);

                  // Caution: this can cause the previous markup to disappear.
                  // Fix in Release 0.1.0
                  $('[class*="visible-parent-' + _visibleOnName + '"]', that.el)
                    .not('.visible-parent-' + _visibleOnName + ',.options-visible-on-' + _visibleOnName + ',.visible-parent-' + $parent.attr('data-parent'))
                    .remove();

                  if (_typeLowerCase === 'multifiles') {
                    $('#' + field.name + '_multifiles_wrapper', this)
                      .trigger('visibleOnRenderComplete');
                  } else {
                    $(':input[name="' + field.name + '"]', this)
                      .trigger('visibleOnRenderComplete');
                  }

                  // Need to rebind the ModelBinder
                  if (!that.model.bindings[field.name] && _.indexOf(that.model.notBinding, field.name) < 0) {
                    var _bindingName = field.name;

                    _.each(_checkBindingArray, function(_suffix) {
                      if (_bindingName !== field.name) {
                        return;
                      }
                      if ($(':input[name="' + _bindingName + _suffix + '"]')
                        .length) {
                        _bindingName = field.name + _suffix;
                      }
                    });

                    if ($(':input[name="' + _bindingName + '"]')
                      .length) {
                      that.model.bindModelBinder(_bindingName, field.type);
                      that._modelBinder.bind(that.model, that.el, that.model.bindings);
                    }
                  }
                });

              // Some browser that still not support the placeholder
              $nextContainer = $container.next('div');
              if ($nextContainer.length === 0) {
                $nextContainer = $container.parent();
              }
              $nextContainer.find(':input')
                .not('input[type="hidden"]')
                .placeholder();

              // Adding Validation Scheme, if has one
              if (_typeLowerCase === 'address') {
                var _address_name = field.name + '_address_street';
                if (that.options.formSchema.validation[_address_name]) {
                  that.model.validation[_address_name] = that.options.formSchema.validation[_address_name];
                }
                _addressArray.push(_address_name);

                _address_name = field.name + '_address_city';
                if (that.options.formSchema.validation[_address_name]) {
                  that.model.validation[_address_name] = that.options.formSchema.validation[_address_name];
                }
                _addressArray.push(_address_name);

                _address_name = field.name + '_address_state';
                if (that.options.formSchema.validation[_address_name]) {
                  that.model.validation[_address_name] = that.options.formSchema.validation[_address_name];
                }
                _addressArray.push(_address_name);

                _address_name = field.name + '_address_zip';
                if (that.options.formSchema.validation[_address_name]) {
                  that.model.validation[_address_name] = that.options.formSchema.validation[_address_name];
                }
                _addressArray.push(_address_name);

                _address_name = field.name + '_address_country';
                if (that.options.formSchema.validation[_address_name]) {
                  that.model.validation[_address_name] = that.options.formSchema.validation[_address_name];
                }
                _addressArray.push(_address_name);

                if (field.options.hidecountry) {
                  that.model.set(_address_name, 'US');
                }

              } else if (that.options.formSchema.validation[field.name] && _typeLowerCase !== 'html') {
                that.model.validation[field.name] = that.options.formSchema.validation[field.name];
                _addressArray.push(field.name);
              } else if (that.options.formSchema.validation[field.name + '[]']) {
                that.model.validation[field.name + '[]'] = that.options.formSchema.validation[field.name + '[]'];
                _addressArray.push(field.name + '[]');
              }

              if (that.options.mode === 'update' && _addressArray.length > 0) {
                _.each(_addressArray, function(element) {
                  if (that.options.formData.fields[element]) {
                    // Need to set default value to the model
                    that.model.set(element, that.options.formData.fields[element]);
                    $(':input[name="' + element + '"]', $containerOptions)
                      .val(that.options.formData.fields[element]);
                  }
                });
              }

              // Check to see if this has UserId Field Type
              if (_typeLowerCase === 'userid') {
                Utils.setupUserIdAjaxCall($('form.form-render'));
                if (!that.model.validation[field.name].pattern && !(field.options.render && field.options.render.toLowerCase() === 'select')) {
                  that.model.validation[field.name].pattern = 'email';
                }
              }
              Utils.setupUrlAjaxCall($('form.form-render'), $('#' + field.name));

              // If there are DatePicker
              if (that._hasDate) {
                Utils.setupDateInput(that.el);
              }
            }
          } else {
            // Trigger Event to let other objects know that this fields will go out of markup
            $('#' + field.name, that.el)
              .trigger('removeVisibleOn');

            // Remove this out of the markup
            $('.options-visible-on-' + field.name, that.el)
              .remove();
            if (_typeLowerCase === 'address') {
              var _address_name = field.name + '_address_street';
              that.model.set(_address_name, '');
              if (that.options.formSchema.validation[_address_name]) {
                that.model.validation[_address_name] = that.options.formSchema.validation[_address_name];
                delete that.model.validation[_address_name];
              }
              _address_name = field.name + '_address_city';
              that.model.set(_address_name, '');
              if (that.options.formSchema.validation[_address_name]) {
                that.model.validation[_address_name] = that.options.formSchema.validation[_address_name];
                delete that.model.validation[_address_name];
              }
              _address_name = field.name + '_address_state';
              that.model.set(_address_name, '');
              if (that.options.formSchema.validation[_address_name]) {
                that.model.validation[_address_name] = that.options.formSchema.validation[_address_name];
                delete that.model.validation[_address_name];
              }
              _address_name = field.name + '_address_zip';
              that.model.set(_address_name, '');
              if (that.options.formSchema.validation[_address_name]) {
                that.model.validation[_address_name] = that.options.formSchema.validation[_address_name];
                delete that.model.validation[_address_name];
              }
              _address_name = field.name + '_address_country';
              that.model.set(_address_name, '');
              if (that.options.formSchema.validation[_address_name]) {
                that.model.validation[_address_name] = that.options.formSchema.validation[_address_name];
                delete that.model.validation[_address_name];
              }
            } else if (_typeLowerCase !== 'html') {
              that.model.set(field.name, '');
              if (that.model.validation[field.name]) {
                // Remove Validation Scheme, if has one
                delete that.model.validation[field.name];
              } else if (that.model.validation[field.name + '[]']) {
                delete that.model.validation[field.name + '[]'];
              }
              // Need to unbind the ModelBinder

              var _bindingName = field.name;

              _.each(_checkBindingArray, function(_suffix) {
                if (that.model.bindings[_bindingName + _suffix]) {
                  that.model.unbindModelBinder(_bindingName + _suffix, field.type);
                  that._modelBinder.bind(that.model, that.el, that.model.bindings);
                  // For Checkbox, this caused the value to be set to empty string.
                  if (!$currentTarget.is(':checkbox')) {
                    $currentTarget.val(_visibleVal);
                  }
                }
              });
            }
          }
        });
    },
    /**
     * Setup Copy Values From Options
     **/
    setupCopyValuesFrom: function(field) {
      if (!field.options.copyvaluesfrom.name || !field.options.copyvaluesfrom.description) {
        throw 'In order to use CopyValuesFrom options, need to have Name and Description';
      }
      var that = this,
        _html = '';

      _html += '<div class="copy-values-from ' + field.options.copyvaluesfrom.name + '">' + this.inputTemplate['buttongroup']({
        description: field.options.copyvaluesfrom.description
      }) + '</div>';

      $(this.el)
        .on('click', '.copy-values-from.' + field.options.copyvaluesfrom.name + ' .btn-group button', function(e) {
          var $currentTarget = $(e.currentTarget),
            _fields, _currentFields, _values = [];
          if ($currentTarget.hasClass('btn-yes')) {
            _fields = Utils.getSpecialFieldsName(field.options.copyvaluesfrom.name, field.type);
            _.each(_fields, function(element) {
              _values.push($(':input[name="' + element + '"]', that.el)
                .val());
            });
            _currentFields = Utils.getSpecialFieldsName(field.name, field.type);
            Utils.setFieldsValues(that.el, that.model, _currentFields, _values);
          } else {
            _currentFields = Utils.getSpecialFieldsName(field.name, field.type);
            Utils.setFieldsValues(that.el, that.model, _currentFields);
          }
        });

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
      switch (_orderBy) {

        // Always alphabetical
        default: _func = function(a, b) {
          return a.localeCompare(b);
        };
      }
      field.values.sort(_func);
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
    }
  });
});