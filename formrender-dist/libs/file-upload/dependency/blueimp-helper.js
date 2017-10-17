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

!function(){"use strict";function t(t,e){var n;for(n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t}function e(t){if(!this||this.find!==e.prototype.find)return new e(t);if(this.length=0,t)if("string"==typeof t&&(t=this.find(t)),t.nodeType||t===t.window)this.length=1,this[0]=t;else{var n=t.length;for(this.length=n;n;)n-=1,this[n]=t[n]}}e.extend=t,e.contains=function(t,e){do{if((e=e.parentNode)===t)return!0}while(e);return!1},e.parseJSON=function(t){return window.JSON&&JSON.parse(t)},t(e.prototype,{find:function(t){var n=this[0]||document;return"string"==typeof t&&(t=n.querySelectorAll?n.querySelectorAll(t):"#"===t.charAt(0)?n.getElementById(t.slice(1)):n.getElementsByTagName(t)),new e(t)},hasClass:function(t){return!!this[0]&&new RegExp("(^|\\s+)"+t+"(\\s+|$)").test(this[0].className)},addClass:function(t){for(var e,n=this.length;n;){if(n-=1,e=this[n],!e.className)return e.className=t,this;if(this.hasClass(t))return this;e.className+=" "+t}return this},removeClass:function(t){for(var e,n=new RegExp("(^|\\s+)"+t+"(\\s+|$)"),i=this.length;i;)i-=1,e=this[i],e.className=e.className.replace(n," ");return this},on:function(t,e){for(var n,i,s=t.split(/\s+/);s.length;)for(t=s.shift(),n=this.length;n;)n-=1,i=this[n],i.addEventListener?i.addEventListener(t,e,!1):i.attachEvent&&i.attachEvent("on"+t,e);return this},off:function(t,e){for(var n,i,s=t.split(/\s+/);s.length;)for(t=s.shift(),n=this.length;n;)n-=1,i=this[n],i.removeEventListener?i.removeEventListener(t,e,!1):i.detachEvent&&i.detachEvent("on"+t,e);return this},empty:function(){for(var t,e=this.length;e;)for(e-=1,t=this[e];t.hasChildNodes();)t.removeChild(t.lastChild);return this}}),"function"==typeof define&&define.amd?define([],function(){return e}):(window.blueimp=window.blueimp||{},window.blueimp.helper=e)}();