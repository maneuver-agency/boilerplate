<template>
  <div>
    <button type="button" class="btn" @click="$emit('click')">{{ label }}</button>
    <div v-clickable>
      test
      <br><br>
      <a href="google.be">link</a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BaseButton',
    props: ['label']
  }
</script>