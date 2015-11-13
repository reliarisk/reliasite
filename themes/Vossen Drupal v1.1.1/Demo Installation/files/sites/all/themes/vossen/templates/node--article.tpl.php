<?php
global $base_path, $base_url;
?>

<article id="node-<?php print $node->nid; ?>" class="blog-post <?php print $classes; ?> clearfix"<?php print $attributes; ?> role="article">


<?php print render($title_prefix); ?>
<h3 class="blog-post-title"><a href="<?php print $node_url; ?>"><?php print $title; ?></a></h3>
<?php print render($title_suffix); ?>


<div class="blog-post-lead"><?php print $node->body['und'][0]['safe_summary']; ?></div>

<?php if ($display_submitted): ?>
  <div class="blog-post-info">
    <span class="blog-post-info-meta"><i class="ion-clock"></i> <?php print format_date($node->created, 'article'); ?></span>
    <span class="blog-post-info-meta"><i class="ion-person"></i> By <a href="<?php echo base_path() . 'user/' . $node->uid;  ?>"><?php print $node->name; ?></a></span>
    <span class="blog-post-info-meta"><i class="ion-folder"></i> <?php print render($content['field_category']); ?></span>
    <span class="blog-post-info-meta"><i class="ion-chatboxes"></i> <span class="to-section"><a href="#comments-section"><?php print $comment_count; ?> Comments</a></span></span>
  </div>  
<?php endif; ?>

  <div class="content clearfix"<?php print $content_attributes; ?>>
    <?php
      // We hide the comments and links now so that we can render them later.
      hide($content['comments']);
      hide($content['links']);
      //print render($content);
    ?>
<?php print render($content['field_image']); ?>
<?php print render($content['field_image_slider']); ?>
<?php print render($content['field_video']); ?>
<?php print render($content['body']); ?>
<div class="tags-list"><?php print render($content['field_tags']); ?></div>
  </div>

  <?php
    // Remove the "Add new comment" link on the teaser page or if the comment
    // form is being displayed on the same page.
    if ($teaser || !empty($content['comments']['comment_form'])) {
      unset($content['links']['comment']['#links']['comment-add']);
    }
    // Only display the wrapper div if there are links.
    $links = render($content['links']);
    if ($links):
  ?>
    <div class="link-wrapper">
      <?php print $links; ?>
    </div>
  <?php endif; ?>

  <?php print render($content['comments']); ?>

<?php print render($content['flippy_pager']);?> 


</article>