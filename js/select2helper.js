/**
 * Select2 Utilities Functions
 * Events
 **/
define([
  'jquery',
  'underscore',
  'utils',
  'jquery.select2'
], function($, _, Utils) {

  if (!$().select2) {
    throw 'Could not be abel to find select2';
  }

  function cloneInputToHiddenInput($element) {
    var attrArray = ['name', 'class', 'id', 'style', 'data-events', 'data-url', 'data-select-value'],
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
    var _selectVal = $hidden.attr('data-select-value');
    if (_selectVal) {
      $hidden.val(_selectVal);
    }
    return $hidden;
  }

  function setupEvents($element, events) {
    var token, tokens, that = this;
    if (!_.isObject(events)) {
      throw 'setupEvents() required events to be a valid object';
    }
    _.each(events, function(value, key) {
      var _func;
      if (_.isString(value)) {
        token = value.match(/\(([^)]+)\)/ig);
        if (token) {
          token = token[0].replace(/(\(|\))/ig, '');
          tokens = token.split(',');
          // Only support predefined function
          token = value.match(/^\s*(\w+)/ig);
          if (token) {
            eval('_func = ' + token[0] + ';');
          }
        } else {
          // Only support predefined function
          eval('_func = ' + value + ';');
        }
      }
      if (typeof _func !== 'function') {
        throw 'setupEvents() require events to be a valid function.';
      }
      $element.on(key, function(e) {
        // console.log('*** Here ***');
        // console.log(tokens);
        if (tokens) {
          _func.apply(that, _.union([$element, e], tokens));
        } else {
          _func($element, e);
        }
      });
    });
  }

  /*** Events Functions for Select2 ***/

  /**
   * Look at the string like 123-5 or 123 - 5
   * @param  object $element
   * @param  object e
   * @return
   */

  function parseNumberList($element, e) {
    // console.log('*** parseNumberList ***');
    // console.log(this);
    // console.log($element);
    // console.log(e);
    if (e.added) {
      // Search string for -
      var txt = e.added.text;
      if (txt.indexOf('-') >= 0) {
        var _tokens = txt.match(/(\d+)(\s*)-(\s*)(\d+)/ig);
        if (_tokens) {
          var _token = _tokens.shift();
          _token = _token.split('-');
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
          if (_cnt > 200) {
            alert('Cannot have the range greater than 200. (from ' + first + ' to ' + second + ')');
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

  function addNumberFromField($element, e, fieldName) {
    // console.log('*** addNumberFromField ***');
    // console.log(this);
    // console.log($element);
    // console.log(e);
    // console.log(fieldName);
    if (e.added) {
      // Check for the empty values
      if (e.val.length > 1) {
        return;
      }
      var txt = parseFloat(e.added.text);
      if (_.isNaN(txt)) {
        return;
      }
      // Auto Add the number.
      var $targetNumber = $('#' + fieldName),
        _val = parseFloat($targetNumber.val());
      if (_.isNaN(_val)) {
        return;
      }
      if (_val > 200) {
        alert('Cannot have the range greater than 200.');
        return;
      }
      e.val = [];
      while (_val) {
        e.val.push(txt);
        txt++;
        _val--;
      }
      $element.select2('val', e.val);
    }
  }

  return {
    renderTags: function($element, form) {

      var _setUpSelectTwoTag = function(data) {

        // console.log($element);
        // console.log($hidden);

        data = data || null;
        if (form._elementData && form._elementData[elementName] && form._elementData[elementName].value) {
          // Set Up Values for edit mode
          var _val = JSON.stringify(form._elementData[elementName].value).replace(/\[|\]|\"/ig, '');
          $hidden.val(_val);
        }
        var _options = {
          tags: (data) ? data : []
        };
        // console.log($hidden.attr('name'));
        /*if (form) {
          console.log(form);
          if (form.model && form.model.toJSON) {
            console.log(form.model.toJSON());
          }
        }*/
        // Only added [] to the select input when it is not a List Fields Type
        if (!form || !form._isListFieldType) {
          $hidden.attr('name', $hidden.attr('name') + '[]');
        }
        $hidden.select2(_options);
        if (form._elementData && form._elementData[elementName] && form._elementData[elementName].events) {
          setupEvents($hidden, form._elementData[elementName].events);
        }
      };

      form = form || null;
      /**
       * Example, $("#e12").select2({tags:["red", "green", "blue"]});
       */
      var $hidden = cloneInputToHiddenInput($element),
        elementName = $hidden.attr('name');
      // If this has Options.Url
      var _url = $hidden.attr('data-url');
      if (_url) {
        $.ajax({
          url: _url,
          type: 'GET',
          cache: false,
          success: function(data, textStatus, jqXHR) {
            // console.log(arguments);
            // console.log($element);

            /*_.each(data, function(v, k) {
              var option;
              if (_.isObject(v)) {
                if (v.id && v.text) {
                  option = $('<option/>', {
                    value: v.id
                  }).text(v.text);
                } else {
                  throw new Error('Not implement This Data!');
                }
              } else {
                option = $('<option/>', {
                  value: v
                }).text(v)
              }
              $element.append(option);
            });
            $element.attr('multiple', true);*/
            // console.log($element);
            _setUpSelectTwoTag(data);
          },
          error: function(jqXHR, textStatus, errorThrown) {
            if (console && console.error) {
              console.error('Could not be able to Send Request to ' + _url);
              console.error(arguments);
            }
            throw new Error('Error when send Ajax Request!');
          }
        });
      } else {
        _setUpSelectTwoTag();
      }
    },
    render: function($element, form) {
      var DEBUG = false;
      if (DEBUG) {
        console.log('[*] select2helper.js:render');
        console.log(arguments);
      }

      var getValueFromTarget = function(lkVal) {
        var $tmpTarget = jQuery(lkVal);
        if (!$tmpTarget.length) {
          throw new Error('Could not be able to find "' + lkVal + '"');
        } else if ($tmpTarget.length > 1) {
          throw new Error('Found more than one element for "' + lkVal + '" [' + $tmpTarget.length + ']');
        }
        var _dataVal = $tmpTarget.val();
        if (DEBUG) {
          console.log('- Query:');
          console.log(arguments);
          console.log($tmpTarget);
          console.log(_dataVal);
        }
        if (_.isString(_dataVal)) {
          _dataVal = _dataVal.split(',');
        }
        return _dataVal;
      };

      if ($element.is('select')) {
        // DEBUG = true;
        var opt = {};
        var renderAsHidden = false;
        var _name = $element.attr('name');
        var _defaultValue = $element.attr('data-select-value');
        if (form && form.children) {
          // List Field Type
          if (form.children.BaseField) {
            var _lookUpVal = form.children.BaseField._getValueFrom;
            // console.log(_lookUpVal);
            // console.log(_name);
            if (_lookUpVal && _lookUpVal[_name]) {
              renderAsHidden = true;
              opt.query = function(q) {
                var data = {
                  results: []
                };

                var _dataVal = getValueFromTarget(_lookUpVal[_name]);

                _.each(_dataVal, function(val, key) {
                  if (DEBUG) {
                    console.log(arguments);
                  }
                  data.results.push({
                    id: val,
                    text: val
                  });
                });
                q.callback(data);
              }
              opt.allowClear = true;
              opt.placeholder = 'Please select a value';
              if (_defaultValue) {
                opt.initSelection = function(el, cb) {
                  if (DEBUG) {
                    console.log('- initSelection for "' + _name + '"');
                    console.log(arguments);
                  }
                  cb({
                    id: _defaultValue,
                    text: _defaultValue
                  });
                };
              }
            }
          }
        }
        if (renderAsHidden) {
          // console.log($element);
          var $hidden = cloneInputToHiddenInput($element);
          $hidden.select2(opt);

          $hidden.on('change', function(e) {
            var DEBUG = false;
            if (DEBUG) {
              console.log('- Select 2: change "' + _name + '"');
            }
            if (form) {
              var model = form.model;
              if (DEBUG) {
                console.log(model.get(_name));
              }
              if (model && model.has && model.has(_name)) {
                model.set(_name, e.val);
              }
              if (DEBUG) {
                console.log(model.get(_name));
              }
            }
          });
        } else {
          $element.select2(opt);
        }
        // console.log($hidden);
        // console.log($element);
      }
    }
  };
});