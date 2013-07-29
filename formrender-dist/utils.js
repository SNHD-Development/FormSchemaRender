define(["jquery","underscore","backbone","jquery.spinner","jquery.birthdaypicker"],function(e,t,n){return{setupOldBrowser:function(){Object.keys=Object.keys||function(e){var t=[],n;for(n in e)e.hasOwnProperty(n)&&t.push(n);return t}},ucwords:function(e){return(e+"").replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g,function(e){return e.toUpperCase()})},preValidate:function(t,n){var r=e(t.currentTarget),i=r.attr("name"),s=r.is(":file"),o;o=s?r.val():e.trim(r.val()),s||(r.hasClass("tolowercase")&&(o=o.toLowerCase()),r.hasClass("toucwords")&&(o=this.ucwords(o)),r.val(o).trigger("change")),n.set(i,o),n.isValid(i,o)?r.removeClass("invalid"):r.addClass("invalid")},setupPlaceHolder:function(t){e("input, textarea",t).placeholder()},setupEmailInput:function(t){e(".emailpicker",t).each(function(){var t=e(".emailpicker_server",this),n=e(".emailpicker_username",this),r=e(":hidden",this),i=e(".not_sending",this);t.val(t.attr("data-value")).trigger("change"),i.on("change",this,function(i){n.val()!==""&&t.val()!==""?r.val(e.trim(n.val()+"@"+t.val())).trigger("change"):r.val("").trigger("change")}).on("keydown",function(e){if(e.keyCode===32)return e.preventDefault(),!1});if(r.val()!==""){var s=r.val().split("@");s.length===2&&(n.val(s[0]).trigger("change"),t.val(s[1]).trigger("change"))}})},setupBDateInput:function(t,n){e(".birthdaypicker",t).each(function(){e(this).birthdaypicker(e(this).attr("data-options"));var t=e(":hidden",this),r,i,s,o;t.val()!==""&&(r=t.val().split("/"),r.length===3&&(r[0][0]==="0"&&(r[0]=r[0].substr(1)),r[1][0]==="0"&&(r[1]=r[1].substr(1)),i=e(".birth-month",this).val(r[0]),s=e(".birth-day",this).val(r[1]),o=e(".birth-year",this).val(r[2]),n.set(i.attr("name"),r[0]),n.set(s.attr("name"),r[1]),n.set(o.attr("name"),r[2])))})},setHiddenField:function(t){e(':hidden[data-value!=""]',t).each(function(){var t=e(this);t.val(t.attr("data-value")).trigger("change")})},getBDateinput:function(t,n){e("fieldset.birthday-picker",t).each(function(){e(".not_sending",this).trigger("change");var t=/NaN/i,r=e(':input[type="hidden"]',this);r.val().match(t)&&r.val(""),n.set(r.attr("name"),r.val())})},getDefaultValues:function(t){e(".has-default-val",t).trigger("change")},setupDateInput:function(t){e(".datepicker",t).each(function(){var t={},n,r;if(e(this).attr("data-maxdate"))switch(e(this).attr("data-maxdate").toLowerCase()){case"today":r=new Date,n=new Date(r.getFullYear(),r.getMonth(),r.getDate(),0,0,0,0),t.onRender=function(e){return e.valueOf()>n.valueOf()?"disabled":""}}e(this).datepicker(t).on("changeDate",function(t){var n=e(t.currentTarget).removeClass("invalid").trigger("change");n.datepicker("hide")}).on("click",function(t){e("div.datepicker.dropdown-menu").css("display","none"),e(t.currentTarget).datepicker("show")})})},setupSpinner:function(t){e(".spinner",t).spinner()},preventSpace:function(e){if(e.keyCode===32)return e.preventDefault(),!1},allowNumber:function(t){if(t.keyCode===8||t.keyCode===37||t.keyCode===39||t.keyCode===46||t.keyCode===9)return!0;(t.shiftKey||(t.keyCode!==46&&t.keyCode!==190&&t.keyCode!==110||e(t.currentTarget).val().indexOf(".")!==-1)&&(t.keyCode<48||t.keyCode>57&&t.keyCode<96||t.keyCode>105))&&t.preventDefault()},allowZipCode:function(e){if(e.keyCode===8||e.keyCode===37||e.keyCode===39||e.keyCode===46||e.keyCode===9)return!0;(e.shiftKey||e.keyCode<48||e.keyCode>57&&e.keyCode<96||e.keyCode>105)&&e.preventDefault()},getHumanTime:function(e){var t=new Date(e*1e3),n=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],r=t.getFullYear(),i=n[t.getMonth()],s=t.getDate(),o=t.getHours(),u=t.getMinutes(),a=t.getSeconds(),f="AM";return o>=12&&(o-=12,f="PM"),o<10&&(o="0"+o),u<10&&(u="0"+u),a<10&&(a="0"+a),i+" "+s+", "+r+" "+o+":"+u+":"+a+" "+f}}});