define([
  'jquery',
  'underscore',
  'backbone',
  'events'
], function($, _, Backbone, Events){
  var views = {}

  , remove = function(name, clean) {
    clean = clean || false
    if(typeof views[name] !== 'undefined') {
      views[name].undelegateEvents();
      if(typeof views[name].clean === 'function') {
        views[name].clean();
      }
      if (clean) {
        if(typeof views[name].removeContent === 'function') {
          views[name].removeContent();
        }
      }
    }
  }

  , create = function (context, name, View, options) {
    // View clean up isn't actually implemented yet but will simply call .clean, .remove and .unbind
    remove(name);

    var view = new View(options);
    views[name] = view;
    if(typeof context.children === 'undefined'){
      context.children = {};
      context.children[name] = view;
    } else {
      context.children[name] = view;
    }
    Events.trigger('viewCreated');
    return view;
  }

  // Convert all key to lowercase
  , toLower = function(obj, skipKey) {
    var keys = Object.keys(obj)
    , n = keys.length;
    while (n--) {
      var key = keys[n]
      , keyLower = key.toLowerCase();
      if (key !== keyLower) {
        obj[keyLower] = obj[key];
        delete obj[key];
      }
      if (typeof obj[keyLower] === 'object') {
        // Validation need to match exactly with the name of the input
        if (keyLower === 'validation') {
          continue;
        } else if (typeof skipKey !== 'undefined' && keyLower === skipKey) {
          continue;
        }
        this.toLower(obj[keyLower]);
      }
    }
  };


  return {
    create: create,
    remove: remove,
    toLower: toLower
  };
});
