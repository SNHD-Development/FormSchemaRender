define([],function(){return'<%var _id = (typeof attributes.id !== \'undefined\') ? attributes.id: name,_numerator = (options.numerator) ? options.numerator: \'\',_denominator = (options.denominator) ? options.denominator: \'\',_class = \'\';if (typeof attributes !== \'undefined\' && attributes && attributes["class"]) {_class = \'class="\' + attributes["class"] +\'"\';}%><div class="form-fraction row-fluid"><input id="<%= _id %>_numerator" name="<%= name %>_numerator" type="text" placeholder="<%= _numerator %>" <%= _class %>/><span>/</span><input id="<%= _id %>_denominator" name="<%= name %>_denominator" type="text" placeholder="<%= _denominator %>" <%= _class %>/></div>'});