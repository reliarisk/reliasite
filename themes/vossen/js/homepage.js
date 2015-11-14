(function($) {
  "use strict";

  /* -------------------
  Removing URL before hash
  ---------------------*/
  $('.to-section a').each(function(){
    $(this).attr('href','#'+$(this).attr('href').split('#')[1]);
  });
  /* -------------------
  Animating .home-link
  ---------------------*/
  $('.home-link').click(function() {
    $('html, body').animate({ scrollTop: 0}, 1000, 'easeInOutExpo');
    return false;
  });
})(jQuery, window, document);
