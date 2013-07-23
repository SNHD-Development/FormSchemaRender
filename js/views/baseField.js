// Field Base Class
define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'events',
  'vm',
  'models/model',
  'modelbinder',
  'validation',
  'views/fields/list',
  'text!data/email.json',
  'text!data/schooles.json',
  'text!templates/fields/html.html',
  'text!templates/fields/label.html',
  'text!templates/fields/text.html',
  'text!templates/fields/file.html',
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
  'text!templates/fields/list.html',
  'text!templates/fields/uneditableinput.html',
  'text!templates/fields/uneditablefile.html',
  'jquery.expose',
  'jquery.datepicker',
  'jquery.birthdaypicker'
], function($, _, Backbone, Bootstrap, Events, Vm, Model, Modelbinder, Validation
	, listView
	, emailData
	, schoolesData
	, htmlTemplate
	, labelTemplate
	, textTemplate
	, fileTemplate
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
	, listTemplate
	, uneditableinputTemplate
	, uneditablefileTemplate
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
	initialize: function(){
	  this._div = 0;	// Number of Open Div
	  this._hasDate = false; // Tracking the dateinput element
	  this._hasBDate = false; // Tracking the Birthdate element

	  // Wizard View Counters
	  this._stepDiv = 0;	// Count number of open div for step (wizard view)
	  this._currentStep = 1;	// Current Step
	  this._stepValidated = [];	// Hold the field names for each validation step

	  this._modelBinder = new Modelbinder();

	  // Setup Keys
	  this.options.formSchema.validation = this.options.formSchema.validation || {};
	  this.model = new Model(this.options.formSchema);
	  if ( ! $.isEmptyObject(this.options.formData)) {
		this.model.set(this.options.formData.fields);
	  }
	  // Prefixed Name
	  this.prefixedName = {
		'list' : 'subform_',
		'listdisplayid' : '_form_content',
		'collectiondisplayid' : '_form_collection',
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
		"file" : _.template(fileTemplate),
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
		"list" : _.template(listTemplate),
		"uneditableinput" : _.template(uneditableinputTemplate),
		"uneditablefile" : _.template(uneditablefileTemplate)
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

		switch (_type) {
		  case 'image':
			field.attributes.accept = 'image/*';
		  case 'file':
			$('form'+this.el).attr('enctype', 'multipart/form-data');
			var _validation_tmp = this.getFormValidationData(field.name);
			if (_validation_tmp.accept) {
			  field.attributes.accept = _validation_tmp.accept;
			}
			break;

		  case 'birthdate':
			this._hasBDate = true;
			field.attributes['class'] = 'birthdaypicker '+((typeof field.attributes['class'] !== 'undefined') ? field.attributes['class']: '');
			var _validation_tmp = this.getFormValidationData(field.name)
			, _options = {
			  id: field.name
			};
			if (typeof this.options.formData.fields !== 'undefined') {
			  _options['defaultdate'] = this.options.formData.fields[field.name];
			}
			field.attributes['data-options'] = JSON.stringify(_.extend(_options, _validation_tmp));
			break;

		  case 'textbox':
			_type = 'text';
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
			this._hasDate = true;
			field.attributes['class'] = 'datepicker '+((typeof field.attributes['class'] !== 'undefined') ? field.attributes['class']: '');
			var _validation_tmp = this.getFormValidationData(field.name);
			// Setup Max Date
			if (_validation_tmp.maxdate) {
			  field.attributes['data-maxdate'] = _validation_tmp.maxdate;
			}
			break;

		  case 'email':
			if (typeof field.options.autocomplete !== 'undefined' && field.options.autocomplete) {
			  field.attributes = {};
			  field.attributes['data-provide'] = 'typeahead';
			  field.attributes['autocomplete'] = 'off';
			  field.attributes['data-source'] = emailData.replace(/\n/g, '').replace(/'/g, "&#39");
			  if (typeof field.options['default'] !== 'undefined') {
				field.attributes['value'] = field.options['default'];
			  }
			}
			break;

		  case 'address':
			delete field.attributes['class'];
			delete field.attributes['placeholder'];
			break;

		  case 'fullname':
			delete field.attributes['class'];
			delete field.attributes['placeholder'];
			_name = [];
			_name.push(field.name+'_fullname_first_name');
			_name.push(field.name+'_fullname_last_name');
			if (typeof field.options.middlename !== 'undefined' && field.options.middlename) {
			  _name.push(field.name+'_fullname_middle_name');
			}
			break;

		  case 'clear':
			_type = 'button';
			field.attributes['class'] = ((typeof field.attributes['class'] !== 'undefined') ? field.attributes['class']: 'btn') + ' btn-clear-form';
			break;

		  case 'submit':
			_type = 'button';
			field['_submit'] = true;
			// If this is submit button will override the action of this form
			if (typeof field.url === 'undefined') {
			  throw 'In order to use submit button, must pass the Url value in the formSchema';
			}
			$(this.el).attr('action', field.url);
		  case 'button':
			field.attributes['class'] = (typeof field.attributes['class'] !== 'undefined') ? field.attributes['class']: 'btn';

			if ( typeof field.showonstatus !== 'undefined'
				&& typeof this.options.formData.status === 'string'
				&& this.options.formData.status !== field.showonstatus ) {
			  return '';
			} else if (this.options.mode === 'create' && typeof field.showonstatus !== 'undefined') {
			  return '';
			} else if (this.options.mode !== 'create' && typeof field.showonstatus === 'undefined') {
			  return '';
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

		  // Sub Form, will need to render new view to handle the event
		  case 'list':
			field.attributes.id = this.prefixedName['list'] + ( (typeof field.attributes.id !== 'undefined') ? field.attributes.id: field.name );
			field.attributes['class'] = (typeof field.attributes['class'] !== 'undefined') ? field.attributes['class']: 'subform-container';
			// Attached Event

			var _validation = (typeof this.options.formSchema.validation[field.name] !== 'undefined') ? this.options.formSchema.validation[field.name] : {};
			this.attachSubFormEvent(field.attributes.id, field, _validation);
			break;
		}

		// Check to see if step validation has been init (wizard view)
		if (typeof this._stepValidated[(this._currentStep)-2] !== 'undefined'
			&& ! ( _type === 'step' || _type === 'list')
			&& (typeof this.options.formSchema.validation[field.name] !== 'undefined') ) {
		  _.each(_name, function(element) {
			that._stepValidated[(that._currentStep)-2].push(element);
		  });
		}

		// If this is read mode will need to render read template
		if ( typeof readMode !== 'undefined' && readMode && typeof _name[0] !== 'undefined'
			&&  _type !== 'button' ) {
		  var _field_data = '';
		  _.each(_name, function(element) {
			_field_data += ( (typeof that.options.formData.fields[element] !== 'undefined') ? that.options.formData.fields[element]: '') + ' ';
		  })
		  _field_data = $.trim(_field_data);
		  if (_type === 'file') {
			field.attributes['class'] = ((typeof field.attributes['class'] !== 'undefined') ? field.attributes['class']: 'btn btn-primary');
			field.attributes['href'] = ((typeof field.attributes['href'] !== 'undefined') ? field.attributes['href']: '/form/getFile/')+that.options.formData.fields[field.name];
			delete field.attributes['accept'];
			_.each(field.attributes, function(value, key) {
			  _attr += ' '+key+'=\''+value+'\'';
			});
			_html += that.inputTemplate['uneditablefile']({value: _field_data, text: field.description, _attr : _attr});
		  } else if (_type === 'list') {
			_html += '';
		  } else {
			_html += that.inputTemplate['uneditableinput']({value: _field_data});
		  }
		} else {
		  _.each(field.attributes, function(value, key) {
			_attr += ' '+key+'=\''+value+'\'';
		  });

		  // Convert to file type
		  if (_type === 'image') {
			_type = 'file';
		  }
		  _html += (typeof this.inputTemplate[_type] !== 'undefined') ? this.inputTemplate[_type](_.extend({_attr:_attr}, field)): '';
		}
		return _html;
	},
	/**
	 * Render Label
	 **/
	renderLabel: function(field, cssClass) {
	  field.attributes = field.attributes || {};
	  field.options = field.options || {};
	  var _cssClass = (typeof cssClass !== 'undefined' && cssClass) ? ' class="'+cssClass+'"': '';
	  return this.inputTemplate['label'](_.extend({ _cssClass:_cssClass }, field));
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
	 * Subform Events
	 **/
	attachSubFormEvent: function(id, field, validation) {
	  field = _.extend(field, { validation: validation} );
	  // Click add button
	  $(this.el).on('click', '#'+id+'_add_btn', {el:'#'+id+this.prefixedName['listdisplayid'], formSchema:field, formId: id}, this.displaySubForm)
	  // User click cancel button
	  .on(id+'.close', this.closeSubForm)
	  // User added a model
	  .on(id+'.add', this, this.addSubformData);
	},
	displaySubForm: function(e, model) {
	  model = model || {};
	  var _id
	  , _data = _.clone(e.data);
	  // Load Subform View
	  if ($.isEmptyObject(model)) {
		_id = 'SubFormView' + e.data.formId;
	  } else {
		_data.model = model;
		_id = 'SubFormViewEdit' + e.data.formId;
	  }
	  require(['views/fields/list'], function (SubFormView) {
		var subFormView = Vm.create(this, _id, SubFormView, _data);
		subFormView.render();
		$(subFormView.el).addClass('active').expose({ closeOnEsc: false, closeOnClick: false, color: '#000' });
	  });
	  $(this).parents('div.actions').fadeOut();
	},
	closeSubForm: function(e, list) {
	  list.$el.fadeOut();
	  // Close mask bg
	  $.mask.close();
	  $('.actions', list.$el.parent('.subform-container')).fadeIn('slow');
	  Vm.remove('SubFormView'+list.options.formId, true);
	},
	addSubformData: function(e, list) {
	  var _view = (list.options.formSchema.view === '') ? 'table': list.options.formSchema.view
	  , _key = list.options.formSchema.name;
	  e.data.closeSubForm(e, list);
	  e.data.model.get(_key).add(list.model);
	  // Render View
	  require(['views/subform-layouts/'+_view], function (CollectionView) {
		var _data = {
		  el: '#'+list.options.formId+e.data.prefixedName['collectiondisplayid'],
		  formSchema: list.options.formSchema,
		  collection: e.data.model.get(_key)
		}
		, collectionView = Vm.create(this, 'CollectionView'+e.data.formId, CollectionView, _data);
		collectionView.render();
	  });
	}
  });
});
