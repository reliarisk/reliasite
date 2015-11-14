<article class="<?php print $classes; ?> clearfix"<?php print $attributes; ?>>

  <footer class="pull-left avatar">
    <?php print $picture; ?>
  </footer>

  <div class="media-body">

    <?php if ($new): ?>
      <span class="new"><?php print $new; ?></span>
    <?php endif; ?>

    <?php print render($title_prefix); ?>
    <h4 class="media-heading"<?php print $title_attributes; ?>><?php print $author; ?></h3>
    <?php print render($title_suffix); ?>
    <p class="time"><?php print $created; ?></p>
    <span class="lead"><?php print check_plain($comment->subject); ?></span>
    <div class="content"<?php print $content_attributes; ?>>
      <?php
        // We hide the comments and links now so that we can render them later.
        hide($content['links']);
        print render($content);
      ?>
      <?php if ($signature): ?>
      <footer class="user-signature clearfix">
        <?php print $signature; ?>
      </footer>
      <?php endif; ?>
    </div> <!-- /.content -->
    <div class="pull-right"><?php print render($content['links']); ?></div>
  </div> <!-- /.comment-text -->
</article>
