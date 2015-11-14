<section id="comments-section" class="comments <?php print $classes; ?>"<?php print $attributes; ?>>
  <?php if ($content['comments'] && $node->type != 'forum'): ?>
    <?php print render($title_prefix); ?>
    <h4 class="comments-title"><?php print 'Comments <small class="number">(' . $node->comment_count . ')</small>'; ?></h4><hr>
    <?php print render($title_suffix); ?>
  <?php endif; ?>

  <div id="comments" class="comment-wrapper comment-wrapper-nid-<?php print $node->nid?> comments-list"><?php print render($content['comments']); ?></div>

  <?php if ($content['comment_form']): ?>
    <h4 class="comments-title"><?php print t('Leave a comment'); ?></h4>
    <?php print render($content['comment_form']); ?>
  <?php endif; ?>
</section>
