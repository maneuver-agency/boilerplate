import Vue from 'vue'

import VModal from 'vue-js-modal'
import VueScrollTo from 'vue-scrollto'
// import BootstrapVue from 'bootstrap-vue'
import { Collapse } from 'bootstrap-vue/es/components'

/**
 * Vue implementation of Bootstrap 4
 * @see https://github.com/bootstrap-vue/bootstrap-vue
 */
// Vue.use(BootstrapVue)
Vue.use(Collapse)

/**
 * Flexible modal/dialog component.
 * @see https://github.com/euvl/vue-js-modal
 */
Vue.use(VModal, {
  dialog: true
})

/**
 * Animating scrolling to an element.
 * @see https://github.com/rigor789/vue-scrollto#readme
 */
Vue.use(VueScrollTo)
