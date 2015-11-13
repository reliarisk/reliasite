<?php

/**
 * @file
 * Default simple view template to all the fields as a row.
 *
 * - $view: The view in use.
 * - $fields: an array of $field objects. Each one contains:
 *   - $field->content: The output of the field.
 *   - $field->raw: The raw data for the field, if it exists. This is NOT output safe.
 *   - $field->class: The safe class id to use.
 *   - $field->handler: The Views field handler object controlling this field. Do not use
 *     var_export to dump this object, as it can't handle the recursion.
 *   - $field->inline: Whether or not the field should be inline.
 *   - $field->inline_html: either div or span based on the above flag.
 *   - $field->wrapper_prefix: A complete wrapper containing the inline_html to use.
 *   - $field->wrapper_suffix: The closing tag for the wrapper.
 *   - $field->separator: an optional separator that may appear before a field.
 *   - $field->label: The wrap label text to use.
 *   - $field->label_html: The full HTML of the label to use including
 *     configured element type.
 * - $row: The raw result object from the query, with all data it fetched.
 *
 * @ingroup views_templates
 */
?>
<!-- SLIDE -->
<li data-transition="fade" data-slotamount="1" data-masterspeed="1000" data-thumb="<?php print ($fields["uri_1"]->content); ?>" data-saveperformance="off" data-title="<?php print ($fields["title"]->content); ?>" class="<?php //print $classes_array[$id]; ?>">

<!-- Video (MP4 and WEBM) -->
                                <div class="tp-caption tp-fade fadeout fullscreenvideo"
                                    data-x="0"
                                    data-y="0"
                                    data-speed="1000"
                                    data-start="1100"
                                    data-easing="Power4.easeOut"
                                    data-elementdelay="0.01"
                                    data-endelementdelay="0.1"
                                    data-endspeed="1500"
                                    data-endeasing="Power4.easeIn"
                                    data-autoplay="true"
                                    data-autoplayonlyfirsttime="false"
                                    data-nextslideatend="true"
                                    data-volume="mute" 
                                    data-forceCover="1" 
                                    data-aspectratio="16:9" 
                                    data-forcerewind="on" 
                                    style="z-index: 2;">
                                    <video class="img-responsive" preload="none" 
                                    poster='<?php print ($fields["uri_1"]->content); ?>'> 
                                    <source src='<?php print ($fields["field_video_url_mp4"]->content); ?>' type='video/mp4' />
                                    <source src='<?php print ($fields["field_video_url_webm"]->content); ?>' type='video/webm' />
                                    </video>
                                </div>

<?php foreach ($fields as $id => $field): ?>
  <?php if (!empty($field->separator)): ?>
    <?php print $field->separator; ?>
  <?php endif; ?>
  <?php print $field->wrapper_prefix; ?>
    <?php print $field->label_html; ?>
    <?php print $field->content; ?>
  <?php print $field->wrapper_suffix; ?>
<?php endforeach; ?>
</li>