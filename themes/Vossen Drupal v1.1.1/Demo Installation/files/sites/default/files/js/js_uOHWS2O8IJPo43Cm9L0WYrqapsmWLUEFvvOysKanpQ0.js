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
