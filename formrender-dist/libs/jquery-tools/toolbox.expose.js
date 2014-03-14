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

(function(e){function n(){if(e.browser&&e.browser.msie){var t=e(document).height(),n=e(window).height();return[window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,t-n<20?n:t]}return[e(document).width(),e(document).height()]}function r(t){if(t)return t.call(e.mask)}e.tools=e.tools||{version:"1.2.7"};var t;t=e.tools.expose={conf:{maskId:"exposeMask",loadSpeed:"slow",closeSpeed:"fast",closeOnClick:!0,closeOnEsc:!0,zIndex:9998,opacity:.8,startOpacity:0,color:"#fff",onLoad:null,onClose:null,renderBody:!0}};var i,s,o,u,a;e.mask={load:function(f,l){if(o)return this;typeof f=="string"&&(f={color:f}),f=f||u,u=f=e.extend(e.extend({},t.conf),f),i=e("#"+f.maskId),i.length||(i=e("<div/>").attr("id",f.maskId),f.renderBody?e("body").append(i):e(l).parents("form").append(i));var c=n();return i.css({position:"absolute",top:0,left:0,width:c[0],height:c[1],display:"none",opacity:f.startOpacity,zIndex:f.zIndex}),f.color&&i.css("backgroundColor",f.color),r(f.onBeforeLoad)===!1?this:(f.closeOnEsc&&e(document).on("keydown.mask",function(t){t.keyCode==27&&e.mask.close(t)}),f.closeOnClick&&i.on("click.mask",function(t){e.mask.close(t)}),e(window).on("resize.mask",function(){e.mask.fit()}),l&&l.length&&(a=l.eq(0).css("zIndex"),e.each(l,function(){var t=e(this);/relative|absolute|fixed/i.test(t.css("position"))||t.css("position","relative")}),s=l.css({zIndex:Math.max(f.zIndex+1,a=="auto"?0:a)})),i.css({display:"block"}).fadeTo(f.loadSpeed,f.opacity,function(){e.mask.fit(),r(f.onLoad),o="full"}),o=!0,this)},close:function(){if(o){if(r(u.onBeforeClose)===!1)return this;i.fadeOut(u.closeSpeed,function(){r(u.onClose),s&&s.css({zIndex:a}),o=!1}),e(document).off("keydown.mask"),i.off("click.mask"),e(window).off("resize.mask")}return this},fit:function(){if(o){var e=n();i.css({width:e[0],height:e[1]})}},getMask:function(){return i},isLoaded:function(e){return e?o=="full":o},getConf:function(){return u},getExposed:function(){return s}},e.fn.mask=function(t){return e.mask.load(t),this},e.fn.expose=function(t){return e.mask.load(t,this),this}})(jQuery);