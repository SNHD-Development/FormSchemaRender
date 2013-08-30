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
			var _opt = {}, $previousView, $buttons, $table;
			if (data) {
				_opt.data = data;
			}
			if (this.options.name) {
				_opt.name = this.options.name;
			}
			_opt._id = ( (_opt.name) ? _opt.name+'_' : '' ) + 'btn_data_selector';

			$previousView = $('#'+_opt._id);

			if ($previousView.length > 0) {
				$previousView.remove();
			}

			this.$el.after(this.template(_opt));

			$table = this.$el.next('#'+_opt._id);
			$buttons = $table.find('button.verified_data');
			$buttons.on('click', { $el : this.$el, data: _opt, buttons: $buttons, table : $table, html : $buttons.html(), className : _opt._id }, this.clickConfirm);
		},

		clickConfirm: function (e) {
			e.preventDefault();

			e.data.buttons.removeAttr('disabled');
			e.data.table.find('tr').removeClass('success');
			e.data.table.find('.btn-info').addClass('btn-success').removeClass('btn-info').html(e.data.html);
			e.data.$el.parent().find('.'+e.data.className).remove();

			var $currentTarger = $(e.currentTarget)
			, $input, _val, _html
			, $currentInputs = $currentTarger.parents('tr').addClass('success').find(':input[type="hidden"]');

			$currentTarger.attr('disabled', true).removeClass('btn-success').addClass('btn-info').html('<i class="icon icon-user"></i> Selected');

			_.each(e.data.data.data.hiddenfields, function (element) {
				$input = $(':input[name="'+element+'"]');
				_val = $currentInputs.filter('[name="'+element+'_data_options_'+$currentTarger.attr('data-index')+'"]').val();
				if ($input.length > 0) {
					$input.val(_val).trigger('change');
				} else {
					_html = '<input type="hidden" name="'+element+'" value="'+_val+'" class="'+e.data.className+'"/>';
					e.data.$el.after(_html);
				}
			});
		}

	});

	return AppView;
});
