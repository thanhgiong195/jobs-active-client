import Constant from '@/constant.json'

export default {
  methods: {
    validatesRequired(label) {
      return [
        {
          required: true,
          whitespace: true,
          message: this.$t(`please_enter`) + label,
          trigger: 'blur',
        },
      ]
    },
    validatePhoneNumber() {
      return [
        { type: 'string' },
        {
          required: true,
          whitespace: true,
          message: this.$t(`empty_phone_number_alert`),
          trigger: 'blur',
        },
        {
          pattern: /^\d{10}$|^\d{11}$/,
          message: this.$t(`empty_single_byte_number_err`),
        },
        {
          min: 10,
          max: 11,
          message: this.$t(`empty_single_byte_number_err`, {
            min: 10,
            max: 11,
          }),
        },
      ]
    },
    validateEmailAddress() {
      return [
        { type: 'string' },
        {
          required: true,
          whitespace: true,
          message: this.$t(`empty_email_address_alert`),
          trigger: 'change',
        },
        {
          pattern:
            /^[-a-z0-9~!$%^&*_=+}{\\'?]+(\.[-a-z0-9~!$%^&*_=+}{\\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,
          message: this.$t(`email_address_alert`),
        },
        {
          max: 128,
          message:
            this.$t('pls_enter_within') + ' 128 ' + this.$t('characters'),
        },
      ]
    },
    validateFullSize() {
      return [
        { type: 'string' },
        {
          pattern: /^[ぁ-んァ-ン一-龥ａ-ｚＡ-Ｚ０-９　ー・]+$/,
          message: this.$t(`double_byte_characters_alert`),
        },
      ]
    },
    validateHalfSize() {
      return [
        { type: 'string' },
        {
          pattern: /^[^ぁ-んァ-ヶａ-ｚＡ-Ｚ０-９ー・]*$/,
          message: this.$t(`pls_enter_in_halfwidth_char`),
        },
      ]
    },
    validateCustomerCode() {
      return [
        { type: 'string' },
        {
          required: true,
          message: this.$t(`empty_account_code_alert`),
        },
        {
          max: 7,
          message: this.$t(`please_enter`) + ' 7 ' + this.$t('digits'),
        },
        {
          pattern: /^[^ぁ-んァ-ヶａ-ｚＡ-Ｚ０-９ー・]*$/,
          message: this.$t(`pls_enter_in_halfwidth_char`),
        },
        {
          pattern: /^\S+$/g,
          message: this.$t(`empty_character_err`),
        },
      ]
    },
    validateAlphabetHalfSize() {
      return [
        { type: 'string' },
        {
          pattern: /^[a-zA-Z0-9]*$/,
          message: this.$t(`pls_enter_in_halfwidth_char`),
        },
      ]
    },
    validateNumberHalfSize() {
      return [
        { type: 'string' },
        {
          pattern: /^[0-9]*$/,
          message: this.$t(`empty_single_byte_number_err`),
        },
      ]
    },
    validateKataKana() {
      return [
        { type: 'string' },
        {
          pattern: /^([ｧ-ﾝァ-ン]|ー)+$/,
          message: this.$t(`half_width_kana_alert`),
        },
      ]
    },
    validateKanji() {
      return [
        { type: 'string' },
        {
          pattern: /^[一-龥]+$/,
          message: this.$t(`kanji_only_alert`),
        },
      ]
    },
    validateZipCode() {
      return [
        { type: 'string' },
        {
          pattern: /^\d{3}[-]\d{4}$|^\d{3}$|^\d{7}$/,
          message: this.$t(`pls_enter_in_halfwidth_char`),
        },
      ]
    },
    validateSurveyElement(survey) {
      let condition = []
      if (!this.isEmptyCustom(survey.required)) {
        condition.push({
          required: true,
          message: this.$t(`please_enter`) + survey.question,
        })
      }
      if (survey.pattern == 1) {
        if (!this.isEmptyCustom(survey.min_length)) {
          condition.push({
            min: survey.min_length,
            message:
              this.$t('string_length_alert') +
              ` ${survey.min_length} ` +
              this.$t('digits_or_more'),
          })
        }
        const max_length = survey.max_length
          ? survey.max_length
          : Constant.survey.input.max_length_default
        condition.push({
          max: max_length,
          message:
            this.$t('pls_enter_within') +
            ` ${max_length} ` +
            this.$t('characters'),
        })
        let pattern = 1
        switch (survey.pattern_input) {
          case 2:
            pattern = { ...this.validateFullSize()[1] }
            break
          case 3:
            pattern = { ...this.validateHalfSize()[1] }
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
      return condition
    },
    validatePassword(label = this.$t('password')) {
      return [
        {
          required: true,
          whitespace: true,
          message: this.$t(`please_enter`) + label,
        },
        {
          pattern: /^[^ぁ-んァ-ヶａ-ｚＡ-Ｚ０-９ー・]*$/,
          message: this.$t(`pls_enter_in_halfwidth_char`),
        },
        {
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
          message: this.$t('please_enter') + ` ${label} ` + this.$t('correcty'),
        },
        {
          max: 16,
          message: this.$t('pls_enter_within') + ' 16 ' + this.$t('characters'),
        },
      ]
    },
  },
}
