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
	  _html += BaseFieldView.prototype.closeOpenDiv.call(this);
	  _html += BaseFieldView.prototype.closeOpenDiv.call(this, '_stepDiv');
      $(this.el).html(this.template(_.extend({html : _html}, this.options.formSchema)));

	  this.renderWizardNavBar();
	  // Bind Model
	  that._modelBinder.bind(that.model, that.el);
	  Backbone.Validation.bind(that, {forceUpdate: true});
	  // Add FormWizard Reference
	  this.$formWizard = $('.wizard-view .wizard', this.el);
	  this.$prevBtn = $('.wizard-view .wizard-actions .btn_prev', this.el);
	  this.$nextBtn = $('.wizard-view .wizard-actions .btn_next', this.el);

	  // hide original actions div
	  $('.step-content .step-pane .form-actions', this.el).hide();
	  // Attched Wizard View Events
	  this.attachedEvents();
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
	  $('.wizard-view ul.steps', this.el).html(_html);
	},
	/**
	 * Wizard Events
	 **/
	attachedEvents: function() {
	  this.$prevBtn.on('click', this, this.clickPrev);
	  this.$nextBtn.on('click', this, this.clickNext);
	  this.$formWizard.on('change', this, this.changeStep);
	  this.$formWizard.on('finished', this, this.submittingForm);
	},
	clickPrev: function(e) {
	  e.data.$formWizard.wizard('previous');
	},
	clickNext: function(e) {
	  e.data.$formWizard.wizard('next');
	},
	changeStep: function(e, data) {
	  var _numSteps = e.data._steps.length;
	  if (data.direction === 'next') {
		switch (data.step) {
		  case 1:
			e.data.$prevBtn.removeAttr('disabled').fadeIn('slow');
			break;

		  case ( _numSteps - 1 ):
			e.data.$nextBtn.removeClass('btn-primary').addClass('btn-info').html('<i class="icon-envelope-alt"></i> Submit');
			break;
		}
	  } else {
		switch (data.step) {
		  case 2:
			e.data.$prevBtn.attr('disabled', true).fadeOut('slow');
			break;

		  case _numSteps:
			e.data.$nextBtn.removeClass('btn-info').addClass('btn-primary').html('Next <i class="icon-arrow-right"></i>');
			break;
		}
	  }
	},
	submittingForm: function(e) {
	  // Check to see if this form has submit button
	  var $submitBtn = $(':submit', e.data.el);
	  if ($submitBtn.length > 0) {
		$submitBtn.trigger('click');
	  } else {

	  }
	}
  });
  return AppView;
});
