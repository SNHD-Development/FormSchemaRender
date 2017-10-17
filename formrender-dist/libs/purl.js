/*
 * Purl (A JavaScript URL parser) v2.3.1
 * Developed and maintanined by Mark Perkins, mark@allmarkedup.com
 * Source repository: https://github.com/allmarkedup/jQuery-URL-Parser
 * Licensed under an MIT-style license. See https://github.com/allmarkedup/jQuery-URL-Parser/blob/master/LICENSE for details.
 */

!function(t){"function"==typeof define&&define.amd?define(t):window.purl=t()}(function(){function t(t,r){for(var e=decodeURI(t),a=l[r?"strict":"loose"].exec(e),n={attr:{},param:{},seg:{}},i=14;i--;)n.attr[p[i]]=a[i]||"";return n.param.query=o(n.attr.query),n.param.fragment=o(n.attr.fragment),n.seg.path=n.attr.path.replace(/^\/+|\/+$/g,"").split("/"),n.seg.fragment=n.attr.fragment.replace(/^\/+|\/+$/g,"").split("/"),n.attr.base=n.attr.host?(n.attr.protocol?n.attr.protocol+"://"+n.attr.host:n.attr.host)+(n.attr.port?":"+n.attr.port:""):"",n}function r(t){var r=t.tagName;return void 0!==r?d[r.toLowerCase()]:r}function e(t,r){if(0===t[r].length)return t[r]={};var e={};for(var a in t[r])e[a]=t[r][a];return t[r]=e,e}function a(t,r,n,o){var i=t.shift();if(i){var s=r[n]=r[n]||[];"]"==i?u(s)?""!==o&&s.push(o):"object"==typeof s?s[c(s).length]=o:s=r[n]=[r[n],o]:~i.indexOf("]")?(i=i.substr(0,i.length-1),!m.test(i)&&u(s)&&(s=e(r,n)),a(t,s,i,o)):(!m.test(i)&&u(s)&&(s=e(r,n)),a(t,s,i,o))}else u(r[n])?r[n].push(o):"object"==typeof r[n]?r[n]=o:void 0===r[n]?r[n]=o:r[n]=[r[n],o]}function n(t,r,e){if(~r.indexOf("]")){a(r.split("["),t,"base",e)}else{if(!m.test(r)&&u(t.base)){var n={};for(var o in t.base)n[o]=t.base[o];t.base=n}""!==r&&i(t.base,r,e)}return t}function o(t){return f(String(t).split(/&|;/),function(t,r){try{r=decodeURIComponent(r.replace(/\+/g," "))}catch(t){}var e=r.indexOf("="),a=s(r),o=r.substr(0,a||e),i=r.substr(a||e,r.length);return i=i.substr(i.indexOf("=")+1,i.length),""===o&&(o=r,i=""),n(t,o,i)},{base:{}}).base}function i(t,r,e){var a=t[r];void 0===a?t[r]=e:u(a)?a.push(e):t[r]=[a,e]}function s(t){for(var r,e,a=t.length,n=0;n<a;++n)if(e=t[n],"]"==e&&(r=!1),"["==e&&(r=!0),"="==e&&!r)return n}function f(t,r){for(var e=0,a=t.length>>0,n=arguments[2];e<a;)e in t&&(n=r.call(void 0,n,t[e],e,t)),++e;return n}function u(t){return"[object Array]"===Object.prototype.toString.call(t)}function c(t){var r=[];for(var e in t)t.hasOwnProperty(e)&&r.push(e);return r}function h(r,e){return 1===arguments.length&&!0===r&&(e=!0,r=void 0),e=e||!1,r=r||window.location.toString(),{data:t(r,e),attr:function(t){return t=g[t]||t,void 0!==t?this.data.attr[t]:this.data.attr},param:function(t){return void 0!==t?this.data.param.query[t]:this.data.param.query},fparam:function(t){return void 0!==t?this.data.param.fragment[t]:this.data.param.fragment},segment:function(t){return void 0===t?this.data.seg.path:(t=t<0?this.data.seg.path.length+t:t-1,this.data.seg.path[t])},fsegment:function(t){return void 0===t?this.data.seg.fragment:(t=t<0?this.data.seg.fragment.length+t:t-1,this.data.seg.fragment[t])}}}var d={a:"href",img:"src",form:"action",base:"href",script:"src",iframe:"src",link:"href",embed:"src",object:"data"},p=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","fragment"],g={anchor:"fragment"},l={strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/},m=/^[0-9]+$/;return h.jQuery=function(t){null!=t&&(t.fn.url=function(e){var a="";return this.length&&(a=t(this).attr(r(this[0]))||""),h(a,e)},t.url=h)},h.jQuery(window.jQuery),h});