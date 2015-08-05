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
  'views/baseField',
  'text!templates/subform-layouts/table.html',
  'text!templates/notice/confirmation.html',
  'bootstrap'
], function($, _, Backbone, Vm, Utils, Events, BaseField, tableTemplate, popoverTemplate) {

  var DEBUG = false;

  var AppView = Backbone.View.extend({
    template: _.template(tableTemplate),
    popTemplate: _.template(popoverTemplate),

    clean: function() {
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
      if (this.options && this.options.formSchema && !this.options.formSchema.options) {
        this.options.formSchema.options = {};
      }
      var _options = this.options;
      _.each(this.options.formSchema.fields, function(element) {
        if (element) {
          if (!element.options) {
            element.options = {};
          }
        }
        switch (element.type.toLowerCase()) {
          case 'fieldsetstart':
          case 'fieldsetend':
            return;
        }
        // Need to make sure that do we need to render this or not
        if (!BaseField.prototype.checkShowOnMode.call(that, element, _options.options.mode, _options.options.formData.status)) {
          return;
        }
        // If added Options.ShowOnTable = false, will not show
        if (element.options && element.options.showontable === false) {
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
              _labels[_labels.length - 1] = 'Timestamps';
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

            case 'number':
              var _number;
              if (element.options && element.options.decimals && model[element.name]) {
                _number = (model[element.name] / Math.pow(10, element.options.decimals)).toFixed(element.options.decimals);
              } else {
                _number = model[element.name];
              }
              _values[index].push(_number);
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
        heading: ((typeof this.options.formSchema.options.readmodedescription !== 'undefined') ? this.options.formSchema.options.readmodedescription : this.options.formSchema.name),
        showViewBtn: this.options.formSchema.options.showviewbtn
      }));

      // Set Up Popover
      Utils.setupPopover(this.$el);
    },
    events: {
      'click .subform-read-model': 'readModel',
      'click .subform-edit-model': 'editModel',
      'click .subform-remove-model': 'popoverConfirm',
      'click .popover-action .popover-submit': 'removeModel',
      'click .popover-action .popover-cancel': 'removePopover'
    },
    readModel: function(e) {
      e.preventDefault();
      var _index = $(e.currentTarget, this.el).attr('data-id');

      if (DEBUG) {
        var _debugCollection = this.collection.toJSON();
        console.log('[*] Click on readModel with index = "' + _index + '" found [' + _debugCollection.length + ']');
        console.log(_debugCollection);
        console.log(this.collection.get(_index).toJSON());
      }

      $('.actions .form-view', this.$el.parent('.subform-container')).trigger('click', [this.collection.get(_index), undefined, undefined, true]);
    },
    editModel: function(e) {
      e.preventDefault();
      var _index = $(e.currentTarget, this.el).attr('data-id');

      if (DEBUG) {
        var _debugCollection = this.collection.toJSON();
        console.log('[*] Click on editModel with index = "' + _index + '" found [' + _debugCollection.length + ']');
        console.log(_debugCollection);
        console.log(this.collection.get(_index).toJSON());
      }

      $('.actions .form-view', this.$el.parent('.subform-container')).trigger('click', this.collection.get(_index));
    },
    popoverConfirm: function(e) {
      e.preventDefault();

      var _opt = {
        html: true,
        placement: 'top',
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