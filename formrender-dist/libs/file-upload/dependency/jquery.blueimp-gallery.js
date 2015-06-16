/*
 * blueimp Gallery jQuery plugin 1.1.0
 * https://github.com/blueimp/Gallery
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

(function(e){"use strict";typeof define=="function"&&define.amd?define(["jquery","blueimp-gallery"],e):e(window.jQuery,window.blueimp.Gallery)})(function(e,t){"use strict";e(document.body).on("click","[data-gallery]",function(n){var r=e(this).data("gallery"),i=e(r),s=i.length&&i||e(t.prototype.options.container),o=e.extend(s.data(),{container:s[0],index:this,event:n,onopen:function(){s.data("gallery",this).trigger("open",arguments)},onslide:function(){s.trigger("slide",arguments)},onslideend:function(){s.trigger("slideend",arguments)},onslidecomplete:function(){s.trigger("slidecomplete",arguments)},onclose:function(){s.trigger("close").removeData("gallery")}}),u=e('[data-gallery="'+r+'"]');return o.filter&&(u=u.filter(o.filter)),new t(u,o)})});