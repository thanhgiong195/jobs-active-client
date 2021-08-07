<template>
  <div class="mt-3">
    <div class="form-login">
      <el-form
        ref="ruleForm"
        :model="formData"
        :rules="rules"
        @keydown.native.enter.prevent="submitForm('ruleForm')"
      >
        <el-form-item prop="login_id">
          <div>Account</div>
          <el-input
            v-model="formData.login_id"
            class="input-left"
            placeholder="Enter account here"
            autocomplete="off"
            :maxlength="50"
          />
        </el-form-item>
        <el-form-item prop="mail_address">
          <div>Registered email address</div>
          <el-input
            v-model="formData.mail_address"
            class="input-left"
            placeholder="Enter email here"
            type="email"
            autocomplete="off"
          />
        </el-form-item>
        <div class="error">{{ error }}</div>
        <button
          type="button"
          class="btn btn-login btn-create yellow"
          @click="submitForm('ruleForm')"
        >
          Send
        </button>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      error: '',
      formData: {
        login_id: '',
        mail_address: '',
      },
      rules: {
        login_id: [
          {
            required: true,
            message: 'Please enter your account.',
          },
        ],
        mail_address: [
          {
            required: true,
            message: 'Please enter your registered email address.',
          },
          {
            pattern:
              /^[-a-z0-9~!$%^&*_=+}{\\'?]+(\.[-a-z0-9~!$%^&*_=+}{\\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,
            message: 'Please enter your registered email address correctly.',
          },
        ],
      },
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.resetPassword(formName)
        } else {
          this.focusError()
          return false
        }
      })
    },
    resetPassword(formName) {
      this.startLoading()
      this.$services.common.refreshPassword(
        this.formData,
        () => {
          this.endLoading()
          this.$alert(
            'For password reset to the registered email address. I sent the URL, please change your password',
            'Confirm',
            {
              confirmButtonText: 'OK',
              type: 'success',
            }
          ).then(() => {
            this.$router.push({
              name: 'client-login',
            })
          })
        },
        (err) => {
          console.log(err)
          this.endLoading()
          this.showErrorMessage(err, formName)
        }
      )
    },
  },
}
</script>
<style lang="scss" scoped>
.error {
  color: red;
}

.btn-login {
  width: 100%;
  margin-top: 10px;

  &:hover {
    opacity: 0.8;
    color: white;
  }
}
</style>
