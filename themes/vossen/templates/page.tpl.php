<?php
/**
 * @file
 * Default theme implementation to display a single Drupal page.
 */
$base_path = base_path();
$path_to_theme = drupal_get_path('theme', 'vossen');
?>

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
			<?php if ($page['main_menu']): ?>
				<div class="collapse navbar-collapse" id="main-nav" style="max-height: 481px;">
					<?php print render($page['main_menu']); ?>
				</div> <!-- /# -->
			<?php endif; ?>
		</div><!-- /.container -->
	</nav>
</header><!-- /header -->

<?php if ($page['hero_fullwidth']): ?> 
	<section id="home-parallax-fullwidth"> 
		<div class="home-container text-center op-1">
			<?php print render($page['hero_fullwidth']); ?>
		</div>
        </section>
<?php endif; ?>

<?php if ($page['hero_landingpage']): ?> 
	<section id="home-landing"> 
		<div class="home-container text-center op-1">
			<?php print render($page['hero_landingpage']); ?>
			<?php if ($page['hero_bottom']): ?>
				<div class="home-bottom">
					<div class="container text-center">
						<div class="move bounce">
							<?php print render($page['hero_bottom']); ?>
						</div>
					</div>
				</div>
			<?php endif; ?>
		</div>
	</section>
<?php endif; ?>

<?php if ($page['hero_parallax']): ?> 
	<section id="home-revolution-slider">
		<div class="hero">
			<?php print render($page['hero_parallax']); ?>
			<?php if ($page['hero_bottom']): ?>
				<div class="home-bottom">
					<div class="container text-center">
						<div class="move bounce">
							<?php print render($page['hero_bottom']); ?>
						</div>
					</div>
				</div>
			<?php endif; ?>
		</div>
	</section>
<?php endif; ?>

<section id="page-top" style="height:400px">
	<div class="hero" style="top: 0rem;">
		<?php if ($page['page_title']): ?>
			<div class="page-top-title text-center">
				<?php print render($page['page_title']); ?>
			</div> <!-- /.page-top-title -->
		<?php endif; ?>
	</div>
</section><!-- /#page-top -->

<!-- Start Content -->
<div class="site-wrapper">
	<a id="main-content"></a>
	<?php if (($page['content']) || ($page['sidebar'])) : ?>
		<div class="main-content">
			<section>
				<div class="container">
					<div class="row">
						<div class="<?php if ($page['sidebar']): ?> col-md-8 <?php else: ?> col-md-12 <?php endif; ?>">
							<?php if ($messages): ?>
								<div id="messages">
									<?php print $messages; ?>
								</div> <!-- /#messages -->
							<?php endif; ?>
							<?php if ($tabs_rendered = render($tabs)): ?>
								<div class="tabs">
									<?php print render($tabs); ?>
								</div>
							<?php endif; ?>
							<?php print render($page['content']); ?>
						</div>
						<?php if ($page['sidebar']): ?>
							<div class="col-md-4 sidebar blog-sidebar">
								<?php print render($page['sidebar']); ?>
							</div> <!-- /.sidebar -->
						<?php endif; ?>
					</div><!--/.row-->
				</div><!--/.container-->
			</section>
			<?php print render($page['help']); ?>
			<?php if ($action_links): ?>
				<ul class="action-links">
					<?php print render($action_links); ?>
				</ul>
			<?php endif; ?>
			<?php if ($feed_icons): ?>
				<div class="container">
					<?php print $feed_icons; ?>
				</div>
			<?php endif; ?>
		</div><!-- /.main-content -->
	<?php endif; ?>
<!-- End Content -->



      <?php if ($page['fullwidth_panel']): ?>
        <section class="fullwidth-panel">
          <?php print render($page['fullwidth_panel']); ?>
        </section> <!-- /.fullwidth-panel -->
      <?php endif; ?>

<!-- Onepage Features -->
      <?php if ($page['onepage_features']): ?>
        <section id="features">
	<div class="container">
          <?php print render($page['onepage_features']); ?>
        </div></section> <!-- /.container, /#features -->
      <?php endif; ?>


<!-- Onepage About -->
      <?php if ($page['onepage_about']): ?>
        <section id="about" class="parallax-section-1">
	<div class="container">
          <?php print render($page['onepage_about']); ?>
        </div></section> <!-- /.container, /#about -->
      <?php endif; ?>


<!-- Onepage Team -->
      <?php if ($page['onepage_team']): ?>
        <section id="team">
	<div class="container">
          <?php print render($page['onepage_team']); ?>
        </div></section> <!-- /.container, /#team -->
      <?php endif; ?>

<!-- Onepage Skills -->
      <?php if ($page['onepage_skills']): ?>
        <section id="skills" class="parallax-section-2">
	<div class="container">
          <?php print render($page['onepage_skills']); ?>
        </div></section> <!-- /.container, /#skills -->
      <?php endif; ?>

<!-- Onepage Facts -->
      <?php if ($page['onepage_facts']): ?>
        <section id="fun-facts">
	<div class="container">
          <?php print render($page['onepage_facts']); ?>
        </div></section> <!-- /.container, /#fun-facts -->
      <?php endif; ?>

