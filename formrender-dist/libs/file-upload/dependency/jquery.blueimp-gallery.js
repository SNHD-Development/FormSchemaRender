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

!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery","blueimp-gallery"],e):e(window.jQuery,window.blueimp.Gallery)}(function(e,n){"use strict";e(document.body).on("click","[data-gallery]",function(t){var i=e(this).data("gallery"),o=e(i),l=o.length&&o||e(n.prototype.options.container),r=e.extend(l.data(),{container:l[0],index:this,event:t,onopen:function(){l.data("gallery",this).trigger("open",arguments)},onslide:function(){l.trigger("slide",arguments)},onslideend:function(){l.trigger("slideend",arguments)},onslidecomplete:function(){l.trigger("slidecomplete",arguments)},onclose:function(){l.trigger("close").removeData("gallery")}}),a=e('[data-gallery="'+i+'"]');return r.filter&&(a=a.filter(r.filter)),new n(a,r)})});