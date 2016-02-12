define(["jquery","underscore","backbone","text!templates/modules/readmodeappendcomment.html","jquery.mask","jquery.purl"],function(e,t,n,r){function a(e){o&&o.error?o.error(e):alert(e)}function f(e){u?u.log(e):alert(e)}var i=!1,s={GET_FORM:"/formproxy",PUT_FORM:"/FormActions/putform"},o,u;return typeof humane!="undefined"&&(o=humane.create({baseCls:"humane-bigbox",timeout:3e3}),o.error=o.spawn({addnCls:"humane-bigbox-error"}),u=humane.create({baseCls:"humane-jackedup",addnCls:"humane-jackedup-success"})),n.View.extend({template:t.template(r),shouldRenderModules:function(){var e=this.options.options;i&&(console.log("[*] readmodeappendcomment.shouldRenderModules"),console.log(this));if(!e.formData||!e.formData._id||e.mode!=="read")return i&&console.log("[x] Not render reason 1"),!1;var t=this.options&&this.options._params?this.options._params:null;return i&&console.log(t),t.internal===e.internal},initialize:function(){if(!this.shouldRenderModules())return;i&&(console.log("[*] readmodeappendcomment.initialize"),console.log(this));var n=this.options.options,r=this;this.currentUser=e("#snhd_user_network_login"),this.currentUser.length?this.currentUser=this.currentUser.text():this.currentUser=null,this.endPoint=t.extend({},s);var o=n.formData._id;t.each(this.endPoint,function(e,t){r.endPoint[t]=e+"?id="+o.$oid})},render:function(t){var n=this;if(!this.shouldRenderModules())return;i&&(console.log("[*] readmodeappendcomment.render"),console.log(this));var r=e(this.options.el);i&&console.log(r);if(!r.length)return;var s=r.find(".form-actions");i&&console.log(s);if(!s.length)return;var o=s.find("#module-append-comment-btn");o.length||(s.append(this.template()),o=s.find("#module-append-comment-btn"),this._modal=s.find("#module-append-comment-modal").modal({backdrop:"static",show:!1,keyboard:!1}));if(!o.length)throw new Error('Could not be able to find the "#module-append-comment-btn" button.');i&&console.log(o)},events:{"blur #append-comment":function(t){i&&console.log("[*] readmodeappendcomment.blur on #module-append-comment-modal #append-comment");var n=e(t.currentTarget);i&&console.log(n);var r=n.val();r?n.removeClass("invalid"):n.addClass("invalid")},"click #module-append-comment-btn":function(e){return e.preventDefault(),i&&console.log("[*] readmodeappendcomment.click on #module-append-comment-btn"),this._modal.modal("toggle"),!1},"click #module-append-comment-modal .btn-danger":function(t){t.preventDefault(),i&&console.log("[*] readmodeappendcomment.click on #module-append-comment-modal .btn-danger"),this._modal.modal("hide");var n=e(this.options.el).find("#module-append-comment-modal");return n.find("#append-comment").removeClass("invalid"),!1},"click #module-append-comment-modal .btn-success":function(n){var r=this,s=this.options._params.internal;n.preventDefault(),i&&console.log("[*] readmodeappendcomment.click on #module-append-comment-modal .btn-success");var o=e(this.options.el).find("#module-append-comment-modal");i&&console.log(o);var u=o.find("#append-comment"),l=u.val();if(!l){u.trigger("blur");return}i&&(console.log("- Text Area Value"),console.log(l));if(this._ajax)return;this._ajax=!0;var c=o.find(".btn");c.attr("disabled",!0),o.mask();var h=function(){r._ajax=!1,c.removeAttr("disabled"),o.unmask()};return e.ajax({url:this.endPoint.GET_FORM,type:"GET",cache:!1,success:function(n,o,u){console&&console.log&&console.log(arguments);if(!n){a("Could not be able to find the form!"),h();return}var c;try{c=JSON.parse(n);if(!t.isObject(c))throw new Error("Invalid Data Type!")}catch(p){console&&console.error&&console.error(p),a("Could not be able to parse JSON file!"),h();return}var d=s?c.InternalFields:c.Fields;!d&&s&&(d={});var v=s?"Comments_internal":"Comments";if(!d.Comments||!t.isArray(d.Comments))d.Comments=[];var m=(new Date).getTime();d.Comments.push({TimeComment:Math.floor(m/1e3),UserAccount:r.currentUser,Comment:l}),i&&console.log(d.Comments);var n={};n[v]=JSON.stringify(d.Comments),i&&console.log(n),e.ajax({url:r.endPoint.PUT_FORM,type:"PUT",data:n,cache:!1,success:function(e,t,n){f("Comment added!"),setTimeout(function(){location.reload(!0)},1e3)},error:function(e,t,n){console&&console.error&&console.error(arguments),a("Error: Could not be able to insert new comment!"),h()}})},error:function(e,t,n){console&&console.error&&console.error(arguments),a("Error: Please try again!"),h()}}),!1}}})});