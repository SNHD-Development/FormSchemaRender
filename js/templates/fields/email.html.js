define(function() { var str ='<%var p_username;switch (lang) {case \'sp\':p_username = \'usuario\';break;default:p_username = \'username\';}%><% if( typeof options.autocomplete !== \'undefined\' && options.autocomplete ) { %><div class="controls-row emailpicker"><input id="<%= (typeof attributes.id !== \'undefined\') ? attributes.id: name %>_username" name="<%= name %>_username" type="text" placeholder="<%= p_username %>" class="not_sending tolowercase tolowercase_email emailpicker_username" style="width: 45%;"/><span class="add-on">@</span><input id="<%= (typeof attributes.id !== \'undefined\') ? attributes.id: name %>_server" name="<%= name %>_server" type="text" placeholder="example.com"<%= _attr %>/><input id="<%= (typeof attributes.id !== \'undefined\') ? attributes.id: name %>" type="hidden" name="<%= name %>" class="tolowercase tolowercase_email"></div><% } else { %><input id="<%= (typeof attributes.id !== \'undefined\') ? attributes.id: name %>" class=" tolowercase tolowercase_email" name="<%= name %>" type="email"<%= _attr %>/><% } %>';return str;});