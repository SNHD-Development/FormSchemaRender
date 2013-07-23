/**
 * Horizontal Read Mode Layout
 **/
define([
  'jquery',
  'lodash',
  'backbone',
  'vm',
  'events',
  'views/baseField',
  'text!templates/readonly/horizontal.html'
], function($, _, Backbone, Vm, Events, BaseFieldView, readLayoutTemplate){
  var AppView = BaseFieldView.extend({
    template: _.template(readLayoutTemplate),
    initialize: function () {
	  BaseFieldView.prototype.initialize.call(this);

	  this._divcontrolgroup = 0;	// init div counter

	  if (typeof this.options.formSchema === 'undefined') {
		throw 'formSchema is not in the options parameters';
	  }
	  if (typeof this.options.formData === 'undefined') {
		throw 'formData is not in the options parameters';
	  }
	  this.el = '#'+this.options.formSchema.name;
	  $(this.el).addClass('form-horizontal');
    },
    render: function () {
		var that = this
		, _parentRender = BaseFieldView.prototype.render
		, _html = '';
	  _.each(this.options.formSchema.fields, function(value, key, list) {
		if (typeof value.description !== 'undefined' && _.indexOf(that.notRenderLabel, value.type.toLowerCase()) === -1) {
			_html += '<div class="control-group">';
			this._divcontrolgroup++;
			_html += that.renderLabel(value, false, 'control-label');
			_html += '<div class="controls">';
		}
		_html += _parentRender.call(that, value, true);
		if (typeof value.description !== 'undefined' && _.indexOf(that.notRenderLabel, value.type.toLowerCase()) === -1) {
			_html += '</div></div>';
			this._divcontrolgroup--;
		}
	  });
	  // not auto rendering the button
	  //_html += BaseFieldView.prototype.renderButton.call(this, this.options.formSchema.formoptions);

	  // Closed open div
	  _html += BaseFieldView.prototype.closeOpenDiv.call(this);
      $(this.el).html(this.template(_.extend({html : _html}, this.options.formSchema)));
    }
  });
  return AppView;
});
