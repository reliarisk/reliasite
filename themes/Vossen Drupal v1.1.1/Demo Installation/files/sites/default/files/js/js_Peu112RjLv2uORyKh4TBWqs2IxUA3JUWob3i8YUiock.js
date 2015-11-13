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
 * Attaches double-click behavior to toggle full path of Krumo elements.
 */
Drupal.behaviors.devel = {
  attach: function (context, settings) {

    // Add hint to footnote
    $('.krumo-footnote .krumo-call').once().before('<img style="vertical-align: middle;" title="Click to expand. Double-click to show path." src="' + settings.basePath + 'misc/help.png"/>');

    var krumo_name = [];
    var krumo_type = [];

    function krumo_traverse(el) {
      krumo_name.push($(el).html());
      krumo_type.push($(el).siblings('em').html().match(/\w*/)[0]);

      if ($(el).closest('.krumo-nest').length > 0) {
        krumo_traverse($(el).closest('.krumo-nest').prev().find('.krumo-name'));
      }
    }

    $('.krumo-child > div:first-child', context).dblclick(
      function(e) {
        if ($(this).find('> .krumo-php-path').length > 0) {
          // Remove path if shown.
          $(this).find('> .krumo-php-path').remove();
        }
        else {
          // Get elements.
          krumo_traverse($(this).find('> a.krumo-name'));

          // Create path.
          var krumo_path_string = '';
          for (var i = krumo_name.length - 1; i >= 0; --i) {
            // Start element.
            if ((krumo_name.length - 1) == i)
              krumo_path_string += '$' + krumo_name[i];

            if (typeof krumo_name[(i-1)] !== 'undefined') {
              if (krumo_type[i] == 'Array') {
                krumo_path_string += "[";
                if (!/^\d*$/.test(krumo_name[(i-1)]))
                  krumo_path_string += "'";
                krumo_path_string += krumo_name[(i-1)];
                if (!/^\d*$/.test(krumo_name[(i-1)]))
                  krumo_path_string += "'";
                krumo_path_string += "]";
              }
              if (krumo_type[i] == 'Object')
                krumo_path_string += '->' + krumo_name[(i-1)];
            }
          }
          $(this).append('<div class="krumo-php-path" style="font-family: Courier, monospace; font-weight: bold;">' + krumo_path_string + '</div>');

          // Reset arrays.
          krumo_name = [];
          krumo_type = [];
        }
      }
    );
  }
};

})(jQuery);
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
(function ($) {

  $(document).bind('afterQuicksandAnimation', function(event) {
    var time = new Date();
    console.log(time.getHours() + '-' + time.getMinutes() + '-' +
    time.getSeconds() + '-' + time.getMilliseconds() + ': after');
  });

  $(document).bind('beforeQuicksandAnimation', function(event) {
    var time = new Date();
    console.log(time.getHours() + '-' + time.getMinutes() + '-' +
    time.getSeconds() + '-' + time.getMilliseconds() + ': before');
  });

})(jQuery);
;
(function ($) {

/**
 * Automatically display the guidelines of the selected text format.
 */
Drupal.behaviors.filterGuidelines = {
  attach: function (context) {
    $('.filter-guidelines', context).once('filter-guidelines')
      .find(':header').hide()
      .closest('.filter-wrapper').find('select.filter-list')
      .bind('change', function () {
        $(this).closest('.filter-wrapper')
          .find('.filter-guidelines-item').hide()
          .siblings('.filter-guidelines-' + this.value).show();
      })
      .change();
  }
};

})(jQuery);
;
(function ($) {

 // Scroll to given element
  Drupal.ajax.prototype.commands.ajaxCommentsScrollToElement = function(ajax, response, status) {
    try {
      pos = $(response.selector).offset();
      $('html, body').animate({ scrollTop: pos.top}, 'slow');
    }
    catch (e) {
      console.log('ajaxComments-ScrollToElementError: ' + e.name);
    }
  };

  /**
   * Add the dummy div if they are not exist.
   * On the server side we have a current state of node and comments, but on client side we may have a outdated state
   * and some div's may be not present
   */
  Drupal.ajax.prototype.commands.ajaxCommentsAddDummyDivAfter = function(ajax, response, status) {
    try {
      if (!$(response.selector).next().hasClass(response.class)) {
        $('<div class="' + response.class + '"></div>').insertAfter(response.selector);
      }
    }
    catch (e) {
      console.log('ajaxComments-AddDummyDivAfter: ' + e.name);
    }
  };

  /*
   * These function may be removed when bug #736066 is fixed
   * At this time, ajax.js automatically wrap comment content into div when we use ajax_command_NAME functions,
   * and this is not good for us because this broke html layout
   */

  /**
   * Own implementation of ajax_command_replace()
   * see bug: https://www.drupal.org/node/736066
   */
  Drupal.ajax.prototype.commands.ajaxCommentsReplace = function(ajax, response, status) {
    try {
      // Removing content from the wrapper, detach behaviors first.
      var wrapper = response.selector ? $(response.selector) : $(ajax.wrapper);
      var settings = response.settings || ajax.settings || Drupal.settings;
      Drupal.detachBehaviors(wrapper, settings);

      $(response.selector).replaceWith(response.html);

      // Attach all JavaScript behaviors to the new content, if it was successfully
      // added to the page, this if statement allows #ajax['wrapper'] to be
      // optional.
      var settings = response.settings || ajax.settings || Drupal.settings;
      Drupal.attachBehaviors(response.data, settings);
    }
    catch (e) {
      console.log('ajaxComments-Replace: ' + e.name)
    }
  };

  /**
   * Own implementation of ajax_command_before()
   * see bug: https://www.drupal.org/node/736066
   */
  Drupal.ajax.prototype.commands.ajaxCommentsBefore = function(ajax, response, status) {
    try {
      $(response.html).insertBefore(response.selector);

      // Attach all JavaScript behaviors to the new content, if it was successfully
      // added to the page, this if statement allows #ajax['wrapper'] to be
      // optional.
      var settings = response.settings || ajax.settings || Drupal.settings;
        Drupal.attachBehaviors(response.data, settings);
      }
      catch (e) {
        console.log('ajaxComments-Before: ' + e.name)
      }
  };

  /**
   * Own implementation of ajax_command_after()
   * see bug: https://www.drupal.org/node/736066
   */
  Drupal.ajax.prototype.commands.ajaxCommentsAfter = function(ajax, response, status) {
    try {
      $(response.html).insertAfter(response.selector);

      // Attach all JavaScript behaviors to the new content, if it was successfully
      // added to the page, this if statement allows #ajax['wrapper'] to be
      // optional.
      var settings = response.settings || ajax.settings || Drupal.settings;
      Drupal.attachBehaviors(response.data, settings);
    }
    catch (e) {
      console.log('ajaxComments-After: ' + e.name)
    }
  };

  /**
   * Own implementation of ajax_command_insert()
   * see bug: https://www.drupal.org/node/736066
   */
  Drupal.ajax.prototype.commands.ajaxCommentsPrepend = function(ajax, response, status) {
    try {
      $(response.selector).prepend(response.html);

      // Attach all JavaScript behaviors to the new content, if it was successfully
      // added to the page, this if statement allows #ajax['wrapper'] to be
      // optional.
      var settings = response.settings || ajax.settings || Drupal.settings;
      Drupal.attachBehaviors(response.data, settings);
    }
    catch (e) {
      console.log('ajaxComments-Prepend: ' + e.name)
    }
  };

  /**
   * Own implementation of ajax_command_append()
   * see bug: https://www.drupal.org/node/736066
   */
  Drupal.ajax.prototype.commands.ajaxCommentsAppend = function(ajax, response, status) {
    try {
      $(response.selector).append(response.html);

      // Attach all JavaScript behaviors to the new content, if it was successfully
      // added to the page, this if statement allows #ajax['wrapper'] to be
      // optional.
      var settings = response.settings || ajax.settings || Drupal.settings;
      Drupal.attachBehaviors(response.data, settings);
    }
    catch (e) {
      console.log('ajaxComments-Append: ' + e.name)
    }
  };

}(jQuery));

;
