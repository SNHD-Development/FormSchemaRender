/**
 * Horizontal Form Layout
 **/
define([
  'jquery',
  'lodash',
  'backbone',
  'vm',
  'utils',
  'events',
  'modelbinder',
  'validation',
  'views/baseField',
  'text!templates/form-layouts/horizontal.html'
], function($, _, Backbone, Vm, Utils, Events, Modelbinder, Validation, BaseFieldView, formLayoutTemplate){
  var AppView = BaseFieldView.extend({
	_modelBinder: undefined,
    template: _.template(formLayoutTemplate),
    initialize: function () {
		BaseFieldView.prototype.initialize.call(this);

		this._divcontrolgroup = 0;	// init div counter
		if (typeof this.options.formSchema === 'undefined') {
			throw 'formSchema is not in the options parameters';
		}
		this.el = '#'+this.options.formSchema.name;
		$(this.el).addClass('form-horizontal');
    },
    render: function () {
		var that = this
		, _parentRender = BaseFieldView.prototype.render
		, _html = ''
		, _required;
	  _.each(this.options.formSchema.fields, function(value, key, list) {
		var _temp = '';
		// Check for Show On Mode
		if ( ! BaseFieldView.prototype.checkShowOnMode.call(that, value, that.options.mode, that.options.formData.status) ) {
		  return '';
		}

		if (typeof value.description !== 'undefined' && _.indexOf(that.notRenderLabel, value.type.toLowerCase()) === -1) {
		  var _visibleon = '', _style = '';
		  if (value.options.visibleon) {
			_visibleon = ' options-visible-on-'+value.name;
			_style = ' style="display:none"';
		  }
		  _temp += '<div class="control-group'+_visibleon+'"'+_style+'>';
		  this._divcontrolgroup++;

		  _required = Utils.checkRequireFields(value, that.options.formSchema.validation);
		  _temp += that.renderLabel(value, _required, 'control-label');
		  _temp += '<div class="controls">';
		}

		_temp += _parentRender.call(that, value);

		if (typeof value.description !== 'undefined' && _.indexOf(that.notRenderLabel, value.type.toLowerCase()) === -1) {
		  _temp += '</div></div>';
		  this._divcontrolgroup--;
		}

		// If this has VisibleOn in options
		if (value.options.visibleon) {
		  BaseFieldView.prototype.setupVisibleOn.call(that, value, _temp, '.control-group');
		} else {
		  _html += _temp;
		}
	  });

	  // Closed open div
	  _html += BaseFieldView.prototype.closeOpenDiv.call(this);
      $(this.el).html(this.template(_.extend({html : _html}, this.options.formSchema)));

	  // Bind Model
	  that._modelBinder.bind(that.model, that.el);
	  Backbone.Validation.bind(that, {forceUpdate: true});
    }
  });
  return AppView;
});
