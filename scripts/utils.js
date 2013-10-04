/***************/
/*** GENETIC ***/
/***************/

(function($){
    var i, len, $images, $enquires;

    $enquires = $('[data-enquire]');
    for (i=0, len=$enquires.length; i < len; i++) {
        var $el = $enquires.eq(i),
            mq = $el.data('enquire');

        enquire.register(mq, {
            deferSetup: true,
            setup: function(){
                $el.find('[data-tag]').each(function(){
                    var $oldEl = $(this),
                        data = $oldEl.data(),
                        $newEl = $('<' + data.tag + ' />'),
                        fade = data.fade || false;

                    delete data.tag;
                    $newEl.attr(data).addClass(this.className);
                    $newEl.css({
                        opacity: 0,
                        position: 'absolute',
                        top: 0
                    });
                    $newEl.load(function(e){
                      $oldEl.remove();
                      $newEl.css('position', 'static').fadeTo(0, 1);
                    });
                    // $(this).replaceWith($newEl);
                    $oldEl.parent().append($newEl);
                });
            }
        });
    }

    // Load different image source based on the provided media query.
    // Beter die van hierboven gebruiken voor gewoon media queries (geen retina) omdat
    // die methode een resizen van het scherm in acht neemt.
    $images = $('img[data-media], img.retina');
    for (i=0, len=$images.length; i<len; i++) {
        var $img = $images.eq(i),
            data = $img.data();

        if ($img.hasClass('retina')) {
            data.media = '(-webkit-min-device-pixel-ratio : 2), (min-resolution: 192dpi)';
            data.src = $img.get(0).src.replace('.png', '@2x.png');
            // only if image is visible (hence mobile)
            if ($img.is(':not(:visible)')) continue;
        }

        if (Modernizr.mq(data.media)) {
            $img.get(0).src = data.src;
        }
    }

    $(document).

    // clickables
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

    // animate jump links
    on('click', 'a[href^=#]', function(e){
        var $target = $(this.href);

        if ($target.length) {
          $('html, body').stop().animate({
            scrollTop: $target.offset().top - 30
          }, 750, 'swing', function(){
            window.location.hash = id;
          });
        }
        e.preventDefault();
    });

    // mailto anti spam
    $('a[data-mailto]').each(function(){
        $(this).text($(this).attr('href').replace('mailto:', ''));
    });

})(jQuery);


