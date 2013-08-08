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

(function(e){typeof define=="function"&&define.amd?define(["jquery","load-image","jquery.fileupload-process","jquery.blueimp-gallery"],e):e(window.jQuery,window.loadImage)})(function(e,t){e.blueimp.fileupload.prototype.options.processQueue.unshift({action:"loadAudio",prefix:!0,fileTypes:"@",maxFileSize:"@",disabled:"@disableAudioPreview"},{action:"setAudio",name:"@audioPreviewName",disabled:"@disableAudioPreview"}),e.widget("blueimp.fileupload",e.blueimp.fileupload,{options:{loadAudioFileTypes:/^audio\/.*$/},_audioElement:document.createElement("audio"),processActions:{loadAudio:function(n,r){if(r.disabled)return n;var i=n.files[n.index],s,o;if(this._audioElement.canPlayType&&this._audioElement.canPlayType(i.type)&&(e.type(r.maxFileSize)!=="number"||i.size<=r.maxFileSize)&&(!r.fileTypes||r.fileTypes.test(i.type))){s=t.createObjectURL(i);if(s)return o=this._audioElement.cloneNode(!1),o.src=s,o.controls=!0,n.audio=o,n}return n},setAudio:function(e,t){return e.audio&&!t.disabled&&(e.files[e.index][t.name||"preview"]=e.audio),e}}})});