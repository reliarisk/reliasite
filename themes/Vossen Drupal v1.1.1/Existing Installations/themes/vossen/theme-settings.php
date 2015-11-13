<?php
function vossen_form_system_theme_settings_alter(&$form, &$form_state) {
  // Cocoon Options
  $form['cocoon_options'] = array(
      '#type' => 'vertical_tabs',
      '#title' => t('Cocoon Theme Options'),
      '#weight' => 0,
      '#collapsible' => TRUE,
      '#collapsed' => FALSE,
  );
  // Cocoon Theme Skin Panel
  $form['cocoon_options']['cocoon_skin'] = array(
    '#type' => 'fieldset', 
    '#title' => t('Cocoon Theme Skin'), 
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );
  // Cocoon Theme Skin Panel: Select Skin
  $form['cocoon_options']['cocoon_skin']['skin'] = array(
    '#type' => 'select',
    '#title' => t('Select Skin'),
    '#description' => t('Choose a default skin color for the theme.'),
    '#options' => array(
      'beige' => t('Beige'),
      'black' => t('Black'),
      'blue' => t('Blue'),
      'blue2' => t('Blue 2'),
      'brown' => t('Brown'),
      'darkgrey' => t('Dark Grey'),
      'green' => t('Green'),
      'green2' => t('Green 2'),
      'midnight' => t('Midnight'),
      'orange' => t('Orange'),
      'pink' => t('Pink'),
      'purple' => t('Purple'),
      'red' => t('Red'),
      'red2' => t('Red 2'),
      'yellow' => t('Yellow'),
    ),
    '#default_value' => theme_get_setting('skin'),
  );
  // Cocoon Theme Skin Panel: Custom CSS
  $form['cocoon_options']['cocoon_skin']['custom_css'] = array(
    '#type' => 'textarea', 
    '#title' => t('Custom CSS'), 
    '#description' => t('Specify custom CSS tags and styling to apply to the theme. You can also override default styles here.'),
    '#rows' => '5',
    '#default_value' => theme_get_setting('custom_css'),
  );
  // Cocoon Theme Features Panel
  $form['cocoon_options']['cocoon_features'] = array(
    '#type' => 'fieldset', 
    '#title' => t('Cocoon Theme Features'), 
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );
  // Cocoon Theme Features Panel: Preloader
  $form['cocoon_options']['cocoon_features']['preloader'] = array(
    '#type' => 'select',
    '#title' => t('Homepage Preloader'),
    '#description' => t('Display your logo while the homepage loads?'),
    '#options' => array(
      0 => t('No'),
      1 => t('Yes'),
    ),
    '#default_value' => theme_get_setting('preloader'),
  );
  // Cocoon Theme Features Panel: Scroll To Top
  $form['cocoon_options']['cocoon_features']['to_top'] = array(
    '#type' => 'select',
    '#title' => t('Scroll To Top'),
    '#description' => t('Show scroll to top button?'),
    '#options' => array(
      0 => t('No'),
      1 => t('Yes'),
    ),
    '#default_value' => theme_get_setting('to_top'),
  );
  // Cocoon Theme Features Panel: Sticky Header
  $form['cocoon_options']['cocoon_features']['sticky_header'] = array(
    '#type' => 'select',
    '#title' => t('Sticky Header'),
    '#description' => t('Use sticky header?'),
    '#options' => array(
      0 => t('No'),
      1 => t('Yes'),
    ),
    '#default_value' => theme_get_setting('sticky_header'),
  );
  // Cocoon Map Settings
  $form['cocoon_options']['cocoon_map'] = array(
    '#type' => 'fieldset', 
    '#title' => t('Cocoon Map Settings'), 
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );
  // Cocoon Map Settings: Show Map on Homepage
  $form['cocoon_options']['cocoon_map']['show_map'] = array(
    '#type' => 'select',
    '#title' => t('Show Map'),
    '#description' => t('Display Google map on website homepage?'),
    '#options' => array(
      0 => t('No'),
      1 => t('Yes'),
    ),
    '#default_value' => theme_get_setting('show_map'),
  );
  // Cocoon Map Settings: Address Textfield
  $form['cocoon_options']['cocoon_map']['map_address'] = array(
    '#type'          => 'textfield',
    '#title'         => t('Address'),
    '#default_value' => theme_get_setting('map_address'),
    '#description'   => t("Enter the full address to show on the map."),
  );
  // Cocoon Map Settings: Map Marker
  $form['cocoon_options']['cocoon_map']['map_marker'] = array(
    '#type'          => 'textfield',
    '#title'         => t('Map Marker'),
    '#default_value' => theme_get_setting('map_marker'),
    '#description'   => t("Path or absolute URL to the image to use as the Map Marker."),
  );
  // Cocoon Simplenews Settings
  $form['cocoon_options']['cocoon_simplenews'] = array(
    '#type' => 'fieldset', 
    '#title' => t('Cocoon Simplenews Settings'), 
    '#description' => t('These settings will enable AJAX in Simplenews block forms so that users can subscribe without the page refreshing. You simply need to enter the ID for the Newsletter and Launch List category to apply AJAX to their block forms. The ID of each Newsletter Category can be found in the URL on the \'edit newsletter category\' page at admin/config/services/simplenews, e.g. \'admin/config/services/simplenews/categories/1/edit\'.'), 
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );
  // Cocoon Simplenews Settings: Newsletter Subscription Form ID
  $form['cocoon_options']['cocoon_simplenews']['newsletter_subscription_id'] = array(
    '#type'          => 'textfield',
    '#title'         => t('Newsletter Category ID'),
    '#default_value' => theme_get_setting('newsletter_subscription_id'),
    '#description'   => t("Enter the form ID number for the Newsletter category, (e.g. 37)."),
  );
  // Cocoon Simplenews Settings: Launch List Subscription Form ID
  $form['cocoon_options']['cocoon_simplenews']['launch_list_subscription_id'] = array(
    '#type'          => 'textfield',
    '#title'         => t('Launch List Category ID'),
    '#default_value' => theme_get_setting('launch_list_subscription_id'),
    '#description'   => t("Enter the form ID number for the Launch List category, (e.g. 42)."),
  );
}
?>