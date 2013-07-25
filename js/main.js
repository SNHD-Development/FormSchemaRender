/**
 * Form Render
 * https://github.com/SNHD-Development/FormSchemaRender
 *
 * Copyright (c) 2013 SNHD
 * Licensed under the MIT license.
 *
 * Version 0.0.2
 **/

require.config({
  paths: {
    // Major libraries
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore-min', // https://github.com/amdjs
    lodash: 'libs/lodash/lodash', // alternative to underscore
    backbone: 'libs/backbone/backbone-min', // https://github.com/amdjs
    bootstrap: 'libs/bootstrap/bootstrap',

    // Backbone Plugin
    modelbinder: 'libs/backbone-binder/Backbone.ModelBinder.min',
    validation: 'libs/backbone-validation/backbone-validation-amd',

    // jQuery Plugin
    "jquery.expose": 'libs/jquery-tools/toolbox.expose',
    "jquery.overlay": 'libs/jquery-tools/jquery.tools.overlay.min',
    "jquery.dateinput": 'libs/jquery-tools/jquery.tools.dateinput.min',
    "jquery.ajaxsubmit": 'libs/jquery-form-plugin/jquery.form.min',
    "jquery.placeholder": 'libs/jquery-form-plugin/jquery.placeholder.min',
    "jquery.birthdaypicker": 'libs/jquery-form-plugin/bdate-picker',
    "jquery.wizard": 'libs/fuelux/wizard',

    // Bootstrap Plugin
    "jquery.datepicker": 'libs/bootstrap-datepicker/bootstrap-datepicker',

    // Require.js plugins
    text: 'libs/require/text',

    // Just a short cut so we can put our html outside the js dir
    // When you have HTML/CSS designers this aids in keeping them out of the js directory
    templates: 'templates',
    views: 'views'
  },
  shim: {
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
    }
  }
});

// Let's kick off the application

require([
  'views/app',
  'vm',
  'utils'
], function(AppView, Vm, Utils){

  Utils.setupOldBrowser();

  var _mode, _view, _token, _opts, appView
  , config = {
    mode : ["read", "edit", "create"],
    view : ["default", "horizontal", "wizard"]
  };

  if (typeof formSchema === 'undefined') {
    throw 'formSchema is undefined';
  }
  // Cast to lowercase
  Vm.toLower(formSchema);
  if (typeof formData !== 'undefined') {
    Vm.toLower(formData, 'fields');
    _mode = (typeof mode !== 'undefined' && config.mode.indexOf(mode.toLowerCase()) > -1) ? mode.toLowerCase(): 'edit';
  } else {
    _mode = (typeof mode !== 'undefined' && config.view.indexOf(view.toLowerCase()) > -1) ? mode.toLowerCase(): 'create';
  }

  _view = (typeof view !== 'undefined') ? view.toLowerCase(): 'horizontal';
  _token = (typeof token !== 'undefined' && _mode !== 'read') ? token: '';

  _opts = {
    formSchema : formSchema,
    formData : ( (typeof formData === 'undefined') ? {}: formData ),
    mode : _mode,
    token : _token
  };
  // Setup View
  _opts.formSchema.view = _view;

  appView = Vm.create({}, 'AppView', AppView, _opts);
  appView.render();

  // Render Custom Script Here
  if (typeof formEvents !== 'undefined') {
    _.each(formEvents, function(value, key) {
      $('div#app').on(formSchema.name+'.'+key, value);
    });
  }
});
