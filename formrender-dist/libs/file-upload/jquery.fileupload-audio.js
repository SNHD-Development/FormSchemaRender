/*
 * jQuery File Upload Audio Preview Plugin 1.0.3
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery","load-image","jquery.fileupload-process","jquery.blueimp-gallery"],e):e(window.jQuery,window.loadImage)}(function(e,i){"use strict";e.blueimp.fileupload.prototype.options.processQueue.unshift({action:"loadAudio",prefix:!0,fileTypes:"@",maxFileSize:"@",disabled:"@disableAudioPreview"},{action:"setAudio",name:"@audioPreviewName",disabled:"@disableAudioPreview"}),e.widget("blueimp.fileupload",e.blueimp.fileupload,{options:{loadAudioFileTypes:/^audio\/.*$/},_audioElement:document.createElement("audio"),processActions:{loadAudio:function(o,d){if(d.disabled)return o;var a,u,l=o.files[o.index];return this._audioElement.canPlayType&&this._audioElement.canPlayType(l.type)&&("number"!==e.type(d.maxFileSize)||l.size<=d.maxFileSize)&&(!d.fileTypes||d.fileTypes.test(l.type))&&(a=i.createObjectURL(l))?(u=this._audioElement.cloneNode(!1),u.src=a,u.controls=!0,o.audio=u,o):o},setAudio:function(e,i){return e.audio&&!i.disabled&&(e.files[e.index][i.name||"preview"]=e.audio),e}}})});