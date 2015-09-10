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
  'utils'
], function($, _, Backbone, Utils) {

  function replaceUrlWithValue(url, viewObj) {
    var tokens;
    var formData = viewObj.options.options.formData;
    var _url = url;
    if (url.indexOf('?') >= 0) {
      tokens = Utils.parseTemplateString(url);
    } else {
      tokens = Utils.parseTemplateStringCurlyBrace(url);
    }
    if (typeof tokens === 'string') {
      // console.log(tokens);
      switch (tokens) {
        case 'id':
          _url = Utils.replaceTemplateStringCurlyBrace(_url, tokens, formData._id.$oid);
          break;
        default:
          throw new Error('Not implement "' + tokens + '" yet!');
      }
    }
    if (_url.indexOf('{{') >= 0) {
      _url = replaceUrlWithValue(_url);
    }
    return _url;
  }

  // Return Extend View
  return Backbone.View.extend({
    initialize: function() {},
    render: function() {
      if (!this.options && !this.options.options && !this.options.options.mode) {
        return;
      }
      if (this.options.options.mode !== 'read') {
        return;
      }
      var _params = this.options._params;
      if (!_params.url) {
        throw new Error('Please pass in Url Parameter.');
      }
      var _url = replaceUrlWithValue(_params.url, this);
      // console.log(_url);
      var formData = this.options.options.formData;
      var $app = $('#app');
      $app.before('<div class="qrcode-wrapper"><img src="' + _url + '" alt="QRCode for ' + formData._id.$oid + '"/></div>');
    },
    events: {}
  });
});