define([],function(){var e="<%var _description, _sortArray = [], _others = false;if (options.defaulttext) {_description = description;} else {switch(_lang) {case 'sp':_description = 'Seleccione ' + description.replace(/Seleccione /i, '').toLowerCase();break;default:_description = 'Select ' + description.replace(/Select /i, '').toLowerCase();}}if (options.orderby && !_.isArray(values)) {_.each(values, function(value, key) {_sortArray.push({key: key,value: value});});if (_sortArray.length) {switch (options.orderby.toLowerCase()) {case 'value-alphabetical':_sortArray.sort(function(a, b) {var x = a.value.toLowerCase();var y = b.value.toLowerCase();return x < y ? -1 : x > y ? 1 : 0;});break;default:_sortArray.sort(function(a, b) { return a.key - b.key; });}}}%><select id=\"<%= (typeof attributes.id !== 'undefined') ? attributes.id: name %>\" name=\"<%= name %>\"<%= _attr %>><option value=\"\">-- <%= _description %> --</option><% if (typeof values !== 'undefined') { %><% if (!_sortArray.length) { %><% _value = $.isArray(values) %><% _.each(values, function(value, key) {if (value.toLowerCase() === 'others') {_others = {key: (_value) ? value: key,value: value};return;}%><option value=\"<%= (_value) ? value: key %>\"><%= value %></option><% }); %><% } else { %><% _.each(_sortArray, function(element) {if (element.value.toLowerCase() === 'others') {_others = {key: element.key,value: element.value};return;}%><option value=\"<%= element.key %>\"><%= element.value %></option><% }); %><% } %><% if (_others) { %><option value=\"<%= _others.key %>\"><%= _others.value %></option><% } %><% } %></select>";return e});