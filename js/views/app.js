/**
 * Main View Controller
 **/
"use strict";
define([
  "jquery",
  "lodash",
  "backbone",
  "vm",
  "utils",
  "events",
  "text!templates/layout.html",
  "jquery.ajaxsubmit",
  "jquery.datepicker",
  "jquery.placeholder",
  "jquery.lightbox",
  "jquery.expose",
  "bootstrap",
  "jquery.select2",
  "jloader",
  "jquery.timepicker"
], function($, _, Backbone, Vm, Utils, Events, layoutTemplate) {
  // Default Config
  function removePopover($ele) {
    $ele
      .attr("disabled", false)
      .popover("destroy")
      .next(".popover")
      .removeClass("success")
      .remove();
  }
  var AppView = Backbone.View.extend({
    template: _.template(layoutTemplate),
    el: "#app",
    initialize: function() {
      if (typeof this.options.formSchema === "undefined") {
        throw "formSchema is not in the options parameters";
      }
    },
    render: function() {
      var that = this,
        formLayout =
          "view" in this.options.formSchema
            ? this.options.formSchema.view
            : "default",
        _opts = {
          formSchema: that.options.formSchema,
          formData: that.options.formData,
          mode: that.options.mode,
          internal: that.options.internal,
          hideButtons: that.options.hideButtons,
          lang: that.options.lang,
          formEvents: this.options.formEvents
        };
      this.$el.html(this.template(this.options.formSchema));
      // Generic Setup
      $("#" + this.options.formSchema.name, this.el).on(
        this.options.formSchema.name + ".renderCompleted",
        function() {
          Utils.genericSetup(that);
        }
      );
      if (
        typeof this.options.mode !== "undefined" &&
        this.options.mode === "read"
      ) {
        $("#" + that.options.formSchema.name, that.el).addClass("read-mode");
        // Async Call
        require(["views/readonly/" + formLayout], function(ReadView) {
          try {
            var readView = Vm.create(that, "ReadView", ReadView, _opts);
            readView.render();
            Utils.finalReadSetup(readView);

            /**
             * Attached Event for Download btn-js-download
             */
            $(readView.el).on('click', '.btn-js-download', function() {
              var $button = $(this);

              var data = $button.attr('data-file');
              if (!data) {
                return;
              }

              var downloadingFile = 'downloading-file';

              var hasDownloadingFile = $button.hasClass(downloadingFile);

              if (hasDownloadingFile) {
                return;
              }

              var dataObj = Utils.Base64.decode(data);
              if (!dataObj) {
                return;
              }

              if (typeof dataObj === 'string') {
                dataObj = JSON.parse(dataObj);
              }

              // Should download the file now
              var base64Data = dataObj.base64Data;
              if (!base64Data) {
                return;
              }
              var fileType = dataObj.fileType;
              var fileName = dataObj.fileName;

              $button.addClass(downloadingFile);

              // Need to serve this binary, non-ie
              var element, blob;
              if (navigator && navigator.msSaveBlob) {
                // This is IE
                blob = Utils.convertDataURIToBlob(base64Data, fileName);
                navigator.msSaveBlob(blob);
              } else {
                // This is the cool browsers
                element = document.createElement('a');
                element.setAttribute('href', base64Data);
                element.setAttribute('download', fileName);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }

              $button.removeClass(downloadingFile);
            });

            // Render Form Complete
            // Send view at second parameter
            $("#" + that.options.formSchema.name, that.el).trigger(
              that.options.formSchema.name + ".renderCompleted",
              that
            );
            // Final Setup for All Mode
            Utils.finalSetupAllMode(readView);
          } catch (err) {
            if (console && console.error) {
              console.error("[x] Rendering Read Mode Error");
              console.error(err);
            }
            Utils.renderError($(readView.el), err);
          }
          // Will make sure to start on top of the page
          Utils.scrollToTop();
        });
      } else {
        // Will render Form
        // Render Form Layout
        // Async Call
        require(["views/form-layouts/" + formLayout], function(FormView) {
          try {
            that.formView = Vm.create(that, "FormView", FormView, _opts);
            that.formView.render();
          } catch (err) {
            if (console && console.log) {
              console.log("Exception: in app.js");
              console.log(err);
            }
            Utils.renderError(that.$el, err);
            return;
          }
          try {
            if (that.formView._hasDate) {
              that.setupDateInput(null, that);
            }
            if (that.formView._hasTime) {
              that.setupTimeInput(null, that);
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
            // Set Up Popover
            // console.log($form);
            Utils.setupPopover(that.el);
            // Final Setup
            Utils.finalSetup(that.formView);
            // Render Form Complete
            // Send view at second parameter
            $("#" + that.options.formSchema.name, that.el).trigger(
              that.options.formSchema.name + ".renderCompleted",
              that
            );
            // Final Setup for All Mode
            Utils.finalSetupAllMode(that.formView);
            // Set the Action if has one
            var $form = $(that.el).find("form.form-render");
            if (that.options.formActionUrl) {
              $form.attr("action", that.options.formActionUrl);
            }
            // Render the buttons
            // Check for the .form-actions class
            var $formButtons = $("div.form-actions", $form);
            // If we have JavaUpload Need to Start it here
            if (that.formView._javaUpload.length > 0) {
              that.setupJavaUpload(that.formView._javaUpload);
            }
            // Set Up Ajax Call
            Utils.setupUrlAjaxCall($("form.form-render"));
            // Set Up Select2 when having class .
            // console.log(that.formView);
            Utils.setupSelect2(that.formView);
            // console.log('Validation:', that.formView.model.validation);
            // console.log('Model, Before Bind ModelBinder:', that.formView.model.toJSON());
            // Bind Model Here
            that.formView._modelBinder.bind(
              that.formView.model,
              that.formView.el,
              that.formView.model.bindings
            );
            // console.log('Model, After Bind:', that.formView.model.toJSON());
            Backbone.Validation.bind(that.formView, {
              forceUpdate: true
            });
          } catch (err) {
            if (console && console.error) {
              console.error(
                "[x] Rendering " + that.options.mode + " Mode Error"
              );
              console.error(err);
            }
            Utils.renderError($(that.formView.el), err);
          }
          // Will focus on the first input
          Utils.focusOnFirstInput(that);
          // Will make sure to start on top of the page
          Utils.scrollToTop();
          // console.log('Model, Render End', that.formView.model.toJSON());
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
      Utils.setupDateInput(this.el, this);
    },
    setupTimeInput: function() {
      Utils.setupTimeInput(this.el, this);
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
     * Valid Whole Number
     **/
    allowWholeNumber: function(e) {
      Utils.allowWholeNumber(e);
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
      Utils.allowPhoneNumber(e);
    },
    /**
     * Format Social Security
     */
    formatSocialSecurity: function(e) {
      Utils.allowSocialSecurity(e);
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
      "submit form.form-render": "submitForm",
      "click .form-actions .btn-clear-form": "clearForm",
      "click .form-actions .btn-render-form": "setupForm",
      "blur :input:not(:button)": "preValidate",
      "change :file": "preValidate",
      'keydown :input[type="email"]': "preventSpace",
      "keydown :input.number": "allowNumber",
      "keydown :input.rational": "allowRational",
      "keydown :input.natural": "allowNaturalNumber",
      "keydown :input.whole": "allowWholeNumber",
      "keydown :input.allowzipcode, :input.integer": "allowZipCode",
      "keydown :input.telephone": "formatTelephoneNumber",
      "blur :input.telephone": "formatTelephoneNumber",
      "keydown :input.socialsecurity": "formatSocialSecurity",
      "blur :input.socialsecurity": "formatSocialSecurity",
      "keydown :input.allowzipcodeplusfour": "formatZipCodePlusFour",
      "blur :input.allowzipcodeplusfour": "formatZipCodePlusFour",
      "keypress :input": "preventEnterPressed",
      "keyup :input.field-keyboard-command": "ajaxCommandByKeyBoard",
      "click .update-cancel": "clickUpdateCancelBtn",
      "click .update-submit": "clickUpdateSubmitBtn"
    },
    /**
     * Submit Form
     **/
    submitForm: function(e) {
      // debugger;
      var $form = $("#" + this.options.formSchema.name, this.el),
        $submitBtn = $('.form-actions button[type="submit"]', this.el),
        _opt,
        _options,
        that = this;
      // DatePicker
      var $datepickers = $form.find(".datepicker");
      $datepickers.each(function() {
        var $this = $(this),
          _val = $this.val();
        if (_val && _val !== "") {
          that.formView.model.set($this.attr("name"), _val);
        }
      });
      $form
        .removeClass("invalid_prevalidation")
        .trigger($form.attr("id") + ".preValidation", [e, $form, this]);
      if ($form.hasClass("invalid_prevalidation")) {
        e.preventDefault();
        return false;
      }
      if ($form.hasClass("form_submitted")) {
        e.preventDefault();
        return false;
      }
      $form
        .addClass("form_submitted")
        .removeClass("validation_pass validation_error not_sending_data_yet");
      this.getBDateinput(this.el, this.formView.model);
      Utils.getUserId(this.el, this.formView.model);
      // Remove Not needed input from submitting data
      $(".not_sending", $form).attr("disabled", true);
      // Attached the subform input
      this.formView.model.appendSubFormInput(
        this.options.formSchema.name,
        this.formView._internalFields,
        this.formView._listSchema
      );
      // Check Data
      Utils.getDefaultValues(this.formView.el, that.formView.model); // Make sure to get default value for each type.
      // Select2 Dynamic Validation
      $form.find(":input.has-select2-dynamic").each(function() {
        var $this = $(this);
        that.formView.model.set($this.attr("name"), $this.val());
      });
      // Adding ability to skip the multifile in update mode
      // console.log('Model, before calling Utils.setDefaultMultiFile', this.formView.model.toJSON());
      Utils.setDefaultMultiFile($form, this.formView);
      Utils.setModelRadioValues($form, this.formView);
      Utils.setModelCheckValues($form, this.formView);
      var _isCheckBoxGood = Utils.validateCheckBox($form);
      // Check for the Select that has empty value and then not select it.
      // console.log(this);
      var $selectInput = this.$(":selected");
      // console.log($selectInput);
      Utils.resetSelectsOption($selectInput);
      // Sometime the Select not get clear properly
      // Since HTML will not send any info if the select is not select
      var $selectInputNull = this.$("select");
      if ($selectInputNull.length) {
        $selectInputNull.each(function() {
          var $this = $(this);
          var _val = $this.val();
          // console.log($this.val());
          if (_.isNull(_val)) {
            $this.val("");
          }
          // console.log($this.val());
        });
      }
      // console.log('Is model valid?', this.formView.model.isValid(true));
      // console.log('Is sub-form model valid?', this.formView.model.isSubformValid());
      // console.log('Model, value before submitted', this.formView.model.toJSON());
      if (
        this.formView.model.isValid(true) &&
        this.formView.model.isSubformValid() &&
        _isCheckBoxGood
      ) {
        // If there is an hidden type that has data-value, then will need to send this as well
        $form.find(":input:hidden[data-value]").each(function() {
          var $this = $(this);
          if ($this.val() === "") {
            $this.val($this.attr("data-value"));
          }
        });
        $form.addClass("validation_pass");
        if (this.options.token !== "") {
          $form.prepend(
            '<input type="hidden" name="token" value="' +
              this.options.token +
              '"/>'
          );
        }
        var _action = $form.attr("action");
        if (
          this.options.mode === "create" &&
          _action.search(/name=\w/gi) === -1
        ) {
          $form.prepend(
            '<input type="hidden" name="form_name" value="' +
              this.options.formSchema.name +
              '"/>'
          );
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
            var $container = $("#" + element.id + "_java-upload");
            if ($container.hasClass("in")) {
              _javaPowSubmit = true;
              var JavaPowUpload = document.getElementById(element.id);
              if (
                $(
                  "#" + element.id + "_java-upload-applet",
                  $container
                ).hasClass("required")
              ) {
                if (!JavaPowUpload.getFiles().size()) {
                  _error = true;
                  return;
                }
              }
              $(':input[name="' + element.id + '"]').remove();
              JavaPowUpload.startUpload();
            }
          });
          if (_javaPowSubmit) {
            if (_error) {
              $form.addClass("validation_error").removeClass("validation_pass");
              $form.removeClass("form_submitted");
              $(".not_sending", $form).attr("disabled", false);
              $(':input[name="form_name"]', $form).remove();
              $(':input[name="token"]', $form).remove();
            }
            e.preventDefault();
            return;
          }
        }

        var _debugFormSubmitEvent = false;

        // Check for Internal Fields and make sure to append _internal at the end
        Utils.parseInternalFieldsBeforeSubmit(
          $form,
          this.formView._internalFields
        );

        if (_debugFormSubmitEvent) {
          console.log(
            "- this.formView._ajaxSubmit:",
            this.formView._ajaxSubmit
          );
        }
        if (this.formView._ajaxSubmit) {
          e.preventDefault();
          if (_debugFormSubmitEvent) {
            console.log("- before fire: $form.ajaxSubmit");
            console.log("- _options:", _options);
          }
          $form.ajaxSubmit(_options);
        } else {
          if (_debugFormSubmitEvent) {
            console.log("- before fire: " + $form.attr("id") + ".preSubmit");
          }
          // This is not using AJAX to send POST
          $form.trigger($form.attr("id") + ".preSubmit", [e, $form, this]);

          // Prevent form to send if has data-stopsubmit in it
          if (_debugFormSubmitEvent) {
            console.log(
              '- $form.attr("data-stopsubmit"):',
              $form.attr("data-stopsubmit")
            );
            console.log(
              '- $form.attr("data-stopSubmit"):',
              $form.attr("data-stopSubmit")
            );
          }
          var attrStopSubmit =
            $form.attr("data-stopSubmit") || $form.attr("data-stopsubmit");
          if (attrStopSubmit && attrStopSubmit !== "") {
            $form.removeAttr("data-stopSubmit");
            $form.removeAttr("data-stopsubmit");
            e.preventDefault();
            $form.removeClass("form_submitted");
            // Error Message
            $(".not_sending", $form).attr("disabled", false);
            if (_debugFormSubmitEvent) {
              console.log(
                '- $form.attr("data-stopsubmit"):',
                $form.attr("data-stopsubmit")
              );
              console.log(
                '- $form.attr("data-stopSubmit"):',
                $form.attr("data-stopSubmit")
              );
            }
            return;
          }
        }
        if (
          this.formView.options.formSchema.view !== "wizard" &&
          !$form.hasClass("not_sending_data_yet")
        ) {
          var _t_1, _t_2;
          switch (this.formView.options.lang) {
            case "sp":
              _t_1 = "Enviando la forma; por favor espere";
              _t_2 = "Cargando Informaci&oacute;n";
              break;
            default:
              _t_1 = "Submitting form; please wait.";
              _t_2 = "Sending data";
          }
          _opt = {
            html: true,
            placement: "top",
            trigger: "manual",
            title: _t_1,
            content:
              '<i class="icon-spinner icon-spin icon-large"></i> ' +
              _t_2 +
              " ..."
          };
          $submitBtn
            .attr("disabled", true)
            .popover(_opt)
            .popover("show")
            .next(".popover")
            .addClass("success");
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
        // Invalid: Events
        e.preventDefault();
        $form.addClass("validation_error");
        $form.removeClass("form_submitted");
        // Error Message
        $(".not_sending", $form).attr("disabled", false);
        // Debug: Validation
        if ("console" in window && console && console.log) {
          console.log("*** Submitted Error ***");
          console.log(this.formView.model.toJSON());
          // console.log($('.not_sending', $form));
          console.log(this.formView.model.validation);
          // console.log('- validationError:', this.formView.model.validationError);
          console.log("- _isCheckBoxGood:", _isCheckBoxGood);
          console.log("- .invalid:", $(".invalid"));
          console.log("******");
        }
        if (this.formView.options.formSchema.view !== "wizard") {
          // console.log('*****');
          // console.log(arguments);
          _opt = {
            html: true,
            placement: "top",
            trigger: "manual",
            title: '<i class="icon-edit"></i> Validation Error',
            content: "Please complete the required fields"
          };
          $submitBtn
            .attr("disabled", true)
            .popover(_opt)
            .popover("show");
          window.setTimeout(function() {
            var $firstError = $(".invalid:first", $form);
            if (!($firstError.is(":checkbox") || $firstError.is(":radio"))) {
              $firstError.focus();
            }
            $submitBtn.attr("disabled", false).popover("destroy");
            $submitBtn.next(".popover").remove();
          }, 2000);
        }
      }
      $form.trigger(this.options.formSchema.name + ".validated");
    },
    /**
     * Debug point to check for Data, Called before the form get send
     * @param  object formData
     * @param  object jqForm
     * @param  object options
     * @return boolean
     */
    showRequest: function(formData, jqForm, options) {
      var _debug = false;

      // console.log('===== POST Data =====');
      // console.log($.param(formData));
      // If form has data-stopSubmit = true, the form will not continue to send data
      jqForm.trigger(jqForm.attr("id") + ".preSubmit", [
        formData,
        jqForm,
        options
      ]);

      if (_debug) {
        console.log("*** showRequest ***");
        console.log(arguments);

        console.log(
          '- jqForm.attr("data-stopSubmit"):',
          jqForm.attr("data-stopSubmit")
        );

        console.log(
          '- jqForm.attr("data-stopsubmit"):',
          jqForm.attr("data-stopsubmit")
        );
      }

      if (jqForm.attr("data-stopSubmit")) {
        jqForm.removeAttr("data-stopSubmit");
        if (_debug) {
          console.log("- remove: data-stopSubmit");
        }
        return false;
      }
      if (jqForm.attr("data-stopsubmit")) {
        jqForm.removeAttr("data-stopsubmit");
        if (_debug) {
          console.log("- remove: data-stopsubmit");
        }
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
      var _debugPostSubmit = false;
      if (console && console.info) {
        console.info("[*] showResponse");
        console.info(arguments);
      }
      var _jsonText,
        $submitBtn = $(
          '.form-actions.wizard-actions button[type="button"].btn_next'
        );
      if (!$submitBtn.length) {
        $submitBtn = $('.form-actions button[type="submit"]');
      }
      try {
        _jsonText = _.isString(responseText)
          ? $.parseJSON(responseText)
          : responseText;
      } catch (err) {
        // console.log(err);
        // IE 9 and Below
        // console.log(responseText);
        try {
          var _index = responseText.search(/<pre>/gi);
          if (_index > -1) {
            // Found Pre Tag
            responseText = responseText.replace(/<pre>|<\/pre>/gi, "");
          }
          _jsonText = JSON.parse(responseText);
          if (_jsonText.html) {
            var _max = 5;
            while (_max) {
              _max--;
              if (_jsonText.html.search(/&\w+;/gi) > -1) {
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
          alert("Response is invalid. Please try again.");
          return;
        }
      }
      if (console && console.info) {
        console.info(_jsonText);
      }
      // Perform the Hidden Form
      if (_jsonText.html) {
        // Special Case
        require(["views/hiddenForm"], function(HiddenFormView) {
          var hiddenFormView = Vm.create({}, "FormView", HiddenFormView);
          hiddenFormView.render(_jsonText);
        });
        return;
      }
      _.each(_jsonText, function(value, key) {
        if (typeof value === "string") {
          _jsonText[key] = _.unescape(value);
        }
      });
      if (_jsonText.status && _jsonText.status === "error") {
        removePopover($submitBtn);
        var _errorMsg =
          _jsonText.error_message ||
          _jsonText.message ||
          _jsonText.response ||
          "Please try again.";
        var _opt = {
          html: true,
          placement: "top",
          trigger: "manual",
          title: "Application Error",
          content:
            "<b>Error Message:</b> <br>" +
            _errorMsg +
            '<br> <hr> Please fill all the required fields completely. We will reload this form in <span id="count_time">20</span> seconds.'
        };
        $submitBtn
          .attr("disabled", true)
          .popover(_opt)
          .popover("show")
          .next(".popover");
        window.setTimeout(function() {
          var $timer = $("#count_time");
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
      $form.removeClass("form_submitted");
      $(".not_sending", $form).attr("disabled", false);
      if (_debugPostSubmit) {
        console.log(
          "- fired: $form.trigger(" + $form.attr("id") + ' + ".postSubmit"'
        );
      }
      var postSubmitEventName = $form.attr("id") + ".postSubmit";
      $form.trigger(postSubmitEventName, [
        responseText,
        _jsonText,
        statusText,
        xhr,
        $form
      ]);

      window.setTimeout(function() {
        $submitBtn
          .attr("disabled", false)
          .popover("destroy")
          .next(".popover")
          .removeClass("success")
          .remove();
      }, 3000);
    },
    /**
     * Ajax Request Error
     * @param  object jqXHR
     * @param  string textStatus
     * @param  string errorThrown
     * @param  object $element
     */
    processError: function(jqXHR, textStatus, errorThrown, $element) {
      if (console && console.error) {
        console.error("[*] showResponse");
        console.error(arguments);
      }
      // If Error Happen in AJAX
      var $submitBtn = $(".form-actions.wizard-actions button.btn_next"),
        errorTxt = errorThrown;
      if (!$submitBtn.length) {
        // This could be a normal form
        $submitBtn = $('.form-actions button[type="submit"]');
      }
      if ($submitBtn.length) {
        // Remove Popover
        removePopover($submitBtn);
        // Generate New Popover Error Message
        if (jqXHR.responseText) {
          // Try to parse JSON
          try {
            errorTxt = JSON.parse(jqXHR.responseText);
            if (errorTxt.message && console && console.log) {
              console.log("*** Error ***");
              console.log(errorTxt.message);
            }
          } catch (err) {
            console.log("*** Error (Exception) ***");
            console.log(err);
          }
          errorTxt = errorThrown + ", please try again later.";
        }
        var _opt = {
          html: true,
          placement: "top",
          trigger: "manual",
          title: "Application Error",
          content: errorTxt
        };
        $submitBtn
          .attr("disabled", true)
          .popover(_opt)
          .popover("show")
          .next(".popover");
      } else {
        alert(errorTxt + ", please try again later.");
        if (console && console.log && jqXHR.responseText) {
          console.log(jqXHR.responseText);
        }
      }
    },
    /**
     * Update the View Model
     **/
    preValidate: function(e) {
      if (this.formView) {
        Utils.preValidate(e, this.formView.model);
      }
    },
    /**
     * Clear Form Data
     **/
    clearForm: function() {
      var that = this;
      _.each(this.formView.model.attributes, function(value, key) {
        if (typeof value.reset === "function") {
          that.formView.model.get(key).reset();
        } else {
          var $field = $(':input[name="' + key + '"]', that.el);
          if ($field.is(":checked")) {
            $field.attr("checked", false);
          } else if ($field.is(":radio")) {
            return;
          }
          $field.val("");
          $field.trigger("change");
          that.formView.model.set(key, "");
        }
      });
    },
    preventEnterPressed: function(e) {
      if (e.keyCode === 13) {
        if ($(e.currentTarget).is("input")) {
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
      $.getJSON($target.attr("href"), {}, function(data, status) {
        if (status === "success") {
          require(["views/hiddenForm"], function(HiddenFormView) {
            var hiddenFormView = Vm.create(that, "FormView", HiddenFormView);
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
      var $view = $(this).get(0),
        jSerialNumber = this.formView.options.formSchema.jserialnumber
          ? this.formView.options.formSchema.jserialnumber
          : window.jSerialNumber;
      if (jSerialNumber == undefined) {
        throw "Please set jSerialNumber to match with your purchase number.";
      }
      var parameters = {
          progressbar: "true",
          boxmessage: "Loading File Uploader Applet ...",
          "Common.SerialNumber": window.jSerialNumber,
          "Common.UploadMode": "true",
          "Common.UseLiveConnect": "true",
          "Common.ProgressArea.DownloadButton.Visible": "false",
          "Common.SkinLF.ThemepackURL":
            "//public.southernnevadahealthdistrict.org/assets/assets/jar/jupload/themepack.zip",
          "Common.Language.AutoDetect": "true",
          "Upload.UploadUrl": $(this.formView.el).attr("action"),
          "Upload.Compress.Enabled": "true",
          "Upload.Compress.ArchiveFileName": "#UNIQUEID#",
          "Upload.Compress.Format": "ZIP",
          "Upload.Compress.Level": "DEFAULT",
          "Upload.HttpUpload.FieldName.FilePath": "SelectedPath_#COUNTER#",
          "Upload.HttpUpload.FormName": this.formView.el.replace("#", ""),
          "Upload.HttpUpload.AddFormValuesToPostFields": "true",
          "Upload.HttpUpload.AddFormValuesToHeaders": "false",
          "Upload.HttpUpload.AddFormValuesToQueryString": "false",
          "Upload.HttpUpload.FieldName.FileBody": "FileBody_#COUNTER#",
          "Upload.HttpUpload.SendBrowserCookie": "true"
        },
        version = "1.5.1";
      // console.log(parameters["Upload.UploadUrl"]);
      // Since deplyJava will override your body
      var oldwrite = document.write,
        content = "";
      document.write = function(text) {
        content += text;
      };
      _.each(jArray, function(value) {
        content = "";
        parameters["Upload.HttpUpload.FieldName.FileBody"] = value.id;
        deployJava.runApplet(value, parameters, version);
        var $appletParent = $("#" + value.id + "_java-upload-applet").html(
          content
        );
        if (
          $view.options.formSchema &&
          $view.options.formSchema.validation &&
          $view.options.formSchema.validation[value.id]
        ) {
          if ($view.formView.model.validation[value.id].required) {
            $appletParent.addClass("required");
          }
          $view.formView.model.validation[value.id] = {};
        }
        $("#" + value.id + "_accordion").on(
          "click",
          ".accordion-heading",
          function() {
            var $this = $(this),
              $container = $this.next(),
              $parent = $this.closest(".accordion-group");
            // console.log($view.formView);
            if ($container.find("applet").length) {
              $view.formView.model.validation[value.id] = {};
              $parent
                .next()
                .find("input")
                .attr("disabled", true);
            } else {
              $container.find("input").attr("disabled", false);
              if (
                $view.options.formSchema &&
                $view.options.formSchema.validation &&
                $view.options.formSchema.validation[value.id]
              ) {
                $view.formView.model.validation[value.id] =
                  $view.options.formSchema.validation[value.id];
              }
            }
          }
        );
      });
      document.write = oldwrite;
      // Attached the OnCompleted Event
      window.JavaPowUpload_onUploadFinish = function() {
        // Will Refresh the page
        window.jRedirect
          ? location.replace(window.jRedirect)
          : location.reload(true);
      };
    },
    /**
     * Global Form Event for Capturing the Keyboard event for field
     * @return {[type]} [description]
     */
    ajaxCommandByKeyBoard: function(e) {
      var DEBUG = false;
      var keyCode = e.keyCode;
      var isInternal = this.options.internal;
      var tmpUrl = isInternal
        ? "/form/edit?id=" + this.options.formData._id.$oid
        : null;
      var $this = $(e.target);
      // Function to switch to read view
      var switchToReadField = function(updateSpan) {
        var $container = $this.closest(".update-on-read-mode");
        $this.fadeOut("slow", function() {
          var $spanTxt = $container.find(".uneditable-input");
          if (updateSpan) {
            var newVal = updateSpan[$spanTxt.attr("id")];
            if (newVal) {
              $spanTxt.html(newVal);
            } else {
              if (console && console.error) {
                console.error("[x] Error: Update New Value");
                console.error(newVal);
                console.log(updateSpan);
              }
              Utils.showHumaneErrorBox("Error, could not update new value!");
            }
          }
          $spanTxt.fadeIn("slow", function() {
            $this.addClass("force-hide");
            $container.removeClass("ajax");
          });
        });
      };
      // Function to send POST Request
      var sendPostRequest = function(targetUrl, data) {
        if ($this.hasClass("ajax-submitted")) {
          // Do nothing
          return false;
        }
        // Start Sending AJAX
        $this.addClass("ajax-submitted");
        Utils.showHumaneSuccessBox("Updating");
        $.ajax({
          url: targetUrl,
          type: "POST",
          data: data,
          cache: false,
          success: function(d, t, jqXHR) {
            $this.removeClass("ajax-submitted");
            Utils.showHumaneSuccessBox("Success");
            switchToReadField(data);
          },
          error: function(jqXHR, textStatus, errorThrown) {
            $this.removeClass("ajax-submitted");
            if (console && console.error) {
              console.error(
                '[x] Error: Sending Data to POST "' + targetUrl + '"'
              );
              console.error(data);
              console.error(arguments);
            }
            Utils.showHumaneErrorBox("Error, please try again!");
          }
        });
      };
      if (DEBUG) {
        console.log("[*] ajaxCommandByKeyBoard: Key=" + keyCode);
        console.log(arguments);
        console.log(this);
      }
      switch (keyCode) {
        case 13:
          if (DEBUG) {
            console.log("Enter Pressed!");
          }
          if (!tmpUrl) {
            throw "Not implement outside internal yet.";
          }
          // Get The ID
          // Send POST Request
          var _d = {};
          _d[$this.attr("name")] = $.trim($this.val());
          sendPostRequest(tmpUrl, _d);
          break;
        case 27:
          if (DEBUG) {
            console.log("ESC Pressed!");
          }
          switchToReadField();
          break;
      }
    },
    clickUpdateCancelBtn: function(e) {
      if (this.options.mode !== "read") {
        return;
      }
      // Only Activate on Read Mode
      var $this = $(e.target);
      var $container = $this.closest(".update-on-read-mode");
      if (!$container.length) {
        return;
      }
      var $fieldContainer = $container.find(".field-container");
      $fieldContainer.fadeOut("slow", function() {
        var $spanTxt = $container.find(".uneditable-input");
        $spanTxt.fadeIn("slow", function() {
          $container.removeClass("ajax");
          $fieldContainer.addClass("force-hide");
        });
      });
    },
    clickUpdateSubmitBtn: function(e) {
      if (this.options.mode !== "read") {
        return;
      }
      var $this = $(e.target);
      if ($this.hasClass("ajax-submitted")) {
        // Do nothing
        return false;
      }
      // Start Sending AJAX
      $this.addClass("ajax-submitted");
      var that = this;
      var $input,
        _val,
        _d = {},
        _html;
      var isInternal = this.options.internal;
      var tmpUrl = isInternal
        ? "/form/edit?id=" + this.options.formData._id.$oid
        : null;
      var sendPostRequest = function(targetUrl, data, htmlToUpdate) {
        // Start Sending AJAX
        $this.addClass("ajax-submitted");
        Utils.showHumaneSuccessBox("Updating");
        $.ajax({
          url: targetUrl,
          type: "POST",
          data: data,
          cache: false,
          success: function(d, t, jqXHR) {
            $this.removeClass("ajax-submitted");
            Utils.showHumaneSuccessBox("Success");
            if (htmlToUpdate) {
              $input
                .closest(".update-on-read-mode")
                .find(".uneditable-input")
                .html(htmlToUpdate);
            }
            that.clickUpdateCancelBtn(e);
          },
          error: function(jqXHR, textStatus, errorThrown) {
            $this.removeClass("ajax-submitted");
            if (console && console.error) {
              console.error(
                '[x] Error: Sending Data to POST "' + targetUrl + '"'
              );
              console.error(data);
              console.error(arguments);
            }
            Utils.showHumaneErrorBox("Error, please try again!");
          }
        });
      };
      var $wrapper = $this.closest(".field-container");
      if ($wrapper.hasClass("radio-container")) {
        // This is Radio Container
        $input = $wrapper.find(":radio:checked");
        _val = $.trim($input.val());
        _html = $input.attr("data-radio-value");
        _d[$input.attr("name")] = _val;
        sendPostRequest(tmpUrl, _d, _html);
      } else {
        $input = $wrapper.find(":input");
        _val = $.trim($input.val());
        _d[$input.attr("name")] = _val;
        sendPostRequest(tmpUrl, _d, _val);
      }
    }
  });
  return AppView;
});
