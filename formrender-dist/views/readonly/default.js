define(["jquery","lodash","backbone","vm","events","views/baseField","text!templates/readonly/default.html"],function(e,t,n,r,i,s,o){var u=s.extend({template:t.template(o),initialize:function(){s.prototype.initialize.call(this);if(typeof this.options.formSchema=="undefined")throw"formSchema is not in the options parameters";if(typeof this.options.formData=="undefined")throw"formData is not in the options parameters";this.el="#"+this.options.formSchema.name},render:function(){var n=this,r=s.prototype.render,i="";t.each(this.options.formSchema.fields,function(e,o,u){if(!s.prototype.checkShowOnMode.call(n,e))return"";typeof e.description!="undefined"&&t.indexOf(n.notRenderLabel,e.type.toLowerCase())===-1&&(i+=n.renderLabel(e,!1)),i+=r.call(n,e,!0)}),i+=s.prototype.closeOpenDiv.call(this),e(this.el).html(this.template(t.extend({html:i},this.options.formSchema)))}});return u});