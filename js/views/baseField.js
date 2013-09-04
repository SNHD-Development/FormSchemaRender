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
  'text!templates/fields/telephone.html',
  'text!templates/fields/hidden.html',
  'text!templates/fields/timestamp.html',
  'text!templates/fields/useraccount.html',
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
  'text!templates/fields/birthdate.html',
  'text!templates/fields/button.html',
  'text!templates/fields/buttongroup.html',
  'text!templates/fields/list.html',
  'text!templates/fields/uneditableinput.html',
  'text!templates/fields/uneditablefile.html',
  'text!templates/fields/uneditableimage.html',
  'text!templates/fields/buttonclipboard.html',
  'text!templates/subform-layouts/table.html',
  'jquery.expose',
  'jquery.datepicker',
  'jquery.birthdaypicker'
], function($, _, Backbone, Bootstrap, Events, Vm, Utils, Model, Modelbinder, Validation
	, listView
	, emailData
	, schoolesData
	, htmlTemplate
	, labelTemplate
	, textTemplate
	, telephoneTemplate
	, hiddenTemplate
	, timestampTemplate
	, useraccountTemplate
	, fileTemplate
	, multifilesTemplate
	, stateTemplate
	, zipcodeTemplate
	, countryTemplate
	, fullnameTemplate
	, addressTemplate
	, textareaTemplate
	, numberTemplate
	, emailTemplate
	, dateTemplate
	, selectTemplate
	, bdateTemplate
	, buttonTemplate
	, buttongroupTemplate
	, listTemplate
	, uneditableinputTemplate
	, uneditablefileTemplate
	, uneditableimageTemplate
	, buttonclipboardTemplate
	, tableTemplate
	){
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
	  this._div = 0;	// Number of Open Div
	  this._hasDate = false; // Tracking the dateinput element
	  this._hasBDate = false; // Tracking the Birthdate element
	  this._hasEmailPicker = false; // Tracking the EmailPicker element
	  this._internalFields = []; // Internal Fields Array
	  this._visibleOn = []; // Field that has visibleOn Options
	  this._multiFiles = []; // MultiFiles Field
	  this._buttonClipboards = []; //Clipboards Button
	  this._buttonDecision = []; //Decision Button
	  this._ajaxSubmit = true;

	  // Wizard View Counters
	  this._stepDiv = 0;	// Count number of open div for step (wizard view)
	  this._currentStep = 1;	// Current Step
	  this._stepValidated = [];	// Hold the field names for each validation step

	  this._modelBinder = new Modelbinder();

	  // Setup Keys
	  this.options.formSchema.validation = this.options.formSchema.validation || {};
	  this.model = new Model( _.extend(this.options.formSchema, { is_internal: this.options.internal, render_mode : this.options.mode } ) );
	  // If user pass in formData
	  if ( ! $.isEmptyObject(this.options.formData)) {
		_.each(this.model.attributes, function(element, index) {
		  if (typeof element === 'object') {
		  } else {
			var _obj = {};
			_obj[index] = that.options.formData.fields[index];
			that.model.set(_obj);
		  }
		});
	  }
	  // Prefixed Name
	  this.prefixedName = {
		'list' : 'subform_',
		'listdisplayid' : '_form_content',
		'collectiondisplayid' : '_form_collection'
	  };
	  // Not render label
	  this.notRenderLabel = [
		'html', 'list', 'button', 'submit', 'clear', 'fieldset', 'fieldsetstart', 'fieldsetend', 'step'
	  ];
	  // Set up the input template
	  this.inputTemplate = {
		"html" : _.template(htmlTemplate),
		"label" : _.template(labelTemplate),
		"text" : _.template(textTemplate),
		"telephone" : _.template(telephoneTemplate),
		"hidden" : _.template(hiddenTemplate),
		"timestamp" : _.template(timestampTemplate),
		"useraccount" : _.template(useraccountTemplate),
		"file" : _.template(fileTemplate),
		"multifiles" : _.template(multifilesTemplate),
		"state" : _.template(stateTemplate),
		"zipcode" : _.template(zipcodeTemplate),
		"country" : _.template(countryTemplate),
		"fullname" : _.template(fullnameTemplate),
		"address" : _.template(addressTemplate),
		"textarea" : _.template(textareaTemplate),
		"number" : _.template(numberTemplate),
		"email" : _.template(emailTemplate),
		"date" : _.template(dateTemplate),
		"select" : _.template(selectTemplate),
		"birthdate" : _.template(bdateTemplate),
		"button" : _.template(buttonTemplate),
		"buttongroup" : _.template(buttongroupTemplate),
		"list" : _.template(listTemplate),
		"uneditableinput" : _.template(uneditableinputTemplate),
		"uneditablefile" : _.template(uneditablefileTemplate),
		"uneditableimage" : _.template(uneditableimageTemplate),
		"buttonclipboard" : _.template(buttonclipboardTemplate),
		'subform-table' : _.template(tableTemplate)
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
	  return ( ( typeof this.options.formSchema.validation[name] === 'undefined' ) ? {} : this.options.formSchema.validation[name] );
	},
	/**
	 * Closed Open Div
	 **/
	closeOpenDiv: function(property) {
	  property = property || '_div';
	  var _html = ''
	  , i = 0, j = this[property];
	  for ( ; i < j; ++i) {
		_html += '</div>';
	  }
	  this._div = 0;
	  return _html
	},
	/**
	 * Render HTML
	 **/
	render: function(field, readMode) {

	  var that = this
	  , _html = ''
	  , _name = [field.name]
	  , _type = field.type.toLowerCase()
	  , _attr = '';
	  field.attributes = field.attributes || {};
	  field.options = field.options || {};
	  this.options.formSchema.validation = this.options.formSchema.validation || {};
	  this.options.formData = this.options.formData || {};

	  // Check to see if this is render internal, external and match with the current display mode or not
	  // In options keys: internal
	  if ( ! this.options.internal && field.options.internal ) {
		return '';
	  } else if ( ( _type === 'button' || _type === 'submit' ) && ! field.options.internal && this.options.internal ) {
		return '';
	  }

	  switch (_type) {

		case 'multifiles':
		  this._multiFiles.push(field);
		  var _validation_tmp = this.getFormValidationData(field.name+'[]');
		  if (typeof this._stepValidated[(this._currentStep)-2] !== 'undefined' && ! $.isEmptyObject(_validation_tmp)) {
			this._stepValidated[(this._currentStep)-2].push(field.name+'[]');
		  }

		  if (this.options.mode === 'read') {
			_type = 'file';
		  }
		  break;

		case 'image':
		  field.attributes.accept = 'image/*';
		case 'file':
		  if ( ! ( this.options.internal && typeof field.options.internalcanupdate !== 'undefined' && ! field.options.internalcanupdate) ) {
			$('form'+this.el).attr('enctype', 'multipart/form-data');
		  }
		  var _validation_tmp = this.getFormValidationData(field.name);
		  if (_validation_tmp.accept) {
			field.attributes.accept = _validation_tmp.accept;
		  }
		  break;

		case 'textbox':
		  _type = 'text';
		  field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'span12');
		  break;

		case 'telephone':
		  field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'integer telephone span12');
		  break;

		case 'textarea':
		  field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'span10');
		  break;

		case 'action':
		  this._div++;
		  return '<div class="form-actions">';

		case 'fieldsetstart':
		  return '<fieldset><legend>'+field.description+'</legend>';

		case 'fieldsetend':
		  return '</fieldset>';

		case 'hr':
		  return '<hr>';

		case 'dateinput':
		  _type = 'date';
		case 'date':
		  // If pass in options.render, by default will render as 'DatePicker'
		  if (field.options.render && field.options.render.toLowerCase() === 'select') {
			_type = 'birthdate'
			this._hasBDate = true;
			field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'birthdaypicker');
			var _validation_tmp = this.getFormValidationData(field.name)
			, _options = {
			  id: field.name
			};
			if (typeof this.options.formData.fields !== 'undefined') {
			  _options['defaultdate'] = this.options.formData.fields[field.name];
			}
			field.attributes['data-options'] = JSON.stringify(_.extend(_options, _validation_tmp));

			// For Wizard View
			if (typeof this._stepValidated[(this._currentStep)-2] !== 'undefined' && ! $.isEmptyObject(_validation_tmp)) {
			  this._stepValidated[(this._currentStep)-2].push(field.name+'_birth[month]');
			  this._stepValidated[(this._currentStep)-2].push(field.name+'_birth[day]');
			  this._stepValidated[(this._currentStep)-2].push(field.name+'_birth[year]');
			}
		  } else {
			this._hasDate = true;
			field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'datepicker');
			var _validation_tmp = this.getFormValidationData(field.name);
			// Setup Max Date
			if (_validation_tmp.maxdate) {
			  field.attributes['data-maxdate'] = _validation_tmp.maxdate;
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
			field.attributes['data-source'] = emailData.replace(/\n/g, '').replace(/'/g, "&#39");
			if (typeof field.options['default'] !== 'undefined') {
			  field.attributes['data-value'] = field.options['default'];
			}

			_name.push(field.name+'_username');
			_name.push(field.name+'_server');
		  }
		  break;

		case 'address':
		  delete field.attributes['class'];
		  delete field.attributes['placeholder'];

		  _name = [];
		  _name.push(field.name+'_address_street');
		  _name.push(field.name+'_address_city');
		  _name.push(field.name+'_address_state');
		  _name.push(field.name+'_address_zip');
		  _name.push(field.name+'_address_country');

		  // Format Data
		  if (typeof readMode !== 'undefined' && typeof this.options.formData !== 'undefined') {
			if (this.options.formData.fields[field.name+'_address_street'] && this.options.formData.fields[field.name+'_address_street'].charAt(this.options.formData.fields[field.name+'_address_street'].length-1) !== '.') {
			  this.options.formData.fields[field.name+'_address_street'] += '.';
			}
			this.options.formData.fields[field.name+'_address_street'] += '<br>';
			this.options.formData.fields[field.name+'_address_city'] += ',';
		  }

		  break;

		case 'number':
		  field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'number span12');
		  if (typeof field.options.spinner !== 'undefined' && field.options.spinner) {
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
		  _name.push(field.name+'_fullname_first_name');
		  if ( typeof field.options.middlename === 'undefined' || field.options.middlename ) {
			_name.push(field.name+'_fullname_middle_name');
		  }
		  _name.push(field.name+'_fullname_last_name');
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
			throw 'In order to use submit button, must pass the Url value in the formSchema';
		  }
		  // AppendId
		  if (field.options.appendid) {
			field.url = ( (field.url) ? field.url : '' ) + ( (field.url.indexOf('?') > -1) ? '&id=': '/') + this.options.formData._id['$oid'];
		  }
		  $(this.el).attr('action', field.url);

		  // Check for Ajax Submit
		  if (typeof field.options.ajaxsubmit !== 'undefined') {
			this._ajaxSubmit = field.options.ajaxsubmit;
		  }

		  break;

		case 'buttonclipboard':
		  field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'btn btn-primary');
		  this._buttonClipboards.push({name: field.name, values : field.values});
		  break;

		case 'buttondecision':
		  if ( ! readMode) {
			field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'btn btn-primary');
			_type = 'button';
			this._buttonDecision.push(field);
		  }
		  break;

		case 'button':
		  field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'btn');
		  // AppendId
		  if (field.options.appendid) {
			field.url = ( (field.url) ? field.url : '' ) + ( (field.url.indexOf('?') > -1) ? '&id=': '/') + this.options.formData._id['$oid'];
		  }
		  break;

		case 'schooles':
		  _type = 'text';
		  field.attributes['data-provide'] = 'typeahead';
		  field.attributes['autocomplete'] = 'off';
		  field.attributes['data-source'] = schoolesData.replace(/\n/g, '').replace(/'/g, "&#39");
		  break;

		// Step Field Type only render for wizard view
		case 'step':
		  if ('view' in this.options.formSchema && this.options.formSchema.view === 'wizard' ) {
			if (this._stepDiv !== 0) {
			  _html += '</div>';
			  this._stepDiv--;
			}
			if (typeof this._stepValidated[(this._currentStep)-1] === 'undefined') {
			  this._stepValidated[this._currentStep-1] = [];
			}
			var _active = 'step-pane' + ( (this._currentStep === 1) ? ' active': '' );
			_html += '<div class="'+_active+'" id="wizard_step'+this._currentStep+'">';
			this._stepDiv++;
			this._currentStep++;
		  } else {
			return '';
		  }
		  break;

		case 'useraccount':
		  field['data_value'] = '';
		  if (field.options.getvaluefromid) {
			field['data_value'] = $('#'+field.options.getvaluefromid).text();
		  }
		  break;

		// Sub Form, will need to render new view to handle the event
		case 'list':
		  field.attributes.id = this.prefixedName['list'] + ( (typeof field.attributes.id !== 'undefined') ? field.attributes.id: field.name );
		  field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'subform-container');
		  // Attached Event

		  var _validation = (typeof this.options.formSchema.validation[field.name] !== 'undefined') ? this.options.formSchema.validation[field.name] : {};
		  this.attachSubFormEvent(field.attributes.id, field, _validation);
		  break;
	  }

	  // Check to see if this is button or submit
	  if (_type === 'button' && field.options.visibleon) {
		var _btnVisibleOnChanged = function (e) {
		  if (e.type === 'change' && field.options.visibleon.values.indexOf($(this).val()) > -1) {
			$('#'+field.name, that.el).show('slow');
		  } else {
			$('#'+field.name, that.el).hide('slow');
		  }
		};
		// Listen to changed event and update the display
		$(this.el).on('change', ':input[name="'+field.options.visibleon.name+'"]', _btnVisibleOnChanged).on('removeVisibleOn', ':input[name="'+field.options.visibleon.name+'"]', _btnVisibleOnChanged);
	  }

	  // Check to see if step validation has been init (wizard view)
	  if (typeof this._stepValidated[(this._currentStep)-2] !== 'undefined'
		  && ! ( _type === 'step' || _type === 'list' )
		  && Utils.checkRequireFields(field, this.options.formSchema.validation) ) {
		_.each(_name, function(element) {
		  that._stepValidated[(that._currentStep)-2].push(element);
		});
	  }

	  // If this is read mode will need to render read template
	  if ( typeof readMode !== 'undefined' && readMode && typeof _name[0] !== 'undefined'
		  &&  ! ( _type === 'button' || _type === 'buttonclipboard' ) ) {
		var _field_data = '', _href = '';
		_.each(_name, function(element) {
		  _field_data += ( (typeof that.options.formData.fields[element] !== 'undefined') ? that.options.formData.fields[element]: '') + ' ';
		});
		_field_data = $.trim(_field_data);
		if (_type === 'file' || _type === 'image') {
		  if (_type === 'image') {
			field.attributes['src'] = ((typeof field.attributes['src'] !== 'undefined') ? field.attributes['src']: '/form/getFile/')+that.options.formData.fields[field.name];
			_href = field.attributes['src'];
		  } else {
			field.attributes['target'] = '_blank';
			field.attributes['class'] = Utils.setupClassAttr(field.attributes['class'], 'btn btn-primary');
			field.attributes['href'] = ((typeof field.attributes['href'] !== 'undefined') ? field.attributes['href']: '/form/getFile/')+that.options.formData.fields[field.name];
		  }
		  delete field.attributes['accept'];
		  _.each(field.attributes, function(value, key) {
			_attr += ' '+key+'=\''+value+'\'';
		  });
		  _html += that.inputTemplate['uneditable'+_type]({value: _field_data, text: field.description, _attr : _attr, id: field.name, href: _href});
		} else if (_type === 'list') {
		  // If this is 'list' type
		  if ( typeof this.options.formData.fields[field.name] !== 'undefined'
			  && this.options.formData.fields[field.name].length > 0 ) {
			var _labels = []
			, _values = new Array (this.options.formData.fields[field.name].length)
			_.each(field.fields, function(element, index) {
			  _labels.push(element.description);
			  _.each(that.options.formData.fields[field.name], function(modelData, index) {
				var _fullName;
				if (typeof _values[index] === 'undefined') {
				  _values[index] = [];
				}
				switch (element.type.toLowerCase()) {
				  case 'timestamp':
					_labels[_labels.length-1] = 'Time';
					// Convert to Human Readable Time
					_values[index].push(Utils.getHumanTime(modelData[element.name]));
					break;

				  case 'useraccount':
					_labels[_labels.length-1] = 'User';
					_values[index].push(modelData[element.name]);
					break;

				  case 'fullname':
					_fullName = modelData[element.name+'_fullname_first_name'];
					if (typeof modelData[element.name+'_fullname_middle_name'] !== 'undefined') {
					  _fullName += ' ' + modelData[element.name+'_fullname_middle_name'];
					}
					_fullName += ' ' + modelData[element.name+'_fullname_last_name'];
					_values[index].push(_fullName);
					break;

				  default:
					_values[index].push(modelData[element.name]);
				}
			  });
			});
			_html += that.inputTemplate['subform-table']({ labels:_labels, values:_values, heading: ( (typeof field.options.readmodedescription === 'undefined') ? field.description: field.options.readmodedescription ) });
		  } else {
			_html += '';
		  }
		} else {
		  var _textarea = '';
		  switch (_type) {
			case 'textarea':
			case 'address':
			  _textarea = ' uneditable-input-textarea';
			  break;
			case 'timestamp':
			  _field_data = Utils.getHumanTime(_field_data)
			  break;
		  }
		  _html += that.inputTemplate['uneditableinput']({value: _field_data, css_class: _textarea, id: field.name});
		}
	  } else {

		// Check if this is internal and has InternalCanUpdate Options
		if (this.options.internal && typeof field.options.internalcanupdate !== 'undefined' && ! field.options.internalcanupdate) {
		  _type = 'hidden';
		} else {
		  _.each(field.attributes, function(value, key) {
			_attr += ' '+key+'=\''+value+'\'';
		  });
		}

		// Convert to file type
		if (_type === 'image') {
		  _type = 'file';
		}

		_html += (typeof this.inputTemplate[_type] !== 'undefined') ? this.inputTemplate[_type](_.extend({_attr:_attr}, field)): '';
	  }

	  // Checking for the VisibleOn options, if it is existed will need to check for the depend value
	  if (field.options.visibleon) {
		if ( ! field.options.visibleon.name || ! $.isArray(field.options.visibleon.values) ) {
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
	  var _type = field.type.toLowerCase()
	  , _cssClass = (typeof cssClass !== 'undefined' && cssClass) ? ' class="'+cssClass+'"': '';
	  switch (_type) {
		case "buttondecision":
		  return '';
	  }
	  return this.inputTemplate['label'](_.extend({ _cssClass:_cssClass, _required: required }, field));
	},
	/**
	 * Render Button
	 **/
	renderButton: function(formOptions) {
	  var _html = '';
	  if (formOptions.submitbutton || formOptions.resetbutton) {
		_html += '<div class="form-actions">';
	  }

	  if (formOptions.submitbutton && ! formOptions.subForm) {
		_html += '<button type="submit" class="btn btn-primary btn-submit">'+formOptions.submitbutton+'</button>';
	  } else {
		_html += '<button type="button" class="btn btn-primary btn-submit">'+formOptions.submitbutton+'</button>';
	  }

	  if (formOptions.resetbutton) {
		_html += '<button type="button" class="btn btn-cancel">'+formOptions.resetbutton+'</button>';
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
	  if (value.options.internal && ( value.options.internal !== this.options.internal )) {
		return false;
	  }

	  // If this is internal fields, we need to push to _internalFields array
	  if (value.options.internal === true && value.name && _type !== 'buttonclipboard') {
		this._internalFields.push(value.name);
	  }

	  if ( this.options.hideButtons && (_type === 'button' || _type === 'submit' || _type === 'reset' || _type ==='action' ) ) {
		return false;
	  }

	  // If this is type VisibleOn and in Read Mode will not render if does not have data
	  if (this.options.mode === 'read' && ! $.isEmptyObject(value.options.visibleon)
		&& ! this.options.formData.fields[value.name]
		&& ! (_type === 'address' || _type === 'buttonclipboard') ) {
		return false;
	  }

	  readMode = readMode || false;
	  status = status || false;

	  if (readMode !== 'read' && value.type.toLowerCase() === 'buttonclipboard') {
		return false;
	  } else if ( readMode === 'read' && ! this.options.internal && value.options.hideonexternalread) {
		return false;
	  } else if (typeof value.options.showonmode !== 'undefined' && value.options.showonmode.indexOf(readMode) === -1) {
		return false;
	  } else if (typeof value.options.showonstatus !== 'undefined') {
		var _showOnStatus = _.map(value.options.showonstatus, function(element){ return element.toLowerCase(); });
		if (status === false || _showOnStatus.indexOf(status.toLowerCase()) === -1) {
		  return false;
		}
	  } else if (this.options.internal && readMode === 'update' && typeof value.options.internalcanupdate !== 'undefined' && ! value.options.internalcanupdate) {
		return false;
	  }

	  return true;
	},
	/**
	 * Subform Events
	 **/
	attachSubFormEvent: function(id, field, validation) {
	  field = _.extend(field, { validation: validation} );
	  // Click add button
	  var that = this
	  , _options = {el:'#'+id+this.prefixedName['listdisplayid'], formSchema:field, formId: id}
	  , _listView = _.extend({}, Backbone.Events);
	  $(this.el).on('click', '#'+id+'_add_btn', _options, this.displaySubForm)
	  // User click cancel button
	  .on(id+'.close', this.closeSubForm)
	  // User added a model
	  .on(id+'.add', _.extend({formId: id}, this), this.addSubformData);

	  // If there are subform data
	  if (this.options.mode === 'update'
		  && typeof this.options.formData.fields[field.name] !== 'undefined'
		  && this.options.formData.fields[field.name].length > 0 ) {
		_listView.on(_options.formId+'.listViewCreated', function(list) {
		  $(that.el).trigger(id+'.add', [list, that.options.formData.fields[field.name]]);
		  _listView.off();
		});
		this.displaySubForm( { data: _options }, {}, true, _listView );
	  }
	},
	displaySubForm: function(e, model, hidden, listView) {
	  model = model || {};
	  hidden = hidden || false;
	  listView = listView || false;
	  var _id
	  , _data = _.clone(e.data);
	  // Load Subform View
	  if ($.isEmptyObject(model)) {
		_id = 'SubFormView' + e.data.formId;
	  } else {
		_data.model = model;
		_id = 'SubFormViewEdit' + e.data.formId;
	  }
	  $(this).parents('div.actions').fadeOut();

	  require(['views/fields/list'], function (SubFormView) {
		var subFormView = Vm.create(this, _id, SubFormView, _data)
		, $subFormView = $(subFormView.el);
		if (hidden) {
		  $subFormView.hide();
		}
		subFormView.render();
		if ( ! hidden) {
		  $subFormView.show();
		  $subFormView.addClass('active');
		  $subFormView.expose({ closeOnEsc: false, closeOnClick: false, color: '#000', zIndex: 1025, renderBody: false });
		}
		if (listView) {
		  listView.trigger(e.data.formId+'.listViewCreated', subFormView);
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
	  $('.actions', list.$el.parent('.subform-container')).fadeIn('slow');
	  Vm.remove('SubFormView'+list.options.formId, true);
	  Vm.remove('SubFormViewEdit'+list.options.formId, true);
	},
	/**
	 * Add model to List
	 **/
	addSubformData: function(e, list, models) {
	  models = models || false;
	  var _view = (list.options.formSchema.view === '') ? 'table': list.options.formSchema.view
	  , _key = list.options.formSchema.name;

	  if (models) {
		var _model = Backbone.Model.extend({});
		_.each(models, function(element) {
		  var _element = new _model;
		  _element.set(element);
		  e.data.model.get(_key).add(_element);
		});
	  } else {
		e.data.model.get(_key).add(list.model);
	  }
	  // Render View
	  require(['views/subform-layouts/'+_view], function (CollectionView) {
		var _data = {
		  el: '#'+list.options.formId+e.data.prefixedName['collectiondisplayid'],
		  formSchema: list.options.formSchema,
		  collection: e.data.model.get(_key)
		}
		, collectionView = Vm.create(this, 'CollectionView'+e.data.formId, CollectionView, _data);
		collectionView.render();

		// Closed Subform
		e.data.closeSubForm(e, list);
	  });
	},
	/**
	 * Setup the VisibleOn Options
	 **/
	setupVisibleOn: function (field, htmlTmpl, parentContainer) {
	  parentContainer = parentContainer || false;
	  var that = this
	  , _typeLowerCase = field.type.toLowerCase();
	  if ( ! field.name) {
		throw 'In order to use VisibleOn option, we need to pass in the Name';
	  }

	  switch (_typeLowerCase) {
		case 'address':
		  delete this.model.validation[field.name+'_address_street'];
		  delete this.model.validation[field.name+'_address_city'];
		  delete this.model.validation[field.name+'_address_state'];
		  delete this.model.validation[field.name+'_address_zip'];
		  delete this.model.validation[field.name+'_address_country'];
		  break;

		case 'multifiles':
		  delete this.model.validation[field.name+'[]'];
		  break;

		default:
		  delete this.model.validation[field.name];
	  }

	  $(this.el).on('change', ':input[name="'+field.options.visibleon.name+'"]', function(e) {
		var $currentTarget = $(e.currentTarget)
		, $container = (parentContainer) ? $currentTarget.parents(parentContainer): $currentTarget
		, $containerOptions
		, _addressArray = [];
		if (_.indexOf(field.options.visibleon.values, $currentTarget.val()) > -1 ) {
		  // Insert this into markup
		  if ($('.options-visible-on-'+field.name, that.el).length < 1) {
			$container.after(htmlTmpl);
			$containerOptions = $container.next('.options-visible-on-'+field.name).fadeIn('slow', function() {
			  $(this).addClass('visible-parent-'+field.options.visibleon.name).attr('data-parent', field.options.visibleon.name);

			  // Remove the class that not belong to this visibleOn
			  var $parent = $('.options-visible-on-'+field.options.visibleon.name, that.el);

			  $('[class*="visible-parent"]', that.el).not('.visible-parent-'+field.options.visibleon.name+',.options-visible-on-'+field.options.visibleon.name+',.visible-parent-'+$parent.attr('data-parent')).remove();

			  if (_typeLowerCase === 'multifiles') {
				$('#'+field.name+'_multifiles_wrapper', this).trigger('visibleOnRenderComplete');
			  } else {
				$(':input[name="'+field.name+'"]', this).trigger('visibleOnRenderComplete');
			  }
			});
			// Adding Validation Scheme, if has one
			if (_typeLowerCase === 'address') {
			  var _address_name = field.name+'_address_street';
			  if (that.options.formSchema.validation[_address_name]) {
				that.model.validation[_address_name] = that.options.formSchema.validation[_address_name];
			  }
			  _addressArray.push(_address_name);

			  _address_name = field.name+'_address_city';
			  if (that.options.formSchema.validation[_address_name]) {
				that.model.validation[_address_name] = that.options.formSchema.validation[_address_name];
			  }
			  _addressArray.push(_address_name);

			  _address_name = field.name+'_address_state';
			  if (that.options.formSchema.validation[_address_name]) {
				that.model.validation[_address_name] = that.options.formSchema.validation[_address_name];
			  }
			  _addressArray.push(_address_name);

			  _address_name = field.name+'_address_zip';
			  if (that.options.formSchema.validation[_address_name]) {
				that.model.validation[_address_name] = that.options.formSchema.validation[_address_name];
			  }
			  _addressArray.push(_address_name);

			  _address_name = field.name+'_address_country';
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
			} else if (that.options.formSchema.validation[field.name+'[]']) {
			  that.model.validation[field.name+'[]'] = that.options.formSchema.validation[field.name+'[]'];
			  _addressArray.push(field.name+'[]');
			}

			if (that.options.mode === 'update' && _addressArray.length > 0) {
			  _.each(_addressArray, function (element) {
				if (that.options.formData.fields[element]) {
				  $(':input[name="'+element+'"]', $containerOptions).val(that.options.formData.fields[element]);
				}
			  });
			}
		  }
		} else {
		  // Trigger Event to let other objects know that this fields will go out of markup
		  $('#'+field.name, that.el).trigger('removeVisibleOn');

		  // Remove this out of the markup
		  $('.options-visible-on-'+field.name, that.el).remove();
		  if (_typeLowerCase === 'address') {
			var _address_name = field.name+'_address_street';
			that.model.set(_address_name, '');
			if (that.options.formSchema.validation[_address_name]) {
			  that.model.validation[_address_name] = that.options.formSchema.validation[_address_name];
			  delete that.model.validation[_address_name];
			}
			_address_name = field.name+'_address_city';
			that.model.set(_address_name, '');
			if (that.options.formSchema.validation[_address_name]) {
			  that.model.validation[_address_name] = that.options.formSchema.validation[_address_name];
			  delete that.model.validation[_address_name];
			}
			_address_name = field.name+'_address_state';
			that.model.set(_address_name, '');
			if (that.options.formSchema.validation[_address_name]) {
			  that.model.validation[_address_name] = that.options.formSchema.validation[_address_name];
			  delete that.model.validation[_address_name];
			}
			_address_name = field.name+'_address_zip';
			that.model.set(_address_name, '');
			if (that.options.formSchema.validation[_address_name]) {
			  that.model.validation[_address_name] = that.options.formSchema.validation[_address_name];
			  delete that.model.validation[_address_name];
			}
			_address_name = field.name+'_address_country';
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
			} else if (that.model.validation[field.name+'[]']) {
			  delete that.model.validation[field.name+'[]'];
			}
		  }
		}
	  });
	},
	/**
	 * Setup Copy Values From Options
	 **/
	setupCopyValuesFrom: function(field) {
	  if ( ! field.options.copyvaluesfrom.name || ! field.options.copyvaluesfrom.description) {
		throw 'In order to use CopyValuesFrom options, need to have Name and Description';
	  }
	  var that = this, _html = '';

	  _html += '<div class="copy-values-from '+field.options.copyvaluesfrom.name+'">' + this.inputTemplate['buttongroup']({ description: field.options.copyvaluesfrom.description }) + '</div>';

	  $(this.el).on('click', '.copy-values-from.'+field.options.copyvaluesfrom.name+' .btn-group button', function(e) {
		var $currentTarget = $(e.currentTarget)
		, _fields, _currentFields, _values = [];
		if ($currentTarget.hasClass('btn-yes')) {
		  _fields = Utils.getSpecialFieldsName(field.options.copyvaluesfrom.name, field.type);
		  _.each(_fields, function(element) {
			_values.push($(':input[name="'+element+'"]', that.el).val());
		  });
		  _currentFields = Utils.getSpecialFieldsName(field.name, field.type);
		  Utils.setFieldsValues(that.el, that.model,  _currentFields, _values);
		} else {
		  _currentFields = Utils.getSpecialFieldsName(field.name, field.type);
		  Utils.setFieldsValues(that.el, that.model, _currentFields);
		}
	  });

	  return _html;
	}
  });
});
