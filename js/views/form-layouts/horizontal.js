/**
 * Horizontal Form Layout
 **/
define([
  'jquery',
  'lodash',
  'backbone',
  'vm',
  'events',
  'modelbinder',
  'validation',
  'views/baseField',
  'text!templates/form-layouts/horizontal.html'
], function($, _, Backbone, Vm, Events, Modelbinder, Validation, BaseFieldView, formLayoutTemplate){
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
		// Check for Show On Mode
		if ( ! BaseFieldView.prototype.checkShowOnMode.call(that, value) ) {
		  return '';
		}

		if (typeof value.description !== 'undefined' && _.indexOf(that.notRenderLabel, value.type.toLowerCase()) === -1) {
			_html += '<div class="control-group">';
			this._divcontrolgroup++;

			_required = (typeof that.options.formSchema.validation[value.name] !== 'undefined' && that.options.formSchema.validation[value.name].required) ? true: false;
			_html += that.renderLabel(value, _required, 'control-label');
			_html += '<div class="controls">';
		}

		_html += _parentRender.call(that, value);

		if (typeof value.description !== 'undefined' && _.indexOf(that.notRenderLabel, value.type.toLowerCase()) === -1) {
			_html += '</div></div>';
			this._divcontrolgroup--;
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
