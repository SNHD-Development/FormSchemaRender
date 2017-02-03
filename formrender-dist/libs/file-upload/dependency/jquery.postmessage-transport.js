/*
 * jQuery postMessage Transport Plugin 1.1.1
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery"],e):e(window.jQuery)}(function(e){"use strict";var t=0,s=["accepts","cache","contents","contentType","crossDomain","data","dataType","headers","ifModified","mimeType","password","processData","timeout","traditional","type","url","username"],n=function(e){return e};e.ajaxSetup({converters:{"postmessage text":n,"postmessage json":n,"postmessage html":n}}),e.ajaxTransport("postmessage",function(n){if(n.postMessage&&window.postMessage){var a,o=e("<a>").prop("href",n.postMessage)[0],i=o.protocol+"//"+o.host,r=n.xhr().upload;return{send:function(o,d){t+=1;var p={id:"postmessage-transport-"+t},c="message."+p.id;a=e('<iframe style="display:none;" src="'+n.postMessage+'" name="'+p.id+'"></iframe>').bind("load",function(){e.each(s,function(e,t){p[t]=n[t]}),p.dataType=p.dataType.replace("postmessage ",""),e(window).bind(c,function(t){t=t.originalEvent;var s,n=t.data;t.origin===i&&n.id===p.id&&("progress"===n.type?(s=document.createEvent("Event"),s.initEvent(n.type,!1,!0),e.extend(s,n),r.dispatchEvent(s)):(d(n.status,n.statusText,{postmessage:n.result},n.headers),a.remove(),e(window).unbind(c)))}),a[0].contentWindow.postMessage(p,i)}).appendTo(document.body)},abort:function(){a&&a.remove()}}}})});