// Default FormSchema Backbone Model
define([
  'jquery',
  'underscore',
  'backbone',
  'collections/collections'
], function($, _, Backbone, Collections){
  var parseFields = function(model, attrs) {
	var _attrs = {}
	, _validation = {}
	, _name
	, _internal = ( attrs.is_internal ) ? true: false;

	_.each(attrs.fields, function(value) {
	  value.options = value.options || {};
	  if ( ! _internal && value.options.internal) {
		return;
	  }
	  if (typeof attrs.validation[value.name] !== 'undefined' ) {
		_.each(attrs.validation[value.name], function(validationValue, key) {
		  delete attrs.validation[value.name][key];
		  attrs.validation[value.name][key.toLowerCase()] = validationValue;
		});
	  }
	  switch (value.type.toLowerCase()) {
		case 'address':
		  _name = value.name+'_address_street';
		  _attrs[_name] = '';
		  setValidationData(_name, attrs, _validation, ' (Street)');

		  _name = value.name+'_address_city';
		  _attrs[_name] = '';
		  setValidationData(_name, attrs, _validation, ' (City)');

		  _name = value.name+'_address_state';
		  _attrs[_name] = '';
		  setValidationData(_name, attrs, _validation, ' (State)');

		  _name = value.name+'_address_zip';
		  _attrs[_name] = '';
		  setValidationData(_name, attrs, _validation, ' (ZIP)');

		  _name = value.name+'_address_country';
		  _attrs[_name] = '';
		  setValidationData(_name, attrs, _validation, ' (Country)');

		  break;

		case 'fullname':
		  if ( typeof value.options.middlename === 'undefined' || value.options.middlename ) {
			_name = value.name+'_fullname_middle_name';
			_attrs[_name] = '';
			setValidationData(_name, attrs, _validation, ' (Middle Name)');
		  }

		  _name = value.name+'_fullname_first_name';
		  _attrs[_name] = '';
		  setValidationData(_name, attrs, _validation, ' (First Name)');


		  _name = value.name+'_fullname_last_name';
		  _attrs[_name] = '';
		  setValidationData(_name, attrs, _validation, ' (Last Name)');

		  break;

		// If this is list (subform) will need collection
		case 'list':
		  _attrs[value.name] = new Collections();
		  setValidationData(value.name, attrs, _validation, '');
		  break;

		// Will ignore these types
		case 'fieldsetstart':
		case 'fieldsetend':
		case 'fieldset':
		case 'clear':
		case 'action':
		case 'button':
		case 'submit':
		case 'hr':
		case 'html':
		case 'step':	// Special Field Type for Wizard View
		  break;

		case 'date':
		  if (value.options.render && value.options.render.toLowerCase() === 'select') {
			_attrs[value.name] = '';
			_attrs[value.name+'_birth[month]'] = '';
			_attrs[value.name+'_birth[day]'] = '';
			_attrs[value.name+'_birth[year]'] = '';
			if (typeof attrs.validation[value.name] !== 'undefined') {
			  _validation[value.name] = _.clone(attrs.validation[value.name]);

			  var _dateValidation = _.clone(attrs.validation[value.name]);

			  if (_dateValidation.mindate) {
				delete _dateValidation.mindate;
			  }
			  if (_dateValidation.maxdate) {
				delete _dateValidation.maxdate;
			  }

			  _validation[value.name+'_birth[month]'] = _.clone(_dateValidation);
			  _validation[value.name+'_birth[day]'] = _.clone(_dateValidation);
			  _validation[value.name+'_birth[year]'] = _.clone(_dateValidation);
			}
		  } else {
			_attrs[value.name] = '';
			setValidationData(value.name, attrs, _validation, '');
		  }
		  break;

		case 'email':
		  _attrs[value.name] = '';
		  if (typeof attrs.validation[value.name] !== 'undefined') {
			_validation[value.name] = _.clone(attrs.validation[value.name]);
			if (value.options.autocomplete) {
			  var _emailValidation = _.clone(attrs.validation[value.name])
			  , _emailServerValidation = _.clone(attrs.validation[value.name]);

			  if (_emailValidation.pattern && _emailValidation.pattern === 'email') {
				_emailValidation.pattern = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))$/i;
				_emailServerValidation.pattern = /^((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
			  }
			  _validation[value.name+'_username'] = _emailValidation;
			  _validation[value.name+'_server'] = _emailServerValidation;
			}
		  }
		  break;

		default:
		  _attrs[value.name] = '';
		  setValidationData(value.name, attrs, _validation, '');
	  }
	});
	model.validation = _validation;
	return _attrs;
  },
  /**
   * Set Validation Data
   **/
  setValidationData = function(name, attrs, validation, msg) {
	if ((typeof attrs.validation[name] !== 'undefined')) {
	  validation[name] = _.clone(attrs.validation[name]);
	  if (attrs.validation[name].msg) {
		validation[name].msg = attrs.validation[name].msg + msg;
	  }
	}
  };

  return Backbone.Model.extend({
	initialize: function() {
	  var _attrs = parseFields(this, this.attributes);
	  this.clear();
	  this.set(_attrs);

	  /**
	   * Add Invalid Event
	   **/
	  this.on('validated:invalid', function(model, errors) {
		_.each(errors, function(value, key) {
		  $(':input[name="'+key+'"]').addClass('invalid');
		});
	  });
	},
	/**
	 * Trim the value before setting the value
	 **/
	setTrim : function(key, value, options) {
	  var attrs;
	  value = $.trim(value);
      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (_.isObject(key) || key == null) {
        attrs = key;
        options = value;
      } else {
        attrs = {};
        attrs[key] = value;
      }

      options = options || {};
      if ( options.trim ) {
          attrs[key] = $.trim( attrs[key] );
      }

	  Backbone.Model.prototype.set.call( this, attrs, options );
	},
	/**
	 * Parse nested JSON data, case Model -> Collection and append to the form input
	 **/
	appendSubFormInput: function(formId, internalField) {
	  var _data = _.clone(this.toJSON()), _postfix;
	  _.each(_data, function(value, key) {
		_postfix = (internalField.indexOf(key) > -1) ? '_internal': '';
		if (typeof value.toJSON === 'function') {
		  $('#'+formId).prepend('<input type="hidden" name="'+key+_postfix+'" value=\''+JSON.stringify(value.toJSON())+'\' class="subform_before_submit">');
        } else {
		}
	  });
	}
  });
});
