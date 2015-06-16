/*
 * blueimp helper JS 1.1.0
 * https://github.com/blueimp/Gallery
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

(function(){"use strict";function e(e,t){var n;for(n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e}function t(e){if(!this||this.find!==t.prototype.find)return new t(e);this.length=0;if(e){typeof e=="string"&&(e=this.find(e));if(e.nodeType||e===e.window)this.length=1,this[0]=e;else{var n=e.length;this.length=n;while(n)n-=1,this[n]=e[n]}}}t.extend=e,t.contains=function(e,t){do{t=t.parentNode;if(t===e)return!0}while(t);return!1},t.parseJSON=function(e){return window.JSON&&JSON.parse(e)},e(t.prototype,{find:function(e){var n=this[0]||document;return typeof e=="string"&&(n.querySelectorAll?e=n.querySelectorAll(e):e.charAt(0)==="#"?e=n.getElementById(e.slice(1)):e=n.getElementsByTagName(e)),new t(e)},hasClass:function(e){return this[0]?(new RegExp("(^|\\s+)"+e+"(\\s+|$)")).test(this[0].className):!1},addClass:function(e){var t=this.length,n;while(t){t-=1,n=this[t];if(!n.className)return n.className=e,this;if(this.hasClass(e))return this;n.className+=" "+e}return this},removeClass:function(e){var t=new RegExp("(^|\\s+)"+e+"(\\s+|$)"),n=this.length,r;while(n)n-=1,r=this[n],r.className=r.className.replace(t," ");return this},on:function(e,t){var n=e.split(/\s+/),r,i;while(n.length){e=n.shift(),r=this.length;while(r)r-=1,i=this[r],i.addEventListener?i.addEventListener(e,t,!1):i.attachEvent&&i.attachEvent("on"+e,t)}return this},off:function(e,t){var n=e.split(/\s+/),r,i;while(n.length){e=n.shift(),r=this.length;while(r)r-=1,i=this[r],i.removeEventListener?i.removeEventListener(e,t,!1):i.detachEvent&&i.detachEvent("on"+e,t)}return this},empty:function(){var e=this.length,t;while(e){e-=1,t=this[e];while(t.hasChildNodes())t.removeChild(t.lastChild)}return this}}),typeof define=="function"&&define.amd?define([],function(){return t}):(window.blueimp=window.blueimp||{},window.blueimp.helper=t)})();