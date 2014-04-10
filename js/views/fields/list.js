/**
 * SubForm Layout
 **/
define([
  'jquery',
  'lodash',
  'backbone',
  'models/model',
  'modelbinder',
  'validation',
  'vm',
  'utils',
  'events',
  'text!templates/subform-layouts/default.html',
  'jquery.expose',
  'bootstrap'
], function($, _, Backbone, Model, Modelbinder, Validation, Vm, Utils, Events, subFormLayoutTemplate) {
  return Backbone.View.extend({
    _modelBinder: undefined,
    // Clean Data Binding
    clean: function() {
      // Unbind Validation
      Backbone.Validation.unbind(this);

      if (typeof this._modelBinder !== 'undefined') {
        this._modelBinder.unbind();
      }

      // Destroy Popover
      Utils.destroyPopover(this.$el);
    },
    removeContent: function() {
      this.$el.html('').removeAttr('class').fadeIn();
    },
    /**
     * Init List View
     **/
    initialize: function() {
      // Setup BB Binder
      this._modelBinder = new Modelbinder();

      var _tmp;

      if (typeof this.options.model === 'undefined') {
        this.model = new Model(_.extend(this.options.formSchema, {
          is_internal: this.options.internal,
          render_mode: this.options.mode
        }));
        this._btn_title = 'Add';
      } else {
        this._btn_title = 'Done';
      }

      this.options.formSchema.view = this.options.formSchema.view || '';
      // Load Correct SubView Render
      switch (this.options.formSchema.view.toLowerCase()) {
        default: _tmp = subFormLayoutTemplate;
        break;
      }
      this.template = _.template(_tmp);
    },
    render: function(firstTime) {
      var that = this,
        _defaultEmail = '';
      // Render Fields
      require(['views/baseField'], function(BaseField) {
        var _html = '',
          _required, formView = Vm.create(that, 'BaseField', BaseField, {
            formSchema: that.options.formSchema
          }),
          _options = that.options;
        _.each(that.options.formSchema.fields, function(value, key, list) {
          // Check for Show On Mode
          if (!BaseField.prototype.checkShowOnMode.call(that, value, _options.options.mode, _options.options.formData.status)) {
            if (that.model.bindings[value.name]) {
              delete that.model.bindings[value.name];
            }
            var _name = value.name + '[]';
            if (that.model.bindings[_name]) {
              delete that.model.bindings[_name];
            }
            return '';
          }
          if (typeof value.description !== 'undefined' && _.indexOf(formView.notRenderLabel, value.type.toLowerCase()) === -1) {
            _required = Utils.checkRequireFields(value, that.options.formSchema.validation);
            _html += formView.renderLabel(value, _required);
          }

          if (value.type.toLowerCase() === 'email' && value.options.autocomplete) {
            if (that.model.get(value.name) !== '') {
              var _strArray = that.model.get(value.name).split('@');
              that.model.set(value.name + '_username', _strArray[0]);
              that.model.set(value.name + '_server', _strArray[1]);
              if (value.options['default']) {
                _defaultEmail = value.options['default'];
                value.options['default'] = _strArray[1];
              } else {
                _defaultEmail = '';
              }
            }
          }

          _html += formView.render(value);

          if (_defaultEmail !== '') {
            value.options['default'] = _defaultEmail;
          }

        });
        var _btn_opts = _.clone(that.options.formSchema.formoptions);
        _btn_opts.submitbutton = that._btn_title;
        _btn_opts.subForm = true;
        _html += formView.renderButton(_btn_opts);

        if (that.el) {
          $(that.el).html(that.template(_.extend({
            html: _html
          }, that.options.formSchema)));
        }

        // Bind Model
        try {
          if (that.el) {
            that._modelBinder.bind(that.model, that.el, that.model.bindings);
          }
        } catch (err) {
          if (window.console && window.console.log) {
            window.console.log('Warning in list.js: "' + err + '" continue running.');
          }
        }
        Backbone.Validation.bind(that, {
          forceUpdate: true
        });

        // Attached Events
        if (formView._hasEmailPicker) {
          that.setupEmailInput();
        }

        // Placeholder Setup for Older Browser
        Utils.setupPlaceHolder(that.el);

        // Set Up Popover
        Utils.setupPopover(that.$el);

        // Set up the BooleanButton
        if (formView._hasBooleanInput) {
          Utils.setupBooleanInput(that.$el, formView);
        }

        // Setup Radio Button Group
        if (formView._hasRadioBtnGroup) {
          Utils.setupRadioBtnGroup(that.$el);
          Utils.setupRadioBtnGroupValue(that.$el);
        }

        // If there are DatePicker
        if (formView._hasDate) {
          Utils.setupDateInput(that.$el);
        }

        // If this is the first time need to click cancel button
        if (firstTime) {
          that.$('.form-actions button.btn-cancel').click();
        }

        // Will need to loop through the value and trigger change
        _.each(that.model.toJSON(), function(value, key) {
          if (value === '') {
            return;
          }
          var _inputName = that.$el.find(':input[name="' + key + '"]'),
            _val = _inputName.val();
          if (_val === '') {
            if (_inputName.is('select') && _inputName.attr('data-url')) {
              // When the data comeback from AJAX Call will loaded the value in
              _inputName.one('dataloaded', function() {
                _inputName.find('option').filter(function() {
                  return $(this).text() === value;
                }).attr('selected', true).trigger('change');
              });
            } else {
              _inputName.val(value);
            }
          }
        });

        // Set Up Ajax Call
        Utils.setupUrlAjaxCall(that.$el);

        // Find the first input in the form
        var $fInput = that.$(':input').not(':hidden').first().focus();
        if ($fInput.length && that.$el.length) {
          $('html, body').animate({
            scrollTop: that.$el.offset().top - 30
          }, 1000);
        }
      });
    },
    /**
     * Events
     **/
    events: {
      'keypress div.sub_form_render :input': 'preventEnterPressed',
      'click div.form-actions .btn-submit': 'sendForm',
      'click div.form-actions .btn-cancel': 'clickCancel',
      'blur :input:not(:button)': 'preValidate'
    },
    /**
     * User pressed a key
     **/
    preventEnterPressed: function(e) {
      if (e.keyCode === 13) {
        if ($(e.currentTarget).is('input')) {
          e.stopPropagation();
          return false;
        }
      }
    },
    preValidate: function(e) {
      e.stopPropagation();
      Utils.preValidate(e, this.model);
    },
    /**
     * This function will call when using click on "Add"
     * @param  object e
     * @return
     */
    sendForm: function(e) {
      e.preventDefault();
      var that = this,
        _submitBtn = $('.form-actions .btn-submit', this.$el);
      if (_submitBtn.hasClass('submitted')) {
        return;
      }
      _submitBtn.addClass('submitted');

      Utils.setHiddenField(this.el);

      if (this.model.isValid(true)) {
        var $not_sending = $('.not_sending', this.el).trigger('change').attr('disabled', true);
        $not_sending.each(function() {
          that.model.unset($(this).attr('name'));
        });
        // Add Model to the parent
        _submitBtn.removeClass('submitted');
        this.$el.trigger(this.options.formId + '.add', this);
      } else {

        // If this is the Boolean Input need to inform user
        this.model.triggerError(this);

        // Error Message
        var _opt = {
          html: true,
          placement: 'top',
          trigger: 'manual',
          title: '<i class="icon-edit"></i> Validation Error',
          content: 'Please correct the form'
        };
        _submitBtn.popover(_opt).popover('show');

        window.setTimeout(
          function() {
            _submitBtn.removeClass('submitted').popover('destroy');
            _submitBtn.next('.popover').remove();
          }, 2000);
      }
    },
    clickCancel: function(e) {
      e.preventDefault();
      Vm.remove('SubFormView' + this.options.formId, true);
      Vm.remove('SubFormViewEdit' + this.options.formId, true);
      this.$el.trigger(this.options.formId + '.close', this);
    },
    /**
     * Init Emailinput
     **/
    setupEmailInput: function() {
      Utils.setupEmailInput(this.el);
    }
  });
});