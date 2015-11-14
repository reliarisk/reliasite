<?php if (!$label_hidden): ?>
  <?php print $label ?>:
<?php endif; ?>
<?php foreach ($items as $delta => $item): ?>
  <small class="field-item <?php print $delta % 2 ? 'odd' : 'even'; ?>"<?php print $item_attributes[$delta]; ?>><?php print render($item); ?></small>
<?php endforeach; ?>
