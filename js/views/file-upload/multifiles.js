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
	  this.template = _.template(uploadTmpl);
	  this.collection = new Backbone.Collection([]);

	  if ( ! $.isEmptyObject(this.options.field.options.visibleon) ) {
		$(this.options.name).on('visibleOnRenderComplete', this.el, { view : this }, this.addEvents);
	  } else {
		// If this field already rendered
	  }
    },
    render: function () {
	  var $renderArea = $('#'+this.options.field.name+'_multifiles_table .files', this.el);
	  $renderArea.html(this.template({ collection : this.collection.toJSON(), convertFileSize : this.convertFileSize }));
    },
	/**
	 * Events
	 **/
	events: {

	},

	/**
	 * Convert File Type
	 **/
	convertFileSize : function (value) {
	  var sOutput;
	  for (var aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], nMultiple = 0, nApprox = value / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
		sOutput = nApprox.toFixed(3) + " " + aMultiples[nMultiple];
	  }
	  return sOutput;
	},

	/**
	 * Setup Events
	 **/
	setupEvents: function (el, view) {
	  $('.fileinput-button', el).on('click', { view : this }, view.clickFileUploadButton);
	  $('.delete', el).on('click', { view : this }, function (e) {
		var view = e.data.view || false;
		view.collection.reset();
		$('#'+view.options.field.name+'_multifiles_table :input.hidden-multi-files').remove();
		view.render();
	  });
	  $('#'+view.options.field.name+'_multifiles', el).on('change', { view : this }, view.changeFileInput);
	  $('#'+view.options.field.name+'_multifiles_table', el).on('click', 'button.cancel', { view : this }, view.removeFile);
	},

	/**
	 * Add all the event
	 **/
	addEvents: function (e) {
	  var view = e.data.view || false;

	  view.setupEvents(this.el, view);
	},

	/**
	 * Click Upload Button
	 **/
	clickFileUploadButton : function (e) {
	  var $currentTarget = $(e.currentTarget)
	  , view = e.data.view || false;
	  $('#'+view.options.field.name+'_multifiles', $currentTarget.parent()).trigger('click');
	},

	/**
	 * File Upload Change
	 **/
	changeFileInput: function (e) {
	  var view = e.data.view || false
	  , $file = $(this);
	  _.each($file.get(0).files, function (element) {
		if (typeof view.collection.findWhere( { name : element.name, size : element.size } ) === 'undefined') {
		  view.collection.add(element);
		  var $fileInput = $('#'+view.options.field.name+'_multifiles').clone()
		  , _model = view.collection.at(view.collection.length-1);
		  $fileInput.attr('id', view.options.field.name+'_'+_model.cid).removeClass('not_sending').addClass('hidden-multi-files').attr('name', view.options.field.name+'[]');
		  $('#'+view.options.field.name+'_multifiles_table').prepend($fileInput);
		}
	  });
	  view.render();
	},

	/**
	 * Remove File
	 **/
	removeFile: function (e) {
	  var view = e.data.view || false
	  , $parent = $(this).parents('.template-upload')
	  , _model = view.collection.findWhere( { name: $parent.find('.name').text(), size : parseInt($parent.find('.size').attr('data-size')) } );
	  view.collection.remove( _model );
	  $('#'+view.options.field.name+'_'+_model.cid).remove();
	  view.render();
	}

  });
});
