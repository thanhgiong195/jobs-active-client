<template>
  <div>
    <el-form-item
      :prop="`owner.surveys.` + index"
      :rules="rules"
      class="preview-form mb-3"
    >
      <el-input v-model="value" :disabled="isDisabled"></el-input>
    </el-form-item>
    <div v-if="isShowRule" class="form-rule">{{ rule }}</div>
  </div>
</template>

<script>
import validate from '@/helpers/custom-rules-validate'
import Constant from '@/constant.json'

const ADMIN_STATIC_SURVEY = 2
export default {
  name: 'InputElement',
  mixins: [validate],
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
      rules: {},
      pattern_inputs: [
        {
          value: 1,
          label: 'no_compulsion',
        },
        {
          value: 2,
          label: 'full_width_characters_only',
        },
        {
          value: 3,
          label: 'half_width_characters_only',
        },
        // {
        //   value: 4,
        //   label: 'half_width_alphabet_only',
        // },
        {
          value: 5,
          label: 'half_width_numbers_only',
        },
        {
          value: 6,
          label: 'email_only',
        },
      ],
    }
  },
  computed: {
    rule() {
      let pattern_input_text = ''
      if (this.element.pattern_input !== null) {
        pattern_input_text = this.pattern_inputs.find(
          (item) => item.value === this.element.pattern_input
        )
        pattern_input_text = pattern_input_text
          ? this.$t(pattern_input_text.label) + this.$t('and')
          : ''
      }

      if (!this.element.min_length) {
        if (this.element.max_length) {
          return `${pattern_input_text} ${this.$t('pls_enter_within')} ${
            this.element.max_length
          } ${this.$t('characters')}`
        } else {
          if (pattern_input_text) {
            return pattern_input_text + this.$t('upper_limit_characters')
          }
          return this.$t('upper_limit_characters')
        }
      } else {
        if (!this.element.max_length) {
          return `${pattern_input_text} ${this.$t('pls_enter_at_least')} ${
            this.element.min_length
          } ${this.$t('characters')}。`
        } else {
          return [
            pattern_input_text,
            this.element.min_length,
            this.$t('characters_at_least'),
            this.element.max_length,
            this.$t('characters_at_most'),
          ].join(' ')
        }
      }
    },
    isShowRule() {
      return this.element.type !== ADMIN_STATIC_SURVEY
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
    const listKeys = Object.keys(this.element)
    const condition = []
    if (listKeys.includes('required')) {
      condition.push({
        required: !!this.element.required,
        message: this.$t('please_enter'),
      })
    }
    if (listKeys.includes('min_length')) {
      condition.push({
        min: this.element.min_length,
        message: this.$t(
          `${this.$t('enter_a_value_of')} ${this.element.min_length}
            ${this.$t('digits_or_more_for')} ${this.element.name}`
        ),
      })
    }
    const max_length = this.element.max_length
      ? this.element.max_length
      : Constant.survey.input.max_length_default
    condition.push({
      max: max_length,
      message:
        this.$t(`pls_enter_within`) +
        ' ' +
        max_length +
        ' ' +
        this.$t('characters'),
    })
    if (listKeys.includes('pattern_input')) {
      let pattern = 1
      switch (this.element.pattern_input) {
        case 2:
          pattern = { ...this.validateFullSize()[1] }
          break
        case 3:
          pattern = { ...this.validateKataKana()[1] }
          break
        // case 4:
        //   pattern = { ...this.validateAlphabetHalfSize()[1] }
        //   break
        case 5:
          pattern = { ...this.validateNumberHalfSize()[1] }
          break
        case 6:
          pattern = { ...this.validateEmailAddress()[2] }
          break
      }
      if (pattern !== 1) condition.push(pattern)
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
.form-rule {
  margin-left: 0;
  padding-top: 6px;
  font-size: 11px;
  padding-left: 12px;
  position: relative;

  &:after {
    content: '*';
    position: absolute;
    left: 3px;
    top: 9px;
    font-size: 16px;
  }
}
</style>
