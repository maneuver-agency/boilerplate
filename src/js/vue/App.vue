<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12">
        <h1>{{ message }} <br> {{ message2}} </h1>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        message: "hallo wereld test",
        message2: "how u doin?"
      }
    }
}
</script>

<style>
</style>
