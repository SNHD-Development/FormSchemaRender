/**
 * File-Upload Layout
 **/
define([
	'jquery',
	'lodash',
	'backbone',
	'models/model',
	'modelbinder',
	'validation',
	'vm',
	'utils',
	'events',
	'text!templates/file-upload/template-upload.html',
	'text!templates/file-upload/template-download.html'
], function($, _, Backbone, Model, Modelbinder, Validation, Vm, Utils, Events
	, uploadTmpl
	, downloadTmpl
	){
  return Backbone.View.extend({
	/**
	 * Init File Upload View
	 **/
    initialize: function () {
	  this.el = '#'+this.options.field.name+'_multifiles_wrapper';

	  if ( ! $.isEmptyObject(this.options.field.options.visibleon) ) {
		$(this.options.name).on('visibleOnRenderComplete', this.el, { view : this }, this.addEvents);
	  } else {
		// If this field already rendered
	  }
    },
    render: function () {

    },
	/**
	 * Events
	 **/
	events: {

	},

	/**
	 * Add all the event
	 **/
	addEvents: function (e) {
	  var view = e.data.view || false;
	}

  });
});
