<template>
  <b-button
    :disabled="disabled"
    :size="size"
    :variant="getButtonType"
    @click="handleClick"
  >
    <i v-if="icon" :class="iconName"></i>
    <span v-if="$slots.default"><slot></slot></span>
  </b-button>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: 'primary',
    },
    size: {
      type: String,
      default: '', //sm, lg
    },
    icon: {
      type: String,
      default: '',
    },
    iconType: {
      type: String,
      default: 'fal',
    },
    disabled: Boolean,
    outline: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    iconName() {
      return `${this.iconType} fa-${this.icon}`
    },
    getButtonType() {
      let str = this.type
      if (this.outline) {
        str = 'outline-' + this.type
      }
      return str
    },
  },
  methods: {
    handleClick(evt) {
      this.$emit('click', evt)
    },
  },
}
</script>
