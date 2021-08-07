<template>
  <div>
    <div v-show="readPolicy" class="ql-editor">
      <h4 class="form-survey-header text-center pt-4">{{ $t('Policy') }}</h4>
      <p v-html="policy"></p>
      <el-button
        class="w-100 btn-create yellow"
        type="success"
        round
        @click="readPolicy = false"
      >
        Back
      </el-button>
    </div>
    <div v-show="!readPolicy">
      <div v-loading="loading" class="wrapper">
        <img
          v-if="categoryDetail.image"
          :src="getFullPathImage(categoryDetail.image)"
          class="img-thumbnail rounded mx-auto d-block"
          max-width="100%"
          max-height="100%"
        />
        <h4 class="form-survey-header pt-4">{{ categoryDetail.name }}</h4>
        <div v-if="categoryDetail.description">
          <p>
            <i class="el-icon-info text-primary pb-2"></i>
            <span
              v-for="(item, index) in splitEndLine(categoryDetail.description)"
              :key="index"
            >
              {{ item }} <br />
            </span>
          </p>
        </div>
        <el-form
          ref="formSurvey"
          :model="surveysAnswer"
          status-icon
          label-position="left"
          class="form-survey-app"
        >
          <div v-for="(survey, index) in surveys" :key="index" class="mb-4">
            <div class="d-flex">
              <h6 class="my-question-name" v-html="labelName(survey)" />
            </div>
            <div v-if="survey.pattern == 1">
              <el-form-item
                :prop="String(survey.id)"
                :rules="validateSurveyElement(survey)"
              >
                <el-input
                  v-model="surveysAnswer[`${survey.id}`]"
                  :placeholder="$t('Please input value')"
                />
              </el-form-item>
              <div v-if="!isEmptyCustom(rule(survey))" class="form-rule">
                {{ rule(survey) }}
              </div>
            </div>
            <div v-if="survey.pattern == 2">
              <el-form-item
                :prop="String(survey.id)"
                :rules="validateSurveyElement(survey)"
              >
                <select
                  v-model="surveysAnswer[`${survey.id}`]"
                  :placeholder="$t('Please select')"
                  class="custom-select full-width-select"
                >
                  <option value="" disabled>
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      {{ $t('Please select') }}
                    </span>
                  </option>
                  <option
                    v-for="(option, key) in splitEndLine(survey.answer_option)"
                    :key="key"
                    :value="option"
                  >
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      {{ option }}
                    </span>
                  </option>
                </select>
              </el-form-item>
              <div v-if="!isEmptyCustom(rule(survey))" class="form-rule">
                {{ rule(survey) }}
              </div>
            </div>
            <div v-if="survey.pattern == 3">
              <el-form-item
                :prop="String(survey.id)"
                :rules="validateSurveyElement(survey)"
              >
                <el-radio-group v-model="surveysAnswer[`${survey.id}`]">
                  <el-radio
                    v-for="(option, key) in splitEndLine(survey.answer_option)"
                    :key="key"
                    :label="option"
                  />
                </el-radio-group>
              </el-form-item>
              <div v-if="!isEmptyCustom(rule(survey))" class="form-rule">
                {{ rule(survey) }}
              </div>
            </div>
            <div v-if="survey.pattern == 4">
              <el-form-item
                :prop="String(survey.id)"
                :rules="validateSurveyElement(survey)"
              >
                <el-checkbox-group v-model="surveysAnswer[`${survey.id}`]">
                  <el-checkbox
                    v-for="(option, key) in splitEndLine(survey.answer_option)"
                    :key="key"
                    :label="option"
                  />
                </el-checkbox-group>
              </el-form-item>
              <div v-if="!isEmptyCustom(rule(survey))" class="form-rule">
                {{ rule(survey) }}
              </div>
            </div>
            <div v-if="survey.pattern == 5">
              <el-form-item
                :prop="String(survey.id)"
                :rules="validateSurveyElement(survey)"
              >
                <el-date-picker
                  v-model="surveysAnswer[`${survey.id}`]"
                  type="date"
                  format="yyyy/MM/dd"
                  placeholder="Pick a date"
                  value-format="yyyy/MM/dd"
                  class="full-width-calendar"
                  :clearable="false"
                  :editable="false"
                  :picker-options="{
                    disabledDate(time) {
                      return (
                        time.getTime() < moment(survey.min_date) ||
                        time.getTime() > moment(survey.max_date)
                      )
                    },
                  }"
                />
              </el-form-item>
              <div v-if="!isEmptyCustom(rule(survey))" class="form-rule">
                {{ rule(survey) }}
              </div>
            </div>
            <div v-if="survey.pattern == 6">
              <el-form-item
                :prop="String(survey.id)"
                :rules="validateSurveyElement(survey)"
              >
                <el-upload
                  class="image-uploader"
                  action="/admin/image-upload"
                  :show-file-list="false"
                  :auto-upload="false"
                  :on-change="handleChange"
                  accept=".jpg, .png, .jpeg"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="image-preview" />
                  <i v-else class="el-icon-plus image-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <div v-if="!isEmptyCustom(rule(survey))" class="form-rule">
                {{ rule(survey) }}
              </div>
            </div>
          </div>
          <p class="tiny-custom-text" style="color: #656565">
            Fields have(*) are required fields.
          </p>
          <div class="box-content-policy">
            <p>About the handling of personal information<br /></p>
            <a
              href="#"
              style="color: #7c7cdc; text-decoration: underline"
              @click="readPolicy = true"
            >
              Read policy
            </a>
            <el-checkbox v-model="checkBox">
              I agree with the privacy policy
            </el-checkbox>
          </div>
          <el-form-item>
            <el-button
              class="w-100 btn-create yellow"
              type="success"
              :disabled="!checkBox"
              round
              @click="submitFormData('formSurvey')"
            >
              Save
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import validate from '@/helpers/custom-rules-validate'
import moment from 'moment'

