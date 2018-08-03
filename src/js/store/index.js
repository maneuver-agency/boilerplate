import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({

  /**
   * STATE
   * The global state object.
   */
  state: {

  },

  /**
   * GETTERS
   * Getters are methods and will receive the state as their 1st argument.
   * You can think of them as computed properties for stores.
   */
  getters: {

  },

  /**
   * MUTATIONS
   * The only way to actually change state in a store is by committing a mutation.
   * They will receive the state as first argument.
   */
  mutations: {
    setAppData (state, data) {
      state = Object.assign(state, data)
    }
  },

  /**
   * ACTIONS
   * Actions are similar to mutations.
   * They don't mutate the state, they commit mutations
   * and they can contain asynchronous operations.
   */
  actions: {

  },

  /**
   * MODULES
   * Divide a large state into seperate modules.
   */
  modules: {

  }
})
