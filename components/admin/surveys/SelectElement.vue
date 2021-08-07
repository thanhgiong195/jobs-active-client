<template>
  <el-form-item :prop="`owner.surveys.` + index">
    <select
      v-model="value"
      :placeholder="element.question"
      class="custom-select"
      style="width: 100%"
      :disabled="isDisabled"
      @change="handleChange()"
    >
      <option v-for="(option, index) in options" :key="index" :value="option">
        <span style="float: right; color: #8492a6; font-size: 13px">
          {{ option }}
        </span>
      </option>
    </select>
  </el-form-item>
</template>

<script>
export default {
  name: 'SelectElement',
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

<style scoped></style>
