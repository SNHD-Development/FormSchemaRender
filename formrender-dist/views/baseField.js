define(["jquery","underscore","backbone","bootstrap","events","vm","utils","models/model","modelbinder","validation","views/fields/list","text!data/email.json","text!data/schooles.json","text!templates/fields/html.html","text!templates/fields/label.html","text!templates/fields/text.html","text!templates/fields/password.html","text!templates/fields/telephone.html","text!templates/fields/hidden.html","text!templates/fields/timestamp.html","text!templates/fields/useraccount.html","text!templates/fields/fraction.html","text!templates/fields/booleaninput.html","text!templates/fields/radio.html","text!templates/fields/file.html","text!templates/fields/multifiles.html","text!templates/fields/state.html","text!templates/fields/zipcode.html","text!templates/fields/country.html","text!templates/fields/fullname.html","text!templates/fields/address.html","text!templates/fields/textarea.html","text!templates/fields/number.html","text!templates/fields/email.html","text!templates/fields/date.html","text!templates/fields/select.html","text!templates/fields/check.html","text!templates/fields/birthdate.html","text!templates/fields/button.html","text!templates/fields/buttongroup.html","text!templates/fields/list.html","text!templates/fields/uneditableinput.html","text!templates/fields/uneditablecheck.html","text!templates/fields/uneditabletel.html","text!templates/fields/uneditablefile.html","text!templates/fields/uneditableimage.html","text!templates/fields/buttonclipboard.html","text!templates/subform-layouts/table.html","jquery.expose","jquery.datepicker","jquery.birthdaypicker","bootstrap"],function(e,t,n,r,i,s,o,u,a,f,l,c,h,p,d,v,m,g,y,b,w,E,S,x,T,N,C,k,L,A,O,M,_,D,P,H,B,j,F,I,q,R,U,z,W,X,V,$){return n.View.extend({_modelBinder:undefined,clean:function(){n.Validation.unbind(this),typeof this._modelBinder!="undefined"&&this._modelBinder.unbind()},initialize:function(){var n=this;this._div=0,this._hasUserId=!1,this._hasDate=!1,this._hasBDate=!1,this._hasEmailPicker=!1,this._hasBooleanInput=!1,this._hasRadioBtnGroup=!1,this._hasSelectAllCheckBox=!1,this._hasClearAllCheckBox=!1,this._hasOtherTextBox=!1,this._internalFields=[],this._visibleOn=[],this._multiFiles=[],this._buttonClipboards=[],this._buttonDecision=[],this._ajaxDataCall=[],this._javaUpload=[],this._ajaxSubmit=!0,this._stepDiv=0,this._currentStep=1,this._stepValidated=[],this._modelBinder=new a,this.options.formSchema.validation=this.options.formSchema.validation||{},this.model=new u(t.extend(this.options.formSchema,{is_internal:this.options.internal,render_mode:this.options.mode})),e.isEmptyObject(this.options.formData)||t.each(this.model.attributes,function(e,t){if(typeof e!="object"){var r={};r[t]=n.options.formData.fields[t],n.model.set(r)}}),this.prefixedName={list:"subform_",listdisplayid:"_form_content",collectiondisplayid:"_form_collection"},this.notRenderLabel=["html","list","button","submit","clear","fieldset","fieldsetstart","fieldsetend","step","check","checkbox","timestamp","hidden"],this.notRenderLabelRead=["html","list","button","submit","clear","fieldset","fieldsetstart","fieldsetend","step","check","checkbox"],this.inputTemplate={html:t.template(p),label:t.template(d),text:t.template(v),password:t.template(m),telephone:t.template(g),hidden:t.template(y),timestamp:t.template(b),useraccount:t.template(w),fraction:t.template(E),booleaninput:t.template(S),radio:t.template(x),file:t.template(T),multifiles:t.template(N),state:t.template(C),zipcode:t.template(k),country:t.template(L),fullname:t.template(A),address:t.template(O),textarea:t.template(M),number:t.template(_),email:t.template(D),date:t.template(P),select:t.template(H),check:t.template(B),birthdate:t.template(j),button:t.template(F),buttongroup:t.template(I),list:t.template(q),uneditableinput:t.template(R),uneditablecheck:t.template(U),uneditabletel:t.template(z),uneditablefile:t.template(W),uneditableimage:t.template(X),buttonclipboard:t.template(V),"subform-table":t.template($)};var r={submitbutton:"Submit",resetbutton:"Cancel"};this.options.formSchema.formoptions=t.extend(r,this.options.formSchema.formoptions)||r},getFormValidationData:function(e){return this.options.formSchema.validation=this.options.formSchema.validation||{},typeof this.options.formSchema.validation[e]=="undefined"?{}:this.options.formSchema.validation[e]},closeOpenDiv:function(e){e=e||"_div";var t="",n=0,r=this[e];for(;n<r;++n)t+="</div>";return this._div=0,t},render:function(n,r){var i=this,u="",a=[n.name],f=n.type.toLowerCase(),l="";n.lang=this.options.lang,n.attributes=n.attributes||{},n.options=n.options||{},this.options.formSchema.validation=this.options.formSchema.validation||{},this.options.formData=this.options.formData||{};if(!this.options.internal&&n.options.internal)return"";if((f==="button"||f==="submit")&&!n.options.internal&&this.options.internal)return"";switch(f){case"booleaninput":this._hasBooleanInput=!0;break;case"radio":!this._hasRadioBtnGroup&&n.options.render&&(this._hasRadioBtnGroup=!0),this.options.formData.fields&&this.options.formData.fields[n.name]&&(n._data=this.options.formData.fields[n.name]),n.options.orderby&&this.sortOrderBy(n);break;case"multifiles":(!this.options.internal||typeof n.options.internalcanupdate=="undefined"||!!n.options.internalcanupdate)&&e("form"+this.el).attr("enctype","multipart/form-data"),this._multiFiles.push(n);var p=this.getFormValidationData(n.name+"[]");typeof this._stepValidated[this._currentStep-2]!="undefined"&&!e.isEmptyObject(p)&&this._stepValidated[this._currentStep-2].push(n.name+"[]"),this.options.mode==="read"&&(f="file");break;case"image":n.attributes.accept="image/*";case"file":(!this.options.internal||typeof n.options.internalcanupdate=="undefined"||!!n.options.internalcanupdate)&&e("form"+this.el).attr("enctype","multipart/form-data");var p=this.getFormValidationData(n.name);p.accept&&(n.attributes.accept=p.accept);if(n.options.javaupload){var d={name:n.name,id:n.name,code:"com.elementit.JavaPowUpload.Manager",archive:"//public.southernnevadahealthdistrict.org/assets/jar/jupload/JavaPowUpload.jar, //public.southernnevadahealthdistrict.org/assets/jar/jupload/skinlf.jar, //public.southernnevadahealthdistrict.org/assets/jar/jupload/commons-httpclient.jar, //public.southernnevadahealthdistrict.org/assets/jar/jupload/commons-compress.jar",width:500,height:350,mayscript:"true",alt:"JavaPowUpload by www.element-it.com"};this._javaUpload.push(d)}if(n.options.markdownloaddatetimeof&&this.options.mode&&this.options.mode==="read"){var v=this.options.internal?"internal":"external",m=n.options.markdownloaddatetimeof.toLowerCase();if(m==="*"||m===v)n.attributes["class"]=(n.attributes["class"]?n.attributes["class"]:"")+" btn-auto-refresh ",n.attributes["data-refresh-delay"]||(n.attributes["data-refresh-delay"]="2000")}break;case"userid":this._hasUserId=!0,n.options&&n.options.lookup&&n.options.lookup.url&&(n.options.url=n.options.lookup.url),n.options.url&&(n.attributes["data-url"]=n.options.url),n.options.data&&(n.attributes["data-url-data"]=JSON.stringify(n.options.data)),n.attributes.placeholder=n.attributes.placeholder||"Valid E-mail as Username",n.attributes["class"]=(n.attributes["class"]||"")+" userid-lookup",f=n.options.render?n.options.render.toLowerCase():"text",f==="select"&&(n.values=[]),n.attributes["class"]=o.setupClassAttr(n.attributes["class"],"span12");break;case"fraction":break;case"textbox":f="text";case"selectsingle":f==="selectsingle"&&(f="select");case"select":n.options&&n.options.lookup&&n.options.lookup.url&&(n.options.url=n.options.lookup.url,n.options.lookup.value&&(n.attributes["data-select-key-value"]=n.options.lookup.value),n.options.lookup.text&&(n.attributes["data-select-key-text"]=n.options.lookup.text),this.options.mode==="update"&&this.options.formData.fields[n.name]&&(n.attributes["data-select-value"]=this.options.formData.fields[n.name])),n.options.url&&(n.attributes["data-url"]=n.options.url.replace(/'/ig,"&#39;")),n.options.data&&(n.attributes["data-url-data"]=JSON.stringify(n.options.data)),n.attributes["class"]=o.setupClassAttr(n.attributes["class"],"span12");break;case"checkbox":case"check":if(n.options.numcolumns){if(!t.isNumber(n.options.numcolumns))throw"NumColumns must be a valid number for "+n.name;n.options.numcolumns>4?n.options.numcolumns=4:n.options.numcolumns<1&&(n.options.numcolumns=1)}else n.options.numcolumns=1;!this._hasSelectAllCheckBox&&n.options.addselectall&&(this._hasSelectAllCheckBox=!0),!this._hasClearAllCheckBox&&n.options.addclearall&&(this._hasClearAllCheckBox=!0),n.options.orderby&&this.sortOrderBy(n),n.options.othertextbox&&(this._hasOtherTextBox=!0),this.options.mode==="update"&&this.options.formData.fields&&this.options.formData.fields[n.name]&&(n._data=this.options.formData.fields[n.name]),this.options.formData.fields&&this.options.formData.fields[n.name+"_other"]&&(n._otherValue=this.options.formData.fields[n.name+"_other"]);if(typeof this.options.formSchema.validation[n.name+"[]"]!="undefined"){n._required=!0;var p=this.getFormValidationData(n.name+"[]");typeof this._stepValidated[this._currentStep-2]!="undefined"&&!e.isEmptyObject(p)&&this._stepValidated[this._currentStep-2].push(n.name+"[]")}else n._required=!1;f="check";if(!n.values)throw"In order to use CheckBox, please set Values.";break;case"password":n.attributes["class"]=o.setupClassAttr(n.attributes["class"],"span12");break;case"telephone":n.attributes["class"]=o.setupClassAttr(n.attributes["class"],"integer telephone span12"),this.options.formData.fields&&this.options.formData.fields[n.name+"_provider"]&&(n._providerValue=this.options.formData.fields[n.name+"_provider"]);break;case"textarea":n.attributes["class"]=o.setupClassAttr(n.attributes["class"],"span12");break;case"action":return this._div++,'<div class="form-actions">';case"fieldsetstart":return"<fieldset><legend>"+n.description+"</legend>";case"fieldsetend":return"</fieldset>";case"hr":return"<hr>";case"dateinput":f="date";case"date":if(this.options.formData&&this.options.formData.fields&&typeof this.options.formData.fields[n.name]=="object"){var g=new Date(this.options.formData.fields[n.name].$date),y=g.getMonth()+1;y<10&&(y="0"+y),y+="/";var b=g.getDate();b<10&&(b="0"+b),b+="/",this.options.formData.fields[n.name]=y+b+g.getFullYear()}n.attributes&&!n.attributes.placeholder&&(n.attributes.placeholder="mm/dd/yyyy");if(n.options.render&&n.options.render.toLowerCase()==="select"){f="birthdate",this._hasBDate=!0,n.attributes["class"]=o.setupClassAttr(n.attributes["class"],"birthdaypicker");var p=this.getFormValidationData(n.name),w={id:n.name};n.lang!=="en"&&(w.lang=n.lang),typeof this.options.formData.fields!="undefined"&&(w.defaultdate=this.options.formData.fields[n.name]),n.attributes["data-options"]=JSON.stringify(t.extend(w,p)),typeof this._stepValidated[this._currentStep-2]!="undefined"&&!e.isEmptyObject(p)&&(this._stepValidated[this._currentStep-2].push(n.name+"_birth[month]"),this._stepValidated[this._currentStep-2].push(n.name+"_birth[day]"),this._stepValidated[this._currentStep-2].push(n.name+"_birth[year]"))}else{this._hasDate=!0,n.attributes["class"]=o.setupClassAttr(n.attributes["class"],"datepicker");var p=this.getFormValidationData(n.name);t.each(p,function(e,t){delete p[t],p[t.toLowerCase()]=e}),p.maxdate&&(n.attributes["data-maxdate"]=p.maxdate),p.mindate&&(n.attributes["data-mindate"]=p.mindate)}break;case"email":n.attributes["class"]=o.setupClassAttr(n.attributes["class"],"tolowercase span12"),typeof n.options.autocomplete!="undefined"&&n.options.autocomplete&&(this._hasEmailPicker=!0,n.attributes={},n.attributes["data-provide"]="typeahead",n.attributes.autocomplete="off",n.attributes.style="width:45%;",n.attributes["class"]="not_sending emailpicker_server tolowercase",n.attributes["data-source"]=c.replace(/\n/g,"").replace(/'/g,"&#39"),typeof n.options["default"]!="undefined"&&(n.attributes["data-value"]=n.options["default"]),a.push(n.name+"_username"),a.push(n.name+"_server"));break;case"address":delete n.attributes["class"],delete n.attributes.placeholder,a=[],a.push(n.name+"_address_street"),a.push(n.name+"_address_city"),a.push(n.name+"_address_state"),a.push(n.name+"_address_zip"),a.push(n.name+"_address_country"),typeof r!="undefined"&&typeof this.options.formData!="undefined"?(this.options.formData.fields[n.name+"_address_country"]=s.getCountry(this.options.formData.fields[n.name+"_address_country"]),this.options.formData.fields[n.name+"_address_street"]&&this.options.formData.fields[n.name+"_address_street"].charAt(this.options.formData.fields[n.name+"_address_street"].length-1)!=="."&&(this.options.formData.fields[n.name+"_address_street"]+="."),this.options.formData.fields[n.name+"_address_street"]+="<br>",this.options.formData.fields[n.name+"_address_city"]+=",",this.options.formData.fields[n.name+"_address_state"]+="<br>",this.options.formData.fields[n.name+"_address_zip"]+="<br>"):this.options.mode==="update"&&this.options.formData.fields[n.name+"_address_country"]!=="US"?n.default_value_state=this.options.formData.fields[n.name+"_address_state"]:this.options.mode==="create"&&this.model.set(n.name+"_address_state","NV");if(n.options.zipcodeformat){var E=n.options.zipcodeformat.toLowerCase();switch(E){case"zip+4":n._zipmax=10}}break;case"number":var S;if(!n.options.numbertype||n.options.decimals)S=n.options.decimals?"number":"natural";else if(n.options.numbertype)switch(n.options.numbertype.toLowerCase()){case"currency":S="number";break;case"double":S="rational";break;default:S="natural"}else S="natural";n.attributes["class"]=o.setupClassAttr(n.attributes["class"],S+" span12");if(n.options.decimals&&this.options.formData.fields&&this.options.formData.fields[n.name]){var x=parseFloat(this.options.formData.fields[n.name]/Math.pow(10,parseInt(n.options.decimals)));isNaN(x)||(this.options.formData.fields[n.name]=x.toFixed(2))}typeof n.options.spinner!="undefined"&&n.options.spinner&&(n.attributes["class"]=n.attributes["class"].replace(/ span12/,"","gi"),n.attributes["class"]=o.setupClassAttr(n.attributes["class"],"spinner-input"),this.options.mode==="update"&&this.options.formData.fields[n.name]&&(n.attributes["data-value"]=this.options.formData.fields[n.name]));break;case"fullname":delete n.attributes["class"],delete n.attributes.placeholder,a=[],a.push(n.name+"_fullname_first_name"),(typeof n.options.middlename=="undefined"||n.options.middlename)&&a.push(n.name+"_fullname_middle_name"),a.push(n.name+"_fullname_last_name"),n.options.url&&this._ajaxDataCall.push(n);break;case"clear":f="button",n.attributes["class"]=o.setupClassAttr(n.attributes["class"],"btn btn-clear-form");break;case"submit":n.attributes["class"]=o.setupClassAttr(n.attributes["class"],"btn"),f="button",n._submit=!0,typeof n.url=="undefined"&&(n.url=""),n.options.appendid&&this.options.formData._id&&this.options.formData._id.$oid&&(n.url=(n.url?n.url:"")+(n.url.indexOf("?")>-1?"&id=":"/")+this.options.formData._id.$oid),e(this.el).attr("action",n.url),typeof n.options.ajaxsubmit!="undefined"&&(this._ajaxSubmit=n.options.ajaxsubmit);break;case"buttonclipboard":n.attributes["class"]=o.setupClassAttr(n.attributes["class"],"btn btn-primary"),this._buttonClipboards.push({name:n.name,values:n.values});break;case"buttondecision":r||(n.attributes["class"]=o.setupClassAttr(n.attributes["class"],"btn btn-primary"),f="button",this._buttonDecision.push(n));break;case"button":n.attributes["class"]=o.setupClassAttr(n.attributes["class"],"btn"),n.options.appendid&&this.options.formData._id&&this.options.formData._id.$oid&&(n.url=(n.url?n.url:"")+(n.url.indexOf("?")>-1?"&id=":"/")+this.options.formData._id.$oid);if(n.options.confirmed){var T=n.options.confirmedtext?n.options.confirmedtext:"Please confirm your selection.",N={html:!0,placement:"top",title:'<span class="text-info">'+T+"</span>",content:'<a class="btn btn-success btn-confirmed" data-href="'+n.url+'">Yes</button><a class="btn btn-danger btn-confirmed">No</button>'};n.attributes["data-popover-confirm"]=JSON.stringify(N)}break;case"schooles":f="text",n.attributes["class"]=o.setupClassAttr(n.attributes["class"],"span12"),n.attributes["data-provide"]="typeahead",n.attributes.autocomplete="off",n.attributes["data-source"]=h.replace(/\n/g,"").replace(/'/g,"&#39");break;case"step":if(!("view"in this.options.formSchema&&this.options.formSchema.view==="wizard"))return"";this._stepDiv!==0&&(u+="</div>",this._stepDiv--),typeof this._stepValidated[this._currentStep-1]=="undefined"&&(this._stepValidated[this._currentStep-1]=[]);var C="step-pane"+(this._currentStep===1?" active":"");u+='<div class="'+C+'" id="wizard_step'+this._currentStep+'">',this._stepDiv++,this._currentStep++;break;case"useraccount":n.data_value="",n.options.getvaluefromid&&(n.data_value=e("#"+n.options.getvaluefromid).text());break;case"list":n.attributes.id=this.prefixedName.list+(typeof n.attributes.id!="undefined"?n.attributes.id:n.name),n.attributes["class"]=o.setupClassAttr(n.attributes["class"],"subform-container");var k=typeof this.options.formSchema.validation[n.name]!="undefined"?this.options.formSchema.validation[n.name]:{};this.attachSubFormEvent(n.attributes.id,n,k)}if(f==="button"&&n.options.visibleon){var L=function(t){t.type==="change"&&n.options.visibleon.values.indexOf(e(this).val())>-1?e("#"+n.name,i.el).show("slow"):e("#"+n.name,i.el).hide("slow")};e(this.el).on("change",':input[name="'+n.options.visibleon.name+'"]',L).on("removeVisibleOn",':input[name="'+n.options.visibleon.name+'"]',L)}typeof this._stepValidated[this._currentStep-2]!="undefined"&&f!=="step"&&f!=="list"&&o.checkRequireFields(n,this.options.formSchema.validation)&&t.each(a,function(e){i._stepValidated[i._currentStep-2].push(e)});if(typeof r!="undefined"&&r&&typeof a[0]!="undefined"&&f!=="button"&&f!=="buttonclipboard"){var A="",O="";t.each(a,function(e){typeof i.options.formData.fields[e]!="object"?A+=(typeof i.options.formData.fields[e]!="undefined"?i.options.formData.fields[e]:"")+" ":A=i.options.formData.fields[e]}),typeof A=="string"&&(A=e.trim(A));if(f==="file"||f==="image"){if(f==="image")n.attributes.src=(typeof n.attributes.src!="undefined"?n.attributes.src:"/form/getFile/")+i.options.formData.fields[n.name],O=n.attributes.src;else{n.attributes.target="_blank",n.attributes["class"]=o.setupClassAttr(n.attributes["class"],"btn btn-primary"),n.attributes.href=(typeof n.attributes.href!="undefined"?n.attributes.href:"/form/getFile/")+i.options.formData.fields[n.name];if(n.options.markdownloaddatetimeof&&this.options.formData._id&&this.options.formData._id.$oid){var M=n.options.markdownloaddatetimeof.toLowerCase();if(M==="*"||this.options.internal&&M==="internal"||!this.options.internal&&M==="external")n.attributes.href+="?formid="+this.options.formData._id.$oid}}delete n.attributes.accept,t.each(n.attributes,function(e,t){e.search("'")&&(e=e.replace(/\'/ig,'"')),l+=" "+t+"='"+e+"'"}),u+=i.inputTemplate["uneditable"+f]({value:A,text:n.description,_attr:l,id:n.name,href:O})}else if(f==="list")if(typeof this.options.formData.fields[n.name]!="undefined"&&(this.options.formData.fields[n.name].length>0||t.size(this.options.formData.fields[n.name])>0)){var _=[],D=[],P=[],H={},B=0,j=new Array(this.options.formData.fields[n.name].length||t.size(this.options.formData.fields[n.name]));t.each(n.fields,function(e,r){e.options=e.options||{},_.push(e.description),e.options.sortby&&e.options.sortby.toLowerCase()==="date"?D.push('data-sort="int"'):D.push(e.options.sortby?'data-sort="'+e.options.sortby+'"':'data-sort="string"'),t.each(i.options.formData.fields[n.name],function(n,r){var i;t.isNumber(r)||(H[e.name]?(B++,r=B):(B=0,H[e.name]=!0,r=B)),typeof j[r]=="undefined"&&(j[r]=[],P[r]=[]);if(e.options.sortby&&e.options.sortby.toLowerCase()==="date"){var s=Date.parseString(n[e.name],"M/d/yyyy h:mm:ss a");P[r].push('data-sort-value="'+s.getTime()+'"')}else P[r].push(null);switch(e.type.toLowerCase()){case"timestamp":_[_.length-1]="Time",j[r].push(o.getHumanTime(n[e.name]));break;case"useraccount":_[_.length-1]="User",j[r].push(n[e.name]);break;case"fullname":i=n[e.name+"_fullname_first_name"],typeof n[e.name+"_fullname_middle_name"]!="undefined"&&(i+=" "+n[e.name+"_fullname_middle_name"]),i+=" "+n[e.name+"_fullname_last_name"],j[r].push(i);break;case"booleaninput":j[r].push(n[e.name]?"Yes":"No");break;default:if(typeof n[e.name]=="undefined"){delete _[_.length-1];return}j[r].push(n[e.name])}})}),u+=i.inputTemplate["subform-table"]({labels:_,values:j,mode:r,sortBy:D,sortByVal:P,heading:typeof n.options.readmodedescription=="undefined"?n.description:n.options.readmodedescription})}else u+="";else if(f==="telephone"&&n._providerValue)u+=i.inputTemplate.uneditabletel({value:A,label:n.description,id:n.name,providerValue:n._providerValue});else if(f==="check")u+=i.inputTemplate.uneditablecheck({value:A,label:n.description,id:n.name,otherValue:n._otherValue?n._otherValue:""});else{var F="";switch(f){case"textarea":case"address":F=" uneditable-input-textarea";break;case"timestamp":A=o.getHumanTime(A)}u+=i.inputTemplate.uneditableinput({value:A,css_class:F,id:n.name})}}else this.options.internal&&typeof n.options.internalcanupdate!="undefined"&&!n.options.internalcanupdate?f="hidden":t.each(n.attributes,function(e,t){l+=" "+t+"='"+e+"'"}),f==="image"&&(f="file"),u+=typeof this.inputTemplate[f]!="undefined"?this.inputTemplate[f](t.extend({_attr:l},n)):"";if(n.options.visibleon){if(!n.options.visibleon.name||!e.isArray(n.options.visibleon.values))throw n.name+".Options.VisibleOn need Name and Values!";this._visibleOn.push(n)}return u},renderLabel:function(e,n,r){n=n||!1,e.attributes=e.attributes||{},e.options=e.options||{};var i=e.type.toLowerCase(),s=typeof r!="undefined"&&r?' class="'+r+'"':"";switch(i){case"hidden":if(this.options.mode==="create")return"";break;case"buttondecision":return""}return this.inputTemplate.label(t.extend({_cssClass:s,_required:n},e))},renderButton:function(e){var t="";if(e.submitbutton||e.resetbutton)t+='<div class="form-actions">';return e.submitbutton&&!e.subForm?t+='<button type="submit" class="btn btn-primary btn-submit">'+e.submitbutton+"</button>":t+='<button type="button" class="btn btn-primary btn-submit">'+e.submitbutton+"</button>",e.resetbutton&&(t+='<button type="button" class="btn btn-cancel">'+e.resetbutton+"</button>"),t.length>0&&(t+="</div>"),t},checkShowOnMode:function(n,r,i){var s=n.type.toLowerCase();if(n.options.internal!=undefined&&n.options.internal!==this.options.internal)return!1;if(n.options.internal===!0&&n.name&&s!=="buttonclipboard"){var o;switch(s){case"check":case"checkbox":o=n.name+"[]";break;default:o=n.name}this._internalFields.push(o)}if(!this.options.hideButtons||s!=="button"&&s!=="submit"&&s!=="reset"&&s!=="action"){if(this.options.mode==="read"&&!e.isEmptyObject(n.options.visibleon)&&!this.options.formData.fields[n.name]&&s!=="fullname"&&s!=="address"&&s!=="buttonclipboard")return!1;r=r||!1,i=i||!1;if(r!=="read"&&n.type.toLowerCase()==="buttonclipboard")return!1;if(r==="read"&&!this.options.internal&&n.options.hideonexternalread)return!1;if(typeof n.options.showonmode!="undefined"&&n.options.showonmode.indexOf(r)===-1)return!1;if(typeof n.options.showonstatus!="undefined"){var u=t.map(n.options.showonstatus,function(e){return e.toLowerCase()});if(i===!1||u.indexOf(i.toLowerCase())===-1)return!1}else if(this.options.internal&&r==="update"&&typeof n.options.internalcanupdate!="undefined"&&!n.options.internalcanupdate)return!1;return!0}return!1},attachSubFormEvent:function(r,i,s){i=t.extend(i,{validation:s});var o=this,u={el:"#"+r+this.prefixedName.listdisplayid,formSchema:i,formId:r,options:this.options},a=t.extend({},n.Events);e(this.el).on("click","#"+r+"_add_btn",u,this.displaySubForm).on(r+".close",this.closeSubForm).on(r+".add",t.extend({formId:r},this),this.addSubformData),this.options.mode==="update"&&typeof this.options.formData.fields[i.name]!="undefined"&&this.options.formData.fields[i.name].length>0?a.on(u.formId+".listViewCreated",function(t){e(o.el).trigger(r+".add",[t,o.options.formData.fields[i.name]]),a.off()}):a.on(u.formId+".listViewCreated",function(t){var n=e("#"+u.formId,o.el),i=function(s,a){e(o.el).trigger(r+".add",[t,a,!0]),n.one(u.formId+".ajaxUpdate",i)};n.one(u.formId+".ajaxUpdate",i),a.off()}),this.displaySubForm({data:u},{},!0,a)},displaySubForm:function(n,r,i,o){r=r||{},i=i||!1,o=o||!1;var u,a=t.clone(n.data);e.isEmptyObject(r)?u="SubFormView"+n.data.formId:(a.model=r,u="SubFormViewEdit"+n.data.formId),e(this).parents("div.actions").fadeOut(),require(["views/fields/list"],function(t){var r=s.create(this,u,t,a),f=e(r.el);i&&f.hide(),r.render(i),i||(f.show(),f.addClass("active"),f.expose({closeOnEsc:!1,closeOnClick:!1,color:"#000",zIndex:1025,renderBody:!1})),o&&o.trigger(n.data.formId+".listViewCreated",r)})},closeSubForm:function(t,n){n.$el.fadeOut(),e.mask.close(),e(".actions",n.$el.parent(".subform-container")).fadeIn("slow"),s.remove("SubFormView"+n.options.formId,!0),s.remove("SubFormViewEdit"+n.options.formId,!0)},addSubformData:function(e,r,i,o){o=o||!1,i=i||!1;var u=r.options.formSchema.view===""?"table":r.options.formSchema.view,a=r.options.formSchema.name;o&&e.data.model.get(a).reset();if(i){var f=n.Model.extend({});t.each(i,function(t){var n=new f;n.set(t),e.data.model.get(a).add(n)})}else e.data.model.get(a).add(r.model);require(["views/subform-layouts/"+u],function(t){var n={el:"#"+r.options.formId+e.data.prefixedName.collectiondisplayid,formSchema:r.options.formSchema,collection:e.data.model.get(a),options:r.options.options},i=s.create(this,"CollectionView"+e.data.formId,t,n);i.render(),e.data.closeSubForm(e,r)})},setupVisibleOn:function(n,r,i){i=i||!1;var s=this,u=n.type.toLowerCase();if(!n.name)throw"In order to use VisibleOn option, we need to pass in the Name";i||(n.options.visibleon.parentcontainer?i=n.options.visibleon.parentcontainer:u==="booleaninput"&&(i=".form-render_booleaninput_wrapper"));switch(u){case"address":delete this.model.validation[n.name+"_address_street"],delete this.model.validation[n.name+"_address_city"],delete this.model.validation[n.name+"_address_state"],delete this.model.validation[n.name+"_address_zip"],delete this.model.validation[n.name+"_address_country"];break;case"multifiles":delete this.model.validation[n.name+"[]"];break;default:delete this.model.validation[n.name]}e(this.el).on("change",':input[name="'+n.options.visibleon.name+'"]',function(a){var f=e(a.currentTarget),l=i?f.parents(i):f,c,h,p=[],d=n.options.visibleon.name,v=f.val(),m=["","[]"];d.match(/\[\]$/ig)&&(l.length||(l=f.closest(".checkbox-container")),d=d.substr(0,d.length-2),l=l.closest(".checkbox-container"),f.is(":checkbox")&&(v="",l.find(":checkbox:checked").each(function(){var r=e(this).val();t.indexOf(n.options.visibleon.values,r)>-1&&(v=r)})));if(t.indexOf(n.options.visibleon.values,v)>-1){if(e(".options-visible-on-"+n.name,s.el).length<1){l.after(r),c=l.next(".options-visible-on-"+n.name).fadeIn("slow",function(){e(this).addClass("visible-parent-"+d).attr("data-parent",d);var r=e(".options-visible-on-"+d,s.el);e('[class*="visible-parent-'+d+'"]',s.el).not(".visible-parent-"+d+",.options-visible-on-"+d+",.visible-parent-"+r.attr("data-parent")).remove(),u==="multifiles"?e("#"+n.name+"_multifiles_wrapper",this).trigger("visibleOnRenderComplete"):e(':input[name="'+n.name+'"]',this).trigger("visibleOnRenderComplete");if(!s.model.bindings[n.name]&&t.indexOf(s.model.notBinding,n.name)<0){var i=n.name;t.each(m,function(t){if(i!==n.name)return;e(':input[name="'+i+t+'"]').length&&(i=n.name+t)}),e(':input[name="'+i+'"]').length&&(s.model.bindModelBinder(i,n.type),s._modelBinder.bind(s.model,s.el,s.model.bindings))}}),h=l.next("div"),h.length===0&&(h=l.parent()),h.find(":input").not('input[type="hidden"]').placeholder();if(u==="address"){var g=n.name+"_address_street";s.options.formSchema.validation[g]&&(s.model.validation[g]=s.options.formSchema.validation[g]),p.push(g),g=n.name+"_address_city",s.options.formSchema.validation[g]&&(s.model.validation[g]=s.options.formSchema.validation[g]),p.push(g),g=n.name+"_address_state",s.options.formSchema.validation[g]&&(s.model.validation[g]=s.options.formSchema.validation[g]),p.push(g),g=n.name+"_address_zip",s.options.formSchema.validation[g]&&(s.model.validation[g]=s.options.formSchema.validation[g]),p.push(g),g=n.name+"_address_country",s.options.formSchema.validation[g]&&(s.model.validation[g]=s.options.formSchema.validation[g]),p.push(g),n.options.hidecountry&&s.model.set(g,"US")}else s.options.formSchema.validation[n.name]&&u!=="html"?(s.model.validation[n.name]=s.options.formSchema.validation[n.name],p.push(n.name)):s.options.formSchema.validation[n.name+"[]"]&&(s.model.validation[n.name+"[]"]=s.options.formSchema.validation[n.name+"[]"],p.push(n.name+"[]"));s.options.mode==="update"&&p.length>0&&t.each(p,function(t){s.options.formData.fields[t]&&(s.model.set(t,s.options.formData.fields[t]),e(':input[name="'+t+'"]',c).val(s.options.formData.fields[t]))}),u==="userid"&&(o.setupUserIdAjaxCall(e("form.form-render")),!s.model.validation[n.name].pattern&&(!n.options.render||n.options.render.toLowerCase()!=="select")&&(s.model.validation[n.name].pattern="email")),o.setupUrlAjaxCall(e("form.form-render"),e("#"+n.name)),s._hasDate&&o.setupDateInput(s.el)}}else{e("#"+n.name,s.el).trigger("removeVisibleOn"),e(".options-visible-on-"+n.name,s.el).remove();if(u==="address"){var g=n.name+"_address_street";s.model.set(g,""),s.options.formSchema.validation[g]&&(s.model.validation[g]=s.options.formSchema.validation[g],delete s.model.validation[g]),g=n.name+"_address_city",s.model.set(g,""),s.options.formSchema.validation[g]&&(s.model.validation[g]=s.options.formSchema.validation[g],delete s.model.validation[g]),g=n.name+"_address_state",s.model.set(g,""),s.options.formSchema.validation[g]&&(s.model.validation[g]=s.options.formSchema.validation[g],delete s.model.validation[g]),g=n.name+"_address_zip",s.model.set(g,""),s.options.formSchema.validation[g]&&(s.model.validation[g]=s.options.formSchema.validation[g],delete s.model.validation[g]),g=n.name+"_address_country",s.model.set(g,""),s.options.formSchema.validation[g]&&(s.model.validation[g]=s.options.formSchema.validation[g],delete s.model.validation[g])}else if(u!=="html"){s.model.set(n.name,""),s.model.validation[n.name]?delete s.model.validation[n.name]:s.model.validation[n.name+"[]"]&&delete s.model.validation[n.name+"[]"];var y=n.name;t.each(m,function(e){s.model.bindings[y+e]&&(s.model.unbindModelBinder(y+e,n.type),s._modelBinder.bind(s.model,s.el,s.model.bindings),f.is(":checkbox")||f.val(v))})}}})},setupCopyValuesFrom:function(n){if(!n.options.copyvaluesfrom.name||!n.options.copyvaluesfrom.description)throw"In order to use CopyValuesFrom options, need to have Name and Description";var r=this,i="";return i+='<div class="copy-values-from '+n.options.copyvaluesfrom.name+'">'+this.inputTemplate.buttongroup({description:n.options.copyvaluesfrom.description})+"</div>",e(this.el).on("click",".copy-values-from."+n.options.copyvaluesfrom.name+" .btn-group button",function(i){var s=e(i.currentTarget),u,a,f=[];s.hasClass("btn-yes")?(u=o.getSpecialFieldsName(n.options.copyvaluesfrom.name,n.type),t.each(u,function(t){f.push(e(':input[name="'+t+'"]',r.el).val())}),a=o.getSpecialFieldsName(n.name,n.type),o.setFieldsValues(r.el,r.model,a,f)):(a=o.getSpecialFieldsName(n.name,n.type),o.setFieldsValues(r.el,r.model,a))}),i},sortOrderBy:function(e){var t=e.options.orderby,n;if(!t&&!e.values)return;switch(t){default:n=function(e,t){return e.localeCompare(t)}}e.values.sort(n)}})});