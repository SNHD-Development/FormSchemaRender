FormSchemaRender
================
Read JS object and Build the HTML Form.

Version `version 0.0.5`

### Head Section
Please use font-awesome to add visual effect to the UI.

`<link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet">`

If need IE7 supports for font-awesome,

	<!--[if IE 7]>
		<link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome-ie7.min.css" rel="stylesheet">
	<![endif]-->


Please include these styles

* form-render.css (Required) `<link rel="stylesheet" href="css/form-render.css" />`
* wizard.css (Required: if rendering with Wizard View) `<link rel="stylesheet" href="css/wizard.css">`
* spinner.css (Required: if setting type 'Number' with options 'Spinner = true' ) `<link rel="stylesheet" href="css/spinner.css">`
* lightbox.css (Required: if setting type 'Image' ) `<link rel="stylesheet" href="css/lightbox.css" />`
* datepicker.css (If you use type = "date") `<link rel="stylesheet" href="css/datepicker.css" />`

Load JS with RequireJS
`<script data-main="js/main" src="js/libs/require/require.js"></script>`

### JS Object
1. formSchema: formSchema JS Object (Require)
2. formData: formData JS Object (Optional)
3. mode: mode either "read", "update" or "create" (Optional, default is create mode)
4. view: view to render "default", "horizontal" or "wizard" (Optional, default view is horizontal view)
5. token: if you want to add token in your form, you can add it here (Optional, but recommended)
6. internal: When we want to add internal only fileds, if any fields that has `options.internal = true` will only get render if this flag set to true. (Optional, default value is false)
7. formEvents: custom events JS code that will need to run in form render scope. (Optional)
8. hideButtons: Force FormRender not to render any buttons. (Optional)

Example:

	<script type="text/javascript">
		var formSchema = {}
		, formData = {}
		, mode = ""
		, view = ""
		, token = ""
		, internal = boolean
		, formEvents = { event : function }
		, hideButtons = false;
	</script>

### HTML Markup
	<div id="app">
		<p class="data-loader">
			<i class="icon-spinner icon-spin icon-large"></i> <span class="text-info">Loading Information ...</span>
		</p>
	</div>

### Views

#### Wizard View
Required wizard.css style
`<link rel="stylesheet" href="css/wizard.css">`

Field type = 'step' is unique for this view only. Other View will not render this field type.
It will set the step for wizard view.
Note: Require to have field type = 'step' at the beginning of fields array in formSchema.

Ex:

	{
		"Type": "Step",
		"Icon": "icon-user",
		"Description": "Step 1"
	}

