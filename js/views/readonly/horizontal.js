/**
 * Horizontal Read Mode Layout
 **/
define([
  "jquery",
  "lodash",
  "backbone",
  "vm",
  "utils",
  "events",
  "views/baseField",
  "text!templates/readonly/horizontal.html"
], function(
  $,
  _,
  Backbone,
  Vm,
  Utils,
  Events,
  BaseFieldView,
  readLayoutTemplate
) {
  var AppView = BaseFieldView.extend({
    template: _.template(readLayoutTemplate),
    initialize: function() {
      BaseFieldView.prototype.initialize.call(this);

      this._divcontrolgroup = 0; // init div counter

      if (typeof this.options.formSchema === "undefined") {
        throw "formSchema is not in the options parameters";
      }
      if (typeof this.options.formData === "undefined") {
        throw "formData is not in the options parameters";
      }
      this.el = "#" + this.options.formSchema.name;
      $(this.el).addClass("form-horizontal");
    },
    render: function() {
      var _DEBUG = false;
      var that = this,
        _parentRender = BaseFieldView.prototype.render,
        visibleOnArray = [],
        fieldsType = {},
        _html = "";
      _.each(this.options.formSchema.fields, function(value, key, list) {
        if (!Utils.shouldRenderShowOnUser(value)) {
          return "";
        }

        var _typeLowerCase = value.type.toLowerCase(), _temp = '';

        Utils.addFormSubmittedData(value, that);

        // Check if the data is empty, will not render
        if (!Utils.isRenderReadMode(that, value)) {
          return "";
        }

        // VisibleOn Options
        if (!Utils.isRenderVisibleOn(that, value, _typeLowerCase)) {
          return "";
        }

        // Check for Show On Mode
        if (
          !BaseFieldView.prototype.checkShowOnMode.call(
            that,
            value,
            "read",
            that.options.formData.status
          )
        ) {
          return "";
        } else if (_typeLowerCase === "buttondecision") {
          _temp +=
            '<input type="hidden" name="' +
            value.name +
            '" id="' +
            value.name +
            '_btn_condition" value="' +
            that.options.formData.fields[value.name] +
            '"/>';
          return "";
        }

        if (
          typeof value.description !== "undefined" &&
          _.indexOf(that.notRenderLabelRead, _typeLowerCase) === -1
        ) {
          _temp += '<div class="control-group">';
          this._divcontrolgroup++;
          _temp += that.renderLabel(value, false, "control-label");
          _temp += '<div class="controls">';
        }
        _temp += _parentRender.call(that, value, true);
        if (
          typeof value.description !== "undefined" &&
          _.indexOf(that.notRenderLabelRead, _typeLowerCase) === -1
        ) {
          _temp += "</div></div>";
          this._divcontrolgroup--;
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

      if (_DEBUG) {
        console.log('- visibleOnArray:', visibleOnArray);
      }

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

      // not auto rendering the button
      //_temp += BaseFieldView.prototype.renderButton.call(this, this.options.formSchema.formoptions);

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
    }
  });
  return AppView;
});
