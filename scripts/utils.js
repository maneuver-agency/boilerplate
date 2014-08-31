define([], function(){

  $(document).

  // Make entire elements clickable and follow the containing link.
  on('click', '[data-clickable]:has(a[href])', function(){
      var $this = $(this),
      $link = $(this).find('a');

      switch ($link.attr('target')) {
          case '_blank':
          window.open($link.attr('href'));
          break;
          default:
          window.location = $link.attr('href');
      }
  }).

  // Animate jump links.
  on('click', 'a[href^=#]', function(e){
    var id = $(this).attr('href'),
      $target = $(id),
      $header = $('#site-header'),
      top = 0;

    if ($target.length) {
      top = $target.offset().top;
      if ($header.css('position') == 'fixed') {
        top -= $header.outerHeight();
      }
      $('html, body').stop().animate({
        scrollTop: top
      }, 750, 'swing', function(){
          // window.location.hash = id;
      });
    }
    e.preventDefault();
  });

  // Replace hashed email adresses for antispam.
  // Use: http://www.katpatuka.org/pub/doc/anti-spam.html
  $('a[data-mailto]').each(function(){
      $(this).text($(this).attr('href').replace('mailto:', ''));
  });

  // svg fallback: replace with png.
  if (!Modernizr.svg) {
    $('img[src*=svg]').each(function(){
      var src = $(this).attr('src');
      src = src.replace('.svg', '.png');
      $(this).attr('src', src);
    });
  }

  /**
   * Capitalize first character of string.
   */
   String.prototype.capitalize = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
  };
});

