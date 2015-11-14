<div class="fluid-width-video-wrapper">
  <div class="video-container">
    <?php foreach ($items as $delta => $item): ?>
      <?php print render($item); ?>
    <?php endforeach; ?>
  </div>
</div>