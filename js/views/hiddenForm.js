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
        template = this.template(data);
      $(this.el)
        .append(template);
      $('#form-render-hidden-form')
        .trigger('submit');
    },
  });
  return AppView;
});