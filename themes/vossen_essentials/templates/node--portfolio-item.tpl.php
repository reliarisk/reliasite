<article class="project-page">
<section id="node-<?php print $node->nid; ?> project-page-title">
    <div class="container">
        <div class="row text-center">
            <div class="col-lg-12">
                <h2 class="project-title"><?php print $title; ?></h2>
                <?php print render($content['field_subtitle']); ?>
            </div>
        </div>
    </div>
</section>

<div class="container">
    <div class="row">
        
        <div class="col-lg-8">
            


<?php print render($content['field_image']); ?>
<?php print render($content['field_image_slider']); ?>
<?php print render($content['field_video']); ?>
                        
            <div class="project-info">
              
  <?php
      // We hide the comments and links now so that we can render them later.
      hide($content['comments']);
      hide($content['links']);
      //print render($content);
    ?>
<?php print render($content['body']); ?>
<br>
                <?php print render($content['field_url']); ?>
            </div>    
         
        </div>

        <div class="col-lg-4">
                       
            <div class="project-widget">
                <h4>Project Description</h4>
                <?php print render($content['field_project_description']); ?>
            </div>    
                        
            <div class="project-widget">
                <h4>Project Details</h4>
                            
                <h5><?php print render($content['field_date']); ?></h5>
                <h5><?php print render($content['field_client']); ?></h5>
            </div>
                      
            <div class="project-widget">
		  <?php print render($content['field_tags']); ?>
            </div>
            
        </div>
        
    </div>
</div>

    <?php
      // We hide the comments and links now so that we can render them later.
      hide($content['comments']);
      hide($content['links']);
    ?>

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

  <?php //print render($content['comments']); ?>
</article>