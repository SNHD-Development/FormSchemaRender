define(["jquery","lodash","backbone","vm","events","text!templates/selectAjaxView.html"],function(t,i,e,o,n,s){return e.View.extend({template:i.template(s),initialize:function(){},events:{"click button.action-submit":"submitData"},render:function(t){if(this.collection.length){var i=this.options.$form.parent().find("#"+this.id),e={collection:this.collection.toJSON(),title:this.options.title},o=this.options.$input,n=this.options.input_callback;i.length&&i.remove(),this.$el.html(this.template(e)).addClass("modal hide fade"),this.options.$form.after(this.el),i=this.options.$form.parent().find("#"+this.id),i.modal({backdrop:"static",keyboard:!1}),i.one("hidden",function(){o.one("change",n)})}},submitData:function(i){i.preventDefault();var e=this.$el.find(".form-select input:checked"),o=this.options.$form.parent().find("#"+this.id),n=this;if(e.length){var s=[];e.each(function(i,e){s.push(n.collection.at(t(e).val()).toJSON())}),t("#subform_"+n.options.listName,n.options.$form).trigger("subform_"+n.options.listName+".ajaxUpdate",[s])}o.modal("hide")}})});