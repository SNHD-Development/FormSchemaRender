/**
 * FormReloadWhenStatusChange Modules
 * This module will pull the Form Data and compare against the Status, If changed will inform user!
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/modules/formreloadwhenstatuschange.html',
  'jquery.purl'
], function($, _, Backbone, formReloadWhenStatusChangeTemplate) {

  function pollAjaxData(view) {
    setTimeout(function() {
      $.ajax({
        url: view.ajaxUrl,
        success: function(data, textStatus) {
          if (_.isString(data)) {
            data = JSON.parse(data);
          }
          if (!_.isObject(data)) {
            throw 'FormReloadWhenStatusChange Module expected data to be an object. (got ' + typeof data + ')';
          }
          var newStatus = $.trim(data.Status);
          view.tmpData.from = $.trim(view.tmpData.from);
          if (newStatus === view.tmpData.from) {
            pollAjaxData(view);
            return;
          }
          view.tmpData.to = newStatus;
          view.render(true);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          throw 'FormReloadWhenStatusChange Module Ajax Error: ' + errorThrown;
        }
      });
    }, view.timer);
  }

  return Backbone.View.extend({

    template: _.template(formReloadWhenStatusChangeTemplate),

    shouldRenderModules: function() {
      var options = this.options.options;
      return (options.internal && options.formData && options.formData._id);
    },

    initialize: function() {
      // will not loaded if this is not internal
      if (!this.shouldRenderModules()) {
        return;
      }
      if (!$.url) {
        throw 'Could not be able to load $.url plugin.';
      }
      // If there are no options passing in will perform basic
      var url = $.url(),
        options = this.options.options;
      this.baseUrl = url.attr('protocol') + '://' + url.attr('host');
      this.ajaxUrl = this.baseUrl + '/formproxy';
      if (options.formData._id && options.formData._id.$oid) {
        this.ajaxUrl += '?id=' + $.trim(options.formData._id.$oid);
      }
      this.timer = 3000; // Default 3 seconds will send out the AJAX
      this.refreshTimer = 5000;
      this.tmpData = {
        from: options.formData.status,
        to: null,
        seconds: this.refreshTimer / 1000
      };
      // Modal Options
      this.modalOptions = {
        keyboard: false,
        show: true,
        backdrop: 'static'
      };
    },

    render: function(modal) {
      var that = this;
      modal = modal || false;
      if (!this.shouldRenderModules()) {
        return;
      }
      if (modal) {
        this.$el.append(this.template(this.tmpData));
        var $modal = this.$('#formreloadwhenstatuschange');
        $modal.on('shown', function() {
          var $secs = $modal.find('#formreloadwhenstatuschange-cnt');
          that._countDown = setInterval(function() {
            var cnt = parseInt($secs.text(), 10);
            cnt--;
            if (cnt > 0) {
              $secs.text(cnt);
            } else {
              clearInterval(that._countDown);
              delete that._countDown;
              location.reload();
            }
          }, 1000);
        }).modal(this.modalOptions);
      } else {
        pollAjaxData(this);
      }
    },

    events: {
      'click #formreloadwhenstatuschange button.btn-danger': function(e) {
        if (this._countDown) {
          clearInterval(this._countDown);
          delete this._countDown;
        }
      },
      'click #formreloadwhenstatuschange button.btn-primary': function(e) {
        location.reload();
      }
    }
  });
});