define(["jquery","lodash","backbone","vm","utils","events","views/baseField","text!templates/readonly/horizontal.html"],function(e,t,o,i,n,a,r,s){return r.extend({template:t.template(s),initialize:function(){if(r.prototype.initialize.call(this),this._divcontrolgroup=0,void 0===this.options.formSchema)throw"formSchema is not in the options parameters";if(void 0===this.options.formData)throw"formData is not in the options parameters";this.el="#"+this.options.formSchema.name,e(this.el).addClass("form-horizontal")},render:function(){var o=this,i=r.prototype.render,a="";t.each(this.options.formSchema.fields,function(e,s,d){if(!n.shouldRenderShowOnUser(e))return"";var l=e.type.toLowerCase();return n.addFormSubmittedData(e,o),n.isRenderReadMode(o,e)&&n.isRenderVisibleOn(o,e,l)&&r.prototype.checkShowOnMode.call(o,e,"read",o.options.formData.status)?"buttondecision"===l?(a+='<input type="hidden" name="'+e.name+'" id="'+e.name+'_btn_condition" value="'+o.options.formData.fields[e.name]+'"/>',""):(void 0!==e.description&&-1===t.indexOf(o.notRenderLabelRead,l)&&(a+='<div class="control-group">',this._divcontrolgroup++,a+=o.renderLabel(e,!1,"control-label"),a+='<div class="controls">'),a+=i.call(o,e,!0),void(void 0!==e.description&&-1===t.indexOf(o.notRenderLabelRead,l)&&(a+="</div></div>",this._divcontrolgroup--))):""}),a+=r.prototype.closeOpenDiv.call(this),e(this.el).html(this.template(t.extend({html:a},this.options.formSchema)))}})});