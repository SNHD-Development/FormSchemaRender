/**
 * Wizard Form Layout
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
  'text!templates/form-layouts/wizard.html',
  'jquery.wizard',
  'bootstrap',
  'jquery.birthdaypicker'
], function($, _, Backbone, Vm, Utils, Events, Modelbinder, Validation, BaseFieldView, formLayoutTemplate){
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
		var that = this, _required
		, _parentRender = BaseFieldView.prototype.render
		, _html = '';
	  _.each(this.options.formSchema.fields, function(value, key, list) {
		var _temp = '';
		// Check for Show On Mode
		if ( ! BaseFieldView.prototype.checkShowOnMode.call(that, value, that.options.mode, that.options.formData.status) ) {
		  return '';
		}

		if (typeof value.description !== 'undefined' && _.indexOf(that.notRenderLabel, value.type.toLowerCase()) === -1) {
		  _required = Utils.checkRequireFields(value, that.options.formSchema.validation);
		  _temp += that.renderLabel(value, _required);
		} else if (value.type.toLowerCase() === 'step') {
		  that._steps.push(value);
		}
		_temp += _parentRender.call(that, value);

		// If this has VisibleOn in options
		if (value.options.visibleon) {
		  _temp = '<div class="options-visible-on-'+value.name+'" style="display:none">'+_temp+'</div>';
		  BaseFieldView.prototype.setupVisibleOn.call(that, value, _temp);
		} else {
		  _html += _temp;
		}
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
	  var _html = '', _icon, $steps, _stepWidth, _offset;
	  _.each(this._steps, function(element, index) {
		element['class'] = element['class'] || '';
		if (index === 0) {
		  element['class'] += ' active';
		}
		// If has an icon will include here
		_icon = (typeof element.icon === 'undefined') ? '': '<i class="icon '+element.icon+' icon-3x"></i>';
		_html += '<li data-target="#wizard_step'+(index+1)+'" class="'+element['class']+'">'+_icon+'<span class="badge badge-info">'+(index+1)+'</span>'+element.description+'</li>';
	  });
	  $steps = $('.wizard-view ul.steps', this.el).html(_html);

	  // Calculated the Step Width
	  _stepWidth = Math.floor( ( $steps.width() - this._steps.length ) / this._steps.length );
	  _offset = $steps.width() - ( _stepWidth * this._steps.length) - 2;
	  $('li', $steps).css('width', _stepWidth).last().css('width', _stepWidth+_offset);
	},
	/**
	 * Wizard Events
	 **/
	attachedEvents: function() {
	  this.$prevBtn.on('click', this, this.clickPrev);
	  this.$nextBtn.on('click', this, this.clickNext);
	  this.$formWizard.on('change', this, this.changeStep);
	  this.$formWizard.on('finished', this, this.submittingForm);
	  this.$formWizard.on('stepclick', this, this.stepClicked);
	  $(this.el).on(this.options.formSchema.name+'.validated', this, this.validatedForm);
	  $(this.el).on(this.options.formSchema.name+'.postSubmit', this, this.respondResult);
	},
	clickPrev: function(e) {
	  e.data.$formWizard.wizard('previous');
	},
	clickNext: function(e) {
	  e.data.$formWizard.wizard('next');
	},
	/**
	 * Step Click
	 **/
	stepClicked: function(e, data) {
	  switch (data.step) {
		case 1:
		  e.data.$prevBtn.attr('disabled', true).fadeOut('slow');
		default:
		  e.data.$nextBtn.removeClass('btn-info').addClass('btn-primary').html('Next <i class="icon-arrow-right"></i>');
	  }
	},
	/**
	 * When step about to change
	 **/
	changeStep: function(e, data) {
	  var _numSteps = e.data._steps.length;
	  Utils.getBDateinput(e.data.el, e.data.model);
	  Utils.getDefaultValues(e.data.el);
	  if (data.direction === 'next') {
		// Validate this step
		if ( ! e.data.isStepValid(data.step - 1)) {
		  e.preventDefault();
		} else {
		  switch (data.step) {
			case 1:
			  e.data.$prevBtn.removeAttr('disabled').fadeIn('slow');
			  break;

			case ( _numSteps - 1 ):
			  e.data.$nextBtn.removeClass('btn-primary').addClass('btn-info').html('<i class="icon-envelope-alt"></i> Submit');
			  break;
		  }
		}
	  } else {
		// Validate this step
		if ( ! e.data.isStepValid(data.step - 2)) {
		  e.preventDefault();
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
	  }
	},
	/**
	 * Validated Each Step
	 **/
	isStepValid: function(index) {
	  var that = this, _error = false, _elementError, $element;

	  if (typeof this._stepValidated[index] !== 'undefined') {
		_.each(this._stepValidated[index], function(element) {
		  $element = $(':input[name="'+element+'"]', that.el).removeClass('invalid');
		  _elementError = that.model.isValid(element);
		  if ( ! _elementError) {
			$element.addClass('invalid');
			_error = true;
		  }
		});
		if (_error) {
		  var _opt = {
			html : true,
			placement: 'top',
			trigger: 'manual',
			title: '<i class="icon-edit"></i> Validation Error',
			content: 'Please correct the form'
		  };
		  this.renderErrorPopover(this.$nextBtn, $(this.el), _opt)
		}
	  }
	  return ! _error;
	},
	submittingForm: function(e) {
	  // Check to see if this form has submit button
	  var $submitBtn = $(':submit[type="submit"]', e.data.el);

	  if ($submitBtn.length > 0) {
		$submitBtn.trigger('click');
	  }
	},
	/**
	 * Submitting Event
	 **/
	validatedForm: function(e) {
	  var $form = $(e.data.el)
	  , _opt = {
		html : true,
		placement: 'top',
		trigger: 'manual'
	  };
	  if ($form.hasClass('validation_pass')) {
		_opt.title = 'Submitting Form, Please wait';
		_opt.content = '<i class="icon-spinner icon-spin icon-large"></i> Sending data...';
		e.data.$nextBtn.attr('disabled', true).popover(_opt).popover('show')
			.next('.popover').addClass('success');
	  } else {
		_opt.title = '<i class="icon-edit"></i> Validation Error';
		_opt.content = 'Please correct the form';
		e.data.renderErrorPopover(e.data.$nextBtn, $form, _opt);
	  }
	},
	/**
	 * Popover UI for error
	 **/
	renderErrorPopover: function($btn, $form, opts) {
		$btn.attr('disabled', true).popover(opts).popover('show');

		window.setTimeout(
		function() {
		  $('.invalid:first', $form).focus();
		  $btn.attr('disabled', false).popover('destroy');
		  $btn.next('.popover').remove();
		}, 2000 );
	},
	respondResult: function(e) {
	  window.setTimeout(
          function() {
              e.data.$nextBtn.attr('disabled', false).popover('destroy').next('.popover').removeClass('success').remove();
          },
          3000
      );
	}
  });
  return AppView;
});
