<template>
  <button type="button" class="btn" @click="$emit('click')">{{ label }}</button>
</template>

<script>
  export default {
    name: 'BaseButton',
    props: ['label']
  }
</script>