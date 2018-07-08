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
    data() {
      return {
        products: [
          {
            id: 1,
            title: 'iPhone X'
          },
          {
            id: 2,
            title: 'MacBook Pro'
          }
        ]
      }
    }
  }
</script>