define(["jquery","underscore","backbone","vm","jquery.spinner","jquery.birthdaypicker","jquery.placeholder","jquery.expose"],function(e,t,n,r){function i(n,r,i){t.each(r,function(t){i.fields[t.name]&&(e(n).on("visibleOnRenderComplete",':input[name="'+t.name+'"]',function(){e(this).val(i.fields[t.name]).trigger("change")}),e(':input[name="'+t.options.visibleon.name+'"]').trigger("change"))})}return{checkBrowser:function(){if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)){var t=parseInt(RegExp.$1);e("body").addClass("ie"+t)}},setupOldBrowser:function(){Object.keys=Object.keys||function(e){var t=[],n;for(n in e)e.hasOwnProperty(n)&&t.push(n);return t},Array.prototype.indexOf||(Array.prototype.indexOf=function(e,t){for(var n=t||0,r=this.length;n<r;n++)if(this[n]===e)return n;return-1})},ucwords:function(e){return(e+"").replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g,function(e){return e.toUpperCase()})},checkRequireFields:function(e,t){var n;switch(e.type.toLowerCase()){case"address":n=e.name+"_address_street";if(typeof t[n]!="undefined"&&t[n].required)return!0;n=e.name+"_address_city";if(typeof t[n]!="undefined"&&t[n].required)return!0;n=e.name+"_address_state";if(typeof t[n]!="undefined"&&t[n].required)return!0;n=e.name+"_address_zip";if(typeof t[n]!="undefined"&&t[n].required)return!0;n=e.name+"_address_country";if(typeof t[n]!="undefined"&&t[n].required)return!0;return!1;case"fullname":n=e.name+"_fullname_middle_name";if(typeof t[n]!="undefined"&&t[n].required)return!0;n=e.name+"_fullname_first_name";if(typeof t[n]!="undefined"&&t[n].required)return!0;n=e.name+"_fullname_last_name";if(typeof t[n]!="undefined"&&t[n].required)return!0;return!1}return typeof t[e.name]!="undefined"&&t[e.name].required?!0:!1},preValidate:function(t,n){var r=e(t.currentTarget),i=r.attr("name"),s=r.is(":file"),o;o=s?r.val():e.trim(r.val()),s||(r.hasClass("tolowercase")&&(o=o.toLowerCase()),r.hasClass("toucwords")&&(o=this.ucwords(o)),r.val(o).trigger("change")),n.set(i,o),n.isValid(i,o)?r.removeClass("invalid"):r.addClass("invalid")},setupPlaceHolder:function(t){e("input, textarea",t).placeholder()},setupFileInput:function(t){e(":file",t).trigger("change")},setupEmailInput:function(t){e(".emailpicker",t).each(function(){var t=e(".emailpicker_server",this),n=e(".emailpicker_username",this),r=e(':input[type="hidden"]',this),i=e(".not_sending",this);typeof t.attr("data-value")!="undefined"&&t.attr("data-value")&&t.val(t.attr("data-value")).trigger("change");if(r.val()!==""){var s=r.val().split("@");s.length===2&&(n.val(s[0]).trigger("change"),t.val(s[1]).trigger("change"))}e(".emailpicker_server, .emailpicker_username",this).on("change",this,function(i){n.val()!==""&&t.val()!==""?r.val(e.trim(n.val()+"@"+t.val())).trigger("change"):r.val("").trigger("change")}).on("keydown",function(e){if(e.keyCode===32)return e.preventDefault(),!1})})},setupBDateInput:function(t,n){e(".birthdaypicker",t).each(function(){e(this).birthdaypicker(e(this).attr("data-options"));var t=e(':input[type="hidden"]',this),r,i,s,o;t.val()!==""&&n.get(t.attr("name"))!==""&&(r=t.val().split("/"),r.length===3&&(r[0][0]==="0"&&(r[0]=r[0].substr(1)),r[1][0]==="0"&&(r[1]=r[1].substr(1)),i=e(".birth-month",this).val(r[0]),s=e(".birth-day",this).val(r[1]),o=e(".birth-year",this).val(r[2]),n.set(i.attr("name"),r[0]),n.set(s.attr("name"),r[1]),n.set(o.attr("name"),r[2])))})},setHiddenField:function(t){e(':hidden[data-value!=""]',t).each(function(){var t=e(this);typeof t.attr("data-value")!="undefined"&&t.attr("data-value")&&t.val(t.attr("data-value")).trigger("change")})},getBDateinput:function(t,n){e("fieldset.birthday-picker",t).each(function(){e(".not_sending",this).trigger("change");var t=/NaN/i,r=e(':input[type="hidden"]',this);r.val().match(t)&&r.val(""),n.set(r.attr("name"),r.val())})},getDefaultValues:function(t){e(".has-default-val",t).trigger("change")},setupDateInput:function(t){e(".datepicker",t).each(function(){var t={},n,r;if(e(this).attr("data-maxdate"))switch(e(this).attr("data-maxdate").toLowerCase()){case"today":r=new Date,n=new Date(r.getFullYear(),r.getMonth(),r.getDate(),0,0,0,0),t.onRender=function(e){return e.valueOf()>n.valueOf()?"disabled":""}}e(this).datepicker(t).on("changeDate",function(t){var n=e(t.currentTarget).removeClass("invalid").trigger("change");n.datepicker("hide")}).on("click",function(t){e("div.datepicker.dropdown-menu").css("display","none"),e(t.currentTarget).datepicker("show")})})},setupSpinner:function(t){e(".spinner",t).each(function(){var t={value:parseInt(e(":input.spinner-input",this).val())||1};e(this).spinner(t)})},preventSpace:function(e){if(e.keyCode===32)return e.preventDefault(),!1},allowNumber:function(t){if(t.keyCode===8||t.keyCode===37||t.keyCode===39||t.keyCode===46||t.keyCode===9)return!0;(t.shiftKey||(t.keyCode!==46&&t.keyCode!==190&&t.keyCode!==110||e(t.currentTarget).val().indexOf(".")!==-1)&&(t.keyCode<48||t.keyCode>57&&t.keyCode<96||t.keyCode>105))&&t.preventDefault()},allowZipCode:function(e){if(e.keyCode===8||e.keyCode===37||e.keyCode===39||e.keyCode===46||e.keyCode===9)return!0;(e.shiftKey||e.keyCode<48||e.keyCode>57&&e.keyCode<96||e.keyCode>105)&&e.preventDefault()},getHumanTime:function(e){var t=new Date(e*1e3),n=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],r=t.getFullYear(),i=n[t.getMonth()],s=t.getDate(),o=t.getHours(),u=t.getMinutes(),a=t.getSeconds(),f="AM";return o>=12&&(o-=12,f="PM"),o<10&&(o="0"+o),u<10&&(u="0"+u),a<10&&(a="0"+a),i+" "+s+", "+r+" "+o+":"+u+":"+a+" "+f},getSpecialFieldsName:function(e,t){var n=[];switch(t.toLowerCase()){case"fullname":n.push(e+"_fullname_first_name"),n.push(e+"_fullname_middle_name"),n.push(e+"_fullname_last_name");break;case"address":n.push(e+"_address_street"),n.push(e+"_address_city"),n.push(e+"_address_state"),n.push(e+"_address_zip"),n.push(e+"_address_country");break;default:n.push(e)}return n},setFieldsValues:function(n,r,i,s){s=s||!1,t.each(i,function(t,i){var o=s&&s[i]?s[i]:"",u=e(':input[name="'+t+'"]',n).val(o).trigger("change");r.set(t,o),r.isValid(t)&&u.removeClass("invalid")})},setupClassAttr:function(e,t){e=e||!1,t=t||"",t.toLowerCase();if(e){e=e.toLowerCase();var n=new RegExp(t,"i");return n.test(e)?e:e+" "+t}return t},finalSetup:function(n){var s=this,o=e("select.has-default-val",n.el);n.options.mode==="update"&&n._visibleOn.length>0&&n.options.formData&&i(n.el,n._visibleOn,n.options.formData),n.options.mode==="create"&&o.length>0&&o.each(function(){var t=e('option[selected=""],option[selected="selected"]',this);t.length>0&&t.val()!==""?e(this).val(t.val()):e(this).hasClass("us-state")?e(this).val("NV"):e(this).hasClass("us-country")&&e(this).val("US")}),n._multiFiles.length>0&&t.each(n._multiFiles,function(e){require(["views/file-upload/multifiles"],function(t){var i=r.create(s,"MultiFilesView"+e.name,t,{field:e,name:n.el,model:n.model,validation:n.options.formSchema.validation});i.render()})})},isRenderReadMode:function(e,n){if(e.options.formData.fields[n.name]==="")return!1;if(n.type.toLowerCase()==="fullname"){var r=this.getSpecialFieldsName(n.name,n.type),i=!1;return t.each(r,function(t){!i&&e.options.formData.fields[t]&&e.options.formData.fields[t]!==""&&(i=!0)}),i}return!0},resetPlaceHolderValue:function(t){_isSetting=e(":input.placeholder",t),_isSetting.each(function(){var t=e(this);t.attr("placeholder")===t.val()&&t.val("")})}}});