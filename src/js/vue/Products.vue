<template>
  <div class="row">
    <div class="col-4" v-for="product in products" :key="product.id">
      <Product :product="product"></Product>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Products',
    created() {
      this.api.getProducts()
      .then(response => {
        this.products = response
      })
    },
    data() {
      return {
        products: []
      }
    }
  }
</script>