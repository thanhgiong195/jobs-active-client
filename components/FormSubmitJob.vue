<template>
  <el-dialog
    title="応募情報"
    :visible.sync="popupVisible"
    :close-on-click-modal="false"
    width="600"
  >
    <el-form
      ref="formData"
      :rules="rules"
      :model="info"
      :validate-on-rule-change="false"
      @submit.native.prevent
    >
      <el-row class="d-flex">
        <div class="d-flex justify-content-end w-25 pt-2 pr-2">
          <div>氏名</div>
          <div class="text-danger ml-2">({{ $t('required') }})</div>
        </div>
        <el-form-item prop="name" class="w-75">
          <el-input v-model="info.name"></el-input>
        </el-form-item>
      </el-row>
      <el-row class="d-flex">
        <div class="d-flex justify-content-end w-25 pt-2 pr-2">
          <div>メールアドレス</div>
          <div class="text-danger ml-2">({{ $t('required') }})</div>
        </div>
        <el-form-item prop="email" class="w-75">
          <el-input v-model="info.email"></el-input>
        </el-form-item>
      </el-row>
      <el-row class="d-flex">
        <div class="d-flex justify-content-end w-25 pt-2 pr-2">
          <div>電話番号</div>
          <div class="text-danger ml-2">({{ $t('required') }})</div>
        </div>
        <el-form-item prop="phone" class="w-75">
          <el-input v-model="info.phone" />
        </el-form-item>
      </el-row>
      <el-row class="d-flex">
        <div class="d-flex justify-content-end w-25 pt-2 pr-2">
          <div>相談内容</div>
        </div>
        <el-form-item prop="description" class="w-75">
          <el-input v-model="info.description" type="textarea" rows="4" />
        </el-form-item>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer el-dialog--end">
      <el-button
        class="btn-create yellow w-100"
        type="success"
        @click="submit()"
      >
        送信
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: null,
    },
    lineProfile: {
      type: [Object],
      default: null,
    },
    jobId: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      info: {
        name: this.lineProfile.displayName || '',
        email: this.lineProfile.email || '',
        phone: '',
        description: '',
      },
      rules: {
        name: [
          {
            required: true,
            whitespace: true,
            message: 'Please insert name',
            trigger: 'blur',
          },
        ],
        email: [
          {
            required: true,
            whitespace: true,
            message: 'Please insert email',
            trigger: 'blur',
          },
          {
            pattern:
              /^[-a-z0-9~!$%^&*_=+}{\\'?]+(\.[-a-z0-9~!$%^&*_=+}{\\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,
            message: 'Please enter your registered email address correctly.',
          },
        ],
        phone: [
          {
            required: true,
            whitespace: true,
            message: 'Please insert phone',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  computed: {
    popupVisible: {
      get: function () {
        this.info = {
          ...this.info,
          name: this.lineProfile.displayName || '',
          email: this.lineProfile.email || '',
        }

        return this.visible || this.innerValue
      },
      set: function (newValue) {
        this.turnOffErrorMessage('formData')
        this.$refs['formData'].resetFields()
        if (!newValue) {
          this.$emit('close', false)
        }
        this.innerValue = newValue
      },
    },
  },
  methods: {
    submit() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.startLoading()
          this.$services.driver.submitJob(
            {
              ...this.info,
              job_id: this.$route.query.jobId,
              line_id: this.lineProfile.userId,
            },
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
              this.showErrorMessage(err, 'formData')
            }
          )
        }
      })
    },
    offPopup() {
      this.turnOffErrorMessage('formData')
      this.$refs['formData'].resetFields()
      this.$emit('close', true)
    },
  },
}
</script>
<style lang="scss" scoped>
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
