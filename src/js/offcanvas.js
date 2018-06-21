;(function($){
  let offcanvas_direction = $('.site-header').data('offcanvas')
  if (offcanvas_direction) {
    let $offcanvas_shift_element = $($('.site-header').data('offcanvas-shift'))
    $offcanvas_shift_element.addClass('offcanvas-shift' + ' offcanvas-shift--' + offcanvas_direction)

    $('#navbarSupportedContent').on('show.bs.collapse', function () {
      $offcanvas_shift_element.addClass('offcanvas--active')
    })
    $('#navbarSupportedContent').on('hide.bs.collapse', function () {
      $offcanvas_shift_element.removeClass('offcanvas--active')
    })
  }
})(jQuery)