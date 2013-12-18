/**
 * Table Collection View Layout
 **/
define([
    'jquery',
    'lodash',
    'backbone',
    'vm',
    'utils',
    'events',
    'text!templates/subform-layouts/table.html',
    'text!templates/notice/confirmation.html',
    'bootstrap'
], function($, _, Backbone, Vm, Utils, Events, tableTemplate, popoverTemplate) {
    var AppView = Backbone.View.extend({
        template: _.template(tableTemplate),
        popTemplate: _.template(popoverTemplate),

        clean: function () {
            // Destroy Popover
            Utils.destroyPopover(this.$el);
        },

        initialize: function() {
            //console.log('=== Display List View ===');
            //console.log(this);
            this.collection.on('reset', this.resetCollection, this);
        },
        render: function() {
            //console.log('=== Render List View ===');
            //console.log(this.collection.toJSON());
            var that = this,
                _labels = [],
                _values = new Array(this.collection.length),
                _models = new Array(this.collection.length),
                _tableHeader;
            _.each(this.options.formSchema.fields, function(element) {
                switch (element.type.toLowerCase()) {
                    case 'fieldsetstart':
                    case 'fieldsetend':
                        return;
                }
                if (element.options && element.options.tabletitle) {
                    _tableHeader = element.options.tabletitle;
                    // Need to Added Popover to this as well
                    _tableHeader = '<a data-content="' + $('<p>' + element.description + '</p>').text() + '" data-original-title="' + element.options.tabletitle + '" data-placement="top" data-toggle="popover" data-trigger="hover" data-html="true">' + _tableHeader + '</a>';
                } else {
                    _tableHeader = element.description;
                }
                _labels.push(_tableHeader);
                _.each(that.collection.models, function(modelObj, index) {
                    var model = modelObj.toJSON(),
                        _fullName;
                    if (typeof _values[index] === 'undefined') {
                        _values[index] = [];
                        _models[index] = modelObj.cid;
                    }
                    switch (element.type.toLowerCase()) {
                        case 'timestamp':
                            _labels[_labels.length - 1] = 'Time';
                            // Convert to Human Readable Time
                            _values[index].push(Utils.getHumanTime(model[element.name]));
                            break;

                        case 'useraccount':
                            _labels[_labels.length - 1] = 'User';
                            _values[index].push(model[element.name]);
                            break;

                        case 'fullname':
                            _fullName = model[element.name + '_fullname_first_name'];
                            if (typeof model[element.name + '_fullname_middle_name'] !== 'undefined') {
                                _fullName += ' ' + model[element.name + '_fullname_middle_name'];
                            }
                            _fullName += ' ' + model[element.name + '_fullname_last_name'];
                            _values[index].push(_fullName);
                            break;

                        case 'booleaninput':
                            var _booleanVal = (model[element.name] === true) ? 'Yes' : ((model[element.name] === false) ? 'No' : '');
                            _values[index].push(_booleanVal);
                            break;

                        default:
                            _values[index].push(model[element.name]);
                    }
                });
            });
            $(this.el).html(this.template({
                labels: _labels,
                values: _values,
                modelId: _models,
                heading: ((typeof this.options.formSchema.options.readmodedescription !== 'undefined') ? this.options.formSchema.options.readmodedescription : this.options.formSchema.name)
            }));

            // Set Up Popover
            Utils.setupPopover(this.$el);
        },
        events: {
            'click .subform-edit-model': 'editModel',
            'click .subform-remove-model': 'popoverConfirm',
            'click .popover-action .popover-submit': 'removeModel',
            'click .popover-action .popover-cancel': 'removePopover'
        },
        editModel: function(e) {
            e.preventDefault();
            var _index = $(e.currentTarget, this.el).attr('data-id');
            $('.actions .form-view', this.$el.parent('.subform-container')).trigger('click', this.collection.get(_index));
        },
        popoverConfirm: function(e) {
            e.preventDefault();

            var _opt = {
                html: true,
                placement: 'bottom',
                trigger: 'manual',
                title: 'Do you want to remove this data?',
                content: this.popTemplate({
                    "id": $(e.currentTarget, this.el).attr('data-id')
                })
            };
            $(e.currentTarget, this.el).popover(_opt).popover('show');
        },
        removeModel: function(e) {
            e.preventDefault();
            var _index = $(e.currentTarget, this.el).attr('data-id');
            this.collection.remove(this.collection.get(_index));
            if (this.collection.length > 0) {
                this.render();
            } else {
                this.$el.html('');
            }
        },
        removePopover: function(e) {
            $('.subform-remove-model', $(e.currentTarget, this.el).parents('.subform-actions')).popover('destroy').next('.popover').remove();
        },
        resetCollection: function(e) {
            this.$el.html('');
        }
    });
    return AppView;
});