/**
 * Default Read Mode Layout (Vertical)
 **/
define([
  'jquery',
  'lodash',
  'backbone',
  'vm',
  'utils',
  'events',
  'views/baseField',
  'text!templates/readonly/default.html'
], function($, _, Backbone, Vm, Utils, Events, BaseFieldView, readLayoutTemplate) {
  var AppView = BaseFieldView.extend({
    template: _.template(readLayoutTemplate),
    initialize: function() {
      BaseFieldView.prototype.initialize.call(this);

      if (typeof this.options.formSchema === 'undefined') {
        throw 'formSchema is not in the options parameters';
      }
      if (typeof this.options.formData === 'undefined') {
        throw 'formData is not in the options parameters';
      }
      this.el = '#' + this.options.formSchema.name;
    },
    render: function() {
      // console.log('here');
      var that = this,
        _parentRender = BaseFieldView.prototype.render,
        visibleOnArray = [],
        fieldsType = {},
        _html = '';
      _.each(this.options.formSchema.fields, function(value, key, list) {

        if (!Utils.shouldRenderShowOnUser(value)) {
          return '';
        }

        var _typeLowerCase = value.type.toLowerCase(), _temp = '';

        Utils.addFormSubmittedData(value, that);

        // Check if the data is empty, will not render
        if (!Utils.isRenderReadMode(that, value)) {
          return '';
        }

        if (!Utils.isRenderVisibleOn(that, value, _typeLowerCase)) {
          return '';
        }

        // Check for Show On Mode
        if (!BaseFieldView.prototype.checkShowOnMode.call(that, value, 'read', that.options.formData.status)) {
          return '';
        }

        if (typeof value.description !== 'undefined' && _.indexOf(that.notRenderLabelRead, _typeLowerCase) === -1) {
          _required = Utils.checkRequireFields(value, that.options.formSchema.validation);
          _temp += that.renderLabel(value, _required);
        }
        _temp += _parentRender.call(that, value, true);
        // If this field has CopyValuesFrom
        if (that.options.mode === 'create' && value.options.copyvaluesfrom && _typeLowerCase !== 'list') {
          _html += BaseFieldView.prototype.setupCopyValuesFrom.call(that, value);
        }
        // If this has VisibleOn in options
        /*if (value.options.visibleon && !(_typeLowerCase === 'button' || _typeLowerCase === 'submit')) {
          _temp = '<div class="options-visible-on-' + value.name + '" style="display:none">' + _temp + '</div>';
          visibleOnArray.unshift({
            value: value,
            html: _temp
          });
          // BaseFieldView.prototype.setupVisibleOn.call(that, value, _temp);
        } else {
          _html += _temp;
        }*/

        _html += _temp;

        // console.log('- value:', value);
        // if (value && value.type.toLowerCase() === 'html') {
        //   console.log('- value:', value);
        //   console.log('- _currentHtml:', _currentHtml);
        // }

        // Mapping the input type
        if (value && value.name && value.type) {
          fieldsType[value.name] = $.trim(value.type.toLowerCase());
        }
      });
      // not auto rendering the button
      //_html += BaseFieldView.prototype.renderButton.call(this, this.options.formSchema.formoptions);

      // console.log('- visibleOnArray:', visibleOnArray);

      // Make VisibleOn from Top Down
      _.each(visibleOnArray, function(ele) {
        BaseFieldView.prototype.setupVisibleOn.call(that, ele.value, ele.html, null, fieldsType);
      });

      // Closed open div
      _html += BaseFieldView.prototype.closeOpenDiv.call(this);
      $(this.el).html(this.template(_.extend({
        html: _html
      }, this.options.formSchema)));
    }
  });
  return AppView;
});
