define(["jquery","underscore","jquery.select2"],function($,_){function cloneInputToHiddenInput(e){var t=["name","class","id","style","data-events"],n="";_.each(t,function(t){var r=e.attr(t);r&&(n+=t+'="'+r+'" ')}),n='<input type="hidden" '+n+" />",e.after(n);var r=e.css("width"),i=e.next();return e.remove(),r?i.css("width",r):i.css("width","98%"),i}function setupEvents($element,events){var token,tokens,that=this;if(!_.isObject(events))throw"setupEvents() required events to be a valid object";_.each(events,function(value,key){var _func;_.isString(value)&&(token=value.match(/\(([^)]+)\)/ig),token?(token=token[0].replace(/(\(|\))/ig,""),tokens=token.split(","),token=value.match(/^\s*(\w+)/ig),token&&eval("_func = "+token[0]+";")):eval("_func = "+value+";"));if(typeof _func!="function")throw"setupEvents() require events to be a valid function.";$element.on(key,function(e){tokens?_func.apply(that,_.union([$element,e],tokens)):_func($element,e)})})}function parseNumberList(e,t){if(t.added){var n=t.added.text;if(n.indexOf("-")>=0){var r=n.match(/(\d+)(\s*)-(\s*)(\d+)/ig);if(r){var i=r.shift();i=i.split("-");var s=parseInt(i.shift(),10),o=parseInt(i.shift(),10),u;if(_.isNaN(s)||_.isNaN(o))return;u=o-s;if(u<1){var a=o.toString().length,f=s.toString().slice(-a);u=o-f;if(u<1)return}if(u>200){alert("Cannot have the range greater than 200. (from "+s+" to "+o+")");return}t.val=_.without(t.val,n);for(var l=0;l<=u;l++)t.val.push(s+l);e.select2("val",t.val)}}}}function addNumberFromField(e,t,n){if(t.added){if(t.val.length>1)return;var r=parseFloat(t.added.text);if(_.isNaN(r))return;var i=$("#"+n),s=parseFloat(i.val());if(_.isNaN(s))return;if(s>200){alert("Cannot have the range greater than 200.");return}t.val=[];while(s)t.val.push(r),r++,s--;e.select2("val",t.val)}}if(!$().select2)throw"Could not be abel to find select2";return{renderTags:function(e,t){t=t||null;var n=cloneInputToHiddenInput(e),r=n.attr("name");if(t._elementData[r]&&t._elementData[r].value){var i=JSON.stringify(t._elementData[r].value).replace(/\[|\]|\"/ig,"");n.val(i)}var s={tags:[]};n.select2(s),t._elementData[r]&&t._elementData[r].events&&setupEvents(n,t._elementData[r].events)},render:function(e,t){e.is("select")&&e.select2()}}});