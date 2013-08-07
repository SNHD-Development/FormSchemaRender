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

	  $(this.options.name).on('visibleOnRenderComplete', ':input[name="'+this.options.field.name+'"]', { view : this }, this.addEvents);
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

	}

  });
});
