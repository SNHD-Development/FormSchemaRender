define([],function(){var e="<%var _description ;if (options.defaulttext) {_description = description;} else {_description = 'Select ' + description.toLowerCase();}%><select id=\"<%= (typeof attributes.id !== 'undefined') ? attributes.id: name %>\" name=\"<%= name %>\"<%= _attr %>><option value=\"\">-- <%= _description %> --</option><% _value = $.isArray(values) %><% _.each(values, function(value, key) { %><option <%= (_value) ? '': ' value=\"'+key+'\"' %>><%= value %></option><% }); %></select>";return e});