define(["jquery","underscore","backbone","collections/collections","../utils"],function(e,n,a,i,t){var s=function(a,s,m){var r,d,u,l={},c={},F=!!s.is_internal,b=s.render_mode||!1;return n.each(s.fields,function(p){if(u=!0,p.options=p.options||{},(F||!p.options.internal)&&(!b||!p.options.showonmode||-1!==p.options.showonmode.indexOf(b))&&(!F||void 0===p.options.internalcanupdate||p.options.internalcanupdate)&&!(a.attributes.status&&p.options.showonstatus&&n.indexOf(p.options.showonstatus,a.attributes.status)<0)){switch(void 0!==s.validation[p.name]&&n.each(s.validation[p.name],function(e,a){var i=["required","length","range","pattern","acceptance","min","max","length"];n.contains(i,a.toLowerCase())&&(delete s.validation[p.name][a],s.validation[p.name][a.toLowerCase()]=e)}),void 0!==p.options.internal&&p.options.internal!==m&&(u=!1),d=p.type.toLowerCase()){case"filerepository":case"radio":u=!1}switch(d){case"textarea":a.escapeHtmlInputs.push(p.name)}switch(d){case"booleaninput":l[p.name]="",o(p.name,s,c,""),u&&(a.bindings[p.name]='[name="'+p.name+'"]'),a.on("change:"+p.name,function(e,n){var a={};a[p.name]="true"===n||!0===n||"false"!==n&&!1!==n&&"",e.set(a,{silent:!0})}),a.hasBooleanInput=!0;break;case"multifiles":r=p.name+"[]",l[r]="",void 0!==s.validation[p.name]&&(s.validation[r]=n.clone(s.validation[p.name]),delete s.validation[p.name]),o(r,s,c,""),a.multiFilesDefaultValue[r]||(a.multiFilesDefaultValue[r]=!0);break;case"fraction":r=p.name+"_numerator",l[r]="",o(r,s,c,""),u&&(a.bindings[r]='[name="'+r+'"]'),r=p.name+"_denominator",l[r]="",o(r,s,c,""),u&&(a.bindings[r]='[name="'+r+'"]');break;case"address":var v=p.options.showstreetnumber?"Street Name":"Street";r=p.name+"_address_street",l[r]="",o(r,s,c," ("+v+")"),u&&!p.options.visibleon&&(a.bindings[r]='[name="'+r+'"]'),r=p.name+"_address_city",l[r]="",o(r,s,c," (City)"),u&&!p.options.visibleon&&(a.bindings[r]='[name="'+r+'"]'),r=p.name+"_address_state",l[r]="",o(r,s,c," (State)"),u&&!p.options.visibleon&&(a.bindings[r]='[name="'+r+'"]'),r=p.name+"_address_zip",l[r]="",o(r,s,c," (ZIP)"),u&&!p.options.visibleon&&(a.bindings[r]='[name="'+r+'"]'),r=p.name+"_address_country",l[r]="",o(r,s,c," (Country)"),u&&!p.options.visibleon&&(a.bindings[r]='[name="'+r+'"]'),p.options.showstreetnumber&&(r=p.name+"_address_street_number",l[r]="",o(r,s,c," (Street Number)"),u&&!p.options.visibleon&&(a.bindings[r]='[name="'+r+'"]')),p.options.showunitnumber&&(r=p.name+"_address_unit_number",l[r]="",o(r,s,c," (Unit Number)"),u&&!p.options.visibleon&&(a.bindings[r]='[name="'+r+'"]'));break;case"fullname":(void 0===p.options.middlename||p.options.middlename)&&(r=p.name+"_fullname_middle_name",l[r]="",o(r,s,c," (Middle Name)"),u&&!p.options.visibleon&&(a.bindings[r]='[name="'+r+'"]')),r=p.name+"_fullname_first_name",l[r]="",o(r,s,c," (First Name)"),u&&!p.options.visibleon&&(a.bindings[r]='[name="'+r+'"]'),r=p.name+"_fullname_last_name",l[r]="",o(r,s,c," (Last Name)"),u&&!p.options.visibleon&&(a.bindings[r]='[name="'+r+'"]');break;case"list":l[p.name]=new i,o(p.name,s,c,""),a.subFormLists.push(p.name);break;case"check":case"checkbox":r=p.name+"[]",l[r]="",void 0!==s.validation[p.name]&&(s.validation[r]=n.clone(s.validation[p.name]),delete s.validation[p.name]),o(r,s,c,"");break;case"hidden":case"buttonclipboard":case"fieldsetstart":case"fieldsetend":case"fieldset":case"clear":case"action":case"button":case"submit":case"hr":case"html":case"step":a.notBinding.push(p.name);break;case"date":if(p.options.render&&"select"===p.options.render.toLowerCase()){if(l[p.name]="",l[p.name+"_birth[month]"]="",l[p.name+"_birth[day]"]="",l[p.name+"_birth[year]"]="",void 0!==s.validation[p.name]){c[p.name]=n.clone(s.validation[p.name]);var h=n.clone(s.validation[p.name]);h.mindate&&delete h.mindate,h.maxdate&&delete h.maxdate,c[p.name+"_birth[month]"]=n.clone(h),c[p.name+"_birth[day]"]=n.clone(h),c[p.name+"_birth[year]"]=n.clone(h)}}else l[p.name]="",o(p.name,s,c,"");break;case"email":if(l[p.name]="",void 0!==s.validation[p.name]&&(c[p.name]=n.clone(s.validation[p.name]),p.options.autocomplete)){var f=n.clone(s.validation[p.name]),g=n.clone(s.validation[p.name]);f.pattern&&"email"===f.pattern&&(f.pattern=/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))$/i,g.pattern=/^((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i),r=p.name+"_username",c[r]=f,r=p.name+"_server",c[r]=g}u&&(a.bindings[p.name]='[name="'+p.name+'"]',p.options.autocomplete&&(r=p.name+"_username",a.bindings[r]='[name="'+r+'"]',r=p.name+"_server",a.bindings[r]='[name="'+r+'"]'));break;case"telephone":l[p.name]="",void 0!==s.validation[p.name]&&(c[p.name]=n.clone(s.validation[p.name]),c[p.name].required&&(c[p.name].pattern=/^\(\d{3}\) \d{3}-\d{4}$/i)),u&&(a.bindings[p.name]='[name="'+p.name+'"]');break;case"socialsecurity":l[p.name]="",void 0!==s.validation[p.name]&&(c[p.name]=n.clone(s.validation[p.name]),c[p.name].required&&(c[p.name].pattern=/^\d{3}\-\d{2}-\d{4}$/i)),c[p.name]||(c[p.name]={}),c&&!c[p.name].pattern&&(void 0===c[p.name].required&&(c[p.name].required=!1),c[p.name].pattern=/(^$|^\d{3}\-\d{2}-\d{4}$)/i),u&&(a.bindings[p.name]='[name="'+p.name+'"]');break;case"userid":l[p.name]="",void 0!==s.validation[p.name]&&(c[p.name]=n.clone(s.validation[p.name]),c[p.name].pattern||p.options.render&&"select"===p.options.render.toLowerCase()||(c[p.name].pattern="email"));break;case"buttondecision":a.on("change:"+p.name,function(n,a){e("#"+p.name+"_btn_condition").val(a).trigger("change")});default:p.attributes&&p.attributes.value?l[p.name]=p.attributes.value:l[p.name]="",o(p.name,s,c,""),"buttondecision"!==d&&u&&(a.bindings[p.name]='[name="'+p.name+'"]'),"select"===d&&p.options.tags&&(a.bindings[p.name]="#"+p.name)}if(p.options&&p.options.visibleon&&a.bindings[p.name]&&delete a.bindings[p.name],a.bindings[p.name]&&p.options&&p.options.showonstatus)if(a.attributes.status){var _=n.indexOf(p.options.showonstatus,a.attributes.status);_<0&&(delete a.bindings[p.name],c[p.name]&&delete c[p.name])}else delete a.bindings[p.name],c[p.name]&&delete c[p.name];p.options&&p.options.showonuser&&a.bindings[p.name]&&!t.shouldRenderShowOnUser(p)&&(delete a.bindings[p.name],c[p.name]&&delete c[p.name])}}),a.validation=c,l},o=function(e,a,i,t){void 0!==a.validation[e]&&(i[e]=n.clone(a.validation[e]),a.validation[e].msg&&(i[e].msg=a.validation[e].msg+t))};return a.Model.extend({initialize:function(){var a=this;this.multiFilesDefaultValue={},this.subFormLists=[],this.bindings={},this.notBinding=[],this.escapeHtmlInputs=[],this._listFieldType={};var i=s(this,this.attributes,this.attributes.is_internal);if(this.clear(),this.set(i),this.on("validated:invalid",function(a,i){"console"in window&&console&&console.log&&console.log("Invalid Fields",i),n.each(i,function(n,a){e(':input[name="'+a+'"]').addClass("invalid")})}),this.escapeHtmlInputs.length){var o={silent:!0};n.each(this.escapeHtmlInputs,function(e){var n="change:"+e;a.on(n,function(){if(a.has(e)){var n=t.htmlspecialchars(a.get(e)),i={};i[e]=n,a.set(i,o)}})})}n.each(this.subFormLists,function(e){if(a&&a.has&&a.has(e)){var n=a.get(e);n&&n.add&&(a._listFieldType[e]=n)}})},setTrim:function(i,t,s){var o;t=e.trim(t),n.isObject(i)||null==i?(o=i,s=t):(o={},o[i]=t),s=s||{},s.trim&&(o[i]=e.trim(o[i])),a.Model.prototype.set.call(this,o,s)},appendSubFormInput:function(a,i,s){s=s||null;var o,m=n.clone(this.toJSON()),r=e("#"+a);e("input.subform_before_submit",r).remove(),n.each(m,function(a,m){if(o=i.indexOf(m)>-1?"_internal":"",void 0!==a&&a&&"function"==typeof a.toJSON){s&&s[m].fields&&n.each(s[m].fields,function(i){if(i&&i.name&&i.type){i&&(i.options||(i.options={}),i.attributes||(i.attributes={}));var s=i.type.toLowerCase();n.each(a.models,function(a){var o;switch(s){case"number":var m=parseFloat(a.get(i.name));isNaN(m)||a.set(i.name,m);break;case"select":o=e.trim(a.get(i.name)),(i.options&&i.options.tags||i.attributes&&i.attributes.multiple)&&(n.isString(o)&&(o=o.split(",")),o&&o.length&&""===o[0]&&(o=[]),o.sort&&(o=o.sort(t.sortNumber)),a.set(i.name,o));break;case"date":if(o=a.get(i.name),""===(o=n.isString(o)?e.trim(o):o))o=null;else if(n.isNull(o));else if(o=o&&o.$date?moment(o.$date):moment(o,"MM/DD/YYYY"),!o.isValid())throw alert('Could not be able to parse this date value for "'+i.name+'" with "'+e.trim(a.get(i.name))+'"'),new Error;a.set(i.name,o)}})}});var d=JSON.stringify(a.toJSON());r.prepend('<input type="hidden" name="'+m+o+'" value="" class="subform_before_submit">'),r.find(':input[name="'+m+o+'"]').val(d)}})},triggerError:function(n){if(this.hasBooleanInput){e('.form-render_booleaninput input[type="hidden"].invalid',n.el).each(function(){e(this).closest(".form-render_booleaninput").next().html('<span class="text-error">Please answer this question.</span>').show("slow")})}},isSubformValid:function(){var a=this,i=!0;return n.each(this.subFormLists,function(t){a.validation[t]&&n.each(a.validation[t],function(a,s){if(!n.isObject(a)&&i){var o=e('input.subform_before_submit[name="'+t+'"]').val();switch(s){case"required":"[]"!==o&&o||(i=!1)}}})}),i},bindModelBinder:function(e,n){n.toLowerCase(),this.bindings[e]='[name="'+e+'"]'},unbindModelBinder:function(e,n){n.toLowerCase(),delete this.bindings[e]}})});