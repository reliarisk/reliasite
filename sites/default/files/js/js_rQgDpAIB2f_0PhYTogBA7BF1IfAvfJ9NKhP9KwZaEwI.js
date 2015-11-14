  (function($) {
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
    /* -------------------
    Google map
    ---------------------*/
    $("#map").gmap3({
      marker:{     
      address:"<?php print $map_address; ?>", 
      options:{ icon: "<?php print $map_marker; ?>"}},
      map:{
      options:{
      styles: [ {
      stylers: [ { "saturation":-90 }, { "lightness": 0 }, { "gamma": 0.0 }]},
      ],
      zoom: 13,
      scrollwheel:false,
      draggable: true }
      }
    });
  })(jQuery, window, document);
;
