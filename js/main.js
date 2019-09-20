/**
 * Form Render
 * https://github.com/SNHD-Development/FormSchemaRender
 *
 * Copyright (c) 2013 SNHD
 * Licensed under the MIT license.
 *
 * Version 0.2.0
 **/
require.config({
  paths: {
    // Major libraries
    jquery: "libs/jquery/jquery-min",
    underscore: "libs/underscore/underscore-min", // https://github.com/amdjs
    lodash: "libs/lodash/lodash", // alternative to underscore
    backbone: "libs/backbone/backbone-min", // https://github.com/amdjs
    bootstrap: "libs/bootstrap/bootstrap",
    json: "libs/json/json3.min",
    moment: "libs/moment",
    humane: "libs/humane.min",
    // Backbone Plugin
    modelbinder: "libs/backbone-binder/Backbone.ModelBinder.min",
    validation: "libs/backbone-validation/backbone-validation-amd",
    // xhr
    xdr: "libs/xhr/jquery.xdomainrequest.min",
    Spinner: "libs/spin.min",
    // Java Loader
    jloader: "libs/javaloader/deployJava",
    // jQuery Plugin
    "jquery.expose": "libs/jquery-tools/toolbox.expose",
    "jquery.overlay": "libs/jquery-tools/jquery.tools.overlay.min",
    "jquery.dateinput": "libs/jquery-tools/jquery.tools.dateinput.min",
    "jquery.ajaxsubmit": "libs/jquery-form-plugin/jquery.form.min",
    "jquery.placeholder": "libs/jquery-form-plugin/jquery.placeholder",
    "jquery.birthdaypicker": "libs/jquery-form-plugin/bdate-picker",
    "jquery.wizard": "libs/fuelux/wizard",
    "jquery.spinner": "libs/fuelux/spinner",
    "jquery.lightbox": "libs/lightbox/lightbox-2.6",
    "jquery.zclip": "libs/copy/jquery.zclip.min",
    "jquery.select2": "libs/select2/select2.min",
    "jquery.stupidtable": "libs/jquery/stupidtable.min",
    "jquery.timepicker": "libs/jquery/jquery.timepicker.min",
    "jquery.purl": "libs/purl",
    "jquery.mask": "libs/jquery-form-plugin/jquery.loadmask.spin",
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
    "jquery.datepicker": "libs/bootstrap-datepicker/bootstrap-datepicker",
    cropper: "libs/images/cropper",
    webcam: "libs/webcam/webcam",
    // Require.js plugins
    text: "libs/require/text",
    // Just a short cut so we can put our html outside the js dir
    // When you have HTML/CSS designers this aids in keeping them out of the js directory
    templates: "templates",
    views: "views"
  },
  shim: {
    bootstrap: {
      deps: ["jquery"]
    },
    "jquery.expose": {
      deps: ["jquery", "bootstrap"],
      exports: "jQuery.expose"
    },
    "jquery.overlay": {
      deps: ["jquery", "bootstrap"],
      exports: "jQuery.overlay"
    },
    "jquery.dateinput": {
      deps: ["jquery", "bootstrap"],
      exports: "jQuery.dateinput"
    },
    "jquery.datepicker": {
      deps: ["jquery", "bootstrap"],
      exports: "jQuery.datepicker"
    },
    "jquery.timepicker": {
      deps: ["jquery", "bootstrap"],
      exports: "jQuery.timepicker"
    },
    "jquery.wizard": {
      deps: ["jquery", "bootstrap"],
      exports: "jQuery.wizard"
    },
    "jquery.spinner": {
      deps: ["jquery", "bootstrap"],
      exports: "jQuery.spinner"
    },
    "jquery.ajaxsubmit": {
      deps: ["jquery", "bootstrap"],
      exports: "jQuery.ajaxSubmit"
    },
    "jquery.placeholder": {
      deps: ["jquery", "bootstrap"],
      exports: "jQuery.placeholder"
    },
    "jquery.birthdaypicker": {
      deps: ["jquery", "bootstrap"],
      exports: "jQuery.birthdaypicker"
    },
    "jquery.lightbox": {
      deps: ["jquery", "bootstrap"],
      exports: "jQuery.lightbox"
    },
    "jquery.zclip": {
      deps: ["jquery", "bootstrap"],
      exports: "jQuery.zclip"
    },
    "jquery.stupidtable": {
      deps: ["jquery"],
      exports: "jQuery.stupidtable"
    },
    "jquery.purl": {
      deps: ["jquery"],
      exports: "jQuery.purl"
    },
    "jquery.mask": {
      deps: ["Spinner", "jquery"],
      exports: "jQuery.mask"
    },
    "jquery.select2": ["jquery"],
    webcam: ["jquery"],
    cropper: ["jquery"],
    xdr: ["jquery"]
  }
});
// Let's kick off the application
require(["jquery", "views/app", "vm", "utils", "libs/date", "moment"], function(
  $,
  AppView,
  Vm,
  Utils
) {
  // Prevent IE 9 and Below for console object
  if (!window.console) window.console = {};
  if (!window.console.log) window.console.log = function() {};
  $(function() {
    Utils.setupOldBrowser();
    var _formEvents = {};
    var _mode,
      _view,
      _token,
      _opts,
      appView,
      config = {
        mode: ["read", "update", "create"],
        view: ["default", "horizontal", "wizard"]
      },
      lang = typeof language === "undefined" ? "en" : language;
    if (typeof formSchema === "undefined") {
      throw "formSchema is undefined";
    }
    // Cast to lowercase
    Vm.toLower(formSchema);

    // Set the View Property
    _view = typeof view !== "undefined" ? view.toLowerCase() : "horizontal";
    // Change the Languages
    if (lang && lang !== "en") {
      Vm.changeLanguage(formSchema.fields, lang);
    }
    if (typeof formData !== "undefined") {
      Vm.toLower(formData, ["fields", "internalfields"]);
      _mode =
        typeof mode !== "undefined" &&
        config.mode.indexOf(mode.toLowerCase()) > -1
          ? mode.toLowerCase()
          : "update";
      if (_mode === "update") {
        Vm.decodeHtml(formData);
      }
      if (typeof formData.internalfields !== "undefined") {
        formData.fields = _.extend(formData.fields, formData.internalfields);
        delete formData.internalfields;
      }

      // console.log('- formData:', formData);
      if (
        formSchema &&
        formSchema.formsadminappendexternalcreateuservalues &&
        formData.externalcreateuserdata
      ) {
        // Let Do This!!!
        try {
          formData.externalcreateuserdata = jQuery.parseJSON(
            formData.externalcreateuserdata
          );

          var userData = formData.externalcreateuserdata;
          var fullNameTokens = [];

          if (userData.LastName) {
            userData.LastName = $.trim(userData.LastName);
            fullNameTokens.push(userData.LastName + ",");
          }
          if (userData.FirstName) {
            userData.FirstName = $.trim(userData.FirstName);
            fullNameTokens.push(userData.FirstName);
          }
          if (userData.MiddleName) {
            userData.MiddleName = $.trim(userData.MiddleName);
            fullNameTokens.push(userData.MiddleName);
          }
          if (userData.Username) {
            userData.UsernameLower = $.trim(userData.Username).toLowerCase();
          }

          userData.fullName =
            fullNameTokens && fullNameTokens.length
              ? fullNameTokens.join(" ")
              : "";
          // console.log('- fullNameTokens:', fullNameTokens);
          // console.log('- userData.fullName:', userData.fullName);
        } catch (e) {
          console.log("[x] could not parse this json string!");
          console.log(e);
          formData.externalcreateuserdata = null;
        }
      }
    } else {
      _mode =
        typeof mode !== "undefined" && config.view.indexOf(_view) > -1
          ? mode.toLowerCase()
          : "create";
    }
    _token = typeof token !== "undefined" && _mode !== "read" ? token : "";
    // Merge formEvents with the Key if Existed
    // formEvents from global scope take precedent
    if (formSchema.events) {
      if (typeof formEvents === "undefined") {
        formEvents = {};
      }
      _.each(formSchema.events, function(value, key) {
        if (!formEvents[key]) {
          eval("formEvents[key]=" + value);
        }
      });
    }
    var debugEvents = false;
    // Render Custom Script Here
    if (typeof formEvents !== "undefined") {
      if (debugEvents) {
        console.log("*** Found formEvents ***");
        console.log("- formSchema.name:", formSchema.name);
      }
      _.each(formEvents, function(value, key) {
        // console.log(arguments)
        if (debugEvents) {
          console.log("- attached event:", key);
        }
        _formEvents[key] = value;
        $("div#app").on(
          formSchema.name + "." + key,
          {
            Utils: Utils,
            event: value
          },
          value
        );
      });
    }
    // Set Up Parameters
    _opts = {
      formSchema: formSchema,
      formData: typeof formData === "undefined" ? {} : formData,
      mode: _mode,
      token: _token,
      internal: typeof internal === "undefined" ? false : internal,
      hideButtons: typeof hideButtons === "undefined" ? false : hideButtons,
      lang: lang,
      formEvents: _formEvents
    };
    if (typeof formActionUrl !== "undefined") {
      _opts.formActionUrl = formActionUrl;
    }
    // Send beforeRender Event
    $("div#app").trigger(_opts.formSchema.name + ".init", _opts);
    // Clean Up Global Object
    formSchema = null;
    formData = null;
    mode = null;
    view = null;
    token = null;
    internal = null;
    formEvents = null;
    hideButtons = null;
    formActionUrl = null;
    // Setup View
    _opts.formSchema.view = _view;
    // Check Browser
    Utils.checkBrowser();
    try {
      appView = Vm.create({}, "AppView", AppView, _opts);
      var _loadingText;
      switch (lang) {
        case "sp":
          _loadingText = "Bajando Informaci&oacute;n";
          break;
        default:
          _loadingText = "Loading Form Information";
      }
      $(appView.el).html(
        '<p class="data-loader" style="text-align:center;margin: 20px;"><i class="icon-spinner icon-spin icon-large"></i> <span class="text-info">' +
          _loadingText +
          " ...</span></p>"
      );
      // Render Modules
      // Pending Modules
      if (_opts.formSchema.modules) {
        var _collection = Backbone.Collection.extend({});
        _.each(_opts.formSchema.modules, function(enable, module) {
          if (!enable) {
            return;
          }
          var _module = module.toLowerCase();
          // Load Modules
          try {
            require(["views/modules/" + _module], function(ModuleView) {
              var moduleView = Vm.create(appView, module + "View", ModuleView, {
                el: appView.el,
                collection: new _collection(),
                options: appView.options,
                _params: enable ? enable : null
              });
              $("div#app").on(
                _opts.formSchema.name + ".renderCompleted",
                function() {
                  moduleView.render();
                }
              );
            });
          } catch (err) {
            alert("Cannot load module " + '"' + module + '", Error: ' + err);
          }
        });
      }
      // Wait for the Module to attached
      setTimeout(function() {
        appView.render();
        // Attach Global Event
        /*$("body").on("change", ".form-render :input.timepicker", function(e) {
          var $this = $(this);
          var value = $this.val();
          console.log('- $this:', $this, ': value=', value);
        });*/
      }, 800);
    } catch (err) {
      Utils.renderError(appView.$el, err);
    }
  });
});
