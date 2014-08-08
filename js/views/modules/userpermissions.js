/**
 * User Permission Modules
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/modules/userpermissions.html'
], function($, _, Backbone, userPermissionsTemplate) {

  var userpermissions = Backbone.View.extend({

    template: _.template(userPermissionsTemplate),

    initialize: function() {
      return;
      this.collection.bind("reset", this.render, this);
    },

    render: function() {
      // Still developing this module.
      return;
      console.log('*** Render ***');

      // Properties
      if (!this._actions) {
        this._actions = this.$el.find('.form-actions');
      }

      var moduleDiv = this.$el.find('#module-userpermissions');
      if (moduleDiv.length) {
        // remove and re-draw
        moduleDiv.remove();
        this._actions.find('.form-modules-add-users').remove();
      }
      // Render the Module
      this._actions.append(this.template({}));
      this.$modalForm = this._actions.find('#module-userpermissions').modal({
        backdrop: "static",
        keyboard: false,
        show: false
      }).appendTo(this.$el);

    },
    events: {
      "click .form-actions .form-modules-add-users": function(e) {
        console.log('*** click on add-user ***');
        this.$modalForm.modal('show');
      },
      "click #module-userpermissions .form-modules-save": function(e) {
        console.log('*** click on save ***');
        this.$modalForm.modal('hide');
        this.collection.reset([]);
      },
    }
  });

  return userpermissions;
});