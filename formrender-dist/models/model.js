define(["jquery","underscore","backbone","collections/collections"],function(e,t,n,r){var i=function(n,i){var o={},u={},a,f=i.is_internal?!0:!1,l=i.render_mode||!1,c;return t.each(i.fields,function(h){h.options=h.options||{};if(!f&&h.options.internal)return;if(l&&h.options.showonmode&&h.options.showonmode.indexOf(l)===-1)return;if(f&&typeof h.options.internalcanupdate!="undefined"&&!h.options.internalcanupdate)return;typeof i.validation[h.name]!="undefined"&&t.each(i.validation[h.name],function(e,n){var r=["required","length","range","pattern","acceptance","min","max","length"];if(!t.contains(r,n.toLowerCase()))return;delete i.validation[h.name][n],i.validation[h.name][n.toLowerCase()]=e}),c=h.type.toLowerCase();switch(c){case"booleaninput":o[h.name]="",s(h.name,i,u,""),n.bindings[h.name]='[name="'+h.name+'"]',n.on("change:"+h.name,function(e,t){var n={};n[h.name]=t==="true"?!0:t==="false"?!1:"",e.set(n,{silent:!0})}),n.hasBooleanInput=!0;break;case"multifiles":a=h.name+"[]",o[a]="",typeof i.validation[h.name]!="undefined"&&(i.validation[a]=t.clone(i.validation[h.name]),delete i.validation[h.name]),s(a,i,u,"");break;case"fraction":a=h.name+"_numerator",o[a]="",s(a,i,u,""),n.bindings[a]='[name="'+a+'"]',a=h.name+"_denominator",o[a]="",s(a,i,u,""),n.bindings[a]='[name="'+a+'"]';break;case"address":a=h.name+"_address_street",o[a]="",s(a,i,u," (Street)"),n.bindings[a]='[name="'+a+'"]',a=h.name+"_address_city",o[a]="",s(a,i,u," (City)"),n.bindings[a]='[name="'+a+'"]',a=h.name+"_address_state",o[a]="",s(a,i,u," (State)"),n.bindings[a]='[name="'+a+'"]',a=h.name+"_address_zip",o[a]="",s(a,i,u," (ZIP)"),n.bindings[a]='[name="'+a+'"]',a=h.name+"_address_country",o[a]="",s(a,i,u," (Country)"),n.bindings[a]='[name="'+a+'"]';break;case"fullname":if(typeof h.options.middlename=="undefined"||h.options.middlename)a=h.name+"_fullname_middle_name",o[a]="",s(a,i,u," (Middle Name)"),n.bindings[a]='[name="'+a+'"]';a=h.name+"_fullname_first_name",o[a]="",s(a,i,u," (First Name)"),n.bindings[a]='[name="'+a+'"]',a=h.name+"_fullname_last_name",o[a]="",s(a,i,u," (Last Name)"),n.bindings[a]='[name="'+a+'"]';break;case"list":o[h.name]=new r,s(h.name,i,u,""),n.subFormLists.push(h.name);break;case"check":case"checkbox":a=h.name+"[]",o[a]="",s(a,i,u,"");break;case"fieldsetstart":case"fieldsetend":case"fieldset":case"clear":case"action":case"button":case"submit":case"hr":case"html":case"step":break;case"date":if(h.options.render&&h.options.render.toLowerCase()==="select"){o[h.name]="",o[h.name+"_birth[month]"]="",o[h.name+"_birth[day]"]="",o[h.name+"_birth[year]"]="";if(typeof i.validation[h.name]!="undefined"){u[h.name]=t.clone(i.validation[h.name]);var p=t.clone(i.validation[h.name]);p.mindate&&delete p.mindate,p.maxdate&&delete p.maxdate,u[h.name+"_birth[month]"]=t.clone(p),u[h.name+"_birth[day]"]=t.clone(p),u[h.name+"_birth[year]"]=t.clone(p)}}else o[h.name]="",s(h.name,i,u,"");break;case"email":o[h.name]="";if(typeof i.validation[h.name]!="undefined"){u[h.name]=t.clone(i.validation[h.name]),n.bindings[h.name]='[name="'+h.name+'"]';if(h.options.autocomplete){var d=t.clone(i.validation[h.name]),v=t.clone(i.validation[h.name]);d.pattern&&d.pattern==="email"&&(d.pattern=/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))$/i,v.pattern=/^((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i),a=h.name+"_username",u[a]=d,n.bindings[a]='[name="'+a+'"]',a=h.name+"_server",u[a]=v,n.bindings[a]='[name="'+a+'"]'}}break;case"telephone":o[h.name]="",typeof i.validation[h.name]!="undefined"&&(u[h.name]=t.clone(i.validation[h.name]),u[h.name].required&&(u[h.name].pattern=/^\(\d{3}\) \d{3}-\d{4}$/i));break;case"userid":o[h.name]="",typeof i.validation[h.name]!="undefined"&&(u[h.name]=t.clone(i.validation[h.name]),!u[h.name].pattern&&(!h.options.render||h.options.render.toLowerCase()!=="select")&&(u[h.name].pattern="email"));break;case"buttondecision":n.on("change:"+h.name,function(t,n){e("#"+h.name+"_btn_condition").val(n).trigger("change")});default:o[h.name]="",s(h.name,i,u,""),c!=="buttondecision"&&(n.bindings[h.name]='[name="'+h.name+'"]')}h.options&&h.options.visibleon&&n.bindings[h.name]&&delete n.bindings[h.name]}),n.validation=u,o},s=function(e,n,r,i){typeof n.validation[e]!="undefined"&&(r[e]=t.clone(n.validation[e]),n.validation[e].msg&&(r[e].msg=n.validation[e].msg+i))};return n.Model.extend({initialize:function(){this.subFormLists=[],this.bindings={};var n=i(this,this.attributes);this.clear(),this.set(n),this.on("validated:invalid",function(n,r){t.each(r,function(t,n){e(':input[name="'+n+'"]').addClass("invalid")})})},setTrim:function(r,i,s){var o;i=e.trim(i),t.isObject(r)||r==null?(o=r,s=i):(o={},o[r]=i),s=s||{},s.trim&&(o[r]=e.trim(o[r])),n.Model.prototype.set.call(this,o,s)},appendSubFormInput:function(n,r){var i=t.clone(this.toJSON()),s,o=e("#"+n);e("input.subform_before_submit",o).remove(),t.each(i,function(e,t){s=r.indexOf(t)>-1?"_internal":"",typeof e!="undefined"&&typeof e.toJSON=="function"&&o.prepend('<input type="hidden" name="'+t+s+"\" value='"+JSON.stringify(e.toJSON())+'\' class="subform_before_submit">')})},triggerError:function(t){if(this.hasBooleanInput){var n=e('.form-render_booleaninput input[type="hidden"].invalid',t.el);n.each(function(){var t=e(this),n='<span class="text-error">Please answer this question.</span>';t.closest(".form-render_booleaninput").next().html(n).show("slow")})}},isSubformValid:function(){var n=this,r=!0;return t.each(this.subFormLists,function(i){if(!n.validation[i])return;t.each(n.validation[i],function(n,s){if(t.isObject(n)||!r)return;var o=e('input.subform_before_submit[name="'+i+'"]').val();switch(s){case"required":o==="[]"&&(r=!1)}})}),r}})});