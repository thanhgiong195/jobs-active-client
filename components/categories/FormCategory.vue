<template>
  <el-dialog
    v-if="categories != null"
    :title="categories.id ? $t('category_editing') : $t('category_creation')"
    :visible.sync="popupVisible"
    :close-on-click-modal="false"
    width="50%"
  >
    <el-form
      ref="formCategory"
      :rules="rules"
      :model="categories"
      :validate-on-rule-change="false"
      @submit.native.prevent
    >
      <el-row class="d-flex">
        <div class="d-flex justify-content-end w-25 pt-2 pr-5">
          <div>{{ $t('category_name') }}</div>
          <div class="text-danger ml-2">({{ $t('required') }})</div>
        </div>
        <el-form-item prop="name" class="w-75">
          <el-input v-model="categories.name"></el-input>
        </el-form-item>
      </el-row>
      <el-row class="d-flex">
        <div class="d-flex justify-content-end w-25 pt-2 pr-5">
          <div>{{ $t('category_description') }}</div>
          <div class="text-danger ml-2">({{ $t('required') }})</div>
        </div>
        <el-form-item prop="description" class="w-75">
          <el-input v-model="categories.description" type="textarea" rows="4" />
        </el-form-item>
      </el-row>
      <el-row class="d-flex">
        <div class="d-flex justify-content-end w-25 pt-2 pr-5">
          <div>{{ $t('category_image') }}</div>
        </div>
        <el-form-item prop="image" class="w-75">
          <el-upload
            class="image-uploader"
            action="/admin/image-upload"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleChangeImage"
            accept=".jpg, .png, .jpeg"
          >
            <img
              v-if="image_preview"
              :src="image_preview"
              class="image-preview"
            />
            <i v-else class="el-icon-plus image-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer el-dialog--end">
      <el-button
        class="btn-create yellow"
        :type="flatCreate ? 'primary' : 'success'"
        @click="flatCreate ? createCategory() : updateCategory()"
      >
        {{ flatCreate ? $t('create_new') : $t('update') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    flatCreate: {
      type: Boolean,
      default: true,
    },
    visible: {
      type: Boolean,
      default: null,
    },
    categories: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      image_preview: '',
      rules: {
        name: [
          {
            required: true,
            whitespace: true,
            message: '',
            trigger: 'blur',
          },
          {
            max: 100,
            message: '',
            trigger: 'blur',
          },
        ],
        description: [
          {
            required: true,
            message: '',
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
        this.turnOffErrorMessage('formCategory')
        this.$refs['formCategory'].resetFields()
        if (!newValue) {
          this.$emit('close', false)
        }
        this.innerValue = newValue
      },
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
    categories() {
      this.image_preview = this.isEmptyCustom(this.categories.image)
        ? ''
        : this.getFullPathImage(this.categories.image)
    },
  },
  mounted: function () {
    this.setFormRules()
  },
  methods: {
    setFormRules() {
      this.rules = {
        name: [
          {
            required: true,
            whitespace: true,
            message: this.$t('Please enter the Jobs name'),
            trigger: 'blur',
          },
          {
            max: 100,
            message: this.$t('pls_enter_within_100_char'),
            trigger: 'blur',
          },
        ],
        description: [
          {
            required: true,
            message: this.$t('Please enter the Jobs description'),
            trigger: 'blur',
          },
        ],
      }
    },
    handleChangeImage(file) {
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
        this.categories.newImage = true
        this.categories.image = file.raw
        this.image_preview = URL.createObjectURL(file.raw)
      }
    },
    updateCategory() {
      this.$refs['formCategory'].validate((valid) => {
        if (valid) {
          this.startLoading()
          this.$services.admin.editCategory(
            this.categories.id,
            this.convertParams(this.categories),
            () => {
              this.endLoading()
              this.offPopup()
              this.$notify({
                title: this.$t('success'),
                message: this.$t('update_successfully'),
                type: 'success',
              })
            },
            (err) => {
              this.endLoading()
              this.showErrorMessage(err, 'formCategory')
            }
          )
        }
      })
    },
    resetCategory() {
      this.categories = {
        id: '',
        name: '',
        description: '',
        image: '',
      }
      this.image_preview = ''
    },
    createCategory() {
      this.$refs['formCategory'].validate((valid) => {
        if (valid) {
          this.startLoading()
          this.$services.admin.createCategory(
            this.convertParams(this.categories),
            () => {
              this.endLoading()
              this.offPopup()
              this.$notify({
                title: this.$t('success'),
                message: this.$t('create_successfully'),
                type: 'success',
              })
            },
            (err) => {
              this.endLoading()
              this.showErrorMessage(err, 'formCategory')
            }
          )
        }
      })
    },
    offPopup() {
      this.turnOffErrorMessage('formCategory')
      this.$refs['formCategory'].resetFields()
      this.$emit('close', true)
      this.resetCategory()
    },
    showErrorMessage(errors, formName = undefined) {
      if (errors.code === 422) {
        this.turnOffErrorMessage(formName)
        this.formShowErrorMessage(errors.error, formName)
        return
      }

      const errorMessage = Object.values(errors.error).map((item) => {
        return '• ' + item
      })
      this.notifyError(errorMessage.join('\n'))
    },
    turnOffErrorMessage(formName) {
      this.$refs[formName].$children.forEach((children) => {
        children.$children.forEach((child) => {
          child.validateState = ''
          child.validateMessage = ''
        })
      })
    },
    formShowErrorMessage(errors, formName) {
      const fieldError = Object.keys(errors)
      this.$refs[formName].$children.forEach((children) => {
        children.$children.forEach((child) => {
          if (!fieldError.includes(child.prop)) {
            if (fieldError.includes('data')) {
              this.notifyError(errors.data)
            }
            return
          }
          child.validateState = 'error'
          child.validateMessage = errors[child.prop]
        })
      })
    },
  },
}
</script>
<style lang="scss">
.image-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin: auto;
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
  width: 200px;
  display: block;
}
.el-cascader-node > .el-radio {
  margin-top: 10px;
}
.el-cascader-menu__wrap {
  min-height: 350px;
}
</style>
<style lang="scss" scoped>
.text-error {
  color: red;
  margin-bottom: unset;
  margin-top: 4px;
}
.border-error {
  border: solid 1px red !important;
}
.upload-box {
  position: relative;
}
.btn-del {
  border: none !important;
  background-color: inherit;
  position: absolute;
  top: 20px;
}
.inputfile {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
.inputfile + label {
  font-size: 1.25em;
  font-weight: 700;
  color: white;
  display: inline-block;
}
.button-upload {
  width: 100%;
  padding-left: 120px;
}
.btn-upload label {
  background-color: transparent;
  padding: 3px 10px;
  border-radius: 5px;
  border: 1px solid #dcdfe6;
}
.text-required {
  color: #308ad9;
}
.text-right {
  text-align: inherit;
}
.text_reward {
  margin-left: 45px;
  width: 35%;
}
.custom-select {
  min-width: 387px;
}
.btn-large {
  width: 200px;
}
</style>
