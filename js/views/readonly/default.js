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
      var that = this,
        _parentRender = BaseFieldView.prototype.render,
        _html = '';
      _.each(this.options.formSchema.fields, function(value, key, list) {

        var _typeLowerCase = value.type.toLowerCase();

        Utils.addFormSubmittedData(value, that);

        // Check if the data is empty, will not render
        if (!Utils.isRenderReadMode(that, value)) {
          return '';
        }

        // VisibleOn Options
        // if (value.options.visibleon && value.type.toLowerCase() !== 'html' && value.options.visibleon.values) {
        //   var shouldShow = true;
        //   if (that.options.formData.fields[value.options.visibleon.name] && _.isArray(that.options.formData.fields[value.options.visibleon.name])) {
        //     shouldShow = false;
        //     for (var i = 0; i < that.options.formData.fields[value.options.visibleon.name].length; i++) {
        //       var _currentValue = that.options.formData.fields[value.options.visibleon.name][i];
        //       // console.log('- _currentValue:', _currentValue);
        //       if (value.options.visibleon.values.indexOf(_currentValue) >= 0) {
        //         shouldShow = true;
        //         break;
        //       }
        //     }
        //   }
        //   else if (value.options.visibleon.values.indexOf(that.options.formData.fields[value.options.visibleon.name]) === -1) {
        //     shouldShow = false;
        //   }
        //   if (!shouldShow) {
        //     return '';
        //   }
        // }
        if (!Utils.isRenderVisibleOn(that, value, _typeLowerCase)) {
          return '';
        }

        // Check for Show On Mode
        if (!BaseFieldView.prototype.checkShowOnMode.call(that, value, 'read', that.options.formData.status)) {
          return '';
        }

        if (typeof value.description !== 'undefined' && _.indexOf(that.notRenderLabelRead, value.type.toLowerCase()) === -1) {
          _html += that.renderLabel(value, false);
        }
        var _currentHtml = _parentRender.call(that, value, true);
        _html += _currentHtml;
        // console.log('- value:', value);
        // if (value && value.type.toLowerCase() === 'html') {
        //   console.log('- value:', value);
        //   console.log('- _currentHtml:', _currentHtml);
        // }
      });
      // not auto rendering the button
      //_html += BaseFieldView.prototype.renderButton.call(this, this.options.formSchema.formoptions);

      // Closed open div
      _html += BaseFieldView.prototype.closeOpenDiv.call(this);
      $(this.el).html(this.template(_.extend({
        html: _html
      }, this.options.formSchema)));
    }
  });
  return AppView;
});
