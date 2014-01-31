// Backbone.Validation v0.8.0
//
// Copyright (c) 2011-2013 Thomas Pedersen
// Distributed under MIT License
//
// Documentation and full license available at:
// http://thedersen.com/projects/backbone-validation

(function(e){typeof exports=="object"?module.exports=e(require("backbone"),require("underscore")):typeof define=="function"&&define.amd&&define(["backbone","underscore"],e)})(function(e,t){return e.Validation=function(t){var n={forceUpdate:!1,selector:"name",labelFormatter:"sentenceCase",valid:Function.prototype,invalid:Function.prototype},r={formatLabel:function(e,t){return f[n.labelFormatter](e,t)},format:function(){var e=Array.prototype.slice.call(arguments),t=e.shift();return t.replace(/\{(\d+)\}/g,function(t,n){return typeof e[n]!="undefined"?e[n]:t})}},i=function(n,r,s){return r=r||{},s=s||"",t.each(n,function(t,o){n.hasOwnProperty(o)&&(!t||typeof t!="object"||t instanceof Date||t instanceof RegExp||t instanceof e.Model||t instanceof e.Collection?r[s+o]=t:i(t,r,s+o+"."))}),r},s=function(){var e=function(e){return t.reduce(t.keys(e.validation||{}),function(e,t){return e[t]=void 0,e},{})},s=function(e,n){var r=e.validation?e.validation[n]||{}:{};if(t.isFunction(r)||t.isString(r))r={fn:r};return t.isArray(r)||(r=[r]),t.reduce(r,function(e,n){return t.each(t.without(t.keys(n),"msg"),function(t){e.push({fn:l[t],val:n[t],msg:n.msg})}),e},[])},u=function(e,n,i,o){return t.reduce(s(e,n),function(s,u){var a=t.extend({},r,l),f;return typeof u.fn!="undefined"&&(f=u.fn.call(a,i,n,u.val,e,o)),f===!1||s===!1?!1:f&&!s?u.msg||f:s},"")},a=function(e,n){var r,s={},o=!0,a=t.clone(n),f=i(n);return t.each(f,function(t,n){r=u(e,n,t,a),r&&(s[n]=r,o=!1)}),{invalidAttrs:s,isValid:o}},f=function(n,r){return{preValidate:function(e,n){return u(this,e,n,t.extend({},this.attributes))},isValid:function(e){var n=i(this.attributes);return t.isString(e)?!u(this,e,n[e],t.extend({},this.attributes)):t.isArray(e)?t.reduce(e,function(e,r){return e&&!u(this,r,n[r],t.extend({},this.attributes))},!0,this):(e===!0&&this.validate(),this.validation?this._isValid:!0)},validate:function(s,o){var u=this,f=!s,l=t.extend({},r,o),c=e(u),h=t.extend({},c,u.attributes,s),p=i(s||h),d=a(u,h);u._isValid=d.isValid,t.each(c,function(e,t){var r=d.invalidAttrs.hasOwnProperty(t);r||l.valid(n,t,l.selector)}),t.each(c,function(e,t){var r=d.invalidAttrs.hasOwnProperty(t),i=p.hasOwnProperty(t);r&&(i||f)&&l.invalid(n,t,d.invalidAttrs[t],l.selector)}),t.defer(function(){u.trigger("validated",u._isValid,u,d.invalidAttrs),u.trigger("validated:"+(u._isValid?"valid":"invalid"),u,d.invalidAttrs)});if(!l.forceUpdate&&t.intersection(t.keys(d.invalidAttrs),t.keys(p)).length>0)return d.invalidAttrs}}},c=function(e,n,r){t.extend(n,f(e,r))},h=function(e){delete e.validate,delete e.preValidate,delete e.isValid},p=function(e){c(this.view,e,this.options)},d=function(e){h(e)};return{version:"0.8.0",configure:function(e){t.extend(n,e)},bind:function(e,r){var i=e.model,s=e.collection;r=t.extend({},n,o,r);if(typeof i=="undefined"&&typeof s=="undefined")throw"Before you execute the binding your view must have a model or a collection.\nSee http://thedersen.com/projects/backbone-validation/#using-form-model-validation for more information.";i?c(e,i,r):s&&(s.each(function(t){c(e,t,r)}),s.bind("add",p,{view:e,options:r}),s.bind("remove",d))},unbind:function(e){var t=e.model,n=e.collection;t&&h(e.model),n&&(n.each(function(e){h(e)}),n.unbind("add",p),n.unbind("remove",d))},mixin:f(null,n)}}(),o=s.callbacks={valid:function(e,t,n){e.$("["+n+'~="'+t+'"]').removeClass("invalid").removeAttr("data-error")},invalid:function(e,t,n,r){e.$("["+r+'~="'+t+'"]').addClass("invalid").attr("data-error",n)}},u=s.patterns={digits:/^\d+$/,number:/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,email:/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,url:/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i},a=s.messages={required:"{0} is required",acceptance:"{0} must be accepted",min:"{0} must be greater than or equal to {1}",max:"{0} must be less than or equal to {1}",range:"{0} must be between {1} and {2}",length:"{0} must be {1} characters",minLength:"{0} must be at least {1} characters",maxLength:"{0} must be at most {1} characters",rangeLength:"{0} must be between {1} and {2} characters",oneOf:"{0} must be one of: {1}",equalTo:"{0} must be the same as {1}",pattern:"{0} must be a valid {1}",mindate:"{0} must be before {1}",maxdate:"{0} must be after {1}"},f=s.labelFormatters={none:function(e){return e},sentenceCase:function(e){return e.replace(/(?:^\w|[A-Z]|\b\w)/g,function(e,t){return t===0?e.toUpperCase():" "+e.toLowerCase()}).replace("_"," ")},label:function(e,t){return t.labels&&t.labels[e]||f.sentenceCase(e,t)}},l=s.validators=function(){var e=String.prototype.trim?function(e){return e===null?"":String.prototype.trim.call(e)}:function(e){var t=/^\s+/,n=/\s+$/;return e===null?"":e.toString().replace(t,"").replace(n,"")},n=function(e){return t.isNumber(e)||t.isString(e)&&e.match(u.number)},r=function(n){return!(t.isNull(n)||t.isUndefined(n)||t.isString(n)&&e(n)==="")};return{fn:function(e,n,r,i,s){return t.isString(r)&&(r=i[r]),r.call(i,e,n,s)},required:function(e,n,i,s,o){var u=t.isFunction(i)?i.call(s,e,n,o):i;if(!u&&!r(e))return!1;if(u&&!r(e))return this.format(a.required,this.formatLabel(n,s))},acceptance:function(e,n,r,i){if(e!=="true"&&(!t.isBoolean(e)||e===!1))return this.format(a.acceptance,this.formatLabel(n,i))},min:function(e,t,r,i){if(!n(e)||e<r)return this.format(a.min,this.formatLabel(t,i),r)},max:function(e,t,r,i){if(!n(e)||e>r)return this.format(a.max,this.formatLabel(t,i),r)},mindate:function(e,t,n,r){var i=e.split("/");if(i.length===3){var s=new Date,o=new Date,u=n.split("/");s.setFullYear(parseInt(i[2]),parseInt(i[0])-1,parseInt(i[1])),o.setFullYear(parseInt(u[2]),parseInt(u[0])-1,parseInt(u[1]));if(s>=o)return}return this.format(a.mindate,this.formatLabel(t,r))},maxdate:function(e,t,n,r){var i=e.split("/");if(i.length===3){var s=new Date,o=new Date,u=n.split("/");s.setFullYear(parseInt(i[2]),parseInt(i[0])-1,parseInt(i[1])),o.setFullYear(parseInt(u[2]),parseInt(u[0])-1,parseInt(u[1]));if(s<=o)return}return this.format(a.maxdate,this.formatLabel(t,r))},range:function(e,t,r,i){if(!n(e)||e<r[0]||e>r[1])return this.format(a.range,this.formatLabel(t,i),r[0],r[1])},length:function(t,n,i,s){if(!r(t)||e(t).length!==i)return this.format(a.length,this.formatLabel(n,s),i)},minLength:function(t,n,i,s){if(!r(t)||e(t).length<i)return this.format(a.minLength,this.formatLabel(n,s),i)},maxLength:function(t,n,i,s){if(!r(t)||e(t).length>i)return this.format(a.maxLength,this.formatLabel(n,s),i)},rangeLength:function(t,n,i,s){if(!r(t)||e(t).length<i[0]||e(t).length>i[1])return this.format(a.rangeLength,this.formatLabel(n,s),i[0],i[1])},oneOf:function(e,n,r,i){if(!t.include(r,e))return this.format(a.oneOf,this.formatLabel(n,i),r.join(", "))},filetype:function(e,n,r,i){var s=e.split(".").pop().toLowerCase();if(!t.include(r,s)){if(s!==""&&$().popover){var o=$('[name="'+n+'"][type="file"]'),u=o.parent().find(".alert.alert-error");!u.length&&!o.attr("disabled")&&o.attr("disabled",!0).before('<div class="alert alert-error" style="display:none;"><i class="icon-edit"></i> Invalid File Type<br>File type must be "'+r.join(", ")+'"</div>').prev().delay(500).show("slow",function(){window.setTimeout(function(){o.attr("disabled",!1).prev().hide("slow",function(){$(this).remove()}),o.val("")},2500)})}return this.format(a.oneOf,this.formatLabel(n,i),r.join(", "))}},equalTo:function(e,t,n,r,i){if(e!==i[n])return this.format(a.equalTo,this.formatLabel(t,r),this.formatLabel(n,r))},pattern:function(e,t,n,i){if(!r(e)||!e.toString().match(u[n]||n))return this.format(a.pattern,this.formatLabel(t,i),n)}}}();return s}(t),e.Validation});