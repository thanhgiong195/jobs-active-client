<template>
  <el-form-item :prop="`owner.surveys.` + index">
    <el-radio-group v-model="value">
      <el-radio
        v-for="(option, key) in options"
        :key="key"
        :disabled="isDisabled"
        :label="option"
        @change="handleChange()"
      ></el-radio>
    </el-radio-group>
  </el-form-item>
</template>

<script>
export default {
  name: 'RadioElement',
  props: {
    isDisabled: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      default: 0,
    },
    element: {
      type: Object,
      default: () => {},
    },
    answer: {
      type: Object,
      default: () => {},
    },
    driver: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      value: '',
    }
  },
  computed: {
    options() {
      if (!this.element) return []
      return this.element.answer_option.split(/(?:\r\n|\r|\n|↵)/g)
    },
  },
  watch: {
    value(newValue) {
      this.answer[`${this.element.id}`].value = newValue
      this.handleChange()
    },
    answer() {
      this.value = this.answer[`${this.element.id}`].value
      this.handleChange()
    },
  },
  created() {
    this.value = this.answer[`${this.element.id}`].value
    if (this.value === '') {
      this.value = this.options[0] ? this.options[0] : ''
    }
  },
  methods: {
    handleChange() {
      this.$emit('listen', {
        elementId: this.element.id,
        name: this.element.name,
        value: this.answer[`${this.element.id}`].value,
      })
    },
  },
}
</script>

<style scoped lang="scss">
.el-radio-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
</style>
