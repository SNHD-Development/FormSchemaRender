/**
 * Horizontal Form Layout
 **/
define([
  "jquery",
  "lodash",
  "backbone",
  "vm",
  "utils",
  "events",
  "modelbinder",
  "validation",
  "views/baseField",
  "text!templates/form-layouts/horizontal.html"
], function(
  $,
  _,
  Backbone,
  Vm,
  Utils,
  Events,
  Modelbinder,
  Validation,
  BaseFieldView,
  formLayoutTemplate
) {
  var AppView = BaseFieldView.extend({
    _modelBinder: undefined,
    template: _.template(formLayoutTemplate),
    initialize: function() {
      BaseFieldView.prototype.initialize.call(this);
      this._divcontrolgroup = 0; // init div counter
      if (typeof this.options.formSchema === "undefined") {
        throw "formSchema is not in the options parameters";
      }
      this.el = "#" + this.options.formSchema.name;
      $(this.el).addClass("form-horizontal");
    },
    render: function() {
      var that = this,
        _parentRender = BaseFieldView.prototype.render,
        _html = "",
        _required,
        visibleOnArray = [],
        fieldsType = {};

      _.each(this.options.formSchema.fields, function(value, key, list) {
        var _temp = "",
          _wrapper = false,
          _typeLowerCase = value.type.toLowerCase();
        if (!Utils.shouldRenderShowOnUser(value)) {
          return "";
        }
        // Check for Show On Mode
        if (
          !BaseFieldView.prototype.checkShowOnMode.call(
            that,
            value,
            that.options.mode,
            that.options.formData.status
          )
        ) {
          return "";
        }
        if (
          that.options.internal &&
          typeof value.options.internalcanupdate !== "undefined" &&
          !value.options.internalcanupdate
        ) {
          if (_typeLowerCase === "image") {
            _wrapper = true;
          }
        } else if (
          typeof value.description !== "undefined" &&
          (_.indexOf(that.notRenderLabel, _typeLowerCase) === -1 ||
            (_typeLowerCase === "html" && value.options.visibleon))
        ) {
          _wrapper = true;
        } else if (value.options.visibleon && _typeLowerCase === "checkbox") {
          _wrapper = true;
        }
        if (_wrapper) {
          var _visibleon = "",
            _style = "";
          if (value.options.visibleon) {
            _visibleon = " options-visible-on-" + value.name;
            _style = ' style="display:none"';
          }
          _temp +=
            '<div class="control-group' + _visibleon + '"' + _style + ">";
          this._divcontrolgroup++;
          if (_typeLowerCase !== "html") {
            _required = Utils.checkRequireFields(
              value,
              that.options.formSchema.validation
            );
            _temp += that.renderLabel(value, _required, "control-label");
            _temp += '<div class="controls">';
          }
        }
        _temp += _parentRender.call(that, value);
        if (_wrapper) {
          _temp += "</div>";
          if (_typeLowerCase !== "html") {
            _temp += "</div>";
          }
          this._divcontrolgroup--;
        }
        // If this field has CopyValuesFrom
        if (
          that.options.mode === "create" &&
          value.options.copyvaluesfrom &&
          _typeLowerCase !== "list"
        ) {
          _html += BaseFieldView.prototype.setupCopyValuesFrom.call(
            that,
            value
          );
        }
        // If this has VisibleOn in options
        if (
          value.options.visibleon &&
          !(_typeLowerCase === "button" || _typeLowerCase === "submit")
        ) {
          if (_typeLowerCase === "checkbox") {
            _temp = _temp.replace(/<label>(\s*)\w+(\s*)<\/label>/i, "");
          }
          visibleOnArray.unshift({
            value: value,
            html: _temp
          });
          // BaseFieldView.prototype.setupVisibleOn.call(that, value, _temp, '.control-group');
        } else {
          _html += _temp;
        }
        // Mapping the input type
        if (value && value.name && value.type) {
          fieldsType[value.name] = $.trim(value.type.toLowerCase());
        }
      });

      // Make VisibleOn from Top Down
      _.each(visibleOnArray, function(ele) {
        BaseFieldView.prototype.setupVisibleOn.call(
          that,
          ele.value,
          ele.html,
          ".control-group",
          fieldsType
        );
      });
      // Closed open div
      _html += BaseFieldView.prototype.closeOpenDiv.call(this);
      // console.log("- jQuery.fn.jquery:", jQuery.fn.jquery);
      // console.log("- _html:", _html);
      // if (_html.indexOf("var") >= 0) {
      //   console.log("- found var!");
      // }
      $(this.el).html(
        this.template(
          _.extend(
            {
              html: _html
            },
            this.options.formSchema
          )
        )
      );
      // Bind Model
      that._modelBinder.bind(that.model, that.el, that.model.bindings);
      //Debug:: Model Binder for Horizontal View
      // console.log(that.model.bindings);
      Backbone.Validation.bind(that, {
        forceUpdate: true
      });
    }
  });
  return AppView;
});
