define(["jquery","lodash","backbone","vm","utils","events","views/baseField","text!templates/readonly/horizontal.html"],function(e,t,n,r,i,s,o,u){var a=o.extend({template:t.template(u),initialize:function(){o.prototype.initialize.call(this),this._divcontrolgroup=0;if(typeof this.options.formSchema=="undefined")throw"formSchema is not in the options parameters";if(typeof this.options.formData=="undefined")throw"formData is not in the options parameters";this.el="#"+this.options.formSchema.name,e(this.el).addClass("form-horizontal")},render:function(){var n=this,r=o.prototype.render,s="";t.each(this.options.formSchema.fields,function(e,u,a){var f=e.type.toLowerCase();if(!i.isRenderReadMode(n,e))return"";if(e.options.visibleon&&f!=="html"&&e.options.visibleon.values.indexOf(n.options.formData.fields[e.options.visibleon.name])===-1)return"";if(!o.prototype.checkShowOnMode.call(n,e,"read",n.options.formData.status))return"";if(f==="buttondecision")return s+='<input type="hidden" name="'+e.name+'" id="'+e.name+'_btn_condition" value="'+n.options.formData.fields[e.name]+'"/>',"";typeof e.description!="undefined"&&t.indexOf(n.notRenderLabelRead,f)===-1&&(s+='<div class="control-group">',this._divcontrolgroup++,s+=n.renderLabel(e,!1,"control-label"),s+='<div class="controls">'),s+=r.call(n,e,!0),typeof e.description!="undefined"&&t.indexOf(n.notRenderLabelRead,f)===-1&&(s+="</div></div>",this._divcontrolgroup--)}),s+=o.prototype.closeOpenDiv.call(this),e(this.el).html(this.template(t.extend({html:s},this.options.formSchema)))}});return a});