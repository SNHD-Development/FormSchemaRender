define(["jquery","lodash","backbone","vm","events","text!templates/hiddenForm.html"],function(e,t,n,r,i,s){var o=n.View.extend({el:"body",template:t.template(s),initialize:function(){},events:{},render:function(t){var n=this,r,i;if(typeof t=="string")try{t=e.parseJSON(t)}catch(s){alert("Could not be able to parse the data.");return}t.html?(r=e("<textarea />").html(t.html).text(),console.log(r),i="#snhd-payment-form"):(r=this.template(t),i="#form-render-hidden-form"),e(this.el).append(r),e(i).trigger("submit")}});return o});