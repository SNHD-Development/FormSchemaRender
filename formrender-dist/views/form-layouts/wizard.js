define(["jquery","lodash","backbone","vm","utils","events","modelbinder","validation","views/baseField","text!templates/form-layouts/wizard.html","jquery.wizard","bootstrap","jquery.birthdaypicker"],function(t,e,i,a,s,o,n,r,l,d){var c,p=l.extend({_modelBinder:void 0,template:e.template(d),initialize:function(){if(l.prototype.initialize.call(this),this._steps=[],"undefined"==typeof this.options.formSchema)throw"formSchema is not in the options parameters";this.el="#"+this.options.formSchema.name,c=this.options.lang},render:function(){var a,o=this,n=l.prototype.render,r="",d=[],c={};e.each(this.options.formSchema.fields,function(i,p,h){var m="",f=i.type.toLowerCase();return l.prototype.checkShowOnMode.call(o,i,o.options.mode,o.options.formData.status)?(o.options.internal&&"undefined"!=typeof i.options.internalcanupdate&&!i.options.internalcanupdate?"image"===f&&(a=s.checkRequireFields(i,o.options.formSchema.validation),m+=o.renderLabel(i,a)):"undefined"!=typeof i.description&&e.indexOf(o.notRenderLabel,f)===-1?(a=s.checkRequireFields(i,o.options.formSchema.validation),m+=o.renderLabel(i,a)):"step"===f&&o._steps.push(i),m+=n.call(o,i),"create"===o.options.mode&&i.options.copyvaluesfrom&&"list"!==f&&(r+=l.prototype.setupCopyValuesFrom.call(o,i)),i.options.visibleon&&"button"!==f&&"submit"!==f?(m='<div class="options-visible-on-'+i.name+'" style="display:none">'+m+"</div>",d.unshift({value:i,html:m})):r+=m,void(i&&i.name&&i.type&&(c[i.name]=t.trim(i.type.toLowerCase())))):""}),e.each(d,function(t){l.prototype.setupVisibleOn.call(o,t.value,t.html,null,c)}),r+=l.prototype.closeOpenDiv.call(this),r+=l.prototype.closeOpenDiv.call(this,"_stepDiv"),t(this.el).html(this.template(e.extend({html:r,lang:this.options.lang},this.options.formSchema))),this.renderWizardNavBar(),o._modelBinder.bind(o.model,o.el,o.model.bindings),i.Validation.bind(o,{forceUpdate:!0}),this.$formWizard=t(".wizard-view .wizard",this.el),this.$prevBtn=t(".wizard-view .wizard-actions .btn_prev",this.el),this.$nextBtn=t(".wizard-view .wizard-actions .btn_next",this.el),t(".step-content .step-pane .form-actions",this.el).hide(),this.attachedEvents()},renderWizardNavBar:function(){var i,a,s,o,n,r=!1,l="",d=0;e.each(this._steps,function(t,e){t.class=t.class||"",0===e&&(t.class+=" active"),i="undefined"==typeof t.icon?"":'<i class="icon '+t.icon+' icon-3x"></i>',l+='<li data-target="#wizard_step'+(e+1)+'" class="'+t.class+'">'+i+'<span class="badge badge-info">'+(e+1)+"</span>"+t.description+"</li>"}),a=t(".wizard-view ul.steps",this.el).html(l);var c=a.width();if(r&&(console.log("[*] wizard.js: renderWizardNavBar()"),console.log("    this._steps: "+this._steps),console.log(a),console.log("    _width: "+c),console.log("    this._steps.length: "+this._steps.length)),n=t("li",a),c)s=Math.floor((c-this._steps.length)/this._steps.length),o=c-s*this._steps.length-4,n.css("width",s),n.last().css("width",s+o);else{var p=100/this._steps.length;r&&console.log("    _units: "+p),n.css("width",p+"%"),n.last().css("width",p-.5+"%")}r&&(console.log("    _stepWidth: "+s),console.log("    _offset: "+o),console.log("    _stepWidth + _offset: "+(s+o))),n.each(function(){d=Math.max(d,t(this).height())}).height(d)},attachedEvents:function(){this.$prevBtn.on("click",this,this.clickPrev),this.$nextBtn.on("click",this,this.clickNext),this.$formWizard.on("change",this,this.changeStep),this.$formWizard.on("finished",this,this.submittingForm),this.$formWizard.on("stepclick",this,this.stepClicked),t(this.el).on(this.options.formSchema.name+".validated",this,this.validatedForm),t(this.el).on(this.options.formSchema.name+".postSubmit",this,this.respondResult)},clickPrev:function(t){t.data.$formWizard.wizard("previous")},clickNext:function(e){var i=t(e.data.el);s.setModelRadioValues(i,e.data),s.setModelCheckValues(i,e.data),e.data.$formWizard.wizard("next")},stepClicked:function(t,e){switch(e.step){case 1:t.data.$prevBtn.attr("disabled",!0).fadeOut("slow");default:t.data.$nextBtn.removeClass("btn-info").addClass("btn-primary").html('Next <i class="icon-arrow-right"></i>')}},changeStep:function(t,e){var i=t.data._steps.length;if(s.getBDateinput(t.data.el,t.data.model),s.getDefaultValues(t.data.el),"next"===e.direction)if(t.data.isStepValid(e.step-1)){switch(e.step){case 1:if(t.data.$prevBtn.removeAttr("disabled").fadeIn("slow"),2!==i)break;case i-1:var a;switch(c){case"sp":a="Enviar";break;default:a="Submit"}t.data.$nextBtn.removeClass("btn-primary").addClass("btn-info").html('<i class="icon-envelope-alt"></i> '+a)}i!==e.step&&t.data.scrollToTopView(e.step)}else t.preventDefault();else if(t.data.isStepValid(e.step-2))switch(e.step){case 2:if(t.data.$prevBtn.attr("disabled",!0).fadeOut("slow"),2!==i)break;case i:t.data.$nextBtn.removeClass("btn-info").addClass("btn-primary").html('Next <i class="icon-arrow-right"></i>')}else t.preventDefault()},isStepValid:function(i){var a,s,o=this,n=!1;if("undefined"!=typeof this._stepValidated[i]&&(e.each(this._stepValidated[i],function(e){if(s=t(':input[name="'+e+'"]',o.el).removeClass("invalid"),!s.is(":checkbox")&&!s.is(":radio")&&o.model.has(e)){var i=o.model.get(e);if(!i||""===i){var r=s.val();r&&""!==r&&o.model.set(e,r)}}a=o.model.isValid(e),a||(s.addClass("invalid"),n=!0)}),n)){var r={html:!0,placement:"top",trigger:"manual",title:'<i class="icon-edit"></i> Validation Error',content:"Please complete the required fields"};"sp"===this.options.lang&&(r.title='<i class="icon-edit"></i> Error de validaci&oacute;n',r.content="Por favor, corrija la forma"),this.renderErrorPopover(this.$nextBtn,t(this.el),r)}return!n},submittingForm:function(e){var i=t(':submit[type="submit"]',e.data.el),a={html:!0,placement:"top",trigger:"manual",title:"Submitting form; please wait.",content:'<i class="icon-spinner icon-spin icon-large"></i> Sending data ...'},s=t(this).nextUntil("",".wizard-actions").find(".btn_next"),o=t("form.form-render");i.length>1&&(i=t(":submit#SubmitBtn",e.data.el)),i.length>0?i.trigger("click"):o.submit(),o.hasClass("invalid_prevalidation")||o.hasClass("validation_error")||s.attr("disabled",!0).popover(a).popover("show").next(".popover").addClass("success")},validatedForm:function(e){var i=t(e.data.el),a={html:!0,placement:"top",trigger:"manual"};if(i.hasClass("validation_pass")){var s,o;switch(c){case"sp":s="Enviando la forma; por favor espere",o="Cargando Informaci&oacute;n";break;default:s="Submitting form; please wait.",o="Sending data"}a.title=s,a.content='<i class="icon-spinner icon-spin icon-large"></i> '+o+" ...",e.data.$nextBtn.attr("disabled",!0).popover(a).popover("show").next(".popover").addClass("success")}else a.title='<i class="icon-edit"></i> Validation Error',a.content="Please correct the form",e.data.renderErrorPopover(e.data.$nextBtn,i,a)},renderErrorPopover:function(e,i,a){e.attr("disabled",!0).popover(a).popover("show"),window.setTimeout(function(){var a=t(".invalid:first",i);a.is(":checkbox")||a.is(":radio")||a.focus(),e.attr("disabled",!1).popover("destroy"),e.next(".popover").remove()},2e3)},respondResult:function(t){window.setTimeout(function(){"undefined"!=typeof t.data&&"undefined"!=typeof t.data.$nextBtn&&t.data.$nextBtn.attr("disabled",!1).popover("destroy").next(".popover").removeClass("success").remove()},3e3)},scrollToTopView:function(e){var i=t("#wizard_step"+(e+1)).parent();i.length&&t("html, body").animate({scrollTop:i.offset().top-5},1500)}});return p});