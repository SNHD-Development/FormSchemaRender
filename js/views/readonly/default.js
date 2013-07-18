/**
 * Default Read Mode Layout
 **/
define([
  'jquery',
  'lodash',
  'backbone',
  'vm',
  'events',
  'views/baseField',
  'text!templates/readonly/default.html'
], function($, _, Backbone, Vm, Events, BaseFieldView, readLayoutTemplate){
  var AppView = BaseFieldView.extend({
    template: _.template(readLayoutTemplate),
    initialize: function () {
	  BaseFieldView.prototype.initialize.call(this);

	  if (typeof this.options.formSchema === 'undefined') {
		throw 'formSchema is not in the options parameters';
	  }
	  if (typeof this.options.formData === 'undefined') {
		throw 'formData is not in the options parameters';
	  }
	  this.el = '#'+this.options.formSchema.name;
    },
    render: function () {
		var that = this
		, _parentRender = BaseFieldView.prototype.render
		, _html = '';
	  _.each(this.options.formSchema.fields, function(value, key, list) {
		if (typeof value.description !== 'undefined' && _.indexOf(that.notRenderLabel, value.type.toLowerCase()) === -1) {
		  _html += that.renderLabel(value);
		}
		_html += _parentRender.call(that, value, true);
	  });
	  // not auto rendering the button
	  //_html += BaseFieldView.prototype.renderButton(this.options.formSchema.formoptions);

	  // Closed open div
	  _html += BaseFieldView.prototype.closeOpenDiv();
      $(this.el).html(this.template(_.extend({html : _html}, this.options.formSchema)));
    }
  });
  return AppView;
});
