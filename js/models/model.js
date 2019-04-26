// Default FormSchema Backbone Model
define([
  "jquery",
  "underscore",
  "backbone",
  "collections/collections",
  "../utils"
], function($, _, Backbone, Collections, Utils) {
  /**
   * Function to parse formSchema to be used in this model
   * @param  objct model
   * @param  object attrs
   * @param  boolean mode either this will be internal or not
   * @return
   */
  var DEBUG_CHANGED = false;
  var DEBUG = false;
  var parseFields = function(model, attrs, mode) {
      var DEBUG = false;
      var _attrs = {},
        _validation = {},
        _name,
        _internal = attrs.is_internal ? true : false,
        _render_mode = attrs.render_mode || false,
        _typeLowerCase,
        _addToModelBinder;
      _.each(attrs.fields, function(value) {
        _addToModelBinder = true;
        value.options = value.options || {};
        if (!_internal && value.options.internal) {
          return;
        } else if (
          _render_mode &&
          value.options.showonmode &&
          value.options.showonmode.indexOf(_render_mode) === -1
        ) {
          return;
        } else if (
          _internal &&
          typeof value.options.internalcanupdate !== "undefined" &&
          !value.options.internalcanupdate
        ) {
          return;
        } else if (
          model.attributes.status &&
          value.options.showonstatus &&
          _.indexOf(value.options.showonstatus, model.attributes.status) < 0
        ) {
          return;
        }
        if (typeof attrs.validation[value.name] !== "undefined") {
          _.each(attrs.validation[value.name], function(validationValue, key) {
            var _keywords = [
              "required",
              "length",
              "range",
              "pattern",
              "acceptance",
              "min",
              "max",
              "length"
            ];
            if (!_.contains(_keywords, key.toLowerCase())) {
              return;
            }
            delete attrs.validation[value.name][key];
            attrs.validation[value.name][key.toLowerCase()] = validationValue;
          });
        }
        // If there is an internal flag will need to check for it as well
        if (
          typeof value.options.internal !== "undefined" &&
          value.options.internal !== mode
        ) {
          _addToModelBinder = false;
        }
        _typeLowerCase = value.type.toLowerCase();
        // Should bind Model?
        switch (_typeLowerCase) {
          case "filerepository":
          case "radio":
            _addToModelBinder = false;
            break;
        }
        // Set Up for escapeHtmlInputs
        switch (_typeLowerCase) {
          case "textarea":
            model.escapeHtmlInputs.push(value.name);
            break;
        }
        // Set Up Logic
        switch (_typeLowerCase) {
          case "booleaninput":
            _attrs[value.name] = "";
            setValidationData(value.name, attrs, _validation, "");
            if (_addToModelBinder) {
              model.bindings[value.name] = '[name="' + value.name + '"]';
            }
            model.on("change:" + value.name, function(modelObj, changedVal) {
              var _data = {};
              _data[value.name] =
                changedVal === "true" || changedVal === true
                  ? true
                  : changedVal === "false" || changedVal === false
                    ? false
                    : "";
              modelObj.set(_data, {
                silent: true
              });
            });
            model.hasBooleanInput = true;
            break;
          case "multifiles":
            // DEBUG = true;
            _name = value.name + "[]";
            _attrs[_name] = "";
            if (DEBUG) {
              console.log(
                "model.parseFields setting ",
                _typeLowerCase,
                "name",
                _name
              );
            }
            if (typeof attrs.validation[value.name] !== "undefined") {
              attrs.validation[_name] = _.clone(attrs.validation[value.name]);
              delete attrs.validation[value.name];
            }
            setValidationData(_name, attrs, _validation, "");
            if (DEBUG) {
              console.log(
                "- multiFilesDefaultValue",
                model.multiFilesDefaultValue
              );
              // console.log('- _attrs', model.attributes[_name]);
              // console.log('- value', value);
            }
            if (!model.multiFilesDefaultValue[_name]) {
              model.multiFilesDefaultValue[_name] = true;
            }
            // DEBUG = false;
            break;
          case "fraction":
            _name = value.name + "_numerator";
            _attrs[_name] = "";
            setValidationData(_name, attrs, _validation, "");
            if (_addToModelBinder) {
              model.bindings[_name] = '[name="' + _name + '"]';
            }
            _name = value.name + "_denominator";
            _attrs[_name] = "";
            setValidationData(_name, attrs, _validation, "");
            if (_addToModelBinder) {
              model.bindings[_name] = '[name="' + _name + '"]';
            }
            break;
          case "address":
            var _tmpName = value.options.showstreetnumber
              ? "Street Name"
              : "Street";
            _name = value.name + "_address_street";
            _attrs[_name] = "";
            setValidationData(_name, attrs, _validation, " (" + _tmpName + ")");
            if (_addToModelBinder && !value.options.visibleon) {
              model.bindings[_name] = '[name="' + _name + '"]';
            }
            _name = value.name + "_address_city";
            _attrs[_name] = "";
            setValidationData(_name, attrs, _validation, " (City)");
            if (_addToModelBinder && !value.options.visibleon) {
              model.bindings[_name] = '[name="' + _name + '"]';
            }
            _name = value.name + "_address_state";
            _attrs[_name] = "";
            setValidationData(_name, attrs, _validation, " (State)");
            if (_addToModelBinder && !value.options.visibleon) {
              model.bindings[_name] = '[name="' + _name + '"]';
            }
            _name = value.name + "_address_zip";
            _attrs[_name] = "";
            setValidationData(_name, attrs, _validation, " (ZIP)");
            if (_addToModelBinder && !value.options.visibleon) {
              model.bindings[_name] = '[name="' + _name + '"]';
            }
            _name = value.name + "_address_country";
            _attrs[_name] = "";
            setValidationData(_name, attrs, _validation, " (Country)");
            if (_addToModelBinder && !value.options.visibleon) {
              model.bindings[_name] = '[name="' + _name + '"]';
            }
            if (value.options.showstreetnumber) {
              _name = value.name + "_address_street_number";
              _attrs[_name] = "";
              setValidationData(_name, attrs, _validation, " (Street Number)");
              if (_addToModelBinder && !value.options.visibleon) {
                model.bindings[_name] = '[name="' + _name + '"]';
              }
            }
            if (value.options.showunitnumber) {
              _name = value.name + "_address_unit_number";
              _attrs[_name] = "";
              setValidationData(_name, attrs, _validation, " (Unit Number)");
              if (_addToModelBinder && !value.options.visibleon) {
                model.bindings[_name] = '[name="' + _name + '"]';
              }
            }
            break;
          case "fullname":
            if (
              typeof value.options.middlename === "undefined" ||
              value.options.middlename
            ) {
              _name = value.name + "_fullname_middle_name";
              _attrs[_name] = "";
              setValidationData(_name, attrs, _validation, " (Middle Name)");
              if (_addToModelBinder && !value.options.visibleon) {
                model.bindings[_name] = '[name="' + _name + '"]';
              }
            }
            _name = value.name + "_fullname_first_name";
            _attrs[_name] = "";
            setValidationData(_name, attrs, _validation, " (First Name)");
            if (_addToModelBinder && !value.options.visibleon) {
              model.bindings[_name] = '[name="' + _name + '"]';
            }
            _name = value.name + "_fullname_last_name";
            _attrs[_name] = "";
            setValidationData(_name, attrs, _validation, " (Last Name)");
            if (_addToModelBinder && !value.options.visibleon) {
              model.bindings[_name] = '[name="' + _name + '"]';
            }
            break;
          // If this is list (subform) will need collection
          case "list":
            _attrs[value.name] = new Collections();
            setValidationData(value.name, attrs, _validation, "");
            model.subFormLists.push(value.name);
            break;
          case "check":
          case "checkbox":
            _name = value.name + "[]";
            _attrs[_name] = "";
            if (typeof attrs.validation[value.name] !== "undefined") {
              attrs.validation[_name] = _.clone(attrs.validation[value.name]);
              delete attrs.validation[value.name];
            }
            setValidationData(_name, attrs, _validation, "");
            // CheckBox should not do ModelBinder
            // model.bindings[_name] = '[name="' + _name + '"]';
            break;
          // Will ignore these types
          case "hidden":
          case "buttonclipboard":
          case "fieldsetstart":
          case "fieldsetend":
          case "fieldset":
          case "clear":
          case "action":
          case "button":
          case "submit":
          case "hr":
          case "html":
          case "step": // Special Field Type for Wizard View
            model.notBinding.push(value.name);
            break;
          case "date":
            if (
              value.options.render &&
              value.options.render.toLowerCase() === "select"
            ) {
              _attrs[value.name] = "";
              _attrs[value.name + "_birth[month]"] = "";
              _attrs[value.name + "_birth[day]"] = "";
              _attrs[value.name + "_birth[year]"] = "";
              if (typeof attrs.validation[value.name] !== "undefined") {
                _validation[value.name] = _.clone(attrs.validation[value.name]);
                var _dateValidation = _.clone(attrs.validation[value.name]);
                if (_dateValidation.mindate) {
                  delete _dateValidation.mindate;
                }
                if (_dateValidation.maxdate) {
                  delete _dateValidation.maxdate;
                }
                _validation[value.name + "_birth[month]"] = _.clone(
                  _dateValidation
                );
                _validation[value.name + "_birth[day]"] = _.clone(
                  _dateValidation
                );
                _validation[value.name + "_birth[year]"] = _.clone(
                  _dateValidation
                );

                // console.log('_validation:', _validation);
              }
            } else {
              _attrs[value.name] = "";
              setValidationData(value.name, attrs, _validation, "");
              // model.bindings[value.name] = '[name="' + value.name + '"]';
            }
            break;
          case "email":
            _attrs[value.name] = "";
            if (typeof attrs.validation[value.name] !== "undefined") {
              _validation[value.name] = _.clone(attrs.validation[value.name]);
              if (value.options.autocomplete) {
                var _emailValidation = _.clone(attrs.validation[value.name]),
                  _emailServerValidation = _.clone(
                    attrs.validation[value.name]
                  );
                if (
                  _emailValidation.pattern &&
                  _emailValidation.pattern === "email"
                ) {
                  _emailValidation.pattern = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))$/i;
                  _emailServerValidation.pattern = /^((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
                }
                _name = value.name + "_username";
                _validation[_name] = _emailValidation;
                _name = value.name + "_server";
                _validation[_name] = _emailServerValidation;
              }
            }
            // Add to model binder
            if (_addToModelBinder) {
              model.bindings[value.name] = '[name="' + value.name + '"]';
              if (value.options.autocomplete) {
                _name = value.name + "_username";
                model.bindings[_name] = '[name="' + _name + '"]';
                _name = value.name + "_server";
                model.bindings[_name] = '[name="' + _name + '"]';
              }
            }
            break;
          case "telephone":
            _attrs[value.name] = "";
            if (typeof attrs.validation[value.name] !== "undefined") {
              _validation[value.name] = _.clone(attrs.validation[value.name]);
              if (_validation[value.name].required) {
                _validation[value.name].pattern = /^\(\d{3}\) \d{3}-\d{4}$/i;
              }
            }
            if (_addToModelBinder) {
              model.bindings[value.name] = '[name="' + value.name + '"]';
            }
            break;

          case "socialsecurity":
            _attrs[value.name] = "";
            if (typeof attrs.validation[value.name] !== "undefined") {
              _validation[value.name] = _.clone(attrs.validation[value.name]);
              if (_validation[value.name].required) {
                _validation[value.name].pattern = /^\d{3}\-\d{2}-\d{4}$/i;
              }
            }
            if (!_validation[value.name]) {
              _validation[value.name] = {};
            }
            if (_validation && !_validation[value.name].pattern) {
              // Force to not require, but will not override the value
              if (typeof _validation[value.name].required === "undefined") {
                _validation[value.name].required = false;
              }
              _validation[value.name].pattern = /(^$|^\d{3}\-\d{2}-\d{4}$)/i;
            }

            if (_addToModelBinder) {
              model.bindings[value.name] = '[name="' + value.name + '"]';
            }
            break;

          case "userid":
            _attrs[value.name] = "";
            if (typeof attrs.validation[value.name] !== "undefined") {
              _validation[value.name] = _.clone(attrs.validation[value.name]);
              if (
                !_validation[value.name].pattern &&
                !(
                  value.options.render &&
                  value.options.render.toLowerCase() === "select"
                )
              ) {
                _validation[value.name].pattern = "email";
              }
            }
            break;
          // If this is ButtonDecision Type
          // Will need to set the on change event
          case "buttondecision":
            model.on("change:" + value.name, function(model, val) {
              $("#" + value.name + "_btn_condition")
                .val(val)
                .trigger("change");
            });
          default:
            // Set If there is attributes.value
            if (value.attributes && value.attributes.value) {
              _attrs[value.name] = value.attributes.value;
            } else {
              _attrs[value.name] = "";
            }
            setValidationData(value.name, attrs, _validation, "");
            if (_typeLowerCase !== "buttondecision" && _addToModelBinder) {
              model.bindings[value.name] = '[name="' + value.name + '"]';
            }
            if (_typeLowerCase === "select") {
              if (value.options.tags) {
                // console.log(model.bindings[value.name]);
                model.bindings[value.name] = "#" + value.name;
                // console.log(model.bindings[value.name]);
              }
            }
        }
        // If there is an option for VisibleOn, need to remove the binding
        if (
          value.options &&
          value.options.visibleon &&
          model.bindings[value.name]
        ) {
          delete model.bindings[value.name];
        }
        // Check for ShowOnStatus
        if (
          model.bindings[value.name] &&
          value.options &&
          value.options.showonstatus
        ) {
          if (model.attributes.status) {
            var _index = _.indexOf(
              value.options.showonstatus,
              model.attributes.status
            );
            if (_index < 0) {
              delete model.bindings[value.name];
              if (_validation[value.name]) {
                delete _validation[value.name];
              }
            }
          } else {
            // Create Mode (No Status Yet)
            delete model.bindings[value.name];
            if (_validation[value.name]) {
              delete _validation[value.name];
            }
          }
        }
        // Check for ShowOnUser
        if (
          value.options &&
          value.options.showonuser &&
          model.bindings[value.name] &&
          !Utils.shouldRenderShowOnUser(value)
        ) {
          delete model.bindings[value.name];
          if (_validation[value.name]) {
            delete _validation[value.name];
          }
        }
      });
      model.validation = _validation;
      return _attrs;
    },
    /**
     * Set Validation Data
     **/
    setValidationData = function(name, attrs, validation, msg) {
      if (typeof attrs.validation[name] !== "undefined") {
        validation[name] = _.clone(attrs.validation[name]);
        if (attrs.validation[name].msg) {
          validation[name].msg = attrs.validation[name].msg + msg;
        }
      }
    };
  return Backbone.Model.extend({
    initialize: function() {
      var self = this;
      this.multiFilesDefaultValue = {};
      this.subFormLists = [];
      this.bindings = {}; // To be used in ModelBinder
      this.notBinding = []; // will be used to check what field will not need to render.
      this.escapeHtmlInputs = []; // Inputs that need to escape the HTML.
      this._listFieldType = {}; // Save the reference for _listFieldType

      // Important Function to Parse FormData
      var _attrs = parseFields(
        this,
        this.attributes,
        this.attributes.is_internal
      );
      this.clear();
      this.set(_attrs);
      /**
       * Add Invalid Event
       **/
      this.on("validated:invalid", function(model, errors) {
        var DEBUG = false;
        if ("console" in window && console && console.log) {
          console.log("Invalid Fields", errors);
        }
        if (DEBUG) {
          console.log("Check Model Values", model.toJSON());
          console.log("Check Model Validation", model.validation);
          console.log(
            "Check Model MultiFilesDefaultValue",
            model.multiFilesDefaultValue
          );
        }
        _.each(errors, function(value, key) {
          $(':input[name="' + key + '"]').addClass("invalid");
          if (DEBUG) {
            console.log("- Invalid Value for ", key);
            console.log(model.get(key));
            console.log("- Validation", model.validation[key]);
            console.log(
              "- MultiFilesDefaultValue",
              model.multiFilesDefaultValue[key]
            );
          }
        });
      });
      // Debug
      if (DEBUG_CHANGED) {
        this.on("change", function() {
          var DEBUG = true;
          if (DEBUG) {
            console.log("=== Check Model Change ===");
            console.log("[x] Values");
            console.log(this.toJSON());
            console.log("[x] Binding");
            console.log(this.bindings);
            console.log("[x] MultiFilesDefaultValue");
            console.log(this.multiFilesDefaultValue);
          }
        });
      }

      // HTML Entities
      if (this.escapeHtmlInputs.length) {
        var escOpts = {
          silent: true
        };
        _.each(this.escapeHtmlInputs, function(name) {
          var currentE = "change:" + name;
          // console.log('Set [' + name + ']');
          self.on(currentE, function() {
            if (self.has(name)) {
              // console.log(name);
              // console.log(self.get(name));
              var esc = Utils.htmlspecialchars(self.get(name));
              var newVal = {};
              newVal[name] = esc;
              self.set(newVal, escOpts);
              // console.log(self.get(name));
            }
          });
        });
      }

      // Save the Reference of Collection for List
      _.each(this.subFormLists, function(keyName) {
        if (self && self.has && self.has(keyName)) {
          var _collection = self.get(keyName);
          if (_collection && _collection.add) {
            self._listFieldType[keyName] = _collection;
          }
        }
      });
    },
    /**
     * Trim the value before setting the value
     **/
    setTrim: function(key, value, options) {
      var attrs;
      value = $.trim(value);
      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (_.isObject(key) || key == null) {
        attrs = key;
        options = value;
      } else {
        attrs = {};
        attrs[key] = value;
      }
      options = options || {};
      if (options.trim) {
        attrs[key] = $.trim(attrs[key]);
      }
      Backbone.Model.prototype.set.call(this, attrs, options);
    },
    /**
     * Parse nested JSON data, case Model -> Collection and append to the form input
     **/
    appendSubFormInput: function(formId, internalField, listSchema) {
      // debugger;
      listSchema = listSchema || null;
      var _data = _.clone(this.toJSON()),
        _postfix,
        $form = $("#" + formId);
      $("input.subform_before_submit", $form).remove();
      _.each(_data, function(value, key) {
        /*if (key && key === 'AddAPublicPOD') {
          debugger;
        }*/
        _postfix = internalField.indexOf(key) > -1 ? "_internal" : "";
        if (
          typeof value !== "undefined" &&
          value &&
          typeof value.toJSON === "function"
        ) {
          // Need to Check FormSchema and Parse the correct Data into input
          if (listSchema && listSchema[key].fields) {
            _.each(listSchema[key].fields, function(fieldsSchema) {
              if (!fieldsSchema || !fieldsSchema.name || !fieldsSchema.type) {
                return;
              }
              // Set keys
              if (fieldsSchema) {
                if (!fieldsSchema.options) {
                  fieldsSchema.options = {};
                }
                if (!fieldsSchema.attributes) {
                  fieldsSchema.attributes = {};
                }
              }
              var _listFieldType = fieldsSchema.type.toLowerCase();
              _.each(value.models, function(modelValue) {
                var _tmpVal;
                // console.log(_listFieldType);
                // Where to format the value
                switch (_listFieldType) {
                  case "number":
                    var _tmpNum = parseFloat(modelValue.get(fieldsSchema.name));
                    if (!isNaN(_tmpNum)) {
                      // if (fieldsSchema.options && fieldsSchema.options.decimals) {
                      //   _tmpNum *= Math.pow(10, fieldsSchema.options.decimals);
                      // }
                      modelValue.set(fieldsSchema.name, _tmpNum);
                    }
                    break;
                  case "select":
                    _tmpVal = $.trim(modelValue.get(fieldsSchema.name));
                    if (
                      (fieldsSchema.options && fieldsSchema.options.tags) ||
                      (fieldsSchema.attributes &&
                        fieldsSchema.attributes.multiple)
                    ) {
                      if (_.isString(_tmpVal)) {
                        _tmpVal = _tmpVal.split(",");
                      }
                      if (_tmpVal && _tmpVal.length && _tmpVal[0] === "") {
                        _tmpVal = [];
                      }
                      if (_tmpVal.sort) {
                        // By default sort by number
                        _tmpVal = _tmpVal.sort(Utils.sortNumber);
                      }
                      modelValue.set(fieldsSchema.name, _tmpVal);
                      // console.log(modelValue.get(fieldsSchema.name));
                    }
                    // console.log(_tmpVal);
                    break;
                  case "date":
                    _tmpVal = modelValue.get(fieldsSchema.name);
                    _tmpVal = _.isString(_tmpVal) ? $.trim(_tmpVal) : _tmpVal;
                    // console.log(_tmpVal);
                    if (_tmpVal === "") {
                      _tmpVal = null;
                    } else if (_.isNull(_tmpVal)) {
                    } else {
                      if (_tmpVal && _tmpVal.$date) {
                        // console.log(_tmpVal.$date);
                        _tmpVal = moment(_tmpVal.$date);
                      } else {
                        _tmpVal = moment(_tmpVal, "MM/DD/YYYY");
                      }
                      if (!_tmpVal.isValid()) {
                        alert(
                          'Could not be able to parse this date value for "' +
                            fieldsSchema.name +
                            '" with "' +
                            $.trim(modelValue.get(fieldsSchema.name)) +
                            '"'
                        );
                        throw new Error();
                      }
                    }
                    modelValue.set(fieldsSchema.name, _tmpVal);
                    break;
                }
              });
            });
          }
          /*if (key && key === 'AddAPublicPOD') {
            debugger;
          }*/
          var _tmpJsonTxt = JSON.stringify(value.toJSON());
          $form.prepend(
            '<input type="hidden" name="' +
              key +
              _postfix +
              '" value="" class="subform_before_submit">'
          );
          $form.find(':input[name="' + key + _postfix + '"]').val(_tmpJsonTxt);
        } else {
        }
      });
    },
    /**
     * Trigger Error for UI for special field types
     * @return
     */
    triggerError: function(view) {
      if (this.hasBooleanInput) {
        var $booleanInput = $(
          '.form-render_booleaninput input[type="hidden"].invalid',
          view.el
        );
        $booleanInput.each(function() {
          var $this = $(this),
            _errorTxt =
              '<span class="text-error">Please answer this question.</span>';
          $this
            .closest(".form-render_booleaninput")
            .next()
            .html(_errorTxt)
            .show("slow");
        });
      }
    },
    /**
     * Checking for Form Validation
     * @return {Boolean}
     */
    isSubformValid: function() {
      var that = this,
        _result = true;
      _.each(this.subFormLists, function(element) {
        if (!that.validation[element]) {
          return;
        }
        // console.log('- that.validation:', that.validation);
        _.each(that.validation[element], function(validation, key) {
          if (_.isObject(validation) || !_result || !validation) {
            return;
          }
          var _subFormData = $(
            'input.subform_before_submit[name="' + element + '"]'
          ).val();
          // console.log(_subFormData);
          // console.log('- validation:', validation);
          switch (key) {
            case "required":
              if (_subFormData === "[]" || !_subFormData) {
                _result = false;
              }
              break;
          }
        });
      });
      return _result;
    },
    /**
     * Add Input into model binder form
     * @param  string name
     * @param  string type
     * @return
     */
    bindModelBinder: function(name, type) {
      // console.log('=== bindModelBinder ===');
      // console.log(name);
      switch (type.toLowerCase()) {
        default:
          this.bindings[name] = '[name="' + name + '"]';
      }
    },
    unbindModelBinder: function(name, type) {
      // console.log('=== unbindModelBinder ===');
      // console.log(name);
      switch (type.toLowerCase()) {
        default:
          delete this.bindings[name];
      }
    }
  });
});
