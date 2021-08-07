<template>
  <el-form-item :prop="`owner.surveys.` + index" :rules="rules">
    <el-checkbox-group v-model="value">
      <el-checkbox
        v-for="(option, key) in options"
        :key="key"
        :disabled="isDisabled"
        :label="option"
        :value="option"
        :name="option"
      >
        {{ option }}
      </el-checkbox>
    </el-checkbox-group>
  </el-form-item>
</template>

<script>
export default {
  name: 'CheckboxElement',
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
      rules: {},
      value: [],
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
      if (Array.isArray(this.answer[`${this.element.id}`].value)) {
        this.value = this.answer[`${this.element.id}`].value
        this.handleChange()
      } else {
        this.value = []
      }
    },
    driver() {
      if (Array.isArray(this.answer[`${this.element.id}`].value)) {
        this.value = this.answer[`${this.element.id}`].value
      } else {
        this.value = []
      }
    },
  },
  created() {
    this.value = this.answer[`${this.element.id}`].value
    if (this.value === '') {
      this.value = []
    }
    const listKeys = Object.keys(this.element)
    const condition = []
    if (listKeys.includes('required')) {
      condition.push({
        type: 'array',
        required: !!this.element.required,
        message: this.$t('please_enter'),
      })
    }
    this.rules = condition
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
.el-checkbox-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
</style>
