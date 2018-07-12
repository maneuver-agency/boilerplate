import Vue from 'vue'

/**
 * Make an element entirely clickable
 * if it has a link with a valid href attribute.
 */
Vue.directive('clickable', el => {
  const link = el.querySelector('a')

  if (link) {
    const href = link.getAttribute('href')

    if (href && href.substr(0, 1) !== '#') {
      el.classList.add('clickable')
      el.addEventListener('click', event => {
        if (link.getAttribute('target') === '_blank') {
          window.open(href)
        } else {
          window.location = href
        }
      })
    }
  }
})
