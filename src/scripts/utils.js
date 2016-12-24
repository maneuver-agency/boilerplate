const $ = require('jquery')

/**
 * Make entire elements clickable
 * Add class to enforce pointer cursor.
 **/
$('[data-clickable]:has(a[href])').each(function () {
  $(this).addClass('clickable')
})

/**
 * Follow the containing link.
 **/
$(document).on('click', '.clickable', function (e) {
  let $this = $(this)
  let $link = $this.find('a')

  switch ($link.attr('target')) {
    case '_blank':
      window.open($link.attr('href'))
      break
    default:
      window.location = $link.attr('href')
  }
  e.preventDefault()
})

/**
 * Animate jump links.
 **/
$(document).on('click', 'a[href^="#"]', function (e) {
  let id = $(this).attr('href')
  if (id !== '#') {
    window.animateTo(id)
  }
  e.preventDefault()
})

/**
 * Scroll page to specific element.
 */
window.animateTo = function (id) {
  const $header = $('#site-header')
  const $target = $(id)
  let top = 0

  if ($target.length) {
    top = $target.offset().top
    if ($header.css('position') === 'fixed') {
      top -= $header.outerHeight()
    }

    $('html, body').stop().animate({
      scrollTop: top
    }, 750, 'swing', function () {
        // window.location.hash = id;
    })
  }
}

/**
 * Replace hashed email adresses for antispam.
 * Use: http://www.katpatuka.org/pub/doc/anti-spam.html
 **/
$('a[data-mailto]').each(function () {
  $(this).text($(this).attr('href').replace('mailto:', ''))
})

// Sticky scroll elements
;(function () {
  let $stickies = $('.sticky')
  let $footer
  let $wrap

  if ('getComputedStyle' in window) {
    $footer = $('#site-footer')
    $wrap = $('#site-wrap')

    $(window).on('scroll', function () {
      $stickies.each(function () {
        let $this = $(this)
        let top = $this.data('top')
        let bot = $this.data('bottom')
        let footeroverlap = 0

        if (!top) {
          recalculate(this)
          $this.parent().css('position', 'relative')
        }

        $this.toggleClass('sticky-on', window.scrollY >= top && $wrap.height() - $this.height() - top > window.innerHeight)
        $this.toggleClass('sticky-stop', window.scrollY >= bot)

        if ($(this).hasClass('sticky-on') && $(this).data('left') && window.matchMedia('(min-width: 767px)').matches) {
          $this.css('left', $(this).data('left'))
        }

        if ($footer.length) {
          footeroverlap = Math.max(0, ($this.height() + 40) - ($footer.position().top - window.scrollY))
        }
        if ($this.hasClass('sticky-on') && footeroverlap) {
          $this.css('top', -footeroverlap)
        }
      })
    })
  }

  $(window).on('resize', function () {
    recalculateAll()
  })
  recalculateAll()

  function recalculateAll () {
    $stickies.each(function () {
      recalculate(this)
    })
  }

  function recalculate (el) {
    let $this = $(el)
    let style
    let top
    let $parent = $this.parent()

    $this.removeClass('sticky-on')

    style = window.getComputedStyle(el)
    top = style.getPropertyValue('top')
    top = top === 'auto' ? 0 : top

    $parent.height('auto')

    // if (window.matchMedia('(min-width: 767px)').matches) {
      // $parent.height($parent.parent().height());
    // }
    $this.css('width', $parent.width())
    $this.data({
      'top': $this.offset().top - parseInt(top, 10),
      'bottom': $this.offset().top + $this.parent().innerHeight() - $this.outerHeight() - parseInt(top, 10),
      'left': $this.offset().left
    })
  }
})()

/**
 * Capitalize first character of string.
 */
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1)
}
