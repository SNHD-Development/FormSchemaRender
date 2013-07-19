/**
 * Wizard Form Layout
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
  'text!templates/form-layouts/wizard.html',
  'jquery.wizard'
], function($, _, Backbone, Vm, Events, Modelbinder, Validation, BaseFieldView, formLayoutTemplate){
  var AppView = BaseFieldView.extend({
	_modelBinder: undefined,
    template: _.template(formLayoutTemplate),
    initialize: function () {
	  BaseFieldView.prototype.initialize.call(this);

	  this._steps = [];	// Steps Array that will need to render after

	  if (typeof this.options.formSchema === 'undefined') {
		  throw 'formSchema is not in the options parameters';
	  }
	  this.el = '#'+this.options.formSchema.name;
    },
    render: function () {
		var that = this
		, _parentRender = BaseFieldView.prototype.render
		, _html = '';
	  _.each(this.options.formSchema.fields, function(value, key, list) {
		if (typeof value.description !== 'undefined' && _.indexOf(that.notRenderLabel, value.type.toLowerCase()) === -1) {
		  _html += that.renderLabel(value);
		} else if (value.type.toLowerCase() === 'step') {
		  that._steps.push(value);
		}
		_html += _parentRender.call(that, value);
	  });

	  // Closed open div
	  _html += BaseFieldView.prototype.closeOpenDiv();
      $(this.el).html(this.template(_.extend({html : _html}, this.options.formSchema)));

	  this.renderWizardNavBar();
	  // Bind Model
	  that._modelBinder.bind(that.model, that.el);
	  Backbone.Validation.bind(that, {forceUpdate: true});
    },
	/**
	 * Render Wizard Navigation Bar
	 **/
	renderWizardNavBar: function() {
	  var _html = '';
	  _.each(this._steps, function(element, index) {
		element['class'] = element['class'] || '';
		if (index === 0) {
		  element['class'] += ' active';
		}
		_html += '<li data-target="#wizard_step'+(index+1)+'" class="'+element['class']+'"><span class="badge badge-info">'+(index+1)+'</span>'+element.description+'<span class="chevron"></span></li>';
	  });
	  $('.wizard .steps', this.el).html(_html);
	}
  });
  return AppView;
});
