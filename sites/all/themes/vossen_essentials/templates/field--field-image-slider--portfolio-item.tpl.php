<div id="project-slider" class="owl-carousel owl-theme">
  <?php foreach ($items as $delta => $item): ?>
    <?php print render($item); ?>
  <?php endforeach; ?>
</div>