<!-- Onepage Quotes -->
      <?php if ($page['onepage_quotes']): ?>
        <section id="quote" class="parallax-section-3">
	<div class="container">
          <div class="row wow fadeInUp animated"><div class="col-lg-12 wow fadeInUp animated">
            <?php print render($page['onepage_quotes']); ?>
          </div></div>
        </div></section> <!-- /.container, /#quotes -->
      <?php endif; ?>

<!-- Onepage Portfolio -->
      <?php if ($page['onepage_portfolio']): ?>
        <section id="portfolio">
	<div class="separator"></div>
	<div class="container">
          <?php print render($page['onepage_portfolio']); ?>
        </div></section> <!-- /.container, /#portfolio -->
      <?php endif; ?>

<!-- Onepage Get Connected -->
      <?php if ($page['onepage_getconnected']): ?>
        <section id="get-connected" class="parallax-section-4">
	<div class="container">
          <?php print render($page['onepage_getconnected']); ?>
        </div></section> <!-- /.container, /#get-connected -->
      <?php endif; ?>
            
<!-- Onepage Services -->
      <?php if ($page['onepage_services']): ?>
        <section id="services">
	<div class="container">
          <?php print render($page['onepage_services']); ?>
        </div></section> <!-- /.container, /#services -->
      <?php endif; ?>

<!-- Onepage Call to Action 1 -->
      <?php if ($page['onepage_calltoaction1']): ?>
        <section id="call-to-action-1" class="parallax-section-5">
	<div class="container">
          <?php print render($page['onepage_calltoaction1']); ?>
        </div></section> <!-- /.container, /#call-to-action-1 -->
      <?php endif; ?>

<!-- Onepage Price List -->
      <?php if ($page['onepage_pricelist']): ?>
        <section id="price-list" class="parallax-section-6">
	<div class="container">
          <?php print render($page['onepage_pricelist']); ?>
        </div></section> <!-- /.container, /#price-list -->
      <?php endif; ?>

<!-- Onepage Clients -->
      <?php if ($page['onepage_clients']): ?>
        <section id="clients">
	<div class="container"><div class="row">
          <?php print render($page['onepage_clients']); ?>
        </div></div></section> <!-- /.row, /.container, /#clients -->
      <?php endif; ?>

<!-- Onepage Testimonials -->
      <?php if ($page['onepage_testimonials']): ?>
        <section id="testimonials" class="parallax-section-7">
	<div class="container">
          <?php print render($page['onepage_testimonials']); ?>
        </div></section> <!-- /.container, /#testimonials -->
      <?php endif; ?>

<!-- Onepage Contact -->
      <?php if ($page['onepage_contact']): ?>
        <section id="contact">
	<div class="container">
          <?php print render($page['onepage_contact']); ?>
        </div></section> <!-- /.container, /#contact -->
      <?php endif; ?>

<!-- Onepage Video Section -->
      <?php if ($page['onepage_videosection']): ?>
        <section id="video-section" class="parallax-section-8">
	<div class="container">
          <?php print render($page['onepage_videosection']); ?>
        </div></section> <!-- /.container, /#video-section -->
      <?php endif; ?>

            <!-- Start Footer 1 -->
            <footer id="footer">
                <div class="footer-widgets">
                    <div class="container"> 
                            
                            <div class="col-md-3 col-sm-6 col-twitter">
				<?php if ($page['col_footer_1']): ?>
                                             <div class="col-footer-1">
						 <?php print render($page['col_footer_1']); ?>
						</div> <!-- /.col-footer-1 -->
					<?php endif; ?>

                            </div>
                            
                            <div class="col-md-3 col-sm-6 col-footer">
                                <div class="subscription">
					<?php if ($page['col_footer_2']): ?>
                                             <div class="col-footer-2">
						 <?php print render($page['col_footer_2']); ?>
						</div> <!-- /.col-footer-2 -->
					<?php endif; ?>
                                    
                                </div>
                            </div> 
                            
                            <div class="col-md-3 col-sm-6 col-footer">
 				<?php if ($page['col_footer_3']): ?>
                                             <div class="col-footer-3">
						 <?php print render($page['col_footer_3']); ?>
						</div> <!-- /.col-footer-3 -->
					<?php endif; ?>
                            </div>
                            
                            <div class="col-md-3 col-sm-6 col-footer">

 				<?php if ($page['col_footer_4']): ?>
                                             <div class="col-footer-4">
						 <?php print render($page['col_footer_4']); ?>
						</div> <!-- /.col-footer-4 -->
					<?php endif; ?>



                            </div>
                             
                    </div>
                </div><!-- End Footer Widgets -->
                
				<div class="footer-copyright">
					<div class="container">
						<div class="row">
								
							<div class="col-md-6 col-sm-12">
                                                          <?php if ($page['footer_copyright']): ?>
                                                            <div class="footer-copyright-text">
							        <?php print render($page['footer_copyright']); ?>
							      </div> <!-- /.footer-copyright -->
							    <?php endif; ?>
							</div>
							<div class="col-md-6 col-sm-12">

                                                          <?php if ($page['footer_social_icons']): ?>
                                                            <div class="footer-social-icons">
							        <?php print render($page['footer_social_icons']); ?>
							      </div> <!-- /.footer-social-icons -->
							    <?php endif; ?>
							</div>
						</div>
					</div>
				</div><!-- End Footer Copyright -->
                
			</footer>
            <!-- End Footer 1 -->
</div><!-- /.site-wrapper -->
