define(["jquery","underscore","backbone","text!templates/modules/userpermissions.html"],function(e,o,n,s){return n.View.extend({template:o.template(s),initialize:function(){},render:function(){return},events:{"click .form-actions .form-modules-add-users":function(e){console.log("*** click on add-user ***"),this.$modalForm.modal("show")},"click #module-userpermissions .form-modules-save":function(e){console.log("*** click on save ***"),this.$modalForm.modal("hide"),this.collection.reset([])}}})});