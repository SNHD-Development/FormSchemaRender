define([
    'jquery',
    'underscore',
    'backbone',
    'events'
], function($, _, Backbone, Events) {
    var views = {}

        , remove = function(name, clean) {
            clean = clean || false;
            if (typeof views[name] !== 'undefined') {
                views[name].undelegateEvents();
                if (typeof views[name].clean === 'function') {
                    views[name].clean();
                }
                if (clean) {
                    if (typeof views[name].removeContent === 'function') {
                        views[name].removeContent();
                    }
                }
            }
        }

        , create = function(context, name, View, options) {
            // View clean up isn't actually implemented yet but will simply call .clean, .remove and .unbind
            remove(name);

            var view = new View(options);
            views[name] = view;
            if (typeof context.children === 'undefined') {
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
            var keys = Object.keys(obj),
                n = keys.length;
            while (n--) {
                var key = keys[n],
                    keyLower = key.toLowerCase();
                if (key !== keyLower) {
                    obj[keyLower] = obj[key];
                    delete obj[key];
                }
                if (typeof obj[keyLower] === 'object') {
                    // Validation need to match exactly with the name of the input
                    if (keyLower === 'validation' || keyLower.search(/^values-*/) !== -1) {
                        continue;
                    } else if (typeof skipKey !== 'undefined' && ((!_.isArray(skipKey) && keyLower === skipKey) || (_.isArray(skipKey) && _.indexOf(skipKey, keyLower) > -1))) {
                        continue;
                    }
                    this.toLower(obj[keyLower]);
                }
            }
        }

        // Parse HTML Code to normal text
        , decodeHtml = function(obj) {
            if (obj.fields) {
                _.each(obj.fields, function(value, key) {
                    var _value = _.unescape(value);
                    obj.fields[key] = _value.replace(/&#39;/g, "'");
                });
            }
        }

        // Change Language
        , changeLanguage = function(obj, language) {
            _.each(obj, function (element) {
              if (element.description && element.languages && element.languages[language]) {
                element.description = element.languages[language];
              }
              switch (element.type.toLowerCase()) {
                case 'select':
                  if (element['values-'+language]) {
                    element.values = element['values-'+language];
                  }

                  if (element.options && typeof element.options.defaulttext === 'object') {                    
                    element.description = element.options.defaulttext[language];
                  } else if (element.options && element.options.defaulttext) {
                    element.description = element.options.defaulttext;
                  }
                  break;
              }
            });
        };


    return {
        create: create,
        remove: remove,
        toLower: toLower,
        decodeHtml: decodeHtml,
        changeLanguage: changeLanguage,
    };
});