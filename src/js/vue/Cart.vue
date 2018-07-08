<template>
  <ul v-if="items.length">
    <li v-for="item in items">{{ item.product.title }} - {{ item.count }} 
      [<a href="#" @click.prevent="removeFromCart(item.product)">remove</a>]
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'Cart',
    created() {

    },
    data() {
      return {
        
      }
    },
    computed: {
      items() {
        return this.$store.getters.productsInCart
      }
    },
    methods: {
      removeFromCart(product) {
        this.$store.dispatch('removeFromCart', product)
      }
    }
  }
</script>