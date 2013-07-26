<!DOCTYPE html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" xml:lang="en" lang="en"> <!--<![endif]-->
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

  <title>Form Render Boilerplate: Wizard View (Create Mode)</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="description" content="Front-End Form Render Engine" />

  <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css" rel="stylesheet">
  <link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet">
  <link rel="stylesheet" href="css/datepicker.css" />
  <link rel="stylesheet" href="css/spinner.css">
  <link rel="stylesheet" href="css/wizard.css">
  <link rel="stylesheet" href="css/form-render.css" />

  <script data-main="js/main" src="js/libs/require/require.js"></script>

</head>

<body>
  <script type="text/javascript">
	<?php
	$content = file_get_contents("example_wizard_1.json");
    echo 'var formSchema = ' . $content;
	echo ', view = "wizard";';
	?>
  </script>
  <!-- Initially populated by templates/layout.html -->
  <div class="container">
	<div class="row">
	  <div class="span12">


	  <!-- Require for Rendering the Form -->
		<div id="app">
			<p class="data-loader">
			  <i class="icon-spinner icon-spin icon-large"></i> <span class="text-info">Loading Information ...</span>
			</p>
		</div>


	  </div>
	</div>
  </div>

</body>
</html>
