/**
 * ReadModeAppendComment Modules
 * This module will allow to insert a comment in Read Mode.
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/modules/readmodeappendcomment.html',
  'jquery.mask',
  'jquery.purl'
], function($, _, Backbone, readModeAppendCommentTemplate) {

  var DEBUG = false;

  var DEFAULT_PARAM = {
    GET_FORM: '/formproxy',
    PUT_FORM: '/FormActions/putform'
  };

  var bigbox;
  var jacked;
  if (typeof humane !== 'undefined') {
    bigbox = humane.create({
      baseCls: 'humane-bigbox',
      timeout: 3000
    });
    bigbox.error = bigbox.spawn({
      addnCls: 'humane-bigbox-error'
    });
    jacked = humane.create({
      baseCls: 'humane-jackedup',
      addnCls: 'humane-jackedup-success'
    });
  }

  function showError(txt) {
    if (bigbox && bigbox.error) {
      bigbox.error(txt);
    } else {
      alert(txt);
    }
  }

  function showSuccess(txt) {
    if (jacked) {
      jacked.log(txt);
    } else {
      alert(txt);
    }
  }

  return Backbone.View.extend({

    template: _.template(readModeAppendCommentTemplate),

    shouldRenderModules: function() {
      var options = this.options.options;
      if (DEBUG) {
        console.log('[*] readmodeappendcomment.shouldRenderModules');
        console.log(this);
      }
      if (!options.formData || !options.formData._id || options.mode !== 'read') {
        if (DEBUG) {
          console.log('[x] Not render reason 1');
        }
        return false;
      }
      var _params = (this.options && this.options._params) ? this.options._params : null;
      if (DEBUG) {
        console.log(_params);
      }
      return (_params.internal === options.internal);
    },

    initialize: function() {
      // will not loaded if this is not internal
      if (!this.shouldRenderModules()) {
        return;
      }
      if (DEBUG) {
        console.log('[*] readmodeappendcomment.initialize');
        console.log(this);
      }

      var options = this.options.options;
      var that = this;
      this.currentUser = $('#snhd_user_network_login');
      if (this.currentUser.length) {
        this.currentUser = this.currentUser.text();
      } else {
        this.currentUser = null;
      }
      this.endPoint = _.extend({}, DEFAULT_PARAM);
      var currentFormId = options.formData._id;
      // console.log(currentFormId);
      _.each(this.endPoint, function(v, k) {
        that.endPoint[k] = v + '?id=' + currentFormId.$oid;
      });
    },

    render: function(modal) {
      // var DEBUG = true;
      var that = this;
      if (!this.shouldRenderModules()) {
        return;
      }
      if (DEBUG) {
        console.log('[*] readmodeappendcomment.render');
        console.log(this);
      }
      var $el = $(this.options.el);
      if (DEBUG) {
        console.log($el);
      }
      if (!$el.length) {
        return;
      }
      var $container = $el.find('.form-actions');
      if (DEBUG) {
        console.log($container);
      }
      if (!$container.length) {
        return;
      }
      var $btn = $container.find('#module-append-comment-btn');
      if (!$btn.length) {
        $container.append(this.template());
        $btn = $container.find('#module-append-comment-btn');
        this._modal = $container.find('#module-append-comment-modal').modal({
          backdrop: 'static',
          show: false,
          keyboard: false
        });
      }
      if (!$btn.length) {
        throw new Error('Could not be able to find the "#module-append-comment-btn" button.');
      }
      if (DEBUG) {
        console.log($btn);
      }
    },

    events: {
      'blur #append-comment': function(e) {
        // var DEBUG = true;
        if (DEBUG) {
          console.log('[*] readmodeappendcomment.blur on #module-append-comment-modal #append-comment');
        }
        var $this = $(e.currentTarget);
        if (DEBUG) {
          console.log($this);
        }
        var _txt = $this.val();
        if (!_txt) {
          $this.addClass('invalid');
        } else {
          $this.removeClass('invalid');
        }
      },
      'click #module-append-comment-btn': function(e) {
        e.preventDefault();
        if (DEBUG) {
          console.log('[*] readmodeappendcomment.click on #module-append-comment-btn');
        }
        this._modal.modal('toggle');
        return false;
      },
      'click #module-append-comment-modal .btn-danger': function(e) {
        // var DEBUG = true;
        e.preventDefault();
        if (DEBUG) {
          console.log('[*] readmodeappendcomment.click on #module-append-comment-modal .btn-danger');
        }
        this._modal.modal('hide');
        var $modal = $(this.options.el).find('#module-append-comment-modal');
        $modal.find('#append-comment').removeClass('invalid');
        return false;
      },
      'click #module-append-comment-modal .btn-success': function(e) {
        var that = this;
        var isInternal = this.options._params.internal;
        // var DEBUG = true;
        e.preventDefault();
        if (DEBUG) {
          console.log('[*] readmodeappendcomment.click on #module-append-comment-modal .btn-success');
        }
        // Process the Request
        var $modal = $(this.options.el).find('#module-append-comment-modal');
        if (DEBUG) {
          console.log($modal);
        }
        var $txtArea = $modal.find('#append-comment');
        var _txt = $txtArea.val();
        if (!_txt) {
          $txtArea.trigger('blur');
          return;
        }
        if (DEBUG) {
          console.log('- Text Area Value');
          console.log(_txt);
        }
        if (this._ajax) {
          return;
        }
        this._ajax = true;
        // Send Ajax and block UI
        var $btns = $modal.find('.btn');
        $btns.attr('disabled', true);
        $modal.mask();

        var clearBlockUi = function() {
          that._ajax = false;
          $btns.removeAttr('disabled');
          $modal.unmask();
        }

        // Send Get Request
        $.ajax({
          url: this.endPoint.GET_FORM,
          type: 'GET',
          cache: false,
          success: function(data, textStatus, jqXHR) {
            if (console && console.log) {
              console.log(arguments);
            }
            if (!data) {
              showError('Could not be able to find the form!');
              clearBlockUi();
              return;
            }
            var currentForm;
            try {
              currentForm = JSON.parse(data);
              if (!_.isObject(currentForm)) {
                throw new Error('Invalid Data Type!');
              }
            } catch (err) {
              if (console && console.error) {
                console.error(err);
              }
              showError('Could not be able to parse JSON file!');
              clearBlockUi();
              return;
            }

            var targetFields = (isInternal) ? currentForm.InternalFields : currentForm.Fields;
            // If there are no "InternalFields" Keys
            if (!targetFields && isInternal) {
              targetFields = {};
            }
            var keyName = (isInternal) ? 'Comments_internal' : 'Comments';
            if (!targetFields.Comments || !_.isArray(targetFields.Comments)) {
              targetFields.Comments = [];
            }
            var currentTime = new Date().getTime();
            targetFields.Comments.push({
              TimeComment: Math.floor(currentTime / 1000),
              UserAccount: that.currentUser,
              Comment: _txt
            });
            if (DEBUG) {
              console.log(targetFields.Comments);
            }
            var data = {};
            data[keyName] = JSON.stringify(targetFields.Comments);
            // Need to Send Put Data
            if (DEBUG) {
              console.log(data);
            }
            $.ajax({
              url: that.endPoint.PUT_FORM,
              type: 'PUT',
              data: data,
              cache: false,
              success: function(data, textStatus, jqXHR) {
                showSuccess('Comment added!');
                setTimeout(function() {
                  location.reload(true);
                }, 1000);
              },
              error: function(jqXHR, textStatus, errorThrown) {
                if (console && console.error) {
                  console.error(arguments);
                }
                showError('Error: Could not be able to insert new comment!');
                clearBlockUi();
              }
            });

          },
          error: function(jqXHR, textStatus, errorThrown) {
            if (console && console.error) {
              console.error(arguments);
            }
            showError('Error: Please try again!');
            clearBlockUi();
          }
        });

        return false;
      }
    }
  });
});