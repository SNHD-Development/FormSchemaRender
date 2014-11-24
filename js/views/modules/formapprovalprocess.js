/**
 * FormApprovalProcess Modules
 * This module will check the current user.
 * If this is not the submittion user, will show the Approval UI
 * If this user is already approved, will not show the Approval UI
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'utils',
  'text!templates/modules/formapprovalprocess.html'
], function($, _, Backbone, Utils, formApprovalProcessTemplate) {

  // Set for Debug Mode
  var DEBUG = false;
  var SUP_USERNAME = 'frame';

  function buildNewFormElement(id, values) {
    var cTime = new Date(),
      append = '_internal',
      html = '<form method="post" action="/form/edit?id=' + id + '" novalidate id="module-form-update-approval"><input type="hidden" name="UserPermissions' + append + '" id="UserPermissions"/></form>';
    var body = $('body').append(html);
    var $form = body.find('#module-form-update-approval');
    $form.find('#UserPermissions').val(JSON.stringify(values));
    $form.submit();
  }

  // Private Functions
  function buildFormDataForComment(view, action) {
    if (!_.isString(action)) {
      throw buildFormDataForComment + ' expected action to be a string.';
    }
    // Adding Spin
    view._modal.find('.modal-body #module-approval-loader').show();

    var formData = view.options.options.formData;
    if (!formData.InternalFields) {
      formData.InternalFields = {};
    }
    if (!formData.InternalFields.UserPermissions) {
      formData.InternalFields.UserPermissions = [];
    }
    if (formData.fields.UserPermissions) {
      formData.InternalFields.UserPermissions = formData.fields.UserPermissions;
    }
    var $comment = view.$('#approval-comment'),
      comment = $comment.val();
    $comment.attr('disabled', true);
    var userPermission = formData.InternalFields.UserPermissions,
      result = {
        Username: view.username,
        Status: null,
        Comment: (!comment || comment === '') ? null : comment,
        DecisionTime: (new Date().getTime()) / 1000
      };
    switch (action) {
      case 'deny':
        result.Status = 'Deny';
        break;
      default:
        result.Status = 'Approve';
    }
    userPermission.push(result);
    // Send Post Data
    buildNewFormElement(formData._id.$oid, userPermission);
  }

  // Return Extend View
  return Backbone.View.extend({
    template: _.template(formApprovalProcessTemplate),
    initialize: function() {
      var formData = this.options.options.formData,
        mode = this.options.options.mode;
      // Catch if this is create form.
      if (mode !== 'read' || typeof formData === 'undefined' || !_.isObject(formData) || !formData.fields) {
        return;
      }
      // Private Variables
      this.username = null;
      this.userId = Utils.getUserIdFormHtml();
      this._btn = null;
      this._modal = null;
      this._submitted = false;

      if (!(this.userId && this.userId.length)) {
        this.userId = null;
        throw 'Could not be able to find userId in FormApprovalProcess module';
      }

      var _tokens = this.userId.split('\\');
      this.username = _tokens.pop();
      if (!this.username.length || this.username === '') {
        return;
      }
      // If this is Debug Mode
      if (DEBUG) {
        this.username = SUP_USERNAME;
      }
      if (this.username === formData.createduser) {
        this.username = null;
        return;
      }
      if (formData.fields && formData.fields.UserPermissions) {
        var allUsers = _.pluck(formData.fields.UserPermissions, 'Username');
        if (_.indexOf(allUsers, this.username) > -1) {
          this.username = null;
          return;
        }
      }
    },
    render: function() {
      if (!this.username) {
        return;
      }
      var $el = $(this.options.el),
        $container = $el.find('.form-actions');
      $container.append(this.template());
      this._btn = $container.find('#module-approval-btn');
      this._modal = $container.find('#module-approval-modal').modal({
        backdrop: 'static',
        show: false,
        keyboard: true
      });
    },
    events: {
      'click #module-approval-btn': function(e) {
        e.preventDefault();
        this._modal.modal('toggle');
        return false;
      },
      'click .modal-footer .btn-danger': function(e) {
        e.preventDefault();
        if (this._submitted) {
          return false;
        }
        this._submitted = true;
        // Process Deny
        buildFormDataForComment(this, 'deny');
        return false;
      },
      'click .modal-footer .btn-success': function(e) {
        e.preventDefault();
        if (this._submitted) {
          return false;
        }
        this._submitted = true;
        // Process Approve
        buildFormDataForComment(this, 'approve');
        return false;
      }
    }
  });
});