<template>
  <div>
    <el-dialog
      :title="$t(`survey_preview`)"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="50%"
    >
      <div class="iphone12-frame">
        <div class="speaker">Speaker</div>
        <div class="camera">Camera</div>
        <div class="preview-content">
          <div class="preview-content-sp">
            <el-form
              ref="surveyForm"
              style="padding-left: 20px"
              class="form-text"
            >
              <img
                v-if="curCategory.image"
                :src="getFullPathImage(curCategory.image)"
                width="100%"
                class="img-thumbnail"
                max-height="100%"
              />
              <h5 align="center" class="pt-2">{{ curCategory.name }}</h5>
              <p v-if="curCategory.description">
                <i class="el-icon-info text-primary"></i>
                <span
                  v-for="(item, index) in splitEndLine(
                    categoryDetail.description
                  )"
                  :key="index"
                >
                  {{ item }} <br />
                </span>
              </p>
              <div
                v-for="(element, index) in listSurvey"
                :key="index"
                style="margin-bottom: 20px"
              >
                <label style="font-weight: bold" v-html="labelName(element)" />
                <component
                  :is="getElementComponentName(element)"
                  :element="element"
                  :is-disabled="true"
                  :answer="driverAnswerSurvey"
                />
              </div>
              <p class="tiny-custom-text" style="color: #656565">
                Fields have(*) are required fields.
              </p>
              <div class="box-content-policy">
                <p>About the handling of personal information<br /></p>
                <a href="#" style="color: #7c7cdc; text-decoration: underline">
                  Read policy
                </a>
                <el-checkbox> I agree with the privacy policy </el-checkbox>
              </div>
              <el-form-item>
                <el-button
                  class="w-100 btn-create yellow"
                  type="success"
                  :disabled="true"
                  round
                >
                  {{ $t('save') }}
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import InputElement from '@/components/admin/surveys/InputElement'
import RadioElement from '@/components/admin/surveys/RadioElement'
import SelectElement from '@/components/admin/surveys/SelectElement'
import CheckboxElement from '@/components/admin/surveys/CheckboxElement'
import DatepickerElement from '@/components/admin/surveys/DatePickerElement'
import ImagepickerElement from '@/components/admin/surveys/ImagePickerElement'
import Button from '@/components/utils/Button'

export default {
  name: 'DialogPreview',
  components: {
    Button,
    InputElement,
    RadioElement,
    SelectElement,
    CheckboxElement,
    DatepickerElement,
    ImagepickerElement,
  },
  props: {
    listSurvey: {
      type: Array,
      default: () => [],
    },
    visible: {
      type: Boolean,
      default: false,
    },
    categoryDetail: {
      type: [Object, Array],
      default: null,
    },
  },
  data() {
    return {
      driverAnswerSurvey: {},
      screenType: 0,
      innerValue: false,
      curCategory: {},
    }
  },
  computed: {
    dialogVisible: {
      get: function () {
        return this.visible || this.innerValue
      },
      set: function (newValue) {
        if (!newValue) {
          this.$emit('close')
        }
        this.innerValue = newValue
      },
    },
  },
  watch: {
    dialogVisible() {
      const result = {}
      this.listSurvey.map((answer) => {
        result[`${answer.id}`] = {
          name: answer.name,
          value: '',
        }
      })
      this.driverAnswerSurvey = result
    },
    listSurvey() {
      const result = {}
      this.listSurvey.map((answer) => {
        result[`${answer.id}`] = {
          name: answer.name,
          value: '',
        }
      })
      this.driverAnswerSurvey = result
    },
    categoryDetail() {
      this.curCategory = this.categoryDetail
    },
  },
  methods: {
    labelName(data) {
      let label = data.question
      if (data.required) {
        label += ` <span class="text-danger">(${this.$t('required')})</span>`
      }
      return label
    },
    getElementComponentName(element) {
      switch (element.pattern) {
        case 1:
          return 'input-element'
        case 2:
          return 'select-element'
        case 3:
          return 'radio-element'
        case 4:
          return 'checkbox-element'
        case 5:
          return 'datepicker-element'
        case 6:
          return 'imagepicker-element'
        default:
          return 'input-element'
      }
    },
  },
}
</script>

<style lang="scss">
.preview-content .el-form-item__content {
  margin-left: 0px !important;
}
</style>

<style lang="scss">
.preview-content .form-rule {
  font-size: 11px;
  padding-left: 12px;
  position: relative;
  padding-top: 0px;

  &:after {
    content: '*';
    position: absolute;
    left: 3px;
    top: 3px;
    font-size: 16px;
  }
}
</style>
