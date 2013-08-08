/*
 * jQuery File Upload Image Preview & Resize Plugin 1.2.3
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

(function(e){typeof define=="function"&&define.amd?define(["jquery","load-image","load-image-meta","load-image-exif","load-image-ios","canvas-to-blob","./jquery.fileupload-process"],e):e(window.jQuery,window.loadImage)})(function(e,t){e.blueimp.fileupload.prototype.options.processQueue.unshift({action:"loadImageMetaData",disableImageHead:"@",disableExif:"@",disableExifThumbnail:"@",disableExifSub:"@",disableExifGps:"@",disabled:"@disableImageMetaDataLoad"},{action:"loadImage",prefix:!0,fileTypes:"@",maxFileSize:"@",noRevoke:"@",disabled:"@disableImageLoad"},{action:"resizeImage",prefix:"image",maxWidth:"@",maxHeight:"@",minWidth:"@",minHeight:"@",crop:"@",disabled:"@disableImageResize"},{action:"saveImage",disabled:"@disableImageResize"},{action:"saveImageMetaData",disabled:"@disableImageMetaDataSave"},{action:"resizeImage",prefix:"preview",maxWidth:"@",maxHeight:"@",minWidth:"@",minHeight:"@",crop:"@",orientation:"@",thumbnail:"@",canvas:"@",disabled:"@disableImagePreview"},{action:"setImage",name:"@imagePreviewName",disabled:"@disableImagePreview"}),e.widget("blueimp.fileupload",e.blueimp.fileupload,{options:{loadImageFileTypes:/^image\/(gif|jpeg|png)$/,loadImageMaxFileSize:1e7,imageMaxWidth:1920,imageMaxHeight:1080,imageCrop:!1,disableImageResize:!0,previewMaxWidth:80,previewMaxHeight:80,previewOrientation:!0,previewThumbnail:!0,previewCrop:!1,previewCanvas:!0},processActions:{loadImage:function(n,r){if(r.disabled)return n;var i=this,s=n.files[n.index],o=e.Deferred();return e.type(r.maxFileSize)==="number"&&s.size>r.maxFileSize||r.fileTypes&&!r.fileTypes.test(s.type)||!t(s,function(e){e.src&&(n.img=e),o.resolveWith(i,[n])},r)?n:o.promise()},resizeImage:function(n,r){if(r.disabled)return n;var i=this,s=e.Deferred(),o=function(e){n[e.getContext?"canvas":"img"]=e,s.resolveWith(i,[n])},u,a,f;r=e.extend({canvas:!0},r);if(n.exif){r.orientation===!0&&(r.orientation=n.exif.get("Orientation"));if(r.thumbnail){u=n.exif.get("Thumbnail");if(u)return t(u,o,r),s.promise()}}a=r.canvas&&n.canvas||n.img;if(a){f=t.scale(a,r);if(f.width!==a.width||f.height!==a.height)return o(f),s.promise()}return n},saveImage:function(t,n){if(!t.canvas||n.disabled)return t;var r=this,i=t.files[t.index],s=i.name,o=e.Deferred(),u=function(e){e.name||(i.type===e.type?e.name=i.name:i.name&&(e.name=i.name.replace(/\..+$/,"."+e.type.substr(6)))),t.files[t.index]=e,o.resolveWith(r,[t])};if(t.canvas.mozGetAsFile)u(t.canvas.mozGetAsFile(/^image\/(jpeg|png)$/.test(i.type)&&s||(s&&s.replace(/\..+$/,"")||"blob")+".png",i.type));else{if(!t.canvas.toBlob)return t;t.canvas.toBlob(u,i.type)}return o.promise()},loadImageMetaData:function(n,r){if(r.disabled)return n;var i=this,s=e.Deferred();return t.parseMetaData(n.files[n.index],function(t){e.extend(n,t),s.resolveWith(i,[n])},r),s.promise()},saveImageMetaData:function(e,t){if(!(e.imageHead&&e.canvas&&e.canvas.toBlob&&!t.disabled))return e;var n=e.files[e.index],r=new Blob([e.imageHead,this._blobSlice.call(n,20)],{type:n.type});return r.name=n.name,e.files[e.index]=r,e},setImage:function(e,t){var n=e.canvas||e.img;return n&&!t.disabled&&(e.files[e.index][t.name||"preview"]=n),e}}})});