/* eslint-disable no-undef */
export default {
  name: 'DialogSurvey',
  mixins: [validate],
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < moment().add(1, 'M')
        },
      },
      imageUrl: '',
      surveyActice: 0,
      newImage: false,
      loading: false,
      surveys: [],
      surveysAnswer: {},
      checkBox: false,
      readPolicy: false,
      userId: '',
      categoryDetail: {},
      policy: '',
    }
  },
  computed: {
    categoryId() {
      return this.$route.query.categoryid
    },
    ssId() {
      return this.$route.query.ssid
    },
  },
  async created() {
    this.loading = true
    const { userId } = await liff.getProfile()
    this.userId = userId
    this.getSurveyInfo()
    this.getCategoryDetail()
    this.getPolicy()
  },
  methods: {
    getPolicy() {
      this.$services.station.getPolicy(
        this.ssId,
        (res) => {
          this.policy = res.policy
        },
        (err) => {
          this.$log.error(err)
        }
      )
    },
    async getCategoryDetail() {
      this.loading = true
      await this.$services.admin.getCategoryById(
        this.categoryId,
        (response) => {
          this.categoryDetail = response
          this.loading = false
        },
        (err) => {
          this.$log.error(err)
          this.loading = false
        }
      )
    },
    handleChange(file) {
      let regex = /(.jpg|.jpeg|.png)$/
      let isFormat = regex.test(file.name.toLowerCase())
      if (!isFormat) {
        this.notifyError('The image format is incorrect.')
        return false
      }
      let isLt10M = file.size / 1024 / 1000 < 10
      if (!isLt10M) {
        this.notifyError('The image size exceeds the limit.')
        return false
      }
      if (isFormat && isLt10M) {
        this.newImage = true
        this.surveysAnswer[this.surveyActice] = file.raw
        this.imageUrl = URL.createObjectURL(file.raw)
      }
    },
    async submitFormData() {
      this.$refs['formSurvey'].validate(async (valid) => {
        if (valid) {
          this.startLoading()

          if (this.newImage) {
            await this.updateLoadImageToS3(
              this.surveysAnswer[this.surveyActice]
            )
          }
          const data = {
            userId: this.userId,
            categoryId: this.categoryId,
            ssId: this.ssId,
            surveysAnswer: this.surveysAnswer,
          }

          this.startLoading()
          await this.$services.driver.answerSurvey(
            data,
            () => {
              this.endLoading()
              this.$message({
                message: this.$t('Submit form success'),
                type: 'success',
              })
              setTimeout(() => {
                liff.closeWindow()
              }, 2000)
            },
            (err) => {
              this.$log.error(err)
              this.endLoading()
            }
          )
        }
      })
    },
    async updateLoadImageToS3(data) {
      let formData = new FormData()
      formData.append('image', data)
      formData.append('ssId', this.ssId)
      formData.append('userId', this.userId)
      formData.append('otherName', this.categoryDetail.other_name)

      this.startLoading()
      await this.$services.driver.updateLoadImageToS3(
        formData,
        (res) => {
          this.surveysAnswer[this.surveyActice] = res
          this.endLoading()
        },
        (err) => {
          this.endLoading()
          this.$log.error(err)
        }
      )
    },
    getSurveyInfo() {
      const params = {
        userId: this.userId,
        ssId: this.ssId,
        categoryId: this.categoryId,
      }
      this.$services.driver.getSurveyInfo(
        params,
        (response) => {
          const surveyValue = {}
          response.surveys.forEach((survey) => {
            switch (survey.pattern) {
              case 4:
                surveyValue[survey.id] = []
                break

              case 6:
                this.surveyActice = survey.id
                surveyValue[survey.id] = ''
                break

              default:
                surveyValue[survey.id] = ''
                break
            }
          })

          this.surveysAnswer = surveyValue
          this.surveys = response.surveys
          this.loading = false
        },
        (err) => {
          this.loading = false
          this.$log.error(err)
        }
      )
    },
    labelName(data) {
      let label = data.question
      if (data.required) {
        label += `<span class="text-danger tiny-custom-text-required">*</span>`
      }
      return label
    },
  },
}
</script>

<style>
.form-survey-app .el-checkbox {
  display: block;
  margin-bottom: 0;
  line-height: 25px;
}
.image-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin: auto;
  display: block;
}
.image-uploader .el-upload:hover {
  border-color: #409eff;
}
.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.image-preview {
  width: 100%;
  display: block;
}
</style>

<style lang="scss" scoped>
.wrapper {
  margin: auto 20px;
  padding-top: 20px;

  h4 {
    margin-bottom: 30px;
    text-align: center;
  }

  .el-form-item__label {
    padding-bottom: 0;
  }
}
.box-content-policy {
  margin-bottom: 20px;
  p {
    font-size: 14px;
    margin-bottom: 6px;
  }

  a {
    color: blue;
  }
}
.my-question-name {
  float: left;
  margin-left: 3px;
  font-size: 16px;
  color: #312f39;
}
.full-width-calendar {
  width: 100%;
}
.full-width-select {
  width: 100%;
}
.form-survey-header {
  color: #143c4f;
  font-weight: 900;
  font-size: 20px;
}
</style>
