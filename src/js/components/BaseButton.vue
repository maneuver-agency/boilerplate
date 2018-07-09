<template>
  <button type="button" class="btn">{{ label }}</button>
</template>

<script>
  export default {
    name: 'BaseButton',
    props: ['label']
  }
</script>