For Icon, we are using [Font-Awesome](http://fortawesome.github.io/Font-Awesome/).

### Build

Automatic Build
1. run this command in terminal `perl compile.pl` form app root.

Manual Build

1. Under js/libs path will have `build.js` and `parsetmpl.pl` file.
2. If this project need to call from another domain, will need to use `perl js/libs/parsetmpl.pl` from app root.
3. run with this command at the app root `r.js -o js/libs/build.js`

Note:
If calling this script from different domain will need to run this build script `perl js/libs/parsetmpl.pl` from the app root.
This script will parse html into requireJS in order to work around XHR restrictions.

### Events

Every events in our form render will follow this namespace `"form_id.event_name"`. Simply listen to these events.

* Form render completed Event: `form_id.renderCompleted`
* Form before submit Event: `form_id.preSubmit`
* Form when received respond back Event: `form_id.postSubmit`

Then you need to pass your custom event into

	var formEvents = {
		'renderCompleted' : function() {
			console.log('Render Form Completed.');
		},
		'preSubmit' : function() {
			console.log('Before Submitting this form.');
		},
		'postSubmit' : function () {
			console.log('Let\'s check the respond.');
		}
	};

### Submit Form

By default, the submit event will use Ajax call to submit data. When passing `Options.AjaxSubmit = false` in Submit field type, it will use normal post form without Ajax.

Example: Setting Button type option to prevent Ajax form submit

	{
		"Name" : "SubmitBtn",
		"Type" : "Submit",
		"Description" : "Submit Button",
		"Url" : "/controller/action",
		"Attributes" : {
			"Class" : "btn btn-primary"
		},
		"Options" : {
			"AppendId" : true,
			"AjaxSubmit": false
		}
	}

### Button

In order to build form when user click a button can be done by adding class "btn-render-form" in any button type.

	{
		"Type" : "Button",
		"Description" : "Build Hidden Form On Click",
		"Url" : "/anyurl",
		"Attributes" : {
			"Class" : "btn btn-primary btn-render-form"
		}
	}

### Address Field

By default, Address Field will render "Street, City, State, ZipCode and Country"

If you want to hide Country simply pass "HideCountry" to true in options.

	{
		"Name" : "ShippingAddress",
		"Type" : "Address",
		"Description" : "Shipping Address",
		"Options" : {
			"HideCountry" : true
		}
	}

### VisibleOn Options

There are sometime that the value from another field will effect the flow of the form. In this case, we will use `Options.VisibleOn = { Name: 'Name of other field', Values: 'Array of that field values that will trigger this field' };` to handle this situation.

Example: If a user select on a value in select area, this will trigger the Depend field.

Select Type (Value of this field will trigger the event of Depend Field)

	{
		"Name" : "SelectMe",
		"Type" : "Select",
		"Description" : "Please select me to trigger another field",
		"Values": [
			"Option 1",
			"Option 2",
			"Option 3",
			"Option 4"
		]
	}

VisibleOn Options

	{
		"Name" : "OptionOne",
		"Type" : "TextBox",
		"Description" : "If user selected 'Option 1' and 'Option 3' in 'SelectMe' I will show!",
		"Options": {
			"VisibleOn": {
				"Name": "SelectMe",
				"Values": [
					"Option 1",
					"Option 3"
				]
			}
		}
	},
	{
		Name: "Test",
		Type: "HTML",
		Description: "<div>Hello to 'Option 2' or 'Option 4'</div>",
		"Options": {
			"VisibleOn": {
				"Name": "SelectMe",
				"Values": [
					"Option 2",
					"Option 4"
				]
			}
		}
	}

Validation FormSchema

	{
		Validation: {
			SelectMe: {
				required: true
			},
			OptionOne: {
				required: true
			}
		}
	}

### CopyValuesFrom Options

Sometime we might run into billing address and shipping address that a user might have the same values in this field. We want to provide the nice UX for our user by adding a button to ask them either this has the same values as previous field.
By passing, `Options.CopyValuesFrom = "Name of the field that we want to copy data from"`.
Note: in order to make this work, it must be the same field type.

	{
		Name: "MyBillingAddress",
		Type: "Address",
		Description: "Your Billing Address"
	},
	{
		Name: "MyShippingAddress",
		Type: "Address",
		Description: "Your Shipping Address",
		Options: {
			CopyValuesFrom: {
				Name: "MyBillingAddress",
				Description: "Is your shipping same as billing address?"
			}
		}
	}


### Date Field

By default `Type = "Date"` will render as DatePicker, However sometime it is very difficult to select birthday with Datepicker, so if you set `Options.Render = "Select"`. This will render the date field as select box.

	{
		Name: "MyDate",
		Type: "Date",
		Description: "Your DatePicker",
		Options: {
			Render: "Datepicker"
		}
	}

	{
		Name: "MySecondDate",
		Type: "Date",
		Description: "Your Birthday",
		Options: {
			Render: "Select"
		}
	}

Validation FormSchema

	{
		Validation: {
			MyDate: {
				required: true,
				maxDate: "today",
				minDate: "01/01/1950"
			},
			MySecondDate: {
				required: true,
				maxDate: "08/14/1995"
			}
		}
	}

### ButtonDecision



### ButtonClipboard

Sometime in read mode, you want to provide the easy way for copy multiple text area to the user in just one click.
This Field Type will only work in read mode and when user "click" the button. It will automatic copy into their clipboard.

	{
		Name : "CopyShippingInfo",
		Type : "ButtonClipboard",
		Description : "Copy Shipping Information",
		Values : [ "ShippingName", "ShippingAddress" ]
	}


## Internal Only Options

These options will be used in internal only mode.

### InternalCanUpdate Options

Sometime there are some fileds that internal should not be able to update these fields. In order to implement this use case, we will need to set `Options.InternalCanUpdate = false`. This will prevent the user to update this field. The FormRender will just render as hidden field.

	{
		"Name" : "ImageId",
		"Type" : "Image",
		"Description" : "Your Image",
		"Options" : {
			"InternalCanUpdate": false
		}
	}

### Version

* 0.0.5 - Adding MultiFiles Upload and Fix minor bug.

* 0.0.4 - SubForm can render the data in all the mode now. Fixed minor bug for validation methods and schema.

* 0.0.3 - Fix IE when render List Type. Fix validation in special field type.

* 0.0.2 - Add Wizard View.

* 0.0.1 - Init Project.
