define(function() { var str ='<%var _model = (typeof modelId !== \'undefined\') ? true : false,_tableClass = (mode)  ? \' stupidtable\': \'\';var _createdUser;var currentUserLowerCase;if (_model && selfOnly) {currentUserLowerCase = currentUser.toLowerCase();}var totalData = (values && values.length) ? values.length : \'\';if (heading) {%><fieldset class="table-view"><legend><%= totalData %> <%= heading %></legend><% } %><table class="table table-striped table-bordered table-hover <%= _tableClass %>"><thead><tr><% _.each( labels, function(element, index) { %><%var _sortBy = (typeof sortBy !== \'undefined\' && sortBy[index]) ? sortBy[index]: \'data-sort="string"\';_sortBy = (mode) ? _sortBy : \'\';%><th <%= _sortBy %>><%= element %></th><% }); %><% if(_model && (showViewBtn || !addOnly || currentUserLowerCase) ) { %><th>Action</th><% } %></tr></thead><tbody><% _.each( values, function(element1, index) {var hideEdit = element1.hideEdit || false;var hideDelete = element1.hideDelete || false;%><tr><%/* Find Matching Username */var _match = false;_.each( element1, function(element2Obj, index2) {var element2 = element2Obj.value || element2Obj;try {if (element2 && _.isObject(element2) && \'value\' in element2) {element2 = element2.value;}} catch(err) {console.log(\'[x] Exception in table.html: could not parse element2\');console.log(err);}var renderAs = element2Obj.renderAs || null;if (_model && selfOnly && userIndex === index2) {_match = (currentUserLowerCase === jQuery.trim(element2.toLowerCase()));}if (renderAs) {switch(renderAs) {case \'downloadFromJS\':if(element2Obj && element2Obj.valueObj && element2Obj.valueObj.base64Data) {element2 = \'<a class="btn btn-primary" href="/form/getFile/\' + element2Obj.valueObj.base64Data + \'" target="_blank">Download - \' + element2Obj.valueObj.fileName + \'</a>\';} else {element2 = \'<a class="btn btn-primary btn-js-download" data-file="\' + element2Obj.valueBase64 + \'">Download - \' + element2Obj.valueObj.fileName + \'</a>\';}break;}}%><% var _sortByVal = (mode && typeof sortByVal !== \'undefined\' && sortByVal[index][index2]) ? sortByVal[index][index2]: \'\' %><td <%= _sortByVal %>><%= element2 %></td><% }); %><% if(_model && (showViewBtn || !addOnly || currentUserLowerCase || (addOnlyWithEditOnCreate)) ) { %><td class="subform-actions"><% if (showViewBtn) { %><button class="btn btn-primary subform-read-model" data-id="<%= modelId[index] %>"><i class="icon-file"></i> View</button><% } %><% if (!addOnly && !selfOnly || selfOnly && _match || addOnlyWithEditOnCreate) { %><% if (!hideEdit) { %><button class="btn btn-info subform-edit-model" data-id="<%= modelId[index] %>"><i class="icon-edit"></i> Edit</button><% } %><% if (!hideDelete) { %><button class="btn btn-danger subform-remove-model" data-id="<%= modelId[index] %>"><i class="icon-remove"></i> Remove</button><% } %><% if (hideDelete && hideEdit) { %>-<% } %><% } %></td><% } %></tr><% }); %></tbody></table><% if (heading) { %></fieldset><% } %>';return str;});