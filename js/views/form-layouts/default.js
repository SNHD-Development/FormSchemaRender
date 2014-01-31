/**
 * Default Form Layout (Vertical)
 **/
define([
    'jquery',
    'lodash',
    'backbone',
    'vm',
    'utils',
    'events',
    'modelbinder',
    'validation',
    'views/baseField',
    'text!templates/form-layouts/default.html'
], function($, _, Backbone, Vm, Utils, Events, Modelbinder, Validation, BaseFieldView, formLayoutTemplate) {
    var AppView = BaseFieldView.extend({
        _modelBinder: undefined,
        template: _.template(formLayoutTemplate),
        initialize: function() {
            BaseFieldView.prototype.initialize.call(this);

            if (typeof this.options.formSchema === 'undefined') {
                throw 'formSchema is not in the options parameters';
            }
            this.el = '#' + this.options.formSchema.name;
        },
        render: function() {
            var that = this,
                _required, _parentRender = BaseFieldView.prototype.render,
                _html = '';
            _.each(this.options.formSchema.fields, function(value, key, list) {
                var _temp = '',
                    _typeLowerCase = value.type.toLowerCase();
                // Check for Show On Mode
                if (!BaseFieldView.prototype.checkShowOnMode.call(that, value, that.options.mode, that.options.formData.status)) {
                    return '';
                }

                if (that.options.internal && typeof value.options.internalcanupdate !== 'undefined' && !value.options.internalcanupdate) {} else if (typeof value.description !== 'undefined' && _.indexOf(that.notRenderLabel, _typeLowerCase) === -1) {
                    _required = Utils.checkRequireFields(value, that.options.formSchema.validation);
                    _temp += that.renderLabel(value, _required);
                }
                _temp += _parentRender.call(that, value);

                // If this field has CopyValuesFrom
                if (that.options.mode === 'create' && value.options.copyvaluesfrom) {
                    _html += BaseFieldView.prototype.setupCopyValuesFrom.call(that, value);
                }

                // If this has VisibleOn in options
                if (value.options.visibleon && !(_typeLowerCase === 'button' || _typeLowerCase === 'submit')) {
                    _temp = '<div class="options-visible-on-' + value.name + '" style="display:none">' + _temp + '</div>';
                    BaseFieldView.prototype.setupVisibleOn.call(that, value, _temp);
                } else {
                    _html += _temp;
                }
            });
            // not auto rendering the button
            //_html += BaseFieldView.prototype.renderButton.call(this, this.options.formSchema.formoptions);

            // Closed open div
            _html += BaseFieldView.prototype.closeOpenDiv.call(this);
            $(this.el).html(this.template(_.extend({
                html: _html
            }, this.options.formSchema)));

            // Bind Model
            that._modelBinder.bind(that.model, that.el, that.model.bindings);

            //Debug:: Model Binder for default View
            // console.log(that.model.bindings);

            Backbone.Validation.bind(that, {
                forceUpdate: true
            });
        }
    });
    return AppView;
});