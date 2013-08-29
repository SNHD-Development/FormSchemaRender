define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/subform-layouts/buttondecision.html',
], function($, _, Backbone, buttonDecisionTemplate){

	var AppView = Backbone.View.extend({
		template: _.template(buttonDecisionTemplate),

		initialize: function () {

		},

		render: function (data) {
			data = data || null;
			var _opt = {};
			if (data) {
				_opt.data = data;
			}
			if (this.options.name) {
				_opt.name = this.options.name;
			}
			this.$el.after(this.template(_opt));
		},

		events: {

		}
	});

	return AppView;
});
