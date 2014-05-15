define(["jquery","underscore","backbone","collections/collections"],function(e,t,n,r){var i=function(n,i,o){var u={},a={},f,l=i.is_internal?!0:!1,c=i.render_mode||!1,h,p;return t.each(i.fields,function(d){p=!0,d.options=d.options||{};if(!l&&d.options.internal)return;if(c&&d.options.showonmode&&d.options.showonmode.indexOf(c)===-1)return;if(l&&typeof d.options.internalcanupdate!="undefined"&&!d.options.internalcanupdate)return;typeof i.validation[d.name]!="undefined"&&t.each(i.validation[d.name],function(e,n){var r=["required","length","range","pattern","acceptance","min","max","length"];if(!t.contains(r,n.toLowerCase()))return;delete i.validation[d.name][n],i.validation[d.name][n.toLowerCase()]=e}),typeof d.options.internal!="undefined"&&d.options.internal!==o&&(p=!1),h=d.type.toLowerCase();switch(h){case"booleaninput":u[d.name]="",s(d.name,i,a,""),p&&(n.bindings[d.name]='[name="'+d.name+'"]'),n.on("change:"+d.name,function(e,t){var n={};n[d.name]=t==="true"?!0:t==="false"?!1:"",e.set(n,{silent:!0})}),n.hasBooleanInput=!0;break;case"multifiles":f=d.name+"[]",u[f]="",typeof i.validation[d.name]!="undefined"&&(i.validation[f]=t.clone(i.validation[d.name]),delete i.validation[d.name]),s(f,i,a,"");break;case"fraction":f=d.name+"_numerator",u[f]="",s(f,i,a,""),p&&(n.bindings[f]='[name="'+f+'"]'),f=d.name+"_denominator",u[f]="",s(f,i,a,""),p&&(n.bindings[f]='[name="'+f+'"]');break;case"address":f=d.name+"_address_street",u[f]="",s(f,i,a," (Street)"),p&&!d.options.visibleon&&(n.bindings[f]='[name="'+f+'"]'),f=d.name+"_address_city",u[f]="",s(f,i,a," (City)"),p&&!d.options.visibleon&&(n.bindings[f]='[name="'+f+'"]'),f=d.name+"_address_state",u[f]="",s(f,i,a," (State)"),p&&!d.options.visibleon&&(n.bindings[f]='[name="'+f+'"]'),f=d.name+"_address_zip",u[f]="",s(f,i,a," (ZIP)"),p&&!d.options.visibleon&&(n.bindings[f]='[name="'+f+'"]'),f=d.name+"_address_country",u[f]="",s(f,i,a," (Country)"),p&&!d.options.visibleon&&(n.bindings[f]='[name="'+f+'"]');break;case"fullname":if(typeof d.options.middlename=="undefined"||d.options.middlename)f=d.name+"_fullname_middle_name",u[f]="",s(f,i,a," (Middle Name)"),p&&!d.options.visibleon&&(n.bindings[f]='[name="'+f+'"]');f=d.name+"_fullname_first_name",u[f]="",s(f,i,a," (First Name)"),p&&!d.options.visibleon&&(n.bindings[f]='[name="'+f+'"]'),f=d.name+"_fullname_last_name",u[f]="",s(f,i,a," (Last Name)"),p&&!d.options.visibleon&&(n.bindings[f]='[name="'+f+'"]');break;case"list":u[d.name]=new r,s(d.name,i,a,""),n.subFormLists.push(d.name);break;case"check":case"checkbox":f=d.name+"[]",u[f]="",typeof i.validation[d.name]!="undefined"&&(i.validation[f]=t.clone(i.validation[d.name]),delete i.validation[d.name]),s(f,i,a,"");break;case"buttonclipboard":case"fieldsetstart":case"fieldsetend":case"fieldset":case"clear":case"action":case"button":case"submit":case"hr":case"html":case"step":n.notBinding.push(d.name);break;case"date":if(d.options.render&&d.options.render.toLowerCase()==="select"){u[d.name]="",u[d.name+"_birth[month]"]="",u[d.name+"_birth[day]"]="",u[d.name+"_birth[year]"]="";if(typeof i.validation[d.name]!="undefined"){a[d.name]=t.clone(i.validation[d.name]);var v=t.clone(i.validation[d.name]);v.mindate&&delete v.mindate,v.maxdate&&delete v.maxdate,a[d.name+"_birth[month]"]=t.clone(v),a[d.name+"_birth[day]"]=t.clone(v),a[d.name+"_birth[year]"]=t.clone(v)}}else u[d.name]="",s(d.name,i,a,""),n.bindings[d.name]='[name="'+d.name+'"]';break;case"email":u[d.name]="";if(typeof i.validation[d.name]!="undefined"){a[d.name]=t.clone(i.validation[d.name]);if(d.options.autocomplete){var m=t.clone(i.validation[d.name]),g=t.clone(i.validation[d.name]);m.pattern&&m.pattern==="email"&&(m.pattern=/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))$/i,g.pattern=/^((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i),f=d.name+"_username",a[f]=m,f=d.name+"_server",a[f]=g}}p&&(n.bindings[d.name]='[name="'+d.name+'"]',d.options.autocomplete&&(f=d.name+"_username",n.bindings[f]='[name="'+f+'"]',f=d.name+"_server",n.bindings[f]='[name="'+f+'"]'));break;case"telephone":u[d.name]="",typeof i.validation[d.name]!="undefined"&&(a[d.name]=t.clone(i.validation[d.name]),a[d.name].required&&(a[d.name].pattern=/^\(\d{3}\) \d{3}-\d{4}$/i)),p&&(n.bindings[d.name]='[name="'+d.name+'"]');break;case"userid":u[d.name]="",typeof i.validation[d.name]!="undefined"&&(a[d.name]=t.clone(i.validation[d.name]),!a[d.name].pattern&&(!d.options.render||d.options.render.toLowerCase()!=="select")&&(a[d.name].pattern="email"));break;case"buttondecision":n.on("change:"+d.name,function(t,n){e("#"+d.name+"_btn_condition").val(n).trigger("change")});default:u[d.name]="",s(d.name,i,a,""),h!=="buttondecision"&&p&&(n.bindings[d.name]='[name="'+d.name+'"]')}d.options&&d.options.visibleon&&n.bindings[d.name]&&delete n.bindings[d.name]}),n.validation=a,u},s=function(e,n,r,i){typeof n.validation[e]!="undefined"&&(r[e]=t.clone(n.validation[e]),n.validation[e].msg&&(r[e].msg=n.validation[e].msg+i))};return n.Model.extend({initialize:function(){this.subFormLists=[],this.bindings={},this.notBinding=[];var n=i(this,this.attributes,this.attributes.is_internal);this.clear(),this.set(n),this.on("validated:invalid",function(n,r){t.each(r,function(t,n){e(':input[name="'+n+'"]').addClass("invalid")})})},setTrim:function(r,i,s){var o;i=e.trim(i),t.isObject(r)||r==null?(o=r,s=i):(o={},o[r]=i),s=s||{},s.trim&&(o[r]=e.trim(o[r])),n.Model.prototype.set.call(this,o,s)},appendSubFormInput:function(n,r){var i=t.clone(this.toJSON()),s,o=e("#"+n);e("input.subform_before_submit",o).remove(),t.each(i,function(e,t){s=r.indexOf(t)>-1?"_internal":"";if(typeof e!="undefined"&&typeof e.toJSON=="function"){var n=JSON.stringify(e.toJSON());o.prepend('<input type="hidden" name="'+t+s+'" value="" class="subform_before_submit">'),o.find(':input[name="'+t+s+'"]').val(n)}})},triggerError:function(t){if(this.hasBooleanInput){var n=e('.form-render_booleaninput input[type="hidden"].invalid',t.el);n.each(function(){var t=e(this),n='<span class="text-error">Please answer this question.</span>';t.closest(".form-render_booleaninput").next().html(n).show("slow")})}},isSubformValid:function(){var n=this,r=!0;return t.each(this.subFormLists,function(i){if(!n.validation[i])return;t.each(n.validation[i],function(n,s){if(t.isObject(n)||!r)return;var o=e('input.subform_before_submit[name="'+i+'"]').val();switch(s){case"required":o==="[]"&&(r=!1)}})}),r},bindModelBinder:function(e,t){switch(t.toLowerCase()){default:this.bindings[e]='[name="'+e+'"]'}},unbindModelBinder:function(e,t){switch(t.toLowerCase()){default:delete this.bindings[e]}}})});