define(["jquery","underscore","backbone","text!templates/subform-layouts/buttondecision.html"],function(e,t,n,r){var i=n.View.extend({template:t.template(r),initialize:function(){},render:function(t){t=t||null;var n={},r,i,s;t&&(n.data=t),this.options.name&&(n.name=this.options.name),n._id=(n.name?n.name+"_":"")+"btn_data_selector",r=e("#"+n._id),r.length>0&&r.remove(),this.$el.after(this.template(n)),s=this.$el.next("#"+n._id),i=s.find("button.verified_data"),i.on("click",{$el:this.$el,data:n,buttons:i,table:s,html:i.html(),className:n._id},this.clickConfirm)},clickConfirm:function(n){n.preventDefault(),n.data.buttons.removeAttr("disabled"),n.data.table.find("tr").removeClass("success"),n.data.table.find(".btn-info").addClass("btn-success").removeClass("btn-info").html(n.data.html),n.data.$el.parent().find("."+n.data.className).remove();var r=e(n.currentTarget),i,s,o,u=r.parents("tr").addClass("success").find(':input[type="hidden"]');r.attr("disabled",!0).removeClass("btn-success").addClass("btn-info").html('<i class="icon icon-user"></i> Selected'),t.each(n.data.data.data.hiddenfields,function(t){i=e(':input[name="'+t+'"]'),s=u.filter('[name="'+t+"_data_options_"+r.attr("data-index")+'"]').val(),i.length>0?i.val(s).trigger("change"):(o='<input type="hidden" name="'+t+'" value="'+s+'" class="'+n.data.className+'"/>',n.data.$el.after(o))})}});return i});