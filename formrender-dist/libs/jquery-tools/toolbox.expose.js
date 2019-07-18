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

!function(o){function e(){if(o.browser&&o.browser.msie){var e=o(document).height(),n=o(window).height();return[window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,e-n<20?n:e]}return[o(document).width(),o(document).height()]}function n(e){if(e)return e.call(o.mask)}o.tools=o.tools||{version:"1.2.7"};var t;t=o.tools.expose={conf:{maskId:"exposeMask",loadSpeed:"slow",closeSpeed:"fast",closeOnClick:!0,closeOnEsc:!0,zIndex:9998,opacity:.8,startOpacity:0,color:"#fff",onLoad:null,onClose:null,renderBody:!0}};var s,i,c,d,r;o.mask={load:function(a,f){if(c)return this;"string"==typeof a&&(a={color:a}),a=a||d,d=a=o.extend(o.extend({},t.conf),a),s=o("#"+a.maskId),s.length||(s=o("<div/>").attr("id",a.maskId),a.renderBody?o("body").append(s):o(f).parents("form").append(s));var l=e();return s.css({position:"fixed",top:0,left:0,width:l[0],height:l[1],display:"none",opacity:a.startOpacity,zIndex:a.zIndex}),a.color&&s.css("backgroundColor",a.color),!1===n(a.onBeforeLoad)?this:(a.closeOnEsc&&o(document).on("keydown.mask",function(e){27==e.keyCode&&o.mask.close(e)}),a.closeOnClick&&s.on("click.mask",function(e){o.mask.close(e)}),o(window).on("resize.mask",function(){o.mask.fit()}),f&&f.length&&(r=f.eq(0).css("zIndex"),o.each(f,function(){var e=o(this);/relative|absolute|fixed/i.test(e.css("position"))||e.css("position","relative")}),i=f.css({zIndex:Math.max(a.zIndex+1,"auto"==r?0:r)})),s.css({display:"block"}).fadeTo(a.loadSpeed,a.opacity,function(){o.mask.fit(),n(a.onLoad),c="full"}),c=!0,this)},close:function(){if(c){if(!1===n(d.onBeforeClose))return this;s.fadeOut(d.closeSpeed,function(){n(d.onClose),i&&i.css({zIndex:r}),c=!1}),o(document).off("keydown.mask"),s.off("click.mask"),o(window).off("resize.mask")}return this},fit:function(){if(c){var o=e();s.css({width:o[0],height:o[1]})}},getMask:function(){return s},isLoaded:function(o){return o?"full"==c:c},getConf:function(){return d},getExposed:function(){return i}},o.fn.mask=function(e){return o.mask.load(e),this},o.fn.expose=function(e){return o.mask.load(e,this),this}}(jQuery);