/**
 * Table Collection View Layout
 **/
define(['jquery', 'lodash', 'backbone', 'vm', 'utils', 'events', 'views/baseField', 'text!templates/subform-layouts/table.html', 'text!templates/notice/confirmation.html', 'bootstrap'], function($, _, Backbone, Vm, Utils, Events, BaseField, tableTemplate, popoverTemplate) {
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
      var DEBUG = false;
      // console.log('=== Render List View ===');
      //console.log(this.collection.toJSON());
      if (DEBUG) {
        console.log('[*] render table.js in subform-layouts -');
      }
      if (!this.options) {
        this.options = {};
      }
      if (!this.options.options) {
        this.options.options = {};
      }
      // console.log(this);
      var that = this,
        _labels = [],
        _values = new Array(this.collection.length),
        _models = new Array(this.collection.length),
        _tableHeader,
        _lang = this.options.options.lang,
        _formSchema = this.options.formSchema;
      if (this.options && this.options.formSchema && !this.options.formSchema.options) {
        this.options.formSchema.options = {};
      }
      var _fieldsMap = {};
      if (_formSchema) {
        _.each(_formSchema.fields, function(el) {
          if (!el || !el.name || !el.type || !el.values) {
            return;
          }
          var langKey = 'values-' + _lang;
          _fieldsMap[el.name] = (el[langKey]) ? el[langKey] : el.values;
        });
      }
      var _options = this.options;
      var _userIndex;

      var hasFileElement = false;

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
        // console.log(_lang);
        _labels.push(_tableHeader);
        _.each(that.collection.models, function(modelObj, index) {
          var model = modelObj.toJSON(),
            _fullName;
          if (typeof _values[index] === 'undefined') {
            _values[index] = [];
            _models[index] = modelObj.cid;
          }
          // console.log(model);
          // console.log(that);
          switch (element.type.toLowerCase()) {
            case 'country':
              var _c = Vm.getCountry(model[element.name]);
              if (!_c) {
                _c = model[element.name];
              }
              _values[index].push({
                value: _c
              });
              break;
            case 'timestamp':
              _labels[_labels.length - 1] = 'Timestamps';
              // Convert to Human Readable Time
              _values[index].push({
                value: Utils.getHumanTime(model[element.name])
              });
              break;
            case 'useraccount':
              _userIndex = _labels.length - 1;
              _labels[_userIndex] = 'User';
              _values[index].push({
                value: model[element.name]
              });
              break;
            case 'fullname':
              _fullName = (model[element.name + '_fullname_first_name']) ? model[element.name + '_fullname_first_name'] : '';
              if (typeof model[element.name + '_fullname_middle_name'] !== 'undefined') {
                _fullName += ' ' + model[element.name + '_fullname_middle_name'];
              }
              if (_fullName) {
                _fullName += ' ';
              }
              _fullName += (model[element.name + '_fullname_last_name']) ? model[element.name + '_fullname_last_name'] : '';
              _values[index].push({
                value: _fullName
              });
              break;
            case 'booleaninput':
              var _booleanVal = (model[element.name] === true) ? 'Yes' : ((model[element.name] === false) ? 'No' : '');
              _values[index].push({
                value: _booleanVal
              });
              break;
            case 'number':
              var _number;
              if (element.options && element.options.decimals && model[element.name]) {
                _number = (model[element.name] / Math.pow(10, element.options.decimals)).toFixed(element.options.decimals);
              } else {
                _number = model[element.name];
              }
              _values[index].push({
                value: _number
              });
              break;
            case 'date':
              var _tempDate = model[element.name];
              // console.log('- _tempDate:', _tempDate);
              if (_tempDate && _tempDate.$date) {
                _tempDate = moment(_tempDate.$date);
                if (!_tempDate.isValid()) {
                  throw new Error('Invalid Date in "' + element.name + '" with "' + JSON.stringify(model[element.name]) + '"');
                }
                _tempDate = _tempDate.format('MM/DD/YYYY');
              }
              _values[index].push({
                value: _tempDate
              });
              break;
            case 'file':
              hasFileElement = true;
              var _fileDef = model[element.name];
              // console.log('- _fileDef:', _fileDef);
              if (_fileDef) {
                if (typeof _fileDef === 'string') {
                  // console.log(_fileDef);
                  try {
                    _fileDef = JSON.parse(_fileDef);
                    var fileStr = _fileDef.fileName;
                    if (_fileDef.fileSize) {  // only add the file size if exist to the fileName string
                      fileStr = fileStr + ' (' + Utils.humanFileSize(_fileDef.fileSize) + ')';
                    }
                    _values[index].push({
                      value: fileStr
                    });
                  } catch (e) {
                    // console.log('- e:', e);
                    _values[index].push({
                      value: _fileDef
                    });

                    window.setTimeout(function() {
                      that.render();
                    }, 2000);
                  }
                }
              } else {
                // Default value
                _values[index].push({
                  value: ''
                });
              }
              break;
            default:
              var _defVal = model[element.name];
              if (_fieldsMap && _fieldsMap[element.name] && typeof _fieldsMap[element.name][_defVal] !== 'undefined') {
                _defVal = _fieldsMap[element.name][_defVal];
              }
              _values[index].push({
                value: _defVal
              });
          }
        });
      });

      if (hasFileElement) {
        // console.log('- _values:', _values);
        // debugger
        if (_values && _values[0] && _values[0].length === 1) {
          _values = _.map(_values, function(el) {
            el.hideEdit = true;
            return el;
          });
        }
      }


      // console.log('- _values:', _values);
      $(this.el).html(this.template({
        labels: _labels,
        values: _values,
        modelId: _models,
        heading: ((typeof this.options.formSchema.options.readmodedescription !== 'undefined') ? this.options.formSchema.options.readmodedescription : this.options.formSchema.name),
        showViewBtn: this.options.formSchema.options.showviewbtn,
        addOnly: this.options.formSchema.options.addonly,
        selfOnly: (this.options.formSchema.options.addonly) ? false : this.options.formSchema.options.selfonly,
        currentUser: Utils.getUserIdFormHtml(),
        userIndex: _userIndex
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
      // var DEBUG = true;
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
