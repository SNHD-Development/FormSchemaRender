define(function() { var str ='<form id="<%= name %>"<%= (typeof action !== \'undefined\') ? \' action="\'+action+\'"\': \'\'%> class="form-render <%= mobileClassName %>" method="post" novalidate=""></form>';return str;});