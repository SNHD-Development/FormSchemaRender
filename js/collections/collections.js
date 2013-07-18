define([
  'jquery',
  'lodash',
  'backbone',
  'models/model'
], function($, _, Backbone, Model){
  return Backbone.Collection.extend({
    model: Model,
    initialize: function(){
    }
  });
});