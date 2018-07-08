<template>
  <div class="product">
    <h4>{{ product.title }}</h4>
    <button type="button" @click="addToCart()">Add To Cart</button>
  </div>
</template>

<script>
  export default {
    name: 'Product',
    props: {
      product: {
        type: Object,
        required: true
      }
    },
    methods: {
      addToCart() {
        this.$store.dispatch('addToCart', this.product)
      }
    }
  }
</script>