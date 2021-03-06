({
  appDir: '../',
  baseUrl: ".",
  dir: '../../formrender-dist',
  modules: [{
    name: 'main'
  }],
  shim: {
    "bootstrap": {
      deps: ['jquery']
    },
    "jquery.expose": {
      deps: ['jquery', 'bootstrap'],
      exports: 'jQuery.expose'
    },
    "jquery.overlay": {
      deps: ['jquery', 'bootstrap'],
      exports: 'jQuery.overlay'
    },
    "jquery.dateinput": {
      deps: ['jquery', 'bootstrap'],
      exports: 'jQuery.dateinput'
    },
    "jquery.datepicker": {
      deps: ['jquery', 'bootstrap'],
      exports: 'jQuery.datepicker'
    },
    "jquery.wizard": {
      deps: ['jquery', 'bootstrap'],
      exports: 'jQuery.wizard'
    },
    "jquery.spinner": {
      deps: ['jquery', 'bootstrap'],
      exports: 'jQuery.spinner'
    },
    "jquery.ajaxsubmit": {
      deps: ['jquery', 'bootstrap'],
      exports: 'jQuery.ajaxSubmit'
    },
    "jquery.placeholder": {
      deps: ['jquery', 'bootstrap'],
      exports: 'jQuery.placeholder'
    },
    "jquery.birthdaypicker": {
      deps: ['jquery', 'bootstrap'],
      exports: 'jQuery.birthdaypicker'
    },
    "jquery.timepicker": {
      deps: ['jquery', 'bootstrap'],
      exports: 'jQuery.timepicker'
    },
    "jquery.lightbox": {
      deps: ['jquery', 'bootstrap'],
      exports: 'jQuery.lightbox'
    },
    "jquery.zclip": {
      deps: ['jquery', 'bootstrap'],
      exports: 'jQuery.zclip'
    },
    "jquery.stupidtable": {
      deps: ['jquery'],
      exports: 'jQuery.stupidtable'
    },
    "jquery.select2": {
      deps: ['jquery', 'bootstrap']
    }
  },
  paths: {
    // Major libraries
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore-min', // https://github.com/amdjs
    lodash: 'libs/lodash/lodash', // alternative to underscore
    backbone: 'libs/backbone/backbone-min', // https://github.com/amdjs
    bootstrap: 'libs/bootstrap/bootstrap',
    json: 'libs/json/json3.min',
    moment: 'libs/moment',
    humane: 'libs/humane.min',

    // Backbone Plugin
    modelbinder: 'libs/backbone-binder/Backbone.ModelBinder.min',
    validation: 'libs/backbone-validation/backbone-validation-amd',

    // xhr
    xdr: 'libs/xhr/jquery.xdomainrequest.min',

    // Java Loader
    jloader: 'libs/javaloader/deployJava',

    // jQuery Plugin
    "jquery.expose": 'libs/jquery-tools/toolbox.expose',
    "jquery.overlay": 'libs/jquery-tools/jquery.tools.overlay.min',
    "jquery.dateinput": 'libs/jquery-tools/jquery.tools.dateinput.min',
    "jquery.ajaxsubmit": 'libs/jquery-form-plugin/jquery.form.min',
    "jquery.placeholder": 'libs/jquery-form-plugin/jquery.placeholder',
    "jquery.birthdaypicker": 'libs/jquery-form-plugin/bdate-picker',
    "jquery.wizard": 'libs/fuelux/wizard',
    "jquery.spinner": 'libs/fuelux/spinner',
    "jquery.lightbox": 'libs/lightbox/lightbox-2.6',
    "jquery.zclip": 'libs/copy/jquery.zclip.min',
    "jquery.stupidtable": 'libs/jquery/stupidtable.min',
    "jquery.select2": 'libs/select2/select2.min',

    // FileUpload
    //'blueimp-helper': 'libs/file-upload/dependency/load-image.min',
    //'load-image': 'libs/file-upload/dependency/load-image.min',
    //'blueimp-gallery': 'libs/file-upload/dependency/blueimp-gallery',
    //'jquery.blueimp-gallery': 'libs/file-upload/dependency/jquery.blueimp-gallery.min',
    //'jquery.fileupload-process': 'libs/file-upload/jquery.fileupload-process',
    //'jquery.ui.widget': 'libs/file-upload/jquery.ui.widget',
    //'jquery.fileupload-image': 'libs/file-upload/jquery.fileupload-image',
    //'jquery.fileupload-audio': 'libs/file-upload/jquery.fileupload-audio',
    //'jquery.fileupload-video': 'libs/file-upload/jquery.fileupload-video',
    //'jquery.fileupload-validate': 'libs/file-upload/jquery.fileupload-validate',
    //'jquery.fileupload': 'libs/file-upload/jquery.fileupload',
    //'jquery.fileupload-ui': 'libs/file-upload/jquery.fileupload-ui',

    // Bootstrap Plugin
    "jquery.datepicker": 'libs/bootstrap-datepicker/bootstrap-datepicker',
    "jquery.timepicker": "libs/jquery/jquery.timepicker.min",

    // Require.js plugins
    text: 'libs/require/text',

    // Just a short cut so we can put our html outside the js dir
    // When you have HTML/CSS designers this aids in keeping them out of the js directory
    templates: 'templates',
    views: 'views',
    cropper: "libs/images/cropper",
    webcam: "libs/webcam/webcam"
  }
})
