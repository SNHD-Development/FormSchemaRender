define([
  'jquery',
  'underscore',
  'backbone',
  'utils',
  'text!templates/subform-layouts/subbuttons.html',
], function($, _, Backbone, Utils, subbuttonsTemplate) {

  return Backbone.View.extend({
    template: _.template(subbuttonsTemplate),

    initialize: function() {
      var that = this,
        _html = '',
        _std_text = (this.options.confirmedtext) ? this.options.confirmedtext : 'Please confirm your selection.';
      _.each(that.options.subbuttons, function(value, key, list) {
        var _type = value.type.toLowerCase();
        value.options = value.options || {};
        // Internal
        if (typeof value.options.internal !== 'undefined' && value.options.internal !== that.options.internal) {
          return;
        }
        if (!Utils.shouldRenderWithShowOnStatusOrShowOnMode(value, that.options.status, that.options.mode)) {
          return;
        }
        // Good to render
        // Setup the data attributes
        switch (_type) {
          case 'button':
            var _attr = '',
              _class;
            if (value.url) {
              // AppendId
              if (value.options.appendid && that.options._oid) {
                value.url = ((value.url) ? value.url : '') + ((value.url.indexOf('?') > -1) ? '&id=' : '/') + that.options._oid;
              }
              _attr += ' href="' + value.url + '"';
            }
            if (value.attributes && value.attributes.class) {
              _class = value.attributes.class;
            } else {
              _class = 'btn-primary';
            }
            _html += '<div class="text-center sub-button"><a class="btn ' + _class + '" ' + _attr + '>' + value.description + '</a></div>';
            break;
        }
      });
      if (_html === '') {
        return;
      }
      this.options.button.popover({
        html: true,
        placement: 'top',
        trigger: 'click',
        title: '<span class="text-info">' + _std_text + '</span>',
        content: _html
      });
    }

  });
});