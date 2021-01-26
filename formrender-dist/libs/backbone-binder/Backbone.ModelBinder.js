// (c) 2013 Bart Wood

!function(t){"function"==typeof define&&define.amd?define(["underscore","jquery","backbone"],t):t(_,$,Backbone)}(function(t,e,i){if(!i)throw"Please include Backbone.js before Backbone.ModelBinder.js";return i.ModelBinder=function(){t.bindAll(this)},i.ModelBinder.SetOptions=function(t){i.ModelBinder.options=t},i.ModelBinder.VERSION="1.0.2",i.ModelBinder.Constants={},i.ModelBinder.Constants.ModelToView="ModelToView",i.ModelBinder.Constants.ViewToModel="ViewToModel",t.extend(i.ModelBinder.prototype,{bind:function(t,i,n,o){this.unbind(),this._model=t,this._rootEl=i,this._setOptions(o),this._model||this._throwException("model must be specified"),this._rootEl||this._throwException("rootEl must be specified"),n?(this._attributeBindings=e.extend(!0,{},n),this._initializeAttributeBindings(),this._initializeElBindings()):this._initializeDefaultBindings(),this._bindModelToView(),this._bindViewToModel()},bindCustomTriggers:function(t,e,i,n,o){this._triggers=i,this.bind(t,e,n,o)},unbind:function(){this._unbindModelToView(),this._unbindViewToModel(),this._attributeBindings&&(delete this._attributeBindings,this._attributeBindings=void 0)},_setOptions:function(e){this._options=t.extend({},i.ModelBinder.options,e),this._options.modelSetOptions||(this._options.modelSetOptions={}),this._options.modelSetOptions.changeSource="ModelBinder",this._options.changeTriggers||(this._options.changeTriggers={"*":"change","[contenteditable]":"blur"}),this._options.initialCopyDirection||(this._options.initialCopyDirection=i.ModelBinder.Constants.ModelToView)},_initializeAttributeBindings:function(){var e,i,n,o,s;for(e in this._attributeBindings){for(i=this._attributeBindings[e],t.isString(i)?n={elementBindings:[{selector:i}]}:t.isArray(i)?n={elementBindings:i}:t.isObject(i)?n={elementBindings:[i]}:this._throwException("Unsupported type passed to Model Binder "+n),o=0;o<n.elementBindings.length;o++)s=n.elementBindings[o],s.attributeBinding=n;n.attributeName=e,this._attributeBindings[e]=n}},_initializeDefaultBindings:function(){var t,i,n,o,s;for(this._attributeBindings={},i=e("[name]",this._rootEl),t=0;t<i.length;t++)n=i[t],o=e(n).attr("name"),this._attributeBindings[o]?this._attributeBindings[o].elementBindings.push({attributeBinding:this._attributeBindings[o],boundEls:[n]}):(s={attributeName:o},s.elementBindings=[{attributeBinding:s,boundEls:[n]}],this._attributeBindings[o]=s)},_initializeElBindings:function(){var t,i,n,o,s,r,d;for(t in this._attributeBindings)for(i=this._attributeBindings[t],n=0;n<i.elementBindings.length;n++)if(o=i.elementBindings[n],s=""===o.selector?e(this._rootEl):e(o.selector,this._rootEl),0===s.length)this._throwException("Bad binding found. No elements returned for binding selector "+o.selector);else for(o.boundEls=[],r=0;r<s.length;r++)d=s[r],o.boundEls.push(d)},_bindModelToView:function(){this._model.on("change",this._onModelChange,this),this._options.initialCopyDirection===i.ModelBinder.Constants.ModelToView&&this.copyModelAttributesToView()},copyModelAttributesToView:function(e){var i,n;for(i in this._attributeBindings)void 0!==e&&-1===t.indexOf(e,i)||(n=this._attributeBindings[i],this._copyModelToView(n))},copyViewValuesToModel:function(){var t,i,n,o,s,r;for(t in this._attributeBindings)for(i=this._attributeBindings[t],n=0;n<i.elementBindings.length;n++)if(o=i.elementBindings[n],this._isBindingUserEditable(o))if(this._isBindingRadioGroup(o))(r=this._getRadioButtonGroupCheckedEl(o))&&this._copyViewToModel(o,r);else for(s=0;s<o.boundEls.length;s++)r=e(o.boundEls[s]),this._isElUserEditable(r)&&this._copyViewToModel(o,r)},_unbindModelToView:function(){this._model&&(this._model.off("change",this._onModelChange),this._model=void 0)},_bindViewToModel:function(){t.each(this._options.changeTriggers,function(t,i){e(this._rootEl).delegate(i,t,this._onElChanged)},this),this._options.initialCopyDirection===i.ModelBinder.Constants.ViewToModel&&this.copyViewValuesToModel()},_unbindViewToModel:function(){this._options&&this._options.changeTriggers&&t.each(this._options.changeTriggers,function(t,i){e(this._rootEl).undelegate(i,t,this._onElChanged)},this)},_onElChanged:function(t){var i,n,o,s;for(i=e(t.target)[0],n=this._getElBindings(i),o=0;o<n.length;o++)s=n[o],this._isBindingUserEditable(s)&&this._copyViewToModel(s,i)},_isBindingUserEditable:function(t){return void 0===t.elAttribute||"text"===t.elAttribute||"html"===t.elAttribute},_isElUserEditable:function(t){return t.attr("contenteditable")||t.is("input")||t.is("select")||t.is("textarea")},_isBindingRadioGroup:function(t){var i,n,o=t.boundEls.length>0;for(i=0;i<t.boundEls.length;i++)if(n=e(t.boundEls[i]),"radio"!==n.attr("type")){o=!1;break}return o},_getRadioButtonGroupCheckedEl:function(t){var i,n;for(i=0;i<t.boundEls.length;i++)if(n=e(t.boundEls[i]),"radio"===n.attr("type")&&n.attr("checked"))return n},_getElBindings:function(t){var e,i,n,o,s,r=[];for(e in this._attributeBindings)for(i=this._attributeBindings[e],n=0;n<i.elementBindings.length;n++)for(o=i.elementBindings[n],s=0;s<o.boundEls.length;s++)o.boundEls[s]===t&&r.push(o);return r},_onModelChange:function(){var t,e;for(t in this._model.changedAttributes())(e=this._attributeBindings[t])&&this._copyModelToView(e)},_copyModelToView:function(t){var n,o,s,r,d,l;for(d=this._model.get(t.attributeName),n=0;n<t.elementBindings.length;n++)for(o=t.elementBindings[n],s=0;s<o.boundEls.length;s++)r=o.boundEls[s],r._isSetting||(l=this._getConvertedValue(i.ModelBinder.Constants.ModelToView,o,d),this._setEl(e(r),o,l))},_setEl:function(t,e,i){e.elAttribute?this._setElAttribute(t,e,i):this._setElValue(t,i)},_setElAttribute:function(e,n,o){switch(n.elAttribute){case"html":e.html(o);break;case"text":e.text(o);break;case"enabled":e.attr("disabled",!o);break;case"displayed":e[o?"show":"hide"]();break;case"hidden":e[o?"hide":"show"]();break;case"css":e.css(n.cssAttribute,o);break;case"class":var s=this._model.previous(n.attributeBinding.attributeName),r=this._model.get(n.attributeBinding.attributeName);t.isUndefined(s)&&t.isUndefined(r)||(s=this._getConvertedValue(i.ModelBinder.Constants.ModelToView,n,s),e.removeClass(s)),o&&e.addClass(o);break;default:e.attr(n.elAttribute,o)}},_setElValue:function(t,e){if(t.attr("type"))switch(t.attr("type")){case"radio":t.val()===e?t.attr("checked","checked"):t.removeAttr("checked");break;case"checkbox":e?t.attr("checked","checked"):t.removeAttr("checked");break;case"file":break;default:t.val(e)}else t.is("input")||t.is("select")||t.is("textarea")?t.val(e||(0===e?"0":"")):t.text(e||(0===e?"0":""))},_copyViewToModel:function(t,n){var o,s,r;n._isSetting||(n._isSetting=!0,o=this._setModel(t,e(n)),n._isSetting=!1,o&&t.converter&&(s=this._model.get(t.attributeBinding.attributeName),r=this._getConvertedValue(i.ModelBinder.Constants.ModelToView,t,s),this._setEl(e(n),t,r)))},_getElValue:function(t,e){switch(e.attr("type")){case"checkbox":return!!e.prop("checked");default:return void 0!==e.attr("contenteditable")?e.html():e.val()}},_setModel:function(t,e){var n={},o=this._getElValue(t,e);return o=this._getConvertedValue(i.ModelBinder.Constants.ViewToModel,t,o),n[t.attributeBinding.attributeName]=o,this._model.set(n,this._options.modelSetOptions)},_getConvertedValue:function(t,e,i){return e.converter&&(i=e.converter(t,i,e.attributeBinding.attributeName,this._model,e.boundEls)),i},_throwException:function(t){if(!this._options.suppressThrows)throw t;console&&console.error&&console.error(t)}}),i.ModelBinder.CollectionConverter=function(e){if(this._collection=e,!this._collection)throw"Collection must be defined";t.bindAll(this,"convert")},t.extend(i.ModelBinder.CollectionConverter.prototype,{convert:function(t,e){return t===i.ModelBinder.Constants.ModelToView?e?e.id:void 0:this._collection.get(e)}}),i.ModelBinder.createDefaultBindings=function(t,i,n,o){var s,r,d,l,a={};for(s=e("["+i+"]",t),r=0;r<s.length;r++)if(d=s[r],l=e(d).attr(i),!a[l]){var h={selector:"["+i+'="'+l+'"]'};a[l]=h,n&&(a[l].converter=n),o&&(a[l].elAttribute=o)}return a},i.ModelBinder.combineBindings=function(e,i){return t.each(i,function(t,i){var n={selector:t.selector};t.converter&&(n.converter=t.converter),t.elAttribute&&(n.elAttribute=t.elAttribute),e[i]?e[i]=[e[i],n]:e[i]=n}),e},i.ModelBinder});