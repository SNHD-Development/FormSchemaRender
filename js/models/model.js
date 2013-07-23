// Default FormSchema Backbone Model
define([
  'jquery',
  'underscore',
  'backbone',
  'collections/collections'
], function($, _, Backbone, Collections){
  var parseFields = function(model, attrs) {
	var _attrs = {}
	, _validation = {};
	_.each(attrs.fields, function(value) {
	  value.options = value.options || {};
	  switch (value.type.toLowerCase()) {
		case 'fullname':
		  var _hasValidation = (typeof attrs.validation[value.name] !== 'undefined')
		  , _msg = (_hasValidation && attrs.validation[value.name].msg) ? attrs.validation[value.name].msg: false;
		  if (typeof value.options.middlename !== 'undefined' && value.options.middlename) {
			_attrs[value.name+'_fullname_middle_name'] = '';
		  }
		  _attrs[value.name+'_fullname_first_name'] = '';
		  _attrs[value.name+'_fullname_last_name'] = '';
		  if (_hasValidation) {
			_validation[value.name+'_fullname_first_name'] = _.clone(attrs.validation[value.name]);
			if (_msg) {
			  _validation[value.name+'_fullname_first_name'].msg = attrs.validation[value.name].msg + ' (First Name)';
			}
			_validation[value.name+'_fullname_last_name'] = _.clone(attrs.validation[value.name]);
			if (_msg) {
			  _validation[value.name+'_fullname_last_name'].msg = attrs.validation[value.name].msg + ' (Last Name)';
			}
		  }
		  break;

		// If this is list (subform) will need collection
		case 'list':
		  _attrs[value.name] = new Collections();
		  if (typeof attrs.validation[value.name] !== 'undefined') {
			_validation[value.name] = _.clone(attrs.validation[value.name]);
		  }
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

		case 'birthdate':
		  _attrs[value.name] = '';
		  _attrs[value.name+'_birth[month]'] = '';
		  _attrs[value.name+'_birth[day]'] = '';
		  _attrs[value.name+'_birth[year]'] = '';
		  if (typeof attrs.validation[value.name] !== 'undefined') {
			_validation[value.name] = _.clone(attrs.validation[value.name]);
			_validation[value.name+'_birth[month]'] = _.clone(attrs.validation[value.name]);
			_validation[value.name+'_birth[day]'] = _.clone(attrs.validation[value.name]);
			_validation[value.name+'_birth[year]'] = _.clone(attrs.validation[value.name]);
		  }
		  break;

		case 'email':
		  _attrs[value.name] = '';
		  if (typeof attrs.validation[value.name] !== 'undefined') {
			_validation[value.name] = _.clone(attrs.validation[value.name]);
			if (value.options.autocomplete) {
			  _validation[value.name+'_username'] = _.clone(attrs.validation[value.name]);
			  _validation[value.name+'_server'] = _.clone(attrs.validation[value.name]);
			}
		  }
		  break;

		default:
		  _attrs[value.name] = '';
		  if (typeof attrs.validation[value.name] !== 'undefined') {
			_validation[value.name] = _.clone(attrs.validation[value.name]);
		  }
	  }
	});
	model.validation = _validation;
	return _attrs;
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
	appendSubFormInput: function(formId) {
	  var _data = _.clone(this.toJSON());
	  _.each(_data, function(value, key) {
		if (typeof value.toJSON === 'function') {
		  $('#'+formId).prepend('<input type="hidden" name="'+key+'" value=\''+JSON.stringify(value.toJSON())+'\' class="subform_before_submit">');
        }
	  });
	}
  });
});
