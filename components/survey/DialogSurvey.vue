<template>
  <el-dialog
    v-if="survey !== null"
    :close-on-click-modal="false"
    :title="survey.id ? $t('question_setting_details') : $t('add_new_settings')"
    :visible.sync="popupVisible"
    width="850px"
  >
    <el-form ref="dataForm" :rules="rules" :model="survey">
      <div class="form-group row">
        <label class="col-sm-2 col-form-label text-right">
          {{ $t('style') }}
        </label>
        <div class="col-sm-10">
          <el-form-item prop="pattern_input" class="w-100">
            <select
              v-model="survey.pattern"
              :placeholder="$t('select')"
              class="custom-select cursor-pointer w-100"
            >
              <option
                v-for="(item, index) in patterns"
                :key="index"
                :value="item.value"
                :disabled="
                  isImageSurveyExisted && item.value == 6 ? true : false
                "
              >
                <span style="float: right; color: brown; font-size: 13px">
                  {{ $t(item.label) }}
                  <p class="text-danger">
                    {{
                      isImageSurveyExisted && item.value == 6
                        ? $t('existed')
                        : ''
                    }}
                  </p>
                </span>
              </option>
            </select>
          </el-form-item>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label text-right">
          {{ $t('question') }}
          <span class="text-danger"> ({{ $t('required') }})</span>
        </label>
        <el-form-item prop="question" class="col-sm-10">
          <el-input v-model="survey.question" class="w-100" />
          <small class="form-text">
            {{ $t('question_text_display_note') }}
          </small>
        </el-form-item>
      </div>
      <div v-if="survey.pattern == 1" class="form-group row">
        <label class="col-sm-2 col-form-label text-right">
          {{ $t('input_text') }}
        </label>
        <el-form-item prop="pattern_input" class="col-sm-10">
          <select
            v-model="survey.pattern_input"
            class="custom-select cursor-pointer w-100"
          >
            <option :label="$t('select')" disabled />
            <option
              v-for="(item, index) in pattern_inputs"
              :key="index"
              :value="item.value"
            >
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ $t(item.label) }}
              </span>
            </option>
          </select>
        </el-form-item>
      </div>
      <div v-if="[2, 3, 4].includes(survey.pattern)" class="form-group row">
        <label class="col-sm-2 col-form-label text-right">
          {{ $t('options') }}
          <span class="text-danger">{{ `&nbsp(${$t('required')})` }}</span>
        </label>
        <el-form-item prop="answer_option" class="col-sm-10 w-100">
          <el-input
            v-model="survey.answer_option"
            type="textarea"
            rows="5"
            class="w-100"
          />
          <small class="form-text">
            {{ $t('option_input_notes') }}
          </small>
        </el-form-item>
      </div>
      <div v-if="survey.pattern == 1" class="form-group row">
        <label class="col-sm-2 col-form-label text-right">
          {{ $t('character_limit') }}
        </label>
        <div class="demo-input-suffix col-sm-10 max-min">
          <div class="row input-suffix-customize">
            <span class="demo-input-label col-form-label">
              {{ $t('lower_limit') }}
            </span>
            <el-form-item prop="min_length" class="el-input in-line-1rem">
              <el-input v-model="survey.min_length" />
            </el-form-item>
            <span class="demo-input-label col-form-label">
              {{ $t('text') }}
            </span>
            <span class="mx-3 col-form-label">~</span>
            <span class="demo-input-label col-form-label">
              {{ $t('upper_limit') }}
            </span>
            <el-form-item prop="max_length" class="el-input in-line-1rem">
              <el-input v-model="survey.max_length" />
            </el-form-item>
            <span class="demo-input-label col-form-label">
              {{ $t('text') }}
            </span>
          </div>
          <small class="form-text">
            {{ $t('character_limit_notes_1') }}<br />
            {{ $t('character_limit_notes_2') }}
          </small>
          <div v-if="flagMinMax" class="row">
            <span class="text-danger ml-3">
              {{ $t('lower_limit_value_error') }}
            </span>
          </div>
        </div>
      </div>
      <!-- answer range picker for Date survey -->
      <div v-if="survey.pattern == 5" class="form-group row mb-3">
        <label class="col-sm-2 mt-2 col-form-label text-right">
          {{ $t('date_range') }}
        </label>
        <div class="col-sm-10 d-flex-align-center">
          <div class="custom-control custom-checkbox pt-2">
            <el-date-picker
              v-model="survey.min_date"
              style="width: calc(100% / 2 - 12px) !important"
              format="yyyy/MM/dd"
              value-format="yyyy-MM-dd"
              type="date"
              :placeholder="$t('min_date')"
              :picker-options="{
                disabledDate(time) {
                  return time.getTime() >= moment(survey.max_date)
                },
              }"
            >
            </el-date-picker>
            <span class="ml-1 mr-1"> - </span>
            <el-date-picker
              v-model="survey.max_date"
              style="width: calc(100% / 2 - 12px) !important"
              format="yyyy/MM/dd"
              value-format="yyyy-MM-dd"
              type="date"
              :placeholder="$t('max_date')"
              :picker-options="{
                disabledDate(time) {
                  return time.getTime() <= moment(survey.min_date)
                },
              }"
            >
            </el-date-picker>
          </div>
          <div v-if="flagMinMaxDate" class="row">
            <span class="text-danger ml-3">
              {{ $t('invalid_date_min_max_err') }}
            </span>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label text-right">
          {{ $t('required_items') }}
        </label>
        <div class="col-sm-10 d-flex-align-center">
          <div class="custom-control custom-checkbox mr-sm-2 pt-2">
            <el-checkbox
              v-model="survey.required"
              :true-label="1"
              :false-label="0"
            >
              {{ $t('make_it_a_required_item') }}
            </el-checkbox>
          </div>
        </div>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer el-dialog--right">
      <el-button
        class="btn-create yellow"
        :type="survey.id ? 'success' : 'primary'"
        @click="submit"
      >
        {{ survey.id ? $t('update') : $t('add_question') }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import FrontendBase from '@/components/layouts/FrontendBase'
import validate from '@/helpers/custom-rules-validate'
import Constant from '~/constant.json'

export default {
  extends: FrontendBase,
  mixins: [validate],
  props: {
    visible: {
      type: Boolean,
      default: null,
    },
    listSurvey: {
      type: Array,
      default: null,
    },
    survey: {
      type: Object,
      default: null,
    },
    categoryId: {
      type: Number,
      default: 0,
      required: true,
    },
    isImageSurveyExisted: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const validateAnswerOption = (rule, value, callback) => {
      if ([2, 3, 4].includes(this.survey.pattern)) {
        if (value === '') {
          callback(new Error('Please enter your choice.'))
        }
        const options = value
          .split(/(?:\r\n|\r|\n|↵)/g)
          .filter((value) => value)
        let duplicate = false
        let current = ''
        if (options.length < 2) {
          callback(new Error('Please enter two or more choices.'))
        }
        for (let i = 0; i < options.length; i++) {
          if (current == options[i]) {
            duplicate = true
            break
          }
          current = options[i]
        }
        if (duplicate) {
          callback(new Error('The answer choices are duplicated.'))
        }
        callback()
      } else {
        callback()
      }
    }
    return {
      flagSubmit: false,
      flagMinMax: false,
      flagMinMaxDate: false,
      innerValue: false,
      constant: Constant,
      patterns: [
        {
          value: 1,
          label: 'text_input',
        },
        {
          value: 2,
          label: 'drop_down',
        },
        {
          value: 3,
          label: 'multiple_choice',
        },
        {
          value: 4,
          label: 'checkboxes',
        },
        {
          value: 5,
          label: 'date',
        },
        {
          value: 6,
          label: 'image_upload',
        },
      ],
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
        {
          value: 5,
          label: 'half_width_numbers_only',
        },
        {
          value: 6,
          label: 'email_only',
        },
      ],
      required: [
        {
          value: '0',
          label: 'random',
        },
        {
          value: '1',
          label: 'requires',
        },
      ],
      rules: {
        question: [],
        min_length: [
          {
            pattern: /^(0|[1-9][0-9]*)$/,
            message: 'incorrect_type_lower_limit',
            trigger: 'change',
          },
          {
            max: 4,
            message:
              this.$t(`pls_enter_within`) + ' 4 ' + this.$t('characters'),
            trigger: 'change',
          },
        ],
        max_length: [
          {
            pattern: /^(0|[1-9][0-9]*)$/,
            message: this.$t('incorrect_type_upper_limit'),
            trigger: 'change',
          },
          {
            max: 4,
            message:
              this.$t(`pls_enter_within`) + ' 4 ' + this.$t('characters'),
            trigger: 'change',
          },
        ],
        answer_option: [
          {
            validator: validateAnswerOption,
            trigger: 'blur',
          },
        ],
      },
    }
  },
  computed: {
    popupVisible: {
      get: function () {
        return this.visible || this.innerValue
      },
      set: function (newValue) {
        if (!newValue) {
          this.$emit('close', false)
        }
        this.innerValue = newValue
      },
    },
    isAdmin: function () {
      return this.$authInfo.role() == this.constant.user_role.admin
    },
    locale() {
      return this.$store.state.i18n.locale
    },
  },
  watch: {
    locale() {
      setTimeout(() => {
        this.setFormRules()
      }, 1)
    },
    itemSurvey(newValue) {
      !this.isEmptyCustom(newValue) ? this.updateSurvey() : this.resetSurvey()
    },
    visible() {
      this.flagSubmit = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    survey(survey) {
      this.survey.min_length = String(survey.min_length || '')
      this.survey.max_length = String(survey.max_length || '')
    },
    'survey.min_length'() {
      let minN = this.isEmptyCustom(this.survey.min_length)
        ? null
        : parseInt(this.survey.min_length)
      let maxN = this.isEmptyCustom(this.survey.max_length)
        ? null
        : parseInt(this.survey.max_length)
      if (
        !this.isEmptyCustom(minN) &&
        !this.isEmptyCustom(maxN) &&
        minN > maxN
      ) {
        this.flagMinMax = true
      } else {
        this.flagMinMax = false
      }
    },
    'survey.max_length'() {
      let minN = this.isEmptyCustom(this.survey.min_length)
        ? null
        : parseInt(this.survey.min_length)
      let maxN = this.isEmptyCustom(this.survey.max_length)
        ? null
        : parseInt(this.survey.max_length)
      if (
        !this.isEmptyCustom(minN) &&
        !this.isEmptyCustom(maxN) &&
        minN > maxN
      ) {
        this.flagMinMax = true
      } else {
        this.flagMinMax = false
      }
    },
    'survey.max_date'() {
      let minN = this.isEmptyCustom(this.survey.min_date)
        ? null
        : new Date(this.survey.min_date)
      let maxN = this.isEmptyCustom(this.survey.max_date)
        ? null
        : new Date(this.survey.max_date)
      if (
        !this.isEmptyCustom(minN) &&
        !this.isEmptyCustom(maxN) &&
        minN >= maxN
      ) {
        this.flagMinMaxDate = true
      } else {
        this.flagMinMaxDate = false
      }
    },
    'survey.min_date'() {
      let minN = this.isEmptyCustom(this.survey.min_date)
        ? null
        : new Date(this.survey.min_date)
      let maxN = this.isEmptyCustom(this.survey.max_date)
        ? null
        : new Date(this.survey.max_date)
      if (
        !this.isEmptyCustom(minN) &&
        !this.isEmptyCustom(maxN) &&
        minN >= maxN
      ) {
        this.flagMinMaxDate = true
      } else {
        this.flagMinMaxDate = false
      }
    },
  },
  created() {},
  mounted() {
    this.setFormRules()
  },
  methods: {
    setFormRules() {
      this.rules = {
        ...this.rules,
        question: [
          {
            required: true,
            whitespace: true,
            message: this.$t('question_text_warning'),
            trigger: 'blur',
          },
          {
            max: 254,
            message:
              this.$t('pls_enter_within') + ' 254 ' + this.$t('characters'),
            trigger: 'blur',
          },
        ],
      }
    },
    submit() {
      if (!this.flagSubmit) {
        if (!this.isEmptyCustom(this.survey.id)) {
          this.updateData()
        } else {
          this.createData()
        }
      }
    },
    showText: function (val, lists) {
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].value == val) {
          return lists[i].label
        }
      }
      return ''
    },
    updateSurvey() {
      this.survey = this.itemSurvey
    },
    createData() {
      this.flagSubmit = true
      if (!this.flagMinMax && !this.flagMinMaxDate) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.survey.ssId = this.$route.params.ss
            if (
              this.survey.pattern !== 1 &&
              this.survey.pattern !== 5 &&
              this.survey.pattern !== 6
            ) {
              this.survey.answer_option = this.survey.answer_option.replace(
                /^\s*\n/gm,
                ''
              )
            }
            this.$services.common.createSurvey(
              { ...this.survey, category_id: Number(this.categoryId) },
              () => {
                this.$emit('close', true)
                this.$notify({
                  title: this.$t('success'),
                  message: this.$t('create_successfully'),
                  type: 'success',
                })
              },
              (err) => {
                this.$log.error(err)
                this.showErrorMessage(err, 'fail')
              }
            )
          } else {
            this.flagSubmit = false
          }
        })
      }
    },
    updateData() {
      this.flagSubmit = true
      if (!this.flagMinMax && !this.flagMinMaxDate) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.survey.ssId = this.$route.params.ss
            if (
              this.survey.pattern !== 1 &&
              this.survey.pattern !== 5 &&
              this.survey.pattern !== 6
            ) {
              this.survey.answer_option = this.survey.answer_option.replace(
                /^\s*\n/gm,
                ''
              )
            }

            this.$services.common.editSurvey(
              { ...this.survey, category_id: Number(this.categoryId) },
              () => {
                this.$emit('close', true)
                this.$notify({
                  title: this.$t('success'),
                  message: this.$t('update_successfully'),
                  type: 'success',
                })
              },
              (err) => {
                this.$log.error(err)
                this.showErrorMessage(err, 'fail')
              }
            )
          }
        })
      } else {
        this.flagSubmit = false
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.max-min .el-form-item.is-error {
  margin-bottom: 25px;
}
.input-suffix-customize {
  margin-left: unset;
  margin-bottom: 20px;
}
.custom-checkbox {
  padding-left: unset;
}
.form-text {
  line-height: 20px;
  margin-top: 0;
}
.form-group {
  margin-bottom: 0;
}
</style>
