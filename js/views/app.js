define([
  'jquery',
  'lodash',
  'backbone',
  'vm',
  'events',
  'jquery.ajaxsubmit',
  'text!templates/layout.html',
  'jquery.datepicker',
], function($, _, Backbone, Vm, Events, AjaxSubmit, layoutTemplate){
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
          mode : that.options.mode
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
          // Render Form Complete
          // Send view at second parameter
          $('#'+that.options.formSchema.name, this.el).trigger(that.options.formSchema.name+'.renderCompleted', that);
        });
      }
    },
    /**
     * Init BDateinput
     **/
    setupBDateInput: function() {
      $('.birthdaypicker', this.el).each(function () {
        $(this).birthdaypicker($(this).attr('data-options'));
      });
    },
    /**
     *
     **/
    getBDateinput: function() {
      $('fieldset.birthday-picker').each(function() {
        $('.not_sending', this).trigger('change');
        var _nan =/NaN/i;
        if ($(':hidden', this).val().match(_nan)) {
          $(':hidden', this).val('');
        }
      });
    },
    /**
     * Init Dateinput
     **/
    setupDateInput: function() {
      $('.datepicker', this.el).each(function () {
        var _options = {}, maxDate, nowTemp;
        if ($(this).attr('data-maxdate')) {
          switch ($(this).attr('data-maxdate').toLowerCase()) {
            case 'today':
              nowTemp = new Date();
              maxDate = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
              _options.onRender = function(date) {
                return date.valueOf() > maxDate.valueOf() ? 'disabled' : '';
              };
              break;
          }
        }
        $(this).datepicker(_options)
          .on('changeDate', function(e){
            var _dateInput = $(e.currentTarget).removeClass('invalid').trigger('change');
            _dateInput.datepicker('hide');
          })
		  .on('click', function(e){
			$('div.datepicker.dropdown-menu').css('display', 'none');
			$(e.currentTarget).datepicker('show');
		  });
      });
    },
    /**
	 * View Events
	 **/
	events: {
	  'submit form.form-render': 'submitForm',
      'click .form-actions .btn-clear-form': 'clearForm',
      'blur :input:not(:button)' : 'preValidate'
	},
	/**
	 * Submit Form
	 **/
	submitForm: function(e) {
      var $form = $('#'+this.options.formSchema.name, this.el)
      , $submitBtn = $('.form-actions button[type="submit"]', this.el)
      , _opt, _options;
	  e.preventDefault();
      if ($form.hasClass('form_submitted')) {
        return;
      }
      $form.addClass('form_submitted');
      this.getBDateinput();
      // Remove Not needed input from submitting data
      $('.not_sending', $form).attr('disabled', true);

      // Check Data
      if (this.formView.model.isValid(true)) {
        $('input.subform_before_submit', this.el).remove();
        this.formView.model.appendSubFormInput(this.options.formSchema.name);
        _options = {
          beforeSubmit: this.showRequest,
          success: this.showResponse
        };
        $form.ajaxSubmit(_options);
        _opt = {
          html : true,
          placement: 'top',
          trigger: 'manual',
          title: 'Submitting Form, Please wait',
          content: '<i class="icon-spinner icon-spin icon-large"></i> Sending data...'
        };
        $submitBtn.attr('disabled', true).popover(_opt).popover('show')
          .next('.popover').addClass('success');
      } else {
        $form.removeClass('form_submitted');
        // Error Message
        $('.not_sending', $form).attr('disabled', false);
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
      var $e = $(e.currentTarget)
	  , _name = $e.attr('name')
	  , _val = $.trim($e.val());
	  $e.val(_val).trigger('change');
	  if (this.formView.model.isValid(_name, _val)) {
		$e.removeClass('invalid');
	  } else {
		$e.addClass('invalid');
	  }
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
        }
      });
    }
  });
  return AppView;
});
