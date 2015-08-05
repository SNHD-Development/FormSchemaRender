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
      if (typeof data === 'string') {
        try {
          data = $.parseJSON(data);
        } catch (err) {
          alert('Could not be able to parse the data.');
          return;
        }
      }
      if (data.html) {
        // Need to convert to the right tag
        template = $('<textarea />').html(data.html).text();
        console.log(template);
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