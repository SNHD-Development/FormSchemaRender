/**
 * Main View Controller
 **/

define([
  'jquery',
  'lodash',
  'backbone',
  'vm',
  'utils',
  'events',
  'text!templates/layout.html',
  'jquery.ajaxsubmit',
  'jquery.datepicker',
  'jquery.placeholder',
  'jquery.lightbox',
  'jquery.expose',
  'bootstrap'
], function($, _, Backbone, Vm, Utils, Events, layoutTemplate){
  var AppView = Backbone.View.extend({
    template: _.template(layoutTemplate),
    el: '#app',
    initialize: function () {
      if (typeof this.options.formSchema === 'undefined') {
        throw 'formSchema is not in the options parameters';
      }
    },
    render: function () {
      var that = this
      , formLayout = ('view' in this.options.formSchema) ? this.options.formSchema.view: 'default'
      , _opts = {
          formSchema: that.options.formSchema,
          formData: that.options.formData,
          mode : that.options.mode,
		  internal : that.options.internal
        };

      this.$el.html(this.template(this.options.formSchema));

      if (typeof this.options.mode !== 'undefined' && this.options.mode === 'read') {
        require(['views/readonly/'+formLayout], function (ReadView) {
          var readView = Vm.create(that, 'ReadView', ReadView, _opts);
          readView.render();
        });
      } else {
        // Will render Form
        // Render Form Layout
        require(['views/form-layouts/'+formLayout], function (FormView) {
          that.formView = Vm.create(that, 'FormView', FormView, _opts);
          that.formView.render();

          if (that.formView._hasDate) {
            that.setupDateInput();
          }
          if (that.formView._hasBDate) {
            that.setupBDateInput();
          }
		  if (that.formView._hasEmailPicker) {
            that.setupEmailInput();
          }

		  // Setup Spinner
		  Utils.setupSpinner(that.el);

		  // Placeholder Setup for Older Browser
		  Utils.setupPlaceHolder(that.el);

		  // Setup Files Input
		  Utils.setupFileInput(that.el);

          // Render Form Complete
          // Send view at second parameter
          $('#'+that.options.formSchema.name, that.el).trigger(that.options.formSchema.name+'.renderCompleted', that);
        });
      }
    },
    /**
     * Init BDateinput
     **/
    setupBDateInput: function() {
      Utils.setupBDateInput(this.el, this.formView.model);
    },
    /**
     * Get BDate Input
     **/
    getBDateinput: function(el, model) {
      Utils.getBDateinput(el, model);
    },
	/**
     * Init Emailinput
     **/
	setupEmailInput: function() {
	  Utils.setupEmailInput(this.el);
	},
    /**
     * Init Dateinput
     **/
    setupDateInput: function() {
      Utils.setupDateInput(this.el);
    },
	/**
	 * Prevent Space Bar
	 **/
	preventSpace: function(e) {
	  Utils.preventSpace(e);
	},
	/**
	 * Valid Number and Decimal
	 **/
	allowNumber: function(e) {
	  Utils.allowNumber(e);
	},
	/**
	 *
	 **/
	allowZipCode: function(e) {
	  Utils.allowZipCode(e);
	},
    /**
	 * View Events
	 **/
	events: {
	  'submit form.form-render': 'submitForm',
	  'click .form-actions .btn-clear-form': 'clearForm',
	  'click .form-actions .btn-render-form': 'setupForm',
	  'blur :input:not(:button)' : 'preValidate',
	  'change :file' : 'preValidate',
	  'keydown :input[type="email"]': 'preventSpace',
	  'keydown :input[type="number"], :input.number': 'allowNumber',
	  'keydown :input.allowzipcode': 'allowZipCode'
	},
	/**
	 * Submit Form
	 **/
	submitForm: function(e) {
      var $form = $('#'+this.options.formSchema.name, this.el)
      , $submitBtn = $('.form-actions button[type="submit"]', this.el)
      , _opt, _options;
      if ($form.hasClass('form_submitted')) {
        return;
      }
      $form.addClass('form_submitted').removeClass('validation_pass validation_error');
      this.getBDateinput(this.el, this.formView.model);
      // Remove Not needed input from submitting data
      $('.not_sending', $form).attr('disabled', true);

      // Check Data
      if (this.formView.model.isValid(true)) {
		$form.addClass('validation_pass');
		if (this.options.token !== '') {
		  $form.prepend('<input type="hidden" name="token" value="'+this.options.token+'"/>');
		}
		if (this.options.mode === 'create') {
		  $form.prepend('<input type="hidden" name="form_name" value="'+this.options.formSchema.name+'"/>');
		}
        $('input.subform_before_submit', this.el).remove();
        this.formView.model.appendSubFormInput(this.options.formSchema.name, this.formView._internalFields);
        _options = {
          beforeSubmit: this.showRequest,
          success: this.showResponse
        };

		if (this.formView._ajaxSubmit) {
		  e.preventDefault();
		  $form.ajaxSubmit(_options);
		}

		if (this.formView.options.formSchema.view !== 'wizard') {
		  _opt = {
			html : true,
			placement: 'top',
			trigger: 'manual',
			title: 'Submitting Form, Please wait',
			content: '<i class="icon-spinner icon-spin icon-large"></i> Sending data...'
		  };
		  $submitBtn.attr('disabled', true).popover(_opt).popover('show')
			.next('.popover').addClass('success');
		}
      } else {
		e.preventDefault();
		$form.addClass('validation_error');
        $form.removeClass('form_submitted');
        // Error Message
        $('.not_sending', $form).attr('disabled', false);

		if (this.formView.options.formSchema.view !== 'wizard') {
		  _opt = {
			html : true,
			placement: 'top',
			trigger: 'manual',
			title: '<i class="icon-edit"></i> Validation Error',
			content: 'Please correct the form'
		  };
		  $submitBtn.attr('disabled', true).popover(_opt).popover('show');

		  window.setTimeout(
			function() {
			  $('.invalid:first', $form).focus();
			  $submitBtn.attr('disabled', false).popover('destroy');
			  $submitBtn.next('.popover').remove();
			}, 2000 );
		}
	  }
	  $form.trigger(this.options.formSchema.name+'.validated');
	},
    showRequest: function(formData, jqForm, options) {
      //console.log($.param(formData));
      // If form has data-stopSubmit = true, the form will not continue to send data
      jqForm.trigger(jqForm.attr('id')+'.preSubmit', [formData, jqForm, options]);
      if (jqForm.attr('data-stopSubmit')) {
        jqForm.removeAttr('data-stopSubmit');
        return false;
      }
    },
    showResponse: function(responseText, statusText, xhr, $form) {
	  $(':hidden[name="token"], :hidden[name="form_name"]', $form).remove();
      $form.removeClass('form_submitted');
      $('.not_sending', $form).attr('disabled', false);
      $form.trigger($form.attr('id')+'.postSubmit', [responseText, statusText, xhr, $form]);
      window.setTimeout(
          function() {
              $('.form-actions button[type="submit"]', $form).attr('disabled', false).popover('destroy').next('.popover').removeClass('success').remove();
          },
          3000
      );
    },
    /**
     * Update the View Model
     **/
    preValidate: function(e) {
      Utils.preValidate(e, this.formView.model);
    },
    /**
     * Clear Form Data
     **/
    clearForm: function() {
      var that = this;
      _.each(this.formView.model.attributes, function(value, key) {
        if (typeof value.reset === 'function') {
          that.formView.model.get(key).reset();
        } else {
          $(':input[name="'+key+'"]', that.el).val('').trigger('change');
		  that.formView.model.set(key, '');
        }
      });
    },
	/**
	 * Setup hidden form and send this data
	 **/
	setupForm : function(e) {
	  var that = this
	  , $target = $(e.currentTarget);
	  e.preventDefault();

	  $.getJSON($target.attr('href'), {}, function(data, status) {
        if (status === 'success') {
		  require(['views/hiddenForm'], function (HiddenFormView) {
			var hiddenFormView = Vm.create(that, 'FormView', HiddenFormView);
			hiddenFormView.render(data);
		  });
        } else {
		  location.refresh();
        }
      });

	  return false;
	}
  });
  return AppView;
});
