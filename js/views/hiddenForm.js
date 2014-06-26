define([
  'jquery',
  'lodash',
  'backbone',
  'vm',
  'events',
  'text!templates/hiddenForm.html'
], function($, _, Backbone, Vm, Events, hiddenFormTemplate) {
  var AppView = Backbone.View.extend({
    el: 'body',
    template: _.template(hiddenFormTemplate),
    initialize: function() {},
    events: {},
    render: function(data) {
      var that = this,
        template,
        selector;
      if (data.html) {
        template = data.html;
        selector = '#snhd-payment-form';
      } else {
        template = this.template(data);
        selector = '#form-render-hidden-form';
      }
      $(this.el).append(template);
      $(selector).trigger('submit');
    },
  });
  return AppView;
});