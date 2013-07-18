/**
 * SubForm Layout
 **/
define([
  'jquery',
  'lodash',
  'backbone',
  'models/model',
  'modelbinder',
  'validation',
  'vm',
  'events',
  'text!templates/subform-layouts/default.html'
], function($, _, Backbone, Model, Modelbinder, Validation, Vm, Events
	, subFormLayoutTemplate
	){
  return Backbone.View.extend({
	_modelBinder: undefined,
	// Clean Data Binding
	clean: function() {
	  // Unbind Validation
	  Backbone.Validation.unbind(this);

	  if (typeof this._modelBinder !== 'undefined') {
		this._modelBinder.unbind();
	  }
	},
	removeContent : function() {
	  this.$el.html('').removeAttr('class').fadeIn();
	},
	/**
	 * Init List View
	 **/
    initialize: function () {
	  // Setup BB Binder
	  this._modelBinder = new Modelbinder();

	  var _tmp;

	  if (typeof this.options.model === 'undefined') {
		this.model = new Model(this.options.formSchema);
		this._btn_title = 'Add';
	  } else {
		this._btn_title = 'Edit';
	  }

	  this.options.formSchema.view = this.options.formSchema.view || '';
	  // Load Correct SubView Render
	  switch (this.options.formSchema.view.toLowerCase()) {
		default:
		  _tmp = subFormLayoutTemplate;
		  break;
	  }
	  this.template = _.template(_tmp);
    },
    render: function () {
	  var that = this;
	  // Render Fields
	  require(['views/baseField'], function (BaseField) {
        var _html = ''
		  , formView = Vm.create(that, 'BaseField', BaseField, { formSchema: that.options.formSchema });
		_.each(that.options.formSchema.fields, function(value, key, list) {
		  if (typeof value.description !== 'undefined' && _.indexOf(that.notRenderLabel, value.type.toLowerCase()) === -1) {
			_html += formView.renderLabel(value);
		  }
		  _html += formView.render(value);
		});
		var _btn_opts = _.clone(that.options.formSchema.formoptions);
		_btn_opts.submitbutton = that._btn_title;
		_btn_opts.subForm = true;
		_html += formView.renderButton(_btn_opts);
		$(that.el).html(that.template(_.extend({html : _html}, that.options.formSchema)));

		// Bind Model
		that._modelBinder.bind(that.model, that.el);
		Backbone.Validation.bind(that, {forceUpdate: true});
      });
    },
	/**
	 * Events
	 **/
	events: {
	  'click div.form-actions .btn-submit' : 'sendForm',
	  'click div.form-actions .btn-cancel' : 'clickCancel',
	  'blur :input:not(:button)' : 'preValidate'
	},
	preValidate: function(e) {
	  e.stopPropagation();
	  var $e = $(e.currentTarget)
	  , _name = $e.attr('name')
	  , _val = $.trim($e.val());
	  $e.val(_val).trigger('change');
	  if (this.model.isValid(_name, _val)) {
		$e.removeClass('invalid');
	  } else {
		$e.addClass('invalid');
	  }
	},
	sendForm: function(e) {
	  e.preventDefault();
	  var _submitBtn = $('.form-actions .btn-submit', this.$el);
	  if (_submitBtn.hasClass('submitted')) {
		return;
	  }
	  _submitBtn.addClass('submitted');

	  if (this.model.isValid(true)) {
		// Add Model to the parent
		_submitBtn.removeClass('submitted');
		this.$el.trigger(this.options.formId+'.add', this);
	  } else {
		// Error Message
		var _opt = {
          html : true,
          placement: 'top',
          trigger: 'manual',
          title: '<i class="icon-edit"></i> Validation Error',
          content: 'Please correct the form'
        };
		_submitBtn.popover(_opt).popover('show');

		window.setTimeout(
		  function() {
			_submitBtn.removeClass('submitted').popover('destroy');
			_submitBtn.next('.popover').remove();
		  }, 2000 );
	  }
	},
	clickCancel: function(e) {
	  e.preventDefault();
	  this.$el.trigger(this.options.formId+'.close', this);
	},
  });
});
