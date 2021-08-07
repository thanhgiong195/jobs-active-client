<template>
  <i :class="getIconName" @click="handleClick"><slot></slot></i>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: Boolean,
      default: false,
    },
    iconType: {
      type: String,
      default: 'fal',
    },
  },
  computed: {
    getIconName() {
      if (this.brand) {
        return 'fab fa-' + this.name
      }
      return this.iconType + ' fa-' + this.name
    },
  },
  methods: {
    handleClick(evt) {
      this.$emit('click', evt)
    },
  },
}
</script>
