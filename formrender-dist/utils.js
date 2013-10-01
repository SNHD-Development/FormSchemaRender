define(["jquery","underscore","backbone","vm","jquery.spinner","jquery.birthdaypicker","jquery.placeholder","jquery.expose","jquery.zclip"],function(e,t,n,r){function i(n,r,i){t.each(r,function(t){i.fields[t.name]&&(e(n).on("visibleOnRenderComplete",':input[name="'+t.name+'"]',function(){e(this).val(i.fields[t.name]).trigger("change")}),e(':input[name="'+t.options.visibleon.name+'"]').trigger("change"))})}return{checkBrowser:function(){if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)){var t=parseInt(RegExp.$1);t<7&&(t=7),e("body").addClass("ie"+t)}},setupOldBrowser:function(){Object.keys=Object.keys||function(e){var t=[],n;for(n in e)e.hasOwnProperty(n)&&t.push(n);return t},Array.prototype.indexOf||(Array.prototype.indexOf=function(e,t){for(var n=t||0,r=this.length;n<r;n++)if(this[n]===e)return n;return-1})},ucwords:function(e){return(e+"").replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g,function(e){return e.toUpperCase()})},checkRequireFields:function(e,t){var n;switch(e.type.toLowerCase()){case"multifiles":n=e.name+"[]";if(typeof t[n]!="undefined"&&t[n].required)return!0;return!1;case"address":n=e.name+"_address_street";if(typeof t[n]!="undefined"&&t[n].required)return!0;n=e.name+"_address_city";if(typeof t[n]!="undefined"&&t[n].required)return!0;n=e.name+"_address_state";if(typeof t[n]!="undefined"&&t[n].required)return!0;n=e.name+"_address_zip";if(typeof t[n]!="undefined"&&t[n].required)return!0;n=e.name+"_address_country";if(typeof t[n]!="undefined"&&t[n].required)return!0;return!1;case"fullname":n=e.name+"_fullname_middle_name";if(typeof t[n]!="undefined"&&t[n].required)return!0;n=e.name+"_fullname_first_name";if(typeof t[n]!="undefined"&&t[n].required)return!0;n=e.name+"_fullname_last_name";if(typeof t[n]!="undefined"&&t[n].required)return!0;return!1}return typeof t[e.name]!="undefined"&&t[e.name].required?!0:!1},preValidate:function(t,n){var r=e(t.currentTarget),i=r.attr("name"),s=r.is(":file"),o;o=s?r.val():e.trim(r.val()),s||(r.hasClass("tolowercase")&&(o=o.toLowerCase()),r.hasClass("toucwords")&&(o=this.ucwords(o)),r.val(o).trigger("change")),n.set(i,o),n.isValid(i,o)?r.removeClass("invalid"):r.addClass("invalid")},setupPlaceHolder:function(t){e("input, textarea",t).placeholder()},setupFileInput:function(t){e(":file",t).trigger("change")},setupEmailInput:function(t){e(".emailpicker",t).each(function(){var t=e(".emailpicker_server",this),n=e(".emailpicker_username",this),r=e(':input[type="hidden"]',this),i=e(".not_sending",this);typeof t.attr("data-value")!="undefined"&&t.attr("data-value")&&t.val(t.attr("data-value")).trigger("change");if(r.val()!==""){var s=r.val().split("@");s.length===2&&(n.val(s[0]).trigger("change"),t.val(s[1]).trigger("change"))}e(".emailpicker_server, .emailpicker_username",this).on("change",this,function(i){n.val()!==""&&t.val()!==""?r.val(e.trim(n.val()+"@"+t.val())).trigger("change"):r.val("").trigger("change")}).on("keydown",function(e){if(e.keyCode===32)return e.preventDefault(),!1})})},setupBDateInput:function(t,n){e(".birthdaypicker",t).each(function(){e(this).birthdaypicker(e(this).attr("data-options"));var t=e(':input[type="hidden"]',this),r,i,s,o;t.val()!==""&&n.get(t.attr("name"))!==""&&(r=t.val().split("/"),r.length===3&&(r[0][0]==="0"&&(r[0]=r[0].substr(1)),r[1][0]==="0"&&(r[1]=r[1].substr(1)),i=e(".birth-month",this).val(r[0]),s=e(".birth-day",this).val(r[1]),o=e(".birth-year",this).val(r[2]),n.set(i.attr("name"),r[0]),n.set(s.attr("name"),r[1]),n.set(o.attr("name"),r[2])))})},setHiddenField:function(t){e(':hidden[data-value!=""]',t).each(function(){var t=e(this);typeof t.attr("data-value")!="undefined"&&t.attr("data-value")&&t.val(t.attr("data-value")).trigger("change")})},getBDateinput:function(t,n){e("fieldset.birthday-picker",t).each(function(){var t=/NaN/i,r=e(':input[type="hidden"]',this),i=e(".not_sending.birth-day",this),s=e(".not_sending.birth-month",this),o=e(".not_sending.birth-year",this),u=parseInt(i.val()),a=parseInt(s.val()),f=parseInt(o.val()),l=!1,c;String(u).match(t)&&(i.val(""),l=!0),String(a).match(t)&&(s.val(""),l=!0),String(f).match(t)&&(o.val(""),l=!0),l?r.val(""):(a<10&&(a+=0+a),u<10&&(u+=0+u),c=a+"/"+u+"/"+f,r.val()),n.set(r.attr("name"),r.val())})},getDefaultValues:function(t){e(".has-default-val",t).each(function(){var t=e(this);if(t.is(":disabled"))return;t.val()===""?t.trigger("change"):t.hasClass("data-clean")&&t.trigger("change").removeClass("data-clean")})},setupDateInput:function(t){e(".datepicker",t).each(function(){var t={},n,r;if(e(this).attr("data-maxdate"))switch(e(this).attr("data-maxdate").toLowerCase()){case"today":r=new Date,n=new Date(r.getFullYear(),r.getMonth(),r.getDate(),0,0,0,0),t.onRender=function(e){return e.valueOf()>n.valueOf()?"disabled":""}}e(this).datepicker(t).on("changeDate",function(t){var n=e(t.currentTarget).removeClass("invalid").trigger("change");n.datepicker("hide")}).on("click",function(t){e("div.datepicker.dropdown-menu").css("display","none"),e(t.currentTarget).datepicker("show")})})},setupSpinner:function(t){e(".spinner",t).each(function(){var t={value:parseInt(e(":input.spinner-input",this).val())||1};e(this).spinner(t)})},preventSpace:function(e){if(e.keyCode===32)return e.preventDefault(),!1},allowNumber:function(t){if(t.keyCode===8||t.keyCode===37||t.keyCode===39||t.keyCode===46||t.keyCode===9)return!0;(t.shiftKey||(t.keyCode!==46&&t.keyCode!==190&&t.keyCode!==110||e(t.currentTarget).val().indexOf(".")!==-1)&&(t.keyCode<48||t.keyCode>57&&t.keyCode<96||t.keyCode>105))&&t.preventDefault()},allowNaturalNumber:function(t){if(t.keyCode===8||t.keyCode===37||t.keyCode===39||t.keyCode===46||t.keyCode===9)return!0;(t.shiftKey||t.keyCode!==46&&t.keyCode!==110&&(t.keyCode<48||t.keyCode>57&&t.keyCode<96||t.keyCode>105)||t.keyCode===48&&e(t.currentTarget).val().length===0)&&t.preventDefault()},allowZipCode:function(e){if(e.keyCode===8||e.keyCode===37||e.keyCode===39||e.keyCode===46||e.keyCode===9)return!0;(e.shiftKey||e.keyCode<48||e.keyCode>57&&e.keyCode<96||e.keyCode>105)&&e.preventDefault()},getHumanTime:function(e){var t=typeof e!="object"?new Date(e*1e3):new Date(e.$date),n=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],r=t.getFullYear(),i=n[t.getMonth()],s=t.getDate(),o=t.getHours(),u=t.getMinutes(),a=t.getSeconds(),f="AM";return o>=12&&(o-=12,f="PM"),o<10&&(o="0"+o),u<10&&(u="0"+u),a<10&&(a="0"+a),i+" "+s+", "+r+" "+o+":"+u+":"+a+" "+f},getSpecialFieldsName:function(e,t){var n=[];switch(t.toLowerCase()){case"fullname":n.push(e+"_fullname_first_name"),n.push(e+"_fullname_middle_name"),n.push(e+"_fullname_last_name");break;case"address":n.push(e+"_address_street"),n.push(e+"_address_city"),n.push(e+"_address_state"),n.push(e+"_address_zip"),n.push(e+"_address_country");break;default:n.push(e)}return n},setFieldsValues:function(n,r,i,s){s=s||!1,t.each(i,function(t,i){var o=s&&s[i]?s[i]:"",u=e(':input[name="'+t+'"]',n).val(o).trigger("change");r.set(t,o),r.isValid(t)&&u.removeClass("invalid")})},setupClassAttr:function(e,t){e=e||!1,t=t||"",t.toLowerCase();if(e){e=e.toLowerCase();var n=new RegExp(t,"i");return n.test(e)?e:e+" "+t}return t},finalSetup:function(n){var s=this,o=e("select.has-default-val",n.el),u=e(n.el);n.options.mode==="update"&&n._visibleOn.length>0&&n.options.formData&&i(n.el,n._visibleOn,n.options.formData),n.options.mode==="create"&&o.length>0&&o.each(function(){var t=e('option[selected=""],option[selected="selected"]',this);t.length>0&&t.val()!==""?e(this).val(t.val()):e(this).hasClass("us-state")?e(this).val("NV"):e(this).hasClass("us-country")&&e(this).val("US")}),n._multiFiles.length>0&&t.each(n._multiFiles,function(e){require(["views/file-upload/multifiles"],function(t){var i=r.create(s,"MultiFilesView"+e.name,t,{field:e,name:n.el,model:n.model,validation:n.options.formSchema.validation});i.render()})}),n._ajaxDataCall.length>0&&this.setupAjaxCall(n,u),n._hasUserId&&this.setupUserIdAjaxCall(n,u),n._buttonDecision.length>0&&t.each(n._buttonDecision,function(i){var o=e("a#"+i.name,n.el),a='<input type="hidden" name="'+i.name+'" id="'+i.name+'_btn_condition"/>';if(!i.url||!i.data)throw"ButtonDecision require Url and Data options!";n.options.mode==="update"&&(o.after(a),n.options.formData.fields[i.name]&&o.next('input[type="hidden"]').val(n.options.formData.fields[i.name]).trigger("change"));if(n.options.internal===!0){var f=o.parents(".control-group");return f.length>0?f.hide():o.hide(),!0}o.click(function(o){o.preventDefault();var f=e(o.currentTarget);if(f.attr("disabled"))return!1;var l=i.url+"?",c={},h=!1,p,d=[],v=i.options.datacanempty?i.options.datacanempty:[],m=i.options.events||function(t){var o=e("#"+i.name+"_btn_condition",u);if(t.status&&t.status==="error")return f.attr("disabled",!1).popover("destroy"),f.next(".popover").remove(),p={html:!0,placement:"top",trigger:"manual",title:'<i class="icon-edit"></i> Error',content:t.error_message},f.attr("disabled",!0).popover(p).popover("show"),window.setTimeout(function(){f.attr("disabled",!1).popover("destroy"),f.next(".popover").remove()},3e3),!1;if(!t.value)throw'Result JSON must have "value" key';o.length===0&&f.after(a),i.options.renderresult&&t.data?(n.model.set(i.name,""),require(["views/subform-layouts/buttondecision"],function(e){var o=r.create(s,i.name+"View",e,{model:n.model,el:f,name:i.name});o.render(t.data)})):(f.parent().find("div.btn-decision-data-wrapper").remove(),n.model.set(i.name,t.value)),window.setTimeout(function(){f.attr("disabled",!1).popover("destroy"),f.next(".popover").remove()},1e3)};t.each(i.data,function(e,r){if(typeof e!="string"){typeof h=="boolean"&&(h=[]);var i;t.each(e,function(e,t){i=s.setUpButtonDecision(e,t,c,n.el,v,d)}),h.push(i)}else h=s.setUpButtonDecision(e,r,c,n.el,v)}),typeof h!="boolean"&&h.indexOf(!1)>-1&&(h=!1);if(h)return p={html:!0,placement:"top",trigger:"manual",title:'<i class="icon-edit"></i> Error',content:"Please correct the form"},f.attr("disabled",!0).popover(p).popover("show"),window.setTimeout(function(){f.attr("disabled",!1).popover("destroy"),f.next(".popover").remove()},2e3),!1;t.each(d,function(e){e.removeClass("invalid")}),l+=e.param(c);var g,y;switch(n.options.lang){case"sp":g="Por Favor Espere",y="Bajando Informaci&oacute;n";break;default:g="Please wait",y="Loading data"}p={html:!0,placement:"top",trigger:"manual",title:'<i class="icon-time"></i> '+g+".",content:'<i class="icon-spinner icon-spin icon-large"></i> '+y+" ..."},f.attr("disabled",!0).popover(p).popover("show"),e.getJSON(l,m)})})},finalReadSetup:function(n){n._buttonClipboards.length>0&&t.each(n._buttonClipboards,function(n){e("button#"+n.name).zclip({path:"//public.southernnevadahealthdistrict.org/assets/js/apps/formrender/libs/copy/ZeroClipboard.swf",copy:function(){var r="";return t.each(n.values,function(t){r+=e("#"+t).text()+"\r\n"}),r}})}),e("a[rel^=lightbox], area[rel^=lightbox], a[data-lightbox], area[data-lightbox]").each(function(){var t=e(this);e("<img>",{src:t.attr("href"),error:function(){t.hide(),t.next(".btn").show()}})})},isRenderReadMode:function(e,n){var r=n.type.toLowerCase();if(n.options.internal&&n.options.internal!==e.options.internal)return!1;if(r==="buttonclipboard")return!0;if(e.options.formData.fields[n.name]==="")return!1;if(r==="fullname"){var i=this.getSpecialFieldsName(n.name,n.type),s=!1;return t.each(i,function(t){!s&&e.options.formData.fields[t]&&e.options.formData.fields[t]!==""&&(s=!0)}),s}if(typeof e.options.formData.fields[n.name]=="undefined")switch(r){case"fieldsetstart":case"fieldsetend":case"html":case"action":case"button":case"submit":case"clear":case"address":break;default:return!1}return!0},resetPlaceHolderValue:function(t){_isSetting=e(":input.placeholder",t),_isSetting.each(function(){var t=e(this);t.attr("placeholder")===t.val()&&t.val("")})},createHiddenForm:function(e){require(["views/hiddenForm"],function(t){var n=r.create({},"FormView",t);n.render(e)})},setupAjaxCall:function(n,r){t.each(n._ajaxDataCall,function(n){var i=n.type.toLowerCase(),s=[],o={};if(typeof n.options.data=="undefined")throw"In order to use ajax call, we need Options.Data.";t.each(n.options.data,function(e){t.each(e,function(e){o[e]=""})});switch(i){case"fullname":s.push(n.name+"_fullname_first_name"),s.push(n.name+"_fullname_middle_name"),s.push(n.name+"_fullname_last_name");break;default:s.push(n.name)}t.each(s,function(i){r.on("change",':input[name="'+i+'"]',function(r){var s=e(this),u=s.val(),a=!1;u!==""&&(o[i]=u),t.each(o,function(e,t){e===""&&(a=!0)});if(!a){var f={},l=n.options.url+"?";t.each(n.options.data,function(e){t.each(e,function(e,t){f[t]=o[e]})}),e.getJSON(l+e.param(f),function(n){n.data&&t.each(n.data,function(t,n){if(typeof o[n]=="undefined"){var r=e(':input[name="'+n+'"]').val(t).trigger("change"),i;if(r.attr("type")==="hidden"){i=r.parent(".emailpicker");if(i.length>0){var s=t.split("@");e(":input.not_sending",i).each(function(t,n){e(n).val(s[t])})}}}})})}})})})},setUpButtonDecision:function(n,r,i,s,o,u){o=o||[],u=u||!1;var a=e("#"+n),f=a.parent(".birthday-picker"),l,c=!1,h;f.length>0&&(l=e(".not_sending",f).trigger("change"));var p=a.val();if(p!==""&&p.search(/NaN/)===-1||o.indexOf(r)>-1)i[r]=p;else{c=!0,h=e(':input[name="'+n+'"]',s).addClass("invalid"),u&&u.push(h);if(f.length>0){var d=p.split("/");t.each(d,function(t,n){t==="NaN"&&(h=e(l[n]).addClass("invalid"),u&&u.push(h))})}}return c},setupUserIdAjaxCall:function(t,n){var r="/user?$filter=Username eq ",i=e(":input.userid-lookup",n);i.each(function(){e(this).change(function(t){var n=e(this),i=n.val(),s=(n.attr("data-url")||r)+i;if(i==="")return;e.getJSON(s,function(e,t,n){})})})},setupAddressEvent:function(t){var n=e("form",t);n.on("change",".country",function(t){t.preventDefault();var n=e(this),r=n.parentsUntil("form","div.address-fieldset"),i=r.find("select.us-state"),s=r.find("input.us-state"),o=r.find("input.postal-code");_val=n.val();if(_val===n.attr("data-value"))return;n.attr("data-value",_val);switch(_val){case"":case"US":i.is(":hidden")&&s.attr("disabled",!0).hide("slow",function(){i.attr("disabled",!1).show("slow")}),o.addClass("allowzipcode").attr("maxlength",5);break;default:s.is(":hidden")&&i.attr("disabled",!0).hide("slow",function(){s.attr("disabled",!1).val("").show("slow")}),o.removeClass("allowzipcode").removeAttr("maxlength")}})}}});