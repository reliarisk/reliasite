<?php
/**
 * @file
 * Default theme implementation to display a single Drupal page.
 */
$base_path = base_path();
$path_to_theme = drupal_get_path('theme', 'vossen');
?>

<!DOCTYPE html>
<html lang="en" dir="ltr"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/terms/"
  xmlns:foaf="http://xmlns.com/foaf/0.1/"
  xmlns:og="http://ogp.me/ns#"
  xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
  xmlns:sioc="http://rdfs.org/sioc/ns#"
  xmlns:sioct="http://rdfs.org/sioc/types#"
  xmlns:skos="http://www.w3.org/2004/02/skos/core#"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema#">
  <head>
    <title><?php print $head_title ?></title>
    <?php print $head ?>
    <?php print $styles ?>
    <!-- COCOON SKIN BEGIN -->
    <link type="text/css" rel="stylesheet" href="<?php print $base_path . $path_to_theme; ?>/css/colors/<?php print (theme_get_setting('skin')); ?>.css" media="all">
    <!-- COCOON SKIN END -->
    <?php print $scripts ?>
  </head>
<body class="<?php print $classes ?>">

<header>
	<nav class="navbar navbar-default navbar-alt <?php if (theme_get_setting('sticky_header')): ?>navbar-sticky<?php endif; ?>" role="navigation">
		<div class="container">
			<!-- Brand and toggle get grouped for better mobile display -->
			<div class="navbar-header">
				<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#main-nav">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				<a class="navbar-brand" rel="home" href="<?php print $front_page; ?>">
					<img src="<?php print $base_path . $path_to_theme; ?>/images/assets/logo-white.png" alt="<?php print $site_name; ?>" class="logo-big">
					<img src="<?php print $base_path . $path_to_theme; ?>/images/assets/logo-dark.png" alt="<?php print $site_name; ?>" class="logo-small">
				</a>
			</div>
			<!-- Collect the nav links, forms, and other content for toggling -->
				<div class="collapse navbar-collapse" id="main-nav" style="max-height: 481px;">
					<ul class="nav navbar-nav navbar-right">
						<li><a href="<?php print $base_path ?>">Refresh</a></li>
						<li><a href="<?php print $base_path ?>?q=user">Login</a></li>
					</ul>
				</div> <!-- /# -->

		</div><!-- /.container -->
	</nav>
</header><!-- /header -->
<section id="page-top" style="height:400px">
	<div class="hero" style="top: 0rem;">
			<div class="page-top-title text-center">
				<h2 class="white op-1">Offline</h2>
				<p class="home-subheading op-1"><?php print($site_name); ?> is under maintenance</p>
			</div> <!-- /.page-top-title -->
	</div>
</section><!-- /#page-top -->

<!-- Start Content -->
<div class="site-wrapper">
	<a id="main-content"></a>
		<div class="main-content" style="min-height:600px;">
			<section>
				<div class="container">
					<div class="row">
						<div class="col-md-12">
							<?php if ($title): ?><h3 class="uppercase"><?php print $title ?></h3><?php endif; ?>
							<?php if ($messages): ?>
								<div id="messages">
									<?php print $messages; ?>
								</div> <!-- /#messages -->
							<?php endif; ?>
							<?php print $content ?>
						</div>
					</div><!--/.row-->
				</div><!--/.container-->
			</section>
			<?php print render($page['help']); ?>
		</div><!-- /.main-content -->
<!-- End Content -->
            <!-- Start Footer 1 -->
            <footer id="footer">                
				<div class="footer-copyright">
					<div class="container">
						<div class="row">
								
							<div class="col-md-6 col-sm-12">
                                                            <div class="footer-copyright-text">
							       <p> &copy;<?php echo date("Y"); print ' '. $site_name; ?></p>
							      </div> <!-- /.footer-copyright -->
							</div>
						</div>
					</div>
				</div><!-- End Footer Copyright -->
                
			</footer>
            <!-- End Footer 1 -->
</div><!-- /.site-wrapper -->
<script src="//code.jquery.com/jquery-1.11.2.min.js"></script>
<script type="text/javascript" src="<?php print $base_path . $path_to_theme; ?>/js/plugins/moderniz.min.js"></script>
<script type="text/javascript" src="<?php print $base_path . $path_to_theme; ?>/js/plugins/smoothscroll.min.js"></script>
<script type="text/javascript" src="<?php print $base_path . $path_to_theme; ?>/js/plugins/bootstrap.min.js"></script>
<script type="text/javascript" src="<?php print $base_path . $path_to_theme; ?>/js/plugins/waypoints.min.js"></script>
<script type="text/javascript" src="<?php print $base_path . $path_to_theme; ?>/js/plugins/parallax.min.js"></script>
<script type="text/javascript" src="<?php print $base_path . $path_to_theme; ?>/js/plugins/easign1.3.min.js"></script>
<script type="text/javascript" src="<?php print $base_path . $path_to_theme; ?>/js/scripts.js"></script>
<script type="text/javascript">
(function($) {
        $(window).scroll(function(){    
          /* -------------------
          Header Animation
          ---------------------*/
          if ($(this).scrollTop() > 5){  
            $('nav').addClass("navbar-small")
          }
          else {
            $('nav').removeClass("navbar-small")
          }
        });
      })(jQuery, window, document);
</script>
</body>
</html>