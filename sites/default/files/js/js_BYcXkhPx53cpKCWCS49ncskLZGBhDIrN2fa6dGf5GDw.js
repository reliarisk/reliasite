
(function ($) {
  Drupal.color = {
    logoChanged: false,
    callback: function(context, settings, form, farb, height, width) {
      // Change the logo to be the real one.
      if (!this.logoChanged) {
        $('#preview #preview-logo img').attr('src', Drupal.settings.color.logo);
        this.logoChanged = true;
      }
      // Remove the logo if the setting is toggled off. 
      if (Drupal.settings.color.logo == null) {
        $('div').remove('#preview-logo');
      }

      // Solid background.
      $('#preview', form).css('backgroundColor', $('#palette input[name="palette[bg]"]', form).val());

      // Text preview.
      $('#preview #preview-main h2, #preview .preview-content', form).css('color', $('#palette input[name="palette[text]"]', form).val());
      $('#preview #preview-content a', form).css('color', $('#palette input[name="palette[link]"]', form).val());

      // Sidebar block.
      $('#preview #preview-sidebar #preview-block', form).css('background-color', $('#palette input[name="palette[sidebar]"]', form).val());
      $('#preview #preview-sidebar #preview-block', form).css('border-color', $('#palette input[name="palette[sidebarborders]"]', form).val());

      // Footer wrapper background.
      $('#preview #preview-footer-wrapper', form).css('background-color', $('#palette input[name="palette[footer]"]', form).val());

      // CSS3 Gradients.
      var gradient_start = $('#palette input[name="palette[top]"]', form).val();
      var gradient_end = $('#palette input[name="palette[bottom]"]', form).val();

      $('#preview #preview-header', form).attr('style', "background-color: " + gradient_start + "; background-image: -webkit-gradient(linear, 0% 0%, 0% 100%, from(" + gradient_start + "), to(" + gradient_end + ")); background-image: -moz-linear-gradient(-90deg, " + gradient_start + ", " + gradient_end + ");");

      $('#preview #preview-site-name', form).css('color', $('#palette input[name="palette[titleslogan]"]', form).val());
    }
  };
})(jQuery);
;
/**
 * @file
 * Attaches the behaviors for the Color module.
 */

(function ($) {

Drupal.behaviors.color = {
  attach: function (context, settings) {
    var i, j, colors, field_name;
    // This behavior attaches by ID, so is only valid once on a page.
    var form = $('#system-theme-settings .color-form', context).once('color');
    if (form.length == 0) {
      return;
    }
    var inputs = [];
    var hooks = [];
    var locks = [];
    var focused = null;

    // Add Farbtastic.
    $(form).prepend('<div id="placeholder"></div>').addClass('color-processed');
    var farb = $.farbtastic('#placeholder');

    // Decode reference colors to HSL.
    var reference = settings.color.reference;
    for (i in reference) {
      reference[i] = farb.RGBToHSL(farb.unpack(reference[i]));
    }

    // Build a preview.
    var height = [];
    var width = [];
    // Loop through all defined gradients.
    for (i in settings.gradients) {
      // Add element to display the gradient.
      $('#preview').once('color').append('<div id="gradient-' + i + '"></div>');
      var gradient = $('#preview #gradient-' + i);
      // Add height of current gradient to the list (divided by 10).
      height.push(parseInt(gradient.css('height'), 10) / 10);
      // Add width of current gradient to the list (divided by 10).
      width.push(parseInt(gradient.css('width'), 10) / 10);
      // Add rows (or columns for horizontal gradients).
      // Each gradient line should have a height (or width for horizontal
      // gradients) of 10px (because we divided the height/width by 10 above).
      for (j = 0; j < (settings.gradients[i]['direction'] == 'vertical' ? height[i] : width[i]); ++j) {
        gradient.append('<div class="gradient-line"></div>');
      }
    }

    // Fix preview background in IE6.
    if (navigator.appVersion.match(/MSIE [0-6]\./)) {
      var e = $('#preview #img')[0];
      var image = e.currentStyle.backgroundImage;
      e.style.backgroundImage = 'none';
      e.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + image.substring(5, image.length - 2) + "')";
    }

    // Set up colorScheme selector.
    $('#edit-scheme', form).change(function () {
      var schemes = settings.color.schemes, colorScheme = this.options[this.selectedIndex].value;
      if (colorScheme != '' && schemes[colorScheme]) {
        // Get colors of active scheme.
        colors = schemes[colorScheme];
        for (field_name in colors) {
          callback($('#edit-palette-' + field_name), colors[field_name], false, true);
        }
        preview();
      }
    });

    /**
     * Renders the preview.
     */
    function preview() {
      Drupal.color.callback(context, settings, form, farb, height, width);
    }

    /**
     * Shifts a given color, using a reference pair (ref in HSL).
     *
     * This algorithm ensures relative ordering on the saturation and luminance
     * axes is preserved, and performs a simple hue shift.
     *
     * It is also symmetrical. If: shift_color(c, a, b) == d, then
     * shift_color(d, b, a) == c.
     */
    function shift_color(given, ref1, ref2) {
      // Convert to HSL.
      given = farb.RGBToHSL(farb.unpack(given));

      // Hue: apply delta.
      given[0] += ref2[0] - ref1[0];

      // Saturation: interpolate.
      if (ref1[1] == 0 || ref2[1] == 0) {
        given[1] = ref2[1];
      }
      else {
        var d = ref1[1] / ref2[1];
        if (d > 1) {
          given[1] /= d;
        }
        else {
          given[1] = 1 - (1 - given[1]) * d;
        }
      }

      // Luminance: interpolate.
      if (ref1[2] == 0 || ref2[2] == 0) {
        given[2] = ref2[2];
      }
      else {
        var d = ref1[2] / ref2[2];
        if (d > 1) {
          given[2] /= d;
        }
        else {
          given[2] = 1 - (1 - given[2]) * d;
        }
      }

      return farb.pack(farb.HSLToRGB(given));
    }

    /**
     * Callback for Farbtastic when a new color is chosen.
     */
    function callback(input, color, propagate, colorScheme) {
      var matched;
      // Set background/foreground colors.
      $(input).css({
        backgroundColor: color,
        'color': farb.RGBToHSL(farb.unpack(color))[2] > 0.5 ? '#000' : '#fff'
      });

      // Change input value.
      if ($(input).val() && $(input).val() != color) {
        $(input).val(color);

        // Update locked values.
        if (propagate) {
          i = input.i;
          for (j = i + 1; ; ++j) {
            if (!locks[j - 1] || $(locks[j - 1]).is('.unlocked')) break;
            matched = shift_color(color, reference[input.key], reference[inputs[j].key]);
            callback(inputs[j], matched, false);
          }
          for (j = i - 1; ; --j) {
            if (!locks[j] || $(locks[j]).is('.unlocked')) break;
            matched = shift_color(color, reference[input.key], reference[inputs[j].key]);
            callback(inputs[j], matched, false);
          }

          // Update preview.
          preview();
        }

        // Reset colorScheme selector.
        if (!colorScheme) {
          resetScheme();
        }
      }
    }

    /**
     * Resets the color scheme selector.
     */
    function resetScheme() {
      $('#edit-scheme', form).each(function () {
        this.selectedIndex = this.options.length - 1;
      });
    }

    /**
     * Focuses Farbtastic on a particular field.
     */
    function focus() {
      var input = this;
      // Remove old bindings.
      focused && $(focused).unbind('keyup', farb.updateValue)
          .unbind('keyup', preview).unbind('keyup', resetScheme)
          .parent().removeClass('item-selected');

      // Add new bindings.
      focused = this;
      farb.linkTo(function (color) { callback(input, color, true, false); });
      farb.setColor(this.value);
      $(focused).keyup(farb.updateValue).keyup(preview).keyup(resetScheme)
        .parent().addClass('item-selected');
    }

    // Initialize color fields.
    $('#palette input.form-text', form)
    .each(function () {
      // Extract palette field name
      this.key = this.id.substring(13);

      // Link to color picker temporarily to initialize.
      farb.linkTo(function () {}).setColor('#000').linkTo(this);

      // Add lock.
      var i = inputs.length;
      if (inputs.length) {
        var lock = $('<div class="lock"></div>').toggle(
          function () {
            $(this).addClass('unlocked');
            $(hooks[i - 1]).attr('class',
              locks[i - 2] && $(locks[i - 2]).is(':not(.unlocked)') ? 'hook up' : 'hook'
            );
            $(hooks[i]).attr('class',
              locks[i] && $(locks[i]).is(':not(.unlocked)') ? 'hook down' : 'hook'
            );
          },
          function () {
            $(this).removeClass('unlocked');
            $(hooks[i - 1]).attr('class',
              locks[i - 2] && $(locks[i - 2]).is(':not(.unlocked)') ? 'hook both' : 'hook down'
            );
            $(hooks[i]).attr('class',
              locks[i] && $(locks[i]).is(':not(.unlocked)') ? 'hook both' : 'hook up'
            );
          }
        );
        $(this).after(lock);
        locks.push(lock);
      };

      // Add hook.
      var hook = $('<div class="hook"></div>');
      $(this).after(hook);
      hooks.push(hook);

      $(this).parent().find('.lock').click();
      this.i = i;
      inputs.push(this);
    })
    .focus(focus);

    $('#palette label', form);

    // Focus first color.
    focus.call(inputs[0]);

    // Render preview.
    preview();
  }
};

})(jQuery);
;
(function ($) {

Drupal.behaviors.textarea = {
  attach: function (context, settings) {
    $('.form-textarea-wrapper.resizable', context).once('textarea', function () {
      var staticOffset = null;
      var textarea = $(this).addClass('resizable-textarea').find('textarea');
      var grippie = $('<div class="grippie"></div>').mousedown(startDrag);

      grippie.insertAfter(textarea);

      function startDrag(e) {
        staticOffset = textarea.height() - e.pageY;
        textarea.css('opacity', 0.25);
        $(document).mousemove(performDrag).mouseup(endDrag);
        return false;
      }

      function performDrag(e) {
        textarea.height(Math.max(32, staticOffset + e.pageY) + 'px');
        return false;
      }

      function endDrag(e) {
        $(document).unbind('mousemove', performDrag).unbind('mouseup', endDrag);
        textarea.css('opacity', 1);
      }
    });
  }
};

})(jQuery);
;
(function ($) {

/**
 * Toggle the visibility of a fieldset using smooth animations.
 */
Drupal.toggleFieldset = function (fieldset) {
  var $fieldset = $(fieldset);
  if ($fieldset.is('.collapsed')) {
    var $content = $('> .fieldset-wrapper', fieldset).hide();
    $fieldset
      .removeClass('collapsed')
      .trigger({ type: 'collapsed', value: false })
      .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Hide'));
    $content.slideDown({
      duration: 'fast',
      easing: 'linear',
      complete: function () {
        Drupal.collapseScrollIntoView(fieldset);
        fieldset.animating = false;
      },
      step: function () {
        // Scroll the fieldset into view.
        Drupal.collapseScrollIntoView(fieldset);
      }
    });
  }
  else {
    $fieldset.trigger({ type: 'collapsed', value: true });
    $('> .fieldset-wrapper', fieldset).slideUp('fast', function () {
      $fieldset
        .addClass('collapsed')
        .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Show'));
      fieldset.animating = false;
    });
  }
};

/**
 * Scroll a given fieldset into view as much as possible.
 */
Drupal.collapseScrollIntoView = function (node) {
  var h = document.documentElement.clientHeight || document.body.clientHeight || 0;
  var offset = document.documentElement.scrollTop || document.body.scrollTop || 0;
  var posY = $(node).offset().top;
  var fudge = 55;
  if (posY + node.offsetHeight + fudge > h + offset) {
    if (node.offsetHeight > h) {
      window.scrollTo(0, posY);
    }
    else {
      window.scrollTo(0, posY + node.offsetHeight - h + fudge);
    }
  }
};

Drupal.behaviors.collapse = {
  attach: function (context, settings) {
    $('fieldset.collapsible', context).once('collapse', function () {
      var $fieldset = $(this);
      // Expand fieldset if there are errors inside, or if it contains an
      // element that is targeted by the URI fragment identifier.
      var anchor = location.hash && location.hash != '#' ? ', ' + location.hash : '';
      if ($fieldset.find('.error' + anchor).length) {
        $fieldset.removeClass('collapsed');
      }

      var summary = $('<span class="summary"></span>');
      $fieldset.
        bind('summaryUpdated', function () {
          var text = $.trim($fieldset.drupalGetSummary());
          summary.html(text ? ' (' + text + ')' : '');
        })
        .trigger('summaryUpdated');

      // Turn the legend into a clickable link, but retain span.fieldset-legend
      // for CSS positioning.
      var $legend = $('> legend .fieldset-legend', this);

      $('<span class="fieldset-legend-prefix element-invisible"></span>')
        .append($fieldset.hasClass('collapsed') ? Drupal.t('Show') : Drupal.t('Hide'))
        .prependTo($legend)
        .after(' ');

      // .wrapInner() does not retain bound events.
      var $link = $('<a class="fieldset-title" href="#"></a>')
        .prepend($legend.contents())
        .appendTo($legend)
        .click(function () {
          var fieldset = $fieldset.get(0);
          // Don't animate multiple times.
          if (!fieldset.animating) {
            fieldset.animating = true;
            Drupal.toggleFieldset(fieldset);
          }
          return false;
        });

      $legend.append(summary);
    });
  }
};

})(jQuery);
;
(function ($) {

Drupal.toolbar = Drupal.toolbar || {};

/**
 * Attach toggling behavior and notify the overlay of the toolbar.
 */
Drupal.behaviors.toolbar = {
  attach: function(context) {

    // Set the initial state of the toolbar.
    $('#toolbar', context).once('toolbar', Drupal.toolbar.init);

    // Toggling toolbar drawer.
    $('#toolbar a.toggle', context).once('toolbar-toggle').click(function(e) {
      Drupal.toolbar.toggle();
      // Allow resize event handlers to recalculate sizes/positions.
      $(window).triggerHandler('resize');
      return false;
    });
  }
};

/**
 * Retrieve last saved cookie settings and set up the initial toolbar state.
 */
Drupal.toolbar.init = function() {
  // Retrieve the collapsed status from a stored cookie.
  var collapsed = $.cookie('Drupal.toolbar.collapsed');

  // Expand or collapse the toolbar based on the cookie value.
  if (collapsed == 1) {
    Drupal.toolbar.collapse();
  }
  else {
    Drupal.toolbar.expand();
  }
};

/**
 * Collapse the toolbar.
 */
Drupal.toolbar.collapse = function() {
  var toggle_text = Drupal.t('Show shortcuts');
  $('#toolbar div.toolbar-drawer').addClass('collapsed');
  $('#toolbar a.toggle')
    .removeClass('toggle-active')
    .attr('title',  toggle_text)
    .html(toggle_text);
  $('body').removeClass('toolbar-drawer').css('paddingTop', Drupal.toolbar.height());
  $.cookie(
    'Drupal.toolbar.collapsed',
    1,
    {
      path: Drupal.settings.basePath,
      // The cookie should "never" expire.
      expires: 36500
    }
  );
};

/**
 * Expand the toolbar.
 */
Drupal.toolbar.expand = function() {
  var toggle_text = Drupal.t('Hide shortcuts');
  $('#toolbar div.toolbar-drawer').removeClass('collapsed');
  $('#toolbar a.toggle')
    .addClass('toggle-active')
    .attr('title',  toggle_text)
    .html(toggle_text);
  $('body').addClass('toolbar-drawer').css('paddingTop', Drupal.toolbar.height());
  $.cookie(
    'Drupal.toolbar.collapsed',
    0,
    {
      path: Drupal.settings.basePath,
      // The cookie should "never" expire.
      expires: 36500
    }
  );
};

/**
 * Toggle the toolbar.
 */
Drupal.toolbar.toggle = function() {
  if ($('#toolbar div.toolbar-drawer').hasClass('collapsed')) {
    Drupal.toolbar.expand();
  }
  else {
    Drupal.toolbar.collapse();
  }
};

Drupal.toolbar.height = function() {
  var $toolbar = $('#toolbar');
  var height = $toolbar.outerHeight();
  // In modern browsers (including IE9), when box-shadow is defined, use the
  // normal height.
  var cssBoxShadowValue = $toolbar.css('box-shadow');
  var boxShadow = (typeof cssBoxShadowValue !== 'undefined' && cssBoxShadowValue !== 'none');
  // In IE8 and below, we use the shadow filter to apply box-shadow styles to
  // the toolbar. It adds some extra height that we need to remove.
  if (!boxShadow && /DXImageTransform\.Microsoft\.Shadow/.test($toolbar.css('filter'))) {
    height -= $toolbar[0].filters.item("DXImageTransform.Microsoft.Shadow").strength;
  }
  return height;
};

})(jQuery);
;
