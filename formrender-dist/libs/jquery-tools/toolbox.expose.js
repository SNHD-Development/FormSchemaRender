/**
 * @license
 * jQuery Tools 1.2.7 / Expose - Dim the lights
 *
 * NO COPYRIGHTS OR LICENSES. DO WHAT YOU LIKE.
 *
 * http://flowplayer.org/tools/toolbox/expose.html
 *
 * Since: Mar 2010
 * Date: @DATE
 */

!function(o){function e(){if(o.browser&&o.browser.msie){var e=o(document).height(),n=o(window).height();return[window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,e-n<20?n:e]}return[o(document).width(),o(document).height()]}function n(e){if(e)return e.call(o.mask)}o.tools=o.tools||{version:"1.2.7"};var t;t=o.tools.expose={conf:{maskId:"exposeMask",loadSpeed:"slow",closeSpeed:"fast",closeOnClick:!0,closeOnEsc:!0,zIndex:9998,opacity:.8,startOpacity:0,color:"#fff",onLoad:null,onClose:null,renderBody:!0}};var s,i,c,d,a;o.mask={load:function(r,l){if(c)return this;"string"==typeof r&&(r={color:r}),r=r||d,d=r=o.extend(o.extend({},t.conf),r),s=o("#"+r.maskId),s.length||(s=o("<div/>").attr("id",r.maskId),r.renderBody?o("body").append(s):o(l).parents("form").append(s));var f=e();return s.css({position:"absolute",top:0,left:0,width:f[0],height:f[1],display:"none",opacity:r.startOpacity,zIndex:r.zIndex}),r.color&&s.css("backgroundColor",r.color),!1===n(r.onBeforeLoad)?this:(r.closeOnEsc&&o(document).on("keydown.mask",function(e){27==e.keyCode&&o.mask.close(e)}),r.closeOnClick&&s.on("click.mask",function(e){o.mask.close(e)}),o(window).on("resize.mask",function(){o.mask.fit()}),l&&l.length&&(a=l.eq(0).css("zIndex"),o.each(l,function(){var e=o(this);/relative|absolute|fixed/i.test(e.css("position"))||e.css("position","relative")}),i=l.css({zIndex:Math.max(r.zIndex+1,"auto"==a?0:a)})),s.css({display:"block"}).fadeTo(r.loadSpeed,r.opacity,function(){o.mask.fit(),n(r.onLoad),c="full"}),c=!0,this)},close:function(){if(c){if(!1===n(d.onBeforeClose))return this;s.fadeOut(d.closeSpeed,function(){n(d.onClose),i&&i.css({zIndex:a}),c=!1}),o(document).off("keydown.mask"),s.off("click.mask"),o(window).off("resize.mask")}return this},fit:function(){if(c){var o=e();s.css({width:o[0],height:o[1]})}},getMask:function(){return s},isLoaded:function(o){return o?"full"==c:c},getConf:function(){return d},getExposed:function(){return i}},o.fn.mask=function(e){return o.mask.load(e),this},o.fn.expose=function(e){return o.mask.load(e,this),this}}(jQuery);