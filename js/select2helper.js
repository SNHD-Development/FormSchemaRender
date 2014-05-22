/**
 * Select2 Utilities Functions
 * Events
 **/
define([
  'jquery',
  'underscore',
  'jquery.select2'
], function($, _) {

  if (!$().select2) {
    throw 'Could not be abel to find select2';
  }

  function cloneInputToHiddenInput($element) {
    var attrArray = ['name', 'class', 'id', 'style', 'data-events'],
      str = '';
    _.each(attrArray, function(element) {
      var _attr = $element.attr(element);
      if (_attr) {
        str += element + '="' + _attr + '" ';
      }
    });
    str = '<input type="hidden" ' + str + ' />';
    $element.after(str);
    var _width = $element.css('width'),
      $hidden = $element.next();
    $element.remove();
    if (!_width) {
      $hidden.css('width', '98%');
    } else {
      $hidden.css('width', _width);
    }
    return $hidden;
  }

  function setupEvents($element, events) {
    if (!_.isObject(events)) {
      throw 'setupEvents() required events to be a valid object';
    }
    _.each(events, function(value, key) {
      var _func;
      if (_.isString(value)) {
        // Only support predefined function
        eval('_func = ' + value + ';');
      }
      if (typeof _func !== 'function') {
        throw 'setupEvents() require events to be a valid function.';
      }
      $element.on(key, function(e) {
        _func($element, e);
      });
    });
  }

  /*** Events Functions for Select2 ***/

  function parseNumberList($element, e) {
    if (e.added) {
      // Search string for -
      var txt = e.added.text;
      if (txt.indexOf(' - ') >= 0) {
        var _tokens = txt.match(/(\d+) - (\d+)/ig);
        if (_tokens) {
          var _token = _tokens.shift();
          _token = _token.split(' - ');
          var first = parseInt(_token.shift(), 10),
            second = parseInt(_token.shift(), 10),
            _cnt;
          if (_.isNaN(first) || _.isNaN(second)) {
            return;
          }
          _cnt = second - first;
          if (_cnt < 1) {
            // Might be the case that 123 - 6
            var _secondLength = second.toString().length;
            var _first = first.toString().slice(-_secondLength);
            _cnt = second - _first;
            if (_cnt < 1) {
              return;
            }
          }
          if (_cnt > 1000) {
            alert('Cannot have the range greater than 1000. (from ' + first + ' to ' + second + ')');
            return;
          }
          e.val = _.without(e.val, txt);
          for (var i = 0; i <= _cnt; i++) {
            e.val.push(first + i);
          }
          $element.select2('val', e.val);
        }
      }
    }
  }

  return {
    renderTags: function($element, form) {
      form = form || null;
      /**
       * Example, $("#e12").select2({tags:["red", "green", "blue"]});
       */
      var $hidden = cloneInputToHiddenInput($element),
        elementName = $hidden.attr('name');
      if (form._elementData[elementName] && form._elementData[elementName].value) {
        // Set Up Values for edit mode
        var _val = JSON.stringify(form._elementData[elementName].value).replace(/\[|\]|\"/ig, '');
        $hidden.val(_val);
      }
      var _options = {
        tags: []
      };
      $hidden.select2(_options);
      if (form._elementData[elementName] && form._elementData[elementName].events) {
        setupEvents($hidden, form._elementData[elementName].events);
      }
    }
  };
});