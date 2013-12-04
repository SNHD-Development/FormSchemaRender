define([
    'jquery',
    'lodash',
    'backbone',
    'vm',
    'events',
    'text!templates/selectAjaxView.html'
], function($, _, Backbone, Vm, Events, selectAjaxViewTemplate) {
    var AppView = Backbone.View.extend({
        template: _.template(selectAjaxViewTemplate),
        initialize: function() {},
        events: {
            "click button.action-submit": "submitData"
        },
        render: function(data) {
            if (!this.collection.length) {
                // If this does not have any data no need to render
                return;
            }

            var $container = this.options.$form.parent().find('#' + this.id),
                _data = {
                    collection: this.collection.toJSON(),
                    title: this.options.title
                },
                $input = this.options.$input,
                _input_callback = this.options.input_callback;

            if ($container.length) {
                $container.remove();
            }

            this.$el.html(this.template(_data)).addClass('modal hide fade');

            this.options.$form.after(this.el);

            $container = this.options.$form.parent().find('#' + this.id);
            $container.modal({
                backdrop: "static",
                keyboard: false
            });

            $container.one('hidden', function() {
                $input.one('change', _input_callback);
            });

        },

        // Events
        submitData: function(e) {
            e.preventDefault();
            var $checked = this.$el.find('.form-select input:checked'),
                $container = this.options.$form.parent().find('#' + this.id),
                that = this;

            if ($checked.length) {
                var tmpData = [];
                $checked.each(function(index, element) {
                    // Need to update the list
                    tmpData.push(that.collection.at($(element).val()).toJSON());
                });
                $('#subform_' + that.options.listName, that.options.$form).trigger('subform_' + that.options.listName + '.ajaxUpdate', [tmpData]);
            }

            $container.modal('hide');
        }
    });
    return AppView;
});