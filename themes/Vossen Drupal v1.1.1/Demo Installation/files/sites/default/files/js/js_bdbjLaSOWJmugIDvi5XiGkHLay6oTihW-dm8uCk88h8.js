jQuery(document).ready(function($) {
    var state = $.cookie('themekey_redirect_state');
    if (state === null) {
        // Cookie not set => state 0.
        state = 0;
    }
    if (state == 0) {
        // Check if the user has to be redirected.
        $.ajax({
            // add the current path and query to the url for ThemeKey's rule matching
            url: Drupal.settings.basePath.replace(/\/$/, "") + '/index.php?q=themekey/redirect_callback' + window.location.pathname + window.location.search.replace(/^\?/, "&"),
            dataType: 'json',
            type: 'GET',
            success: function(target) {
                if (target) {
                    if (Drupal.settings.ThemeKeyRedirect.redirectOnce) {
                        // Set Domain A state to 2.
                        $.cookie('themekey_redirect_state', 2, { path: '/'});
                    }
                    window.location.href = target;
                    // If the targeted page runs ThemeKey Redirect it sets the
                    // state to 1 or 2.
                }
            }
        });
        if (Drupal.settings.ThemeKeyRedirect.checkOnce) {
            // Set Domain A state to 2.
            $.cookie('themekey_redirect_state', 2, { path: '/'});
        }
    }
    else if (state == 1) {
        // The user has been redirected but is optionally allowed once to switch
        // back manually.
        $('#block-themekey-redirect-domain-selector').show();
        // Set Domain B state to 2.
        $.cookie('themekey_redirect_state', 2, { path: '/'});
    }
    // State 2 indicates that the user has been redirected and no further redirects will happen.
});
;
(function ($) {

/**
 * A progressbar object. Initialized with the given id. Must be inserted into
 * the DOM afterwards through progressBar.element.
 *
 * method is the function which will perform the HTTP request to get the
 * progress bar state. Either "GET" or "POST".
 *
 * e.g. pb = new progressBar('myProgressBar');
 *      some_element.appendChild(pb.element);
 */
Drupal.progressBar = function (id, updateCallback, method, errorCallback) {
  var pb = this;
  this.id = id;
  this.method = method || 'GET';
  this.updateCallback = updateCallback;
  this.errorCallback = errorCallback;

  // The WAI-ARIA setting aria-live="polite" will announce changes after users
  // have completed their current activity and not interrupt the screen reader.
  this.element = $('<div class="progress" aria-live="polite"></div>').attr('id', id);
  this.element.html('<div class="bar"><div class="filled"></div></div>' +
                    '<div class="percentage"></div>' +
                    '<div class="message">&nbsp;</div>');
};

/**
 * Set the percentage and status message for the progressbar.
 */
Drupal.progressBar.prototype.setProgress = function (percentage, message) {
  if (percentage >= 0 && percentage <= 100) {
    $('div.filled', this.element).css('width', percentage + '%');
    $('div.percentage', this.element).html(percentage + '%');
  }
  $('div.message', this.element).html(message);
  if (this.updateCallback) {
    this.updateCallback(percentage, message, this);
  }
};

/**
 * Start monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.startMonitoring = function (uri, delay) {
  this.delay = delay;
  this.uri = uri;
  this.sendPing();
};

/**
 * Stop monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.stopMonitoring = function () {
  clearTimeout(this.timer);
  // This allows monitoring to be stopped from within the callback.
  this.uri = null;
};

/**
 * Request progress data from server.
 */
Drupal.progressBar.prototype.sendPing = function () {
  if (this.timer) {
    clearTimeout(this.timer);
  }
  if (this.uri) {
    var pb = this;
    // When doing a post request, you need non-null data. Otherwise a
    // HTTP 411 or HTTP 406 (with Apache mod_security) error may result.
    $.ajax({
      type: this.method,
      url: this.uri,
      data: '',
      dataType: 'json',
      success: function (progress) {
        // Display errors.
        if (progress.status == 0) {
          pb.displayError(progress.data);
          return;
        }
        // Update display.
        pb.setProgress(progress.percentage, progress.message);
        // Schedule next timer.
        pb.timer = setTimeout(function () { pb.sendPing(); }, pb.delay);
      },
      error: function (xmlhttp) {
        pb.displayError(Drupal.ajaxError(xmlhttp, pb.uri));
      }
    });
  }
};

/**
 * Display errors on the page.
 */
Drupal.progressBar.prototype.displayError = function (string) {
  var error = $('<div class="messages error"></div>').html(string);
  $(this.element).before(error).hide();

  if (this.errorCallback) {
    this.errorCallback(this);
  }
};

})(jQuery);
;
/**
 * @file
 * Some basic behaviors and utility functions for Views.
 */
