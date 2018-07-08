import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cart: {
      products: []
    }
  },
  mutations: {
    addToCart (state, product) {
      let found = state.cart.products.find(item => item.product.id === product.id)
      if (found) {
        found.count++
      } else {
        state.cart.products.push({
          product,
          count: 1
        })
      }
    },
    removeFromCart (state, product) {
      state.cart.products = state.cart.products.filter(item => item.product.id !== product.id)
    }
  },
  actions: {
    addToCart (context, product) {
      context.commit('addToCart', product)
    },
    removeFromCart (context, product) {
      context.commit('removeFromCart', product)
    }
  },
  getters: {
    productsInCart: state => state.cart.products
  }
})
