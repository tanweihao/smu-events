<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
		<meta charset="utf-8" />
		<title>Login - W8 Admin</title>
		<meta name="description" content="This is page-header (.page-header &gt; h1)" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />

		<!--basic styles-->

		<link href="bootstrap/css/bootstrap.min.css" rel="stylesheet" />
		<link href="bootstrap/css/bootstrap-responsive.min.css" rel="stylesheet" />
		<link rel="stylesheet" href="themes/font-awesome/css/font-awesome.min.css" />

		<!--[if IE 7]>
		  <link rel="stylesheet" href="themes/font-awesome/css/font-awesome-ie7.min.css" />
		<![endif]-->

		<!--page specific plugin styles-->

		<link rel="stylesheet" href="themes/css/prettify.css" />

		<!--fonts-->

		<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Open+Sans:400,300" />

		<!--ace styles-->

		<link rel="stylesheet" href="themes/css/w8.min.css" />
		<link rel="stylesheet" href="themes/css/w8-responsive.min.css" />
		<link rel="stylesheet" href="themes/css/w8-skins.min.css" />

		<!--[if lte IE 8]>
		  <link rel="stylesheet" href="themes/css/ace-ie.min.css" />
		<![endif]-->

		<!--inline styles if any-->
		<style>
			body{background-color: #F7F7F6;}
.login{padding-top: 65px;}
.center{float: none; margin-left: auto; margin-right: auto;}
		</style>
	</head>

 
<body>
<!-- Navigation Bar -->
<div class="navbar navbar-inverse navbar-fixed-top">
  <div class="navbar-inner">
    <div class="container">
        <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
 
            </a>
 
    <a href="#" class="brand">LiveLabs - Event Management</a>
 
    <!--<div class="nav-collapse collapse pull-right">
        <ul class="nav">
            <li><a href="#forgot" data-toggle="modal"><i class="icon-user icon-white"></i> Forgot Password</a></li>
            <li class="divider-vertical"></li>
            <li><a href="#contact" data-toggle="modal"><i class="icon-envelope icon-white"></i> Contact Us</a></li>
            <li class="divider-vertical"></li>
 
        </ul>
    </div>-->
 
    </div>
  </div>
</div>
<!-- Navigation Ends -->
 
<!-- Main Container -->
<section>
<div class="container login">
    <div class="row ">
        <div class="center span4 well">
            <legend>Please Sign In</legend>
            
            <form method="POST" action="dashboard.php" accept-charset="UTF-8">
            <input type="text" id="username" class="span4" name="username" placeholder="Username" />
            <input type="password" id="password" class="span4" name="password" placeholder="Password" />
            <label class="checkbox">
                <input type="checkbox" name="remember" value="1" /> Remember Me
            </label>
            <button id="signIn"  name="submit" class="btn btn-primary btn-block" >Sign in</button>
            </form>
        </div>
    </div>
</div>
<p class="text-center muted ">&copy; Copyright 2013 </p>
</section>
<!-- Main Container Ends -->
 
<!-- Forgot Password Model Box -->
<div id="forgot" class="modal hide fade in" style="display: none; ">
<div class="modal-header">
<a class="close" data-dismiss="modal">×</a>
<h3>Forgot Password</h3>
</div>
<div class="modal-body">
<p>Enter your username to reset the password</p>
<form>
      <div class="controls controls-row">
          <input id="name" name="name" type="text" class="span3" placeholder="Name" />
      </div>
 
</form>
</div>
<div class="modal-footer">
<a href="#" class="btn btn-primary">Submit</a>
<a href="#" class="btn" data-dismiss="modal">Close</a>
</div>
</div>
 
<!-- Contact Us Model Box -->
<div id="contact" class="modal hide fade in" style="display: none; ">
<div class="modal-header">
<a class="close" data-dismiss="modal">×</a>
<h3>Contact Us</h3>
</div>
<div class="modal-body">
<form>
      <div class="controls controls-row">
          <input id="name" name="name" type="text" class="span3" placeholder="Name" />
      </div>
 
       <div class="controls controls-row">
       <input id="email" name="email" type="email" class="span3" placeholder="Email address" />
       </div>
 
      <div class="controls">
          <textarea id="message" name="message" class="span5" placeholder="Your Message" rows="5"></textarea>
      </div>
 
  </form>
</div>
 
<div class="modal-footer">
<a href="#" class="btn btn-primary">Submit</a>
<a href="#" class="btn" data-dismiss="modal">Close</a>
</div>
</div>
 
<!-- JavaScript -->

		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
		<script type="text/javascript">
			
			
			PageUI.ready(function(){
				window.jQuery || document.write("<script src='themes/js/jquery-1.9.1.min.js'>"+"<"+"/script>");
			});
			
			
			
		</script>
		<script src="bootstrap/js/bootstrap.min.js"></script>
		<script src="themes/js/jquery-ui-1.10.3.custom.min.js"></script>
		<script src="themes/js/jquery.ui.touch-punch.min.js"></script>
		
		<script src="themes/js/jquery.slimscroll.min.js"></script>
		<script src="themes/js/jquery.easy-pie-chart.min.js"></script>
		<script src="themes/js/jquery.sparkline.min.js"></script>
		
		<script src="themes/js/jquery.flot.min.js"></script>
		<script src="themes/js/jquery.flot.pie.min.js"></script>
		<script src="themes/js/jquery.flot.resize.min.js"></script>
		
		
		<!--w8 scripts-->

		<script src="themes/js/w8-elements.min.js"></script>
		<script src="themes/js/w8.min.js"></script>
			<script src="login.js"></script>
</body>
</html>