(function ($) {

Drupal.Views = {};

/**
 * jQuery UI tabs, Views integration component
 */
Drupal.behaviors.viewsTabs = {
  attach: function (context) {
    if ($.viewsUi && $.viewsUi.tabs) {
      $('#views-tabset').once('views-processed').viewsTabs({
        selectedClass: 'active'
      });
    }

    $('a.views-remove-link').once('views-processed').click(function(event) {
      var id = $(this).attr('id').replace('views-remove-link-', '');
      $('#views-row-' + id).hide();
      $('#views-removed-' + id).attr('checked', true);
      event.preventDefault();
   });
  /**
    * Here is to handle display deletion
    * (checking in the hidden checkbox and hiding out the row)
    */
  $('a.display-remove-link')
    .addClass('display-processed')
    .click(function() {
      var id = $(this).attr('id').replace('display-remove-link-', '');
      $('#display-row-' + id).hide();
      $('#display-removed-' + id).attr('checked', true);
      return false;
  });
  }
};

/**
 * Helper function to parse a querystring.
 */
Drupal.Views.parseQueryString = function (query) {
  var args = {};
  var pos = query.indexOf('?');
  if (pos != -1) {
    query = query.substring(pos + 1);
  }
  var pairs = query.split('&');
  for(var i in pairs) {
    if (typeof(pairs[i]) == 'string') {
      var pair = pairs[i].split('=');
      // Ignore the 'q' path argument, if present.
      if (pair[0] != 'q' && pair[1]) {
        args[decodeURIComponent(pair[0].replace(/\+/g, ' '))] = decodeURIComponent(pair[1].replace(/\+/g, ' '));
      }
    }
  }
  return args;
};

/**
 * Helper function to return a view's arguments based on a path.
 */
Drupal.Views.parseViewArgs = function (href, viewPath) {
  var returnObj = {};
  var path = Drupal.Views.getPath(href);
  // Ensure we have a correct path.
  if (viewPath && path.substring(0, viewPath.length + 1) == viewPath + '/') {
    var args = decodeURIComponent(path.substring(viewPath.length + 1, path.length));
    returnObj.view_args = args;
    returnObj.view_path = path;
  }
  return returnObj;
};

/**
 * Strip off the protocol plus domain from an href.
 */
Drupal.Views.pathPortion = function (href) {
  // Remove e.g. http://example.com if present.
  var protocol = window.location.protocol;
  if (href.substring(0, protocol.length) == protocol) {
    // 2 is the length of the '//' that normally follows the protocol
    href = href.substring(href.indexOf('/', protocol.length + 2));
  }
  return href;
};

/**
 * Return the Drupal path portion of an href.
 */
Drupal.Views.getPath = function (href) {
  href = Drupal.Views.pathPortion(href);
  href = href.substring(Drupal.settings.basePath.length, href.length);
  // 3 is the length of the '?q=' added to the url without clean urls.
  if (href.substring(0, 3) == '?q=') {
    href = href.substring(3, href.length);
  }
  var chars = ['#', '?', '&'];
  for (i in chars) {
    if (href.indexOf(chars[i]) > -1) {
      href = href.substr(0, href.indexOf(chars[i]));
    }
  }
  return href;
};

})(jQuery);
;
/**
 * @file
 * Handles AJAX fetching of views, including filter submission and response.
 */
(function ($) {

/**
 * Attaches the AJAX behavior to Views exposed filter forms and key View links.
 */
Drupal.behaviors.ViewsAjaxView = {};
Drupal.behaviors.ViewsAjaxView.attach = function() {
  if (Drupal.settings && Drupal.settings.views && Drupal.settings.views.ajaxViews) {
    $.each(Drupal.settings.views.ajaxViews, function(i, settings) {
      Drupal.views.instances[i] = new Drupal.views.ajaxView(settings);
    });
  }
};

Drupal.views = {};
Drupal.views.instances = {};

/**
 * Javascript object for a certain view.
 */
Drupal.views.ajaxView = function(settings) {
  var selector = '.view-dom-id-' + settings.view_dom_id;
  this.$view = $(selector);

  // Retrieve the path to use for views' ajax.
  var ajax_path = Drupal.settings.views.ajax_path;

  // If there are multiple views this might've ended up showing up multiple times.
  if (ajax_path.constructor.toString().indexOf("Array") != -1) {
    ajax_path = ajax_path[0];
  }

  // Check if there are any GET parameters to send to views.
  var queryString = window.location.search || '';
  if (queryString !== '') {
    // Remove the question mark and Drupal path component if any.
    var queryString = queryString.slice(1).replace(/q=[^&]+&?|&?render=[^&]+/, '');
    if (queryString !== '') {
      // If there is a '?' in ajax_path, clean url are on and & should be used to add parameters.
      queryString = ((/\?/.test(ajax_path)) ? '&' : '?') + queryString;
    }
  }

  this.element_settings = {
    url: ajax_path + queryString,
    submit: settings,
    setClick: true,
    event: 'click',
    selector: selector,
    progress: { type: 'throbber' }
  };

  this.settings = settings;

  // Add the ajax to exposed forms.
  this.$exposed_form = this.$view.children('.view-filters').children('form');
  this.$exposed_form.once(jQuery.proxy(this.attachExposedFormAjax, this));

  // Add the ajax to pagers.
  this.$view
    // Don't attach to nested views. Doing so would attach multiple behaviors
    // to a given element.
    .filter(jQuery.proxy(this.filterNestedViews, this))
    .once(jQuery.proxy(this.attachPagerAjax, this));

  // Add a trigger to update this view specifically. In order to trigger a
  // refresh use the following code.
  //
  // @code
  // jQuery('.view-name').trigger('RefreshView');
  // @endcode
  // Add a trigger to update this view specifically.
  var self_settings = this.element_settings;
  self_settings.event = 'RefreshView';
  this.refreshViewAjax = new Drupal.ajax(this.selector, this.$view, self_settings);
};

Drupal.views.ajaxView.prototype.attachExposedFormAjax = function() {
  var button = $('input[type=submit], button[type=submit], input[type=image]', this.$exposed_form);
  button = button[0];

  this.exposedFormAjax = new Drupal.ajax($(button).attr('id'), button, this.element_settings);
};

Drupal.views.ajaxView.prototype.filterNestedViews= function() {
  // If there is at least one parent with a view class, this view
  // is nested (e.g., an attachment). Bail.
  return !this.$view.parents('.view').size();
};

/**
 * Attach the ajax behavior to each link.
 */
Drupal.views.ajaxView.prototype.attachPagerAjax = function() {
  this.$view.find('ul.pager > li > a, th.views-field a, .attachment .views-summary a')
  .each(jQuery.proxy(this.attachPagerLinkAjax, this));
};

/**
 * Attach the ajax behavior to a singe link.
 */
Drupal.views.ajaxView.prototype.attachPagerLinkAjax = function(id, link) {
  var $link = $(link);
  var viewData = {};
  var href = $link.attr('href');
  // Construct an object using the settings defaults and then overriding
  // with data specific to the link.
  $.extend(
    viewData,
    this.settings,
    Drupal.Views.parseQueryString(href),
    // Extract argument data from the URL.
    Drupal.Views.parseViewArgs(href, this.settings.view_base_path)
  );

  // For anchor tags, these will go to the target of the anchor rather
  // than the usual location.
  $.extend(viewData, Drupal.Views.parseViewArgs(href, this.settings.view_base_path));

  this.element_settings.submit = viewData;
  this.pagerAjax = new Drupal.ajax(false, $link, this.element_settings);
};

Drupal.ajax.prototype.commands.viewsScrollTop = function (ajax, response, status) {
  // Scroll to the top of the view. This will allow users
  // to browse newly loaded content after e.g. clicking a pager
  // link.
  var offset = $(response.selector).offset();
  // We can't guarantee that the scrollable object should be
  // the body, as the view could be embedded in something
  // more complex such as a modal popup. Recurse up the DOM
  // and scroll the first element that has a non-zero top.
  var scrollTarget = response.selector;
  while ($(scrollTarget).scrollTop() == 0 && $(scrollTarget).parent()) {
    scrollTarget = $(scrollTarget).parent();
  }
  // Only scroll upward
  if (offset.top - 10 < $(scrollTarget).scrollTop()) {
    $(scrollTarget).animate({scrollTop: (offset.top - 10)}, 500);
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

/**
 * JavaScript behaviors for the front-end display of webforms.
 */

(function ($) {

Drupal.behaviors.webform = Drupal.behaviors.webform || {};

Drupal.behaviors.webform.attach = function(context) {
  // Calendar datepicker behavior.
  Drupal.webform.datepicker(context);

  // Conditional logic.
  if (Drupal.settings.webform && Drupal.settings.webform.conditionals) {
    Drupal.webform.conditional(context);
  }
};

Drupal.webform = Drupal.webform || {};

Drupal.webform.datepicker = function(context) {
  $('div.webform-datepicker').each(function() {
    var $webformDatepicker = $(this);
    var $calendar = $webformDatepicker.find('input.webform-calendar');

    // Ensure the page we're on actually contains a datepicker.
    if ($calendar.length == 0) {
      return;
    }

    var startDate = $calendar[0].className.replace(/.*webform-calendar-start-(\d{4}-\d{2}-\d{2}).*/, '$1').split('-');
    var endDate = $calendar[0].className.replace(/.*webform-calendar-end-(\d{4}-\d{2}-\d{2}).*/, '$1').split('-');
    var firstDay = $calendar[0].className.replace(/.*webform-calendar-day-(\d).*/, '$1');
    // Convert date strings into actual Date objects.
    startDate = new Date(startDate[0], startDate[1] - 1, startDate[2]);
    endDate = new Date(endDate[0], endDate[1] - 1, endDate[2]);

    // Ensure that start comes before end for datepicker.
    if (startDate > endDate) {
      var laterDate = startDate;
      startDate = endDate;
      endDate = laterDate;
    }

    var startYear = startDate.getFullYear();
    var endYear = endDate.getFullYear();

    // Set up the jQuery datepicker element.
    $calendar.datepicker({
      dateFormat: 'yy-mm-dd',
      yearRange: startYear + ':' + endYear,
      firstDay: parseInt(firstDay),
      minDate: startDate,
      maxDate: endDate,
      onSelect: function(dateText, inst) {
        var date = dateText.split('-');
        $webformDatepicker.find('select.year, input.year').val(+date[0]).trigger('change');
        $webformDatepicker.find('select.month').val(+date[1]).trigger('change');
        $webformDatepicker.find('select.day').val(+date[2]).trigger('change');
      },
      beforeShow: function(input, inst) {
        // Get the select list values.
        var year = $webformDatepicker.find('select.year, input.year').val();
        var month = $webformDatepicker.find('select.month').val();
        var day = $webformDatepicker.find('select.day').val();

        // If empty, default to the current year/month/day in the popup.
        var today = new Date();
        year = year ? year : today.getFullYear();
        month = month ? month : today.getMonth() + 1;
        day = day ? day : today.getDate();

        // Make sure that the default year fits in the available options.
        year = (year < startYear || year > endYear) ? startYear : year;

        // jQuery UI Datepicker will read the input field and base its date off
        // of that, even though in our case the input field is a button.
        $(input).val(year + '-' + month + '-' + day);
      }
    });

    // Prevent the calendar button from submitting the form.
    $calendar.click(function(event) {
      $(this).focus();
      event.preventDefault();
    });
  });
};

Drupal.webform.conditional = function(context) {
  // Add the bindings to each webform on the page.
  $.each(Drupal.settings.webform.conditionals, function(formKey, settings) {
    var $form = $('.' + formKey + ':not(.webform-conditional-processed)');
    $form.each(function(index, currentForm) {
      var $currentForm = $(currentForm);
      $currentForm.addClass('webform-conditional-processed');
      $currentForm.bind('change', { 'settings': settings }, Drupal.webform.conditionalCheck);

      // Trigger all the elements that cause conditionals on this form.
      $.each(Drupal.settings.webform.conditionals[formKey]['sourceMap'], function(elementKey) {
        $currentForm.find('.' + elementKey).find('input,select,textarea').filter(':first').trigger('change');
      });
    })
  });
};

/**
 * Event handler to respond to field changes in a form.
 *
 * This event is bound to the entire form, not individual fields.
 */
Drupal.webform.conditionalCheck = function(e) {
  var $triggerElement = $(e.target).closest('.webform-component');
  var $form = $triggerElement.closest('form');
  var triggerElementKey = $triggerElement.attr('class').match(/webform-component--[^ ]+/)[0];
  var settings = e.data.settings;


  if (settings.sourceMap[triggerElementKey]) {
    $.each(settings.sourceMap[triggerElementKey], function(n, rgid) {
      var ruleGroup = settings.ruleGroups[rgid];

      // Perform the comparison callback and build the results for this group.
      var conditionalResult = true;
      var conditionalResults = [];
      $.each(ruleGroup['rules'], function(m, rule) {
        var elementKey = rule['source'];
        var element = $form.find('.' + elementKey)[0];
        var existingValue = settings.values[elementKey] ? settings.values[elementKey] : null;
        conditionalResults.push(window['Drupal']['webform'][rule.callback](element, existingValue, rule['value'] ));
      });

      // Filter out false values.
      var filteredResults = [];
      for (var i = 0; i < conditionalResults.length; i++) {
        if (conditionalResults[i]) {
          filteredResults.push(conditionalResults[i]);
        }
      }

      // Calculate the and/or result.
      if (ruleGroup['andor'] === 'or') {
        conditionalResult = filteredResults.length > 0;
      }
      else {
        conditionalResult = filteredResults.length === conditionalResults.length;
      }

      // Flip the result of the action is to hide.
      var showComponent;
      if (ruleGroup['action'] == 'hide') {
        showComponent = !conditionalResult;
      }
      else {
        showComponent = conditionalResult;
      }

      var $target = $form.find('.' + ruleGroup['target']);
      var $targetElements;
      if (showComponent) {
        $targetElements = $target.find('.webform-conditional-disabled').removeClass('webform-conditional-disabled');
        $.fn.prop ? $targetElements.prop('disabled', false) : $targetElements.removeAttr('disabled');
        $target.show();
      }
      else {
        $targetElements = $target.find(':input').addClass('webform-conditional-disabled');
        $.fn.prop ? $targetElements.prop('disabled', true) : $targetElements.attr('disabled', true);
        $target.hide();
      }
    });
  }

};

Drupal.webform.conditionalOperatorStringEqual = function(element, existingValue, ruleValue) {
  var returnValue = false;
  var currentValue = Drupal.webform.stringValue(element, existingValue);
  $.each(currentValue, function(n, value) {
    if (value.toLowerCase() === ruleValue.toLowerCase()) {
      returnValue = true;
      return false; // break.
    }
  });
  return returnValue;
};

Drupal.webform.conditionalOperatorStringNotEqual = function(element, existingValue, ruleValue) {
  var found = false;
  var currentValue = Drupal.webform.stringValue(element, existingValue);
  $.each(currentValue, function(n, value) {
    if (value.toLowerCase() === ruleValue.toLowerCase()) {
      found = true;
    }
  });
  return !found;
};

Drupal.webform.conditionalOperatorStringContains = function(element, existingValue, ruleValue) {
  var returnValue = false;
  var currentValue = Drupal.webform.stringValue(element, existingValue);
  $.each(currentValue, function(n, value) {
    if (value.toLowerCase().indexOf(ruleValue.toLowerCase()) > -1) {
      returnValue = true;
      return false; // break.
    }
  });
  return returnValue;
};

Drupal.webform.conditionalOperatorStringDoesNotContain = function(element, existingValue, ruleValue) {
  var found = false;
  var currentValue = Drupal.webform.stringValue(element, existingValue);
  $.each(currentValue, function(n, value) {
    if (value.toLowerCase().indexOf(ruleValue.toLowerCase()) > -1) {
      found = true;
    }
  });
  return !found;
};

Drupal.webform.conditionalOperatorStringBeginsWith = function(element, existingValue, ruleValue) {
  var returnValue = false;
  var currentValue = Drupal.webform.stringValue(element, existingValue);
  $.each(currentValue, function(n, value) {
    if (value.toLowerCase().indexOf(ruleValue.toLowerCase()) === 0) {
      returnValue = true;
      return false; // break.
    }
  });
  return returnValue;
};

Drupal.webform.conditionalOperatorStringEndsWith = function(element, existingValue, ruleValue) {
  var returnValue = false;
  var currentValue = Drupal.webform.stringValue(element, existingValue);
  $.each(currentValue, function(n, value) {
    if (value.toLowerCase().lastIndexOf(ruleValue.toLowerCase()) === value.length - ruleValue.length) {
      returnValue = true;
      return false; // break.
    }
  });
  return returnValue;
};

Drupal.webform.conditionalOperatorStringEmpty = function(element, existingValue, ruleValue) {
  var currentValue = Drupal.webform.stringValue(element, existingValue);
  var returnValue = true;
  $.each(currentValue, function(n, value) {
    if (value !== '') {
      returnValue = false;
      return false; // break.
    }
  });
  return returnValue;
};

Drupal.webform.conditionalOperatorStringNotEmpty = function(element, existingValue, ruleValue) {
  return !Drupal.webform.conditionalOperatorStringEmpty(element, existingValue, ruleValue);
};

Drupal.webform.conditionalOperatorNumericEqual = function(element, existingValue, ruleValue) {
  // See float comparison: http://php.net/manual/en/language.types.float.php
  var currentValue = Drupal.webform.stringValue(element, existingValue);
  var epsilon = 0.000001;
  // An empty string does not match any number.
  return currentValue[0] === '' ? false : (Math.abs(parseFloat(currentValue[0]) - parseFloat(ruleValue)) < epsilon);
};

Drupal.webform.conditionalOperatorNumericNotEqual = function(element, existingValue, ruleValue) {
  // See float comparison: http://php.net/manual/en/language.types.float.php
  var currentValue = Drupal.webform.stringValue(element, existingValue);
  var epsilon = 0.000001;
  // An empty string does not match any number.
  return currentValue[0] === '' ? true : (Math.abs(parseFloat(currentValue[0]) - parseFloat(ruleValue)) >= epsilon);
};

Drupal.webform.conditionalOperatorNumericGreaterThan = function(element, existingValue, ruleValue) {
  var currentValue = Drupal.webform.stringValue(element, existingValue);
  return parseFloat(currentValue[0]) > parseFloat(ruleValue);
};

Drupal.webform.conditionalOperatorNumericLessThan = function(element, existingValue, ruleValue) {
  var currentValue = Drupal.webform.stringValue(element, existingValue);
  return parseFloat(currentValue[0]) < parseFloat(ruleValue);
};

Drupal.webform.conditionalOperatorDateEqual = function(element, existingValue, ruleValue) {
  var currentValue = Drupal.webform.dateValue(element, existingValue);
  return currentValue === ruleValue;
};

Drupal.webform.conditionalOperatorDateBefore = function(element, existingValue, ruleValue) {
  var currentValue = Drupal.webform.dateValue(element, existingValue);
  return (currentValue !== false) && currentValue < ruleValue;
};

Drupal.webform.conditionalOperatorDateAfter = function(element, existingValue, ruleValue) {
  var currentValue = Drupal.webform.dateValue(element, existingValue);
  return (currentValue !== false) && currentValue > ruleValue;
};

Drupal.webform.conditionalOperatorTimeEqual = function(element, existingValue, ruleValue) {
  var currentValue = Drupal.webform.timeValue(element, existingValue);
  return currentValue === ruleValue;
};

Drupal.webform.conditionalOperatorTimeBefore = function(element, existingValue, ruleValue) {
  // Date and time operators intentionally exclusive for "before".
  var currentValue = Drupal.webform.timeValue(element, existingValue);
  return (currentValue !== false) && (currentValue < ruleValue);
};

Drupal.webform.conditionalOperatorTimeAfter = function(element, existingValue, ruleValue) {
  // Date and time operators intentionally inclusive for "after".
  var currentValue = Drupal.webform.timeValue(element, existingValue);
  return (currentValue !== false) && (currentValue >= ruleValue);
};

/**
 * Utility function to get a string value from a select/radios/text/etc. field.
 */
Drupal.webform.stringValue = function(element, existingValue) {
  var value = [];

  if (element) {
    // Checkboxes and radios.
    $(element).find('input[type=checkbox]:checked,input[type=radio]:checked').each(function() {
      value.push(this.value);
    });
    // Select lists.
    if (!value.length) {
      var selectValue = $(element).find('select').val();
      if (selectValue) {
        value.push(selectValue);
      }
    }
    // Simple text fields. This check is done last so that the select list in
    // select-or-other fields comes before the "other" text field.
    if (!value.length) {
      $(element).find('input:not([type=checkbox],[type=radio]),textarea').each(function() {
        value.push(this.value);
      });
    }
  }
  else if (existingValue) {
    value = existingValue;
  }

  return value;
};

/**
 * Utility function to calculate a millisecond timestamp from a time field.
 */
Drupal.webform.dateValue = function(element, existingValue) {
  if (element) {
    var day = $(element).find('[name*=day]').val();
    var month = $(element).find('[name*=month]').val();
    var year = $(element).find('[name*=year]').val();
    // Months are 0 indexed in JavaScript.
    if (month) {
      month--;
    }
    return (year !== '' && month !== '' && day !== '') ? Date.UTC(year, month, day) / 1000 : false;
  }
  else {
    var existingValue = existingValue.length ? existingValue[0].split('-') : existingValue;
    return existingValue.length ? Date.UTC(existingValue[0], existingValue[1], existingValue[2]) / 1000 : false;
  }
};

/**
 * Utility function to calculate a millisecond timestamp from a time field.
 */
Drupal.webform.timeValue = function(element, existingValue) {
  if (element) {
    var hour = $(element).find('[name*=hour]').val();
    var minute = $(element).find('[name*=minute]').val();
    var ampm = $(element).find('[name*=ampm]:checked').val();

    // Convert to integers if set.
    hour = (hour === '') ? hour : parseInt(hour);
    minute = (minute === '') ? minute : parseInt(minute);

    if (hour !== '') {
      hour = (hour < 12 && ampm == 'pm') ? hour + 12 : hour;
      hour = (hour === 12 && ampm == 'am') ? 0 : hour;
    }
    return (hour !== '' && minute !== '') ? Date.UTC(1970, 0, 1, hour, minute) / 1000 : false;
  }
  else {
    var existingValue = existingValue.length ? existingValue[0].split(':') : existingValue;
    return existingValue.length ? Date.UTC(1970, 0, 1, existingValue[0], existingValue[1]) / 1000 : false;
  }
};

})(jQuery);
;
(function ($) {

/**
 * Retrieves the summary for the first element.
 */
$.fn.drupalGetSummary = function () {
  var callback = this.data('summaryCallback');
  return (this[0] && callback) ? $.trim(callback(this[0])) : '';
};

/**
 * Sets the summary for all matched elements.
 *
 * @param callback
 *   Either a function that will be called each time the summary is
 *   retrieved or a string (which is returned each time).
 */
$.fn.drupalSetSummary = function (callback) {
  var self = this;

  // To facilitate things, the callback should always be a function. If it's
  // not, we wrap it into an anonymous function which just returns the value.
  if (typeof callback != 'function') {
    var val = callback;
    callback = function () { return val; };
  }

  return this
    .data('summaryCallback', callback)
    // To prevent duplicate events, the handlers are first removed and then
    // (re-)added.
    .unbind('formUpdated.summary')
    .bind('formUpdated.summary', function () {
      self.trigger('summaryUpdated');
    })
    // The actual summaryUpdated handler doesn't fire when the callback is
    // changed, so we have to do this manually.
    .trigger('summaryUpdated');
};

/**
 * Sends a 'formUpdated' event each time a form element is modified.
 */
Drupal.behaviors.formUpdated = {
  attach: function (context) {
    // These events are namespaced so that we can remove them later.
    var events = 'change.formUpdated click.formUpdated blur.formUpdated keyup.formUpdated';
    $(context)
      // Since context could be an input element itself, it's added back to
      // the jQuery object and filtered again.
      .find(':input').andSelf().filter(':input')
      // To prevent duplicate events, the handlers are first removed and then
      // (re-)added.
      .unbind(events).bind(events, function () {
        $(this).trigger('formUpdated');
      });
  }
};

/**
 * Prepopulate form fields with information from the visitor cookie.
 */
Drupal.behaviors.fillUserInfoFromCookie = {
  attach: function (context, settings) {
    $('form.user-info-from-cookie').once('user-info-from-cookie', function () {
      var formContext = this;
      $.each(['name', 'mail', 'homepage'], function () {
        var $element = $('[name=' + this + ']', formContext);
        var cookie = $.cookie('Drupal.visitor.' + this);
        if ($element.length && cookie) {
          $element.val(cookie);
        }
      });
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
