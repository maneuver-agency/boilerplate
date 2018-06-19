
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
 * Open share links in a popup window.
 **/
$(document).on('click', '.btn-share', function (e) {
  e.preventDefault()
  const sizes = {
    facebook: [555,500],
    twitter: [600,266],
    linkedin: [550,500],
    google: [400,500]
  }
  
  let url = this.getAttribute('href')
  let w = 400
  let h = 500

  for(var p in sizes) {
    if (url.indexOf(p) !== -1) {
      w = sizes[p][0]
      h = sizes[p][1]
      break
    }
  }
  window.open(url, 'windowShare', 'width='+w+',height='+h+',chrome=yes,centerscreen=1')
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


/**
 * Capitalize first character of string.
 */
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1)
}