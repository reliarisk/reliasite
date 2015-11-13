<!-- Start Content -->
<div class="main-content">
        <?php if ($messages): ?>
          <div id="messages"><div class="container">
            <?php print $messages; ?>
          </div></div> <!-- /.container, /#messages -->
        <?php endif; ?>

        <?php if ($tabs_rendered = render($tabs)): ?>
	<div class="container">
	  <div class="tabs">
            <?php print render($tabs); ?>
          </div></div><!-- /.tabs, /.container -->
        <?php endif; ?>

        <?php print render($page['content']); ?>

      <?php print render($page['help']); ?>
      <?php if ($action_links): ?>
        <ul class="action-links">
          <?php print render($action_links); ?>
        </ul>
      <?php endif; ?>
      <?php print $feed_icons; ?>
</div>
<!-- End Content -->
