// Default Form Model
'use strict';

define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {

  // Default URL for Form
  var defaultUrl = '/formproxy';

  var Form = Backbone.Model.extend({
    initialize: function(param) {
      this.urlRoot = param.urlRoot || defaultUrl;

      if (!param.urlRoot) {
        // Override URL method
        this.url = function() {
          var base = this.urlRoot || this.collection.url || function() {
            throw 'Invalid URL Parameter.';
          };
          if (this.isNew()) return base;
          return base + '?id=' + encodeURIComponent(this.id) + '&_' + (new Date().getTime());
        }
      }
    },
    parse: function(response) {
      try {
        var data = JSON.parse(response);
      } catch (err) {
        if (console && console.error) {
          console.error('[x] Erro: Response from parse.');
          console.error(err);
        }
        alert('Error: Parse response from Form.');
      }
      return data;
    }
  });

  return Form;
});