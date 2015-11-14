<?php

/**
 * @file
 * Default theme implementation to display the basic html structure of a single
 * Drupal page.
 *
 * Variables:
 * - $css: An array of CSS files for the current page.
 * - $language: (object) The language the site is being displayed in.
 *   $language->language contains its textual representation.
 *   $language->dir contains the language direction. It will either be 'ltr' or 'rtl'.
 * - $rdf_namespaces: All the RDF namespace prefixes used in the HTML document.
 * - $grddl_profile: A GRDDL profile allowing agents to extract the RDF data.
 * - $head_title: A modified version of the page title, for use in the TITLE
 *   tag.
 * - $head_title_array: (array) An associative array containing the string parts
 *   that were used to generate the $head_title variable, already prepared to be
 *   output as TITLE tag. The key/value pairs may contain one or more of the
 *   following, depending on conditions:
 *   - title: The title of the current page, if any.
 *   - name: The name of the site.
 *   - slogan: The slogan of the site, if any, and if there is no title.
 * - $head: Markup for the HEAD section (including meta tags, keyword tags, and
 *   so on).
 * - $styles: Style tags necessary to import all CSS files for the page.
 * - $scripts: Script tags necessary to load the JavaScript files and settings
 *   for the page.
 * - $page_top: Initial markup from any modules that have altered the
 *   page. This variable should always be output first, before all other dynamic
 *   content.
 * - $page: The rendered page content.
 * - $page_bottom: Final closing markup from any modules that have altered the
 *   page. This variable should always be output last, after all other dynamic
 *   content.
 * - $classes String of classes that can be used to style contextually through
 *   CSS.
 *
 * @see template_preprocess()
 * @see template_preprocess_html()
 * @see template_process()
 */

// Get variables
$site_name = variable_get('site_name');
$site_slogan = variable_get('site_slogan');

// Get Cocoon theme settings
$custom_css = theme_get_setting('custom_css');
$to_top = theme_get_setting('to_top');

?><!DOCTYPE html>
<html lang="<?php print $language->language; ?>" dir="<?php print $language->dir; ?>"
<?php print $rdf_namespaces; ?>>

<head>
  <?php print $head; ?>
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="MobileOptimized" content="width" />
  <meta name="HandheldFriendly" content="true" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta http-equiv="cleartype" content="on" />
  <?php if (drupal_is_front_page()) : ?>
    <title><?php print $site_name.' | '. $site_slogan; ?></title>
  <?php else : ?>
    <title><?php print $head_title; ?></title>
  <?php endif; ?>
  <?php print $styles; ?>
  <?php if (theme_get_setting('custom_css')): ?>
    <style type="text/css">
      <?php print $custom_css; ?>
    </style>
  <?php endif; ?>
  <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300' rel='stylesheet' type='text/css'>
  <link href='http://fonts.googleapis.com/css?family=Montserrat:400,700' rel='stylesheet' type='text/css'>
  <!-- COCOON SKIN BEGIN -->
    <link type="text/css" rel="stylesheet" href="<?php print $base_path . $path_to_theme; ?>/css/colors/<?php print (theme_get_setting('skin')); ?>.css" media="all">
  <!-- COCOON SKIN END -->
  <?php print $scripts; ?>
</head>
<body class="<?php print $classes; ?>" <?php print $attributes;?>>
  <div id="skip-link">
    <a href="#main-content" class="element-invisible element-focusable"><?php print t('Skip to main content'); ?></a>
  </div>
  <?php print $page_top; ?>
  <?php print $page; ?>
  <?php if (theme_get_setting('to_top')): ?>
    <!-- Start Back To Top -->
    <a id="back-to-top" style="bottom: -50px;"><i class="icon ion-chevron-up"></i></a>
    <!-- End Back To Top -->
  <?php endif; ?>
  <?php print $page_bottom; ?>
</body>
</html>
