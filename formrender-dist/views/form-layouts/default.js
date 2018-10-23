define(["jquery","lodash","backbone","vm","utils","events","modelbinder","validation","views/baseField","text!templates/form-layouts/default.html"],function(e,t,o,i,n,a,l,s,r,d){return r.extend({_modelBinder:void 0,template:t.template(d),initialize:function(){if(r.prototype.initialize.call(this),void 0===this.options.formSchema)throw"formSchema is not in the options parameters";this.el="#"+this.options.formSchema.name},render:function(){var i,a=this,l=r.prototype.render,s="",d=[],p={};t.each(this.options.formSchema.fields,function(o,m,c){var h="",u=o.type.toLowerCase();return n.shouldRenderShowOnUser(o)&&r.prototype.checkShowOnMode.call(a,o,a.options.mode,a.options.formData.status)?(a.options.internal&&void 0!==o.options.internalcanupdate&&!o.options.internalcanupdate?"image"===u&&(i=n.checkRequireFields(o,a.options.formSchema.validation),h+=a.renderLabel(o,i)):void 0!==o.description&&-1===t.indexOf(a.notRenderLabel,u)&&(i=n.checkRequireFields(o,a.options.formSchema.validation),h+=a.renderLabel(o,i)),h+=l.call(a,o),"create"===a.options.mode&&o.options.copyvaluesfrom&&"list"!==u&&(s+=r.prototype.setupCopyValuesFrom.call(a,o)),o.options.visibleon&&"button"!==u&&"submit"!==u?(h='<div class="options-visible-on-'+o.name+'" style="display:none">'+h+"</div>",d.unshift({value:o,html:h})):s+=h,void(o&&o.name&&o.type&&(p[o.name]=e.trim(o.type.toLowerCase())))):""}),t.each(d,function(e){r.prototype.setupVisibleOn.call(a,e.value,e.html,null,p)}),s+=r.prototype.closeOpenDiv.call(this),e(this.el).html(this.template(t.extend({html:s},this.options.formSchema))),a._modelBinder.bind(a.model,a.el,a.model.bindings),o.Validation.bind(a,{forceUpdate:!0})}})});