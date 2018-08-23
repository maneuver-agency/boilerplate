import '../scss/style.scss'
// import './offcanvas.js'

import Vue from 'vue'
import store from './store'

import './directives'
import './plugins'
import './mixins'

import './components/_globals'

// Load appdata into store.
const el = document.getElementById('appdata')
if (el) {
  let appdata = JSON.parse(el.textContent)
  if (appdata) {
    this.$store.commit('setAppData', appdata)
  }
}

new Vue({ // eslint-disable-line no-new
  el: '#app',
  store,
  mounted () {
    // Animate jump links.
    document.querySelectorAll('a[href^="#"]').forEach(el => {
      const id = el.getAttribute('href')
      if (id.length > 1) {
        el.addEventListener('click', event => {
          event.preventDefault()
          this.$scrollTo(id)
        })
      }
    })
  },
  components: {

  },
  methods: {

  }
})
