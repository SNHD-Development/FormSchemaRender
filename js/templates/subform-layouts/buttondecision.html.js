define(function() { var str ='<div id="<%= _id %>" class="btn-decision-data-wrapper"><table class="table table-hover table-striped btn-decision-data-render"><caption><%= data.caption %></caption><thead><tr><% _.each(data.thead, function (value, key) { %><td><%= value %></td><% }); %><td></td></tr></thead><tbody><%var _i = -1;_.each(data.data, function (valueData) {++_i;%><tr><% _.each(valueData, function (valueDatum, keyDatum) {var _html;if (data.hiddenfields && data.hiddenfields.indexOf(keyDatum) > -1) {_html = \'<input type="hidden" name="\'+keyDatum+\'_data_options_\'+_i+\'" value="\'+valueDatum+\'" class="not_sending"/>\';} else if (data.thead && data.thead[keyDatum]) {_html = \'<td>\'+valueDatum+\'</td>\';}%><%= _html %><% }); %><td><button type="button" class="verified_data btn btn-success" data-index="<%= _i %>"><i class="icon icon-ok"></i> Confirm</button></td></tr><% }); %></tbody></table></div>';return str;});