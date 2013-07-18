FormSchemaRender
================

Version `version 0.0.1`

Read JS object and Build the HTML Form.

### Head Section
Please use font-awesome to add visual effect to the UI.
<link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet">

### JS Object
1. formSchema: formSchema JS Object (Require)
2. formData: formData JS Object (Optional)
3. mode: mode either 'read', 'edit', or 'Create' (Optional)

### HTML Markup
	<div id="app">
		<p class="data-loader">
			<i class="icon-spinner icon-spin icon-large"></i> <span class="text-info">Loading Information ...</span>
		</p>
	</div>

### Build
1. Under js/libs path will have `build.js` file.
2. run with this command at the app root `r.js -o js/libs/build.js`

### Version

* 0.0.1 - Init Project.
