({
  appDir: '../',
  baseUrl: ".",
  dir: '../../formrender-dist'
  , modules: [
    { name: 'main' }
  ]
  , shim: {
    "bootstrap": {
      deps: ['jquery'],
      exports: 'jQuery'
    },
    "jquery.expose": {
      deps: ['jquery'],
      exports: 'jQuery.expose'
    },
    "jquery.overlay": {
      deps: ['jquery'],
      exports: 'jQuery.overlay'
    },
    "jquery.dateinput": {
      deps: ['jquery'],
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
      deps: ['jquery'],
      exports: 'jQuery.ajaxSubmit'
    },
    "jquery.placeholder": {
      deps: ['jquery'],
      exports: 'jQuery.placeholder'
    },
    "jquery.birthdaypicker": {
      deps: ['jquery'],
      exports: 'jQuery.birthdaypicker'
    },
    "jquery.lightbox": {
      deps: ['jquery'],
      exports: 'jQuery.lightbox'
    }
  }
  , paths: {
    // Major libraries
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore-min', // https://github.com/amdjs
    lodash: 'libs/lodash/lodash', // alternative to underscore
    backbone: 'libs/backbone/backbone-min', // https://github.com/amdjs
    bootstrap: 'libs/bootstrap/bootstrap',
    json: 'libs/json/json3.min',

    // Backbone Plugin
    modelbinder: 'libs/backbone-binder/Backbone.ModelBinder.min',
    validation: 'libs/backbone-validation/backbone-validation-amd',

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

    // Require.js plugins
    text: 'libs/require/text',

    // Just a short cut so we can put our html outside the js dir
    // When you have HTML/CSS designers this aids in keeping them out of the js directory
    templates: 'templates',
    views: 'views'
  }
})
