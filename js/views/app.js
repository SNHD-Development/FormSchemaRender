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
  'bootstrap',
  'jquery.select2',
  'jloader'
], function($, _, Backbone, Vm, Utils, Events, layoutTemplate) {

  function removePopover($ele) {
    $ele.attr('disabled', false)
      .popover('destroy')
      .next('.popover')
      .removeClass('success')
      .remove();
  }

  var AppView = Backbone.View.extend({
    template: _.template(layoutTemplate),
    el: '#app',
    initialize: function() {
      if (typeof this.options.formSchema === 'undefined') {
        throw 'formSchema is not in the options parameters';
      }
    },
    render: function() {
      var that = this,
        formLayout = ('view' in this.options.formSchema) ? this.options.formSchema.view : 'default',
        _opts = {
          formSchema: that.options.formSchema,
          formData: that.options.formData,
          mode: that.options.mode,
          internal: that.options.internal,
          hideButtons: that.options.hideButtons,
          lang: that.options.lang
        };

      this.$el.html(this.template(this.options.formSchema));

      if (typeof this.options.mode !== 'undefined' && this.options.mode === 'read') {
        $('#' + that.options.formSchema.name, that.el)
          .addClass('read-mode');
        require(['views/readonly/' + formLayout], function(ReadView) {
          var readView = Vm.create(that, 'ReadView', ReadView, _opts);
          readView.render();

          Utils.finalReadSetup(readView);
          // Render Form Complete
          // Send view at second parameter
          $('#' + that.options.formSchema.name, that.el)
            .trigger(that.options.formSchema.name + '.renderCompleted', that);
        });
      } else {
        // Will render Form
        // Render Form Layout
        require(['views/form-layouts/' + formLayout], function(FormView) {
          try {
            that.formView = Vm.create(that, 'FormView', FormView, _opts);
            that.formView.render();
          } catch (err) {
            Utils.renderError(that.$el, err);
          }

          if (that.formView._hasDate) {
            that.setupDateInput();
          }
          if (that.formView._hasBDate) {
            that.setupBDateInput();
          }
          if (that.formView._hasEmailPicker) {
            that.setupEmailInput();
          }

          // Attached Address Event
          Utils.setupAddressEvent(that.el, that);

          // Setup Spinner
          Utils.setupSpinner(that.el, that.formView.options.mode);

          // Placeholder Setup for Older Browser
          Utils.setupPlaceHolder(that.el);

          // Setup Files Input
          Utils.setupFileInput(that.el);

          // Final Setup
          Utils.finalSetup(that.formView);

          // Render Form Complete
          // Send view at second parameter
          $('#' + that.options.formSchema.name, that.el)
            .trigger(that.options.formSchema.name + '.renderCompleted', that);

          // Set the Action if has one
          var $form = $(that.el)
            .find('form.form-render');
          if (that.options.formActionUrl) {
            $form.attr('action', that.options.formActionUrl);
          }

          // Render the buttons
          // Check for the .form-actions class
          var $formButtons = $('div.form-actions', $form);

          // If we have JavaUpload Need to Start it here
          if (that.formView._javaUpload.length > 0) {
            that.setupJavaUpload(that.formView._javaUpload);
          }

          // Set Up Ajax Call
          Utils.setupUrlAjaxCall($('form.form-render'));

          // Set Up Select2 when having class .
          Utils.setupSelect2(that.formView);

          // Bind Model Here
          that.formView._modelBinder.bind(that.formView.model, that.formView.el, that.formView.model.bindings);
          Backbone.Validation.bind(that.formView, {
            forceUpdate: true
          });
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
     * Valid +/- Floating Point
     */
    allowRational: function(e) {
      Utils.allowRational(e);
    },
    /**
     * Valid Natural Number
     **/
    allowNaturalNumber: function(e) {
      Utils.allowNaturalNumber(e);
    },
    /**
     * Valid Integer Number Only
     **/
    allowZipCode: function(e) {
      Utils.allowZipCode(e);
    },
    /**
     * Format Telephone number in valid format (xxx) xxx-xxxx
     **/
    formatTelephoneNumber: function(e) {
      var $currentTarget = $(e.currentTarget),
        _val = $currentTarget.val(),
        _tmp = '';

      if (e.type === 'keydown' && (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {

        switch (_val.length) {
          case 0:
            if (e.keyCode === 48 || e.keyCode === 105) {
              e.preventDefault();
              return;
            }
            $currentTarget.val('(' + _val);
            break;

          case 4:
            $currentTarget.val(_val + ') ');
            break;

          case 9:
            $currentTarget.val(_val + '-');
        }
        if (e.update) {
          $currentTarget.val($currentTarget.val() + String.fromCharCode(e.keyCode));
        }
      } else {
        for (var i = 0, j = _val.length; i < j; i++) {
          if (!isNaN(parseInt(_val[i]))) {
            _tmp += _val[i];
          }
        }
        _val = '';
        for (var i = 0, j = _tmp.length; i < j; i++) {
          switch (i) {
            case 0:
              _val += '(';
              break;
            case 3:
              _val += ') ';
              break;
            case 6:
              _val += '-';
              break;
          }
          _val += _tmp[i];
        }
        $currentTarget.val(_val);
      }
    },
    /**
     * Zipcode Plus Four Format (Optional)
     * @return
     */
    formatZipCodePlusFour: function(e) {
      Utils.allowZipCodePlusFour(e);
    },
    /**
     * View Events
     **/
    events: {
      'submit form.form-render': 'submitForm',
      'click .form-actions .btn-clear-form': 'clearForm',
      'click .form-actions .btn-render-form': 'setupForm',
      'blur :input:not(:button)': 'preValidate',
      'change :file': 'preValidate',
      'keydown :input[type="email"]': 'preventSpace',
      'keydown :input.number': 'allowNumber',
      'keydown :input.rational': 'allowRational',
      'keydown :input.natural': 'allowNaturalNumber',
      'keydown :input.allowzipcode, :input.integer': 'allowZipCode',
      'keydown :input.telephone': 'formatTelephoneNumber',
      'blur :input.telephone': 'formatTelephoneNumber',
      'keydown :input.allowzipcodeplusfour': 'formatZipCodePlusFour',
      'blur :input.allowzipcodeplusfour': 'formatZipCodePlusFour',
      'keypress :input': 'preventEnterPressed'
    },
    /**
     * Submit Form
     **/
    submitForm: function(e) {
      var $form = $('#' + this.options.formSchema.name, this.el),
        $submitBtn = $('.form-actions button[type="submit"]', this.el),
        _opt, _options,
        that = this;

      // DatePicker
      var $datepickers = $form.find('.datepicker');
      $datepickers.each(function() {
        var $this = $(this),
          _val = $this.val();
        if (_val && _val !== '') {
          that.formView.model.set($this.attr('name'), _val);
        }
      });

      $form.trigger($form.attr('id') + '.preValidation', [e, $form, this]);
      if ($form.hasClass('form_submitted')) {
        return;
      }

      $form.addClass('form_submitted')
        .removeClass('validation_pass validation_error not_sending_data_yet');
      this.getBDateinput(this.el, this.formView.model);
      Utils.getUserId(this.el, this.formView.model);
      // Remove Not needed input from submitting data
      $('.not_sending', $form)
        .attr('disabled', true);

      // Attached the subform input
      this.formView.model.appendSubFormInput(this.options.formSchema.name, this.formView._internalFields, this.formView._listSchema);

      // Check Data
      Utils.getDefaultValues(this.formView.el); // Make sure to get default value for each type.
      // Select2 Dynamic Validation
      $form.find(':input.has-select2-dynamic').each(function() {
        var $this = $(this);
        that.formView.model.set($this.attr('name'), $this.val());
      });
      Utils.setModelRadioValues($form, this.formView);
      Utils.setModelCheckValues($form, this.formView);

      if (this.formView.model.isValid(true) && this.formView.model.isSubformValid()) {

        // If there is an hidden type that has data-value, then will need to send this as well
        $form.find(':input:hidden[data-value]')
          .each(function() {
            var $this = $(this);
            if ($this.val() === '') {
              $this.val($this.attr('data-value'));
            }
          });

        $form.addClass('validation_pass');
        if (this.options.token !== '') {
          $form.prepend('<input type="hidden" name="token" value="' + this.options.token + '"/>');
        }
        var _action = $form.attr('action');
        if (this.options.mode === 'create' && _action.search(/name=\w/ig) === -1) {
          $form.prepend('<input type="hidden" name="form_name" value="' + this.options.formSchema.name + '"/>');
        }

        _options = {
          beforeSubmit: this.showRequest,
          success: this.showResponse,
          error: this.processError
        };

        // Some Browser Does not support placeholder, will need to check for it.
        Utils.resetPlaceHolderValue(this.el);

        // Some Data Clean Up
        Utils.convertDataToArrayString($form);

        // Need to check for the Number default (integer)
        Utils.convertNumberToDecimal($form);

        // If this form has Java Pow Upload need to send those in as well
        if (this.formView._javaUpload.length) {
          var _javaPowSubmit = false,
            _error = false;

          _.each(this.formView._javaUpload, function(element) {
            var $container = $('#' + element.id + '_java-upload');
            if ($container.hasClass('in')) {
              _javaPowSubmit = true;
              var JavaPowUpload = document.getElementById(element.id);

              if ($('#' + element.id + '_java-upload-applet', $container)
                .hasClass('required')) {
                if (!JavaPowUpload.getFiles()
                  .size()) {
                  _error = true;
                  return;
                }
              }
              $(':input[name="' + element.id + '"]')
                .remove();
              JavaPowUpload.startUpload();
            }
          });

          if (_javaPowSubmit) {
            if (_error) {
              $form.addClass('validation_error')
                .removeClass('validation_pass');
              $form.removeClass('form_submitted');
              $('.not_sending', $form)
                .attr('disabled', false);
              $(':input[name="form_name"]', $form)
                .remove();
              $(':input[name="token"]', $form)
                .remove();
            }
            e.preventDefault();
            return;
          }
        }

        // Check for Internal Fields and make sure to append _internal at the end
        Utils.parseInternalFieldsBeforeSubmit($form, this.formView._internalFields);

        if (this.formView._ajaxSubmit) {
          e.preventDefault();
          $form.ajaxSubmit(_options);
        } else {
          // This is not using AJAX to send POST
          $form.trigger($form.attr('id') + '.preSubmit', [e, $form, this]);
        }

        if (this.formView.options.formSchema.view !== 'wizard' && !$form.hasClass('not_sending_data_yet')) {
          var _t_1, _t_2;
          switch (this.formView.options.lang) {
            case 'sp':
              _t_1 = 'Enviando la forma; por favor espere';
              _t_2 = 'Cargando Informaci&oacute;n';
              break;
            default:
              _t_1 = 'Submitting form; please wait.';
              _t_2 = 'Sending data';
          }
          _opt = {
            html: true,
            placement: 'top',
            trigger: 'manual',
            title: _t_1,
            content: '<i class="icon-spinner icon-spin icon-large"></i> ' + _t_2 + ' ...'
          };
          $submitBtn.attr('disabled', true)
            .popover(_opt)
            .popover('show')
            .next('.popover')
            .addClass('success');
        }

        // Debugger Point if not using AJAX Post
        // console.log(this);
        // console.log('===== Debug Post Data =====');
        // console.log(JSON.stringify($form.serializeArray()));
        // e.preventDefault();
        // if (console && console.log) {
        //   console.log(that.formView.model.toJSON());
        // }
        // return false;
      } else {
        e.preventDefault();
        $form.addClass('validation_error');
        $form.removeClass('form_submitted');
        // Error Message
        $('.not_sending', $form)
          .attr('disabled', false);

        // Debug: Validation
        // if (console && console.log) {
        //     console.log(this.formView.model.toJSON());
        //     console.log($('.not_sending', $form));
        // }

        if (this.formView.options.formSchema.view !== 'wizard') {
          _opt = {
            html: true,
            placement: 'top',
            trigger: 'manual',
            title: '<i class="icon-edit"></i> Validation Error',
            content: 'Please correct the form'
          };
          $submitBtn.attr('disabled', true)
            .popover(_opt)
            .popover('show');

          window.setTimeout(
            function() {
              var $firstError = $('.invalid:first', $form);
              if (!($firstError.is(':checkbox') || $firstError.is(':radio'))) {
                $firstError.focus();
              }
              $submitBtn.attr('disabled', false)
                .popover('destroy');
              $submitBtn.next('.popover')
                .remove();
            }, 2000);
        }
      }
      $form.trigger(this.options.formSchema.name + '.validated');
    },
    /**
     * Debug point to check for Data, Called before the form get send
     * @param  object formData
     * @param  object jqForm
     * @param  object options
     * @return boolean
     */
    showRequest: function(formData, jqForm, options) {
      // console.log('===== POST Data =====');
      // console.log($.param(formData));
      // If form has data-stopSubmit = true, the form will not continue to send data
      jqForm.trigger(jqForm.attr('id') + '.preSubmit', [formData, jqForm, options]);
      if (jqForm.attr('data-stopSubmit')) {
        jqForm.removeAttr('data-stopSubmit');
        return false;
      }
    },
    /**
     * Success Callback when perform Ajax Submit Request
     * @param  object responseText
     * @param  string statusText
     * @param  object xhr
     * @param  object $form
     */
    showResponse: function(responseText, statusText, xhr, $form) {
      var _jsonText,
        $submitBtn = $('.form-actions.wizard-actions button[type="button"].btn_next');
      if (!$submitBtn.length) {
        $submitBtn = $('.form-actions button[type="submit"]');
      }
      try {
        _jsonText = (_.isString(responseText)) ? $.parseJSON(responseText) : responseText;
      } catch (err) {
        // console.log(err);
        // IE 9 and Below
        // console.log(responseText);
        try {
          var _index = responseText.search(/<pre>/ig);
          if (_index > -1) {
            // Found Pre Tag
            responseText = responseText.replace(/<pre>|<\/pre>/ig, '');
          }
          _jsonText = JSON.parse(responseText);
          if (_jsonText.html) {
            var _max = 5;
            while (_max) {
              _max--;
              if (_jsonText.html.search(/&\w+;/ig) > -1) {
                _jsonText.html = _.unescape(_jsonText.html);
              } else {
                break;
              }
            }
          }
        } catch (_err) {
          if (console && console.log) {
            console.log(_err);
          }
          alert('Response is invalid. Please try again.');
          return;
        }
      }
      // Perform the Hidden Form
      if (_jsonText.html) {
        // Special Case
        require(['views/hiddenForm'], function(HiddenFormView) {
          var hiddenFormView = Vm.create({}, 'FormView', HiddenFormView);
          hiddenFormView.render(_jsonText);
        });
        return;
      }
      _.each(_jsonText, function(value, key) {
        if (typeof value === 'string') {
          _jsonText[key] = _.unescape(value);
        }
      });
      if (_jsonText.status && _jsonText.status === 'error') {
        removePopover($submitBtn);
        var _errorMsg = _jsonText.error_message || _jsonText.message || _jsonText.response || 'Please try again.';
        _opt = {
          html: true,
          placement: 'top',
          trigger: 'manual',
          title: 'Application Error',
          content: '<b>Error Message:</b> <br>' + _errorMsg + '<br> <hr> Please fill all the required fields completely. We will reload this form in <span id="count_time">20</span> seconds.'
        };
        $submitBtn.attr('disabled', true)
          .popover(_opt)
          .popover('show')
          .next('.popover');
        window.setTimeout(function() {
          var $timer = $('#count_time');
          setTimeout(function() {
            location.reload();
          }, parseInt($timer.text(), 10) * 1000);
          setInterval(function() {
            var cnt = parseInt($timer.text(), 10);
            cnt--;
            if (cnt < 1) {
              return;
            }
            $timer.text(cnt);
          }, 1000);
        }, 2000);
        return;
      }
      $(':hidden[name="token"], :hidden[name="form_name"]', $form).remove();
      $form.removeClass('form_submitted');
      $('.not_sending', $form)
        .attr('disabled', false);
      $form.trigger($form.attr('id') + '.postSubmit', [responseText, _jsonText, statusText, xhr, $form]);
      window.setTimeout(
        function() {
          $submitBtn.attr('disabled', false)
            .popover('destroy')
            .next('.popover')
            .removeClass('success')
            .remove();
        },
        3000
      );
    },
    /**
     * Ajax Request Error
     * @param  object jqXHR
     * @param  string textStatus
     * @param  string errorThrown
     * @param  object $element
     */
    processError: function(jqXHR, textStatus, errorThrown, $element) {
      // If Error Happen in AJAX
      var $submitBtn = $('.form-actions button[type="submit"]'),
        errorTxt = errorThrown;
      if ($submitBtn.length) {
        // Remove Popover
        removePopover($submitBtn);

        // Generate New Popover Error Message
        if (jqXHR.responseText) {
          // Try to parse JSON
          try {
            errorTxt = JSON.parse(jqXHR.responseText);
            if (errorTxt.message && console && console.log) {
              console.log('*** Error ***');
              console.log(errorTxt.message);
            }
          } catch (err) {
            console.log('*** Error (Exception) ***');
            console.log(err);
          }
          errorTxt = errorThrown + ', please try again later.';
        }
        _opt = {
          html: true,
          placement: 'top',
          trigger: 'manual',
          title: 'Application Error',
          content: errorTxt
        };
        $submitBtn.attr('disabled', true)
          .popover(_opt)
          .popover('show')
          .next('.popover');
      } else {
        alert(errorTxt + ', please try again later.');
        if (console && console.log && jqXHR.responseText) {
          console.log(jqXHR.responseText);
        }
      }
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
          var $field = $(':input[name="' + key + '"]', that.el);
          if ($field.is(':checked')) {
            $field.attr('checked', false);
          } else if ($field.is(':radio')) {
            return;
          }
          $field.val('');
          $field.trigger('change');
          that.formView.model.set(key, '');
        }
      });
    },
    preventEnterPressed: function(e) {
      if (e.keyCode === 13) {
        if ($(e.currentTarget).is('input')) {
          e.stopPropagation();
          return false;
        }
      }
    },
    /**
     * Setup hidden form and send this data
     **/
    setupForm: function(e) {
      var that = this,
        $target = $(e.currentTarget);
      e.preventDefault();

      $.getJSON($target.attr('href'), {}, function(data, status) {
        if (status === 'success') {
          require(['views/hiddenForm'], function(HiddenFormView) {
            var hiddenFormView = Vm.create(that, 'FormView', HiddenFormView);
            hiddenFormView.render(data);
          });
        } else {
          location.refresh();
        }
      });

      return false;
    },

    /**
     * Setup Java Upload
     * @return
     */
    setupJavaUpload: function(jArray) {
      var $view = $(this)
        .get(0),
        jSerialNumber = (this.formView.options.formSchema.jserialnumber) ? this.formView.options.formSchema.jserialnumber : window.jSerialNumber;
      if (jSerialNumber == undefined) {
        throw 'Please set jSerialNumber to match with your purchase number.';
      }
      var parameters = {
          "progressbar": "true",
          "boxmessage": "Loading File Uploader Applet ...",
          "Common.SerialNumber": window.jSerialNumber,
          "Common.UploadMode": "true",
          "Common.UseLiveConnect": "true",
          "Common.ProgressArea.DownloadButton.Visible": "false",
          "Common.SkinLF.ThemepackURL": "//public.southernnevadahealthdistrict.org/assets/assets/jar/jupload/themepack.zip",
          "Common.Language.AutoDetect": "true",
          "Upload.UploadUrl": $(this.formView.el)
            .attr('action'),
          "Upload.Compress.Enabled": "true",
          "Upload.Compress.ArchiveFileName": "#UNIQUEID#",
          "Upload.Compress.Format": "ZIP",
          "Upload.Compress.Level": "DEFAULT",
          "Upload.HttpUpload.FieldName.FilePath": "SelectedPath_#COUNTER#",
          "Upload.HttpUpload.FormName": this.formView.el.replace('#', ''),
          "Upload.HttpUpload.AddFormValuesToPostFields": "true",
          "Upload.HttpUpload.AddFormValuesToHeaders": "false",
          "Upload.HttpUpload.AddFormValuesToQueryString": "false",
          "Upload.HttpUpload.FieldName.FileBody": "FileBody_#COUNTER#",
          "Upload.HttpUpload.SendBrowserCookie": "true"
        },
        version = '1.5.1';

      // console.log(parameters["Upload.UploadUrl"]);

      // Since deplyJava will override your body

      var oldwrite = document.write,
        content = '';
      document.write = function(text) {
        content += text;
      };

      _.each(jArray, function(value) {
        content = '';

        parameters["Upload.HttpUpload.FieldName.FileBody"] = value.id;

        deployJava.runApplet(value, parameters, version);
        var $appletParent = $('#' + value.id + '_java-upload-applet')
          .html(content);

        if ($view.options.formSchema && $view.options.formSchema.validation && $view.options.formSchema.validation[value.id]) {
          if ($view.formView.model.validation[value.id].required) {
            $appletParent.addClass('required');
          }
          $view.formView.model.validation[value.id] = {};
        }

        $('#' + value.id + '_accordion')
          .on('click', '.accordion-heading', function() {
            var $this = $(this),
              $container = $this.next(),
              $parent = $this.closest('.accordion-group');

            // console.log($view.formView);
            if ($container.find('applet')
              .length) {
              $view.formView.model.validation[value.id] = {};
              $parent.next()
                .find('input')
                .attr('disabled', true);
            } else {
              $container.find('input')
                .attr('disabled', false);
              if ($view.options.formSchema && $view.options.formSchema.validation && $view.options.formSchema.validation[value.id]) {
                $view.formView.model.validation[value.id] = $view.options.formSchema.validation[value.id];
              }
            }
          });
      });

      document.write = oldwrite;

      // Attached the OnCompleted Event
      window.JavaPowUpload_onUploadFinish = function() {
        // Will Refresh the page
        (window.jRedirect) ? location.replace(window.jRedirect) : location.reload(true);
      };
    }
  });
  return AppView;
});