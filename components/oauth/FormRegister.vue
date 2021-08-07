<template>
  <div>
    <div class="form-login">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        @keydown.native.enter.prevent="submitForm('ruleForm')"
      >
        <p style="margin: 15px 0">
          <el-form-item prop="login_id">
            <el-input
              v-model="ruleForm.login_id"
              class="input-left"
              :placeholder="$t(`Input account`)"
              type="account"
              autocomplete="off"
            />
          </el-form-item>
        </p>
        <p>
          <el-form-item prop="name">
            <el-input
              v-model="ruleForm.name"
              class="input-left"
              :placeholder="$t(`Input name`)"
              type="text"
              autocomplete="off"
            />
          </el-form-item>
        </p>
        <p>
          <el-form-item prop="password">
            <el-input
              v-model="ruleForm.password"
              class="input-left"
              :placeholder="$t(`Input password`)"
              type="password"
              autocomplete="off"
            />
          </el-form-item>
        </p>
        <p>
          <el-form-item prop="password_confirmation">
            <el-input
              v-model="ruleForm.password_confirmation"
              class="input-left"
              :placeholder="$t(`Input password confirmation`)"
              type="password"
              autocomplete="off"
            />
          </el-form-item>
        </p>
        <el-form-item label="Role :">
          <el-radio-group v-model="resource" size="medium">
            <el-radio border label="Admin"></el-radio>
            <el-radio border label="Approve"></el-radio>
            <el-radio border label="Station"></el-radio>
          </el-radio-group>
        </el-form-item>
        <p class="error">{{ error }}</p>
        <p>
          <button
            type="button"
            class="btn btn-login meta"
            @click="submitForm('ruleForm')"
          >
            {{ $t('Register') }}
          </button>
        </p>
      </el-form>
    </div>
    <div class="actions">
      <p>
        {{ $t(`Do you have an account?`) }}
        <nuxt-link to="/login">{{ $t(`Login`) }}</nuxt-link>
      </p>
      <p>
        <a class="btn-forget" href="#">{{ $t(`Forgot password?`) }}</a>
      </p>
    </div>
  </div>
</template>

<script>
import validate from '@/helpers/custom-rules-validate'
import LoginSocial from '@/helpers/login-social'

export default {
  mixins: [validate, LoginSocial],
  data() {
    return {
      stringCommon: '',
      error: '',
      rules: {
        login_id: [
          {
            required: true,
            message: this.$t(`アカウントを入力ください。`),
          },
        ],
        name: [
          {
            required: true,
            whitespace: true,
            message: this.$t(`Please input name!`),
          },
        ],
        password: [
          {
            required: true,
            whitespace: true,
            message: this.$t(`Please input password!`),
          },
        ],
        password_confirmation: [
          {
            required: true,
            whitespace: true,
            message: this.$t(`Please input password confirmation!`),
          },
        ],
      },
      ruleForm: {
        login_id: '',
        password: '',
        password_confirmation: '',
        form: 'login',
        role: 2,
      },
      resource: '',
    }
  },
  watch: {
    resource(value) {
      if (value) {
        this.error = ''
      }
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid || this.resource) {
          this.postRegister(formName)
        } else {
          if (!this.resource) {
            this.error = this.$t(`Please choose role!`)
          }
          this.focusError()
          this.$log.warn('Error validate')
          return false
        }
      })
    },
    async postRegister(formName) {
      this.startLoading()
      if (!this.resource) {
        this.endLoading()
        return
      }
      switch (this.resource) {
        case 'Admin':
          this.ruleForm.role = 1
          break
        case 'Approve':
          this.ruleForm.role = 2
          break
        default:
          this.ruleForm.role = 3
      }
      await this.$services.common.register(
        this.ruleForm,
        (response) => {
          this.saveAccessToken(response.access_token, response.user_obj.role)
          this.$authInfo.loginAction(response.user_obj)
          let redirect
          switch (this.$authInfo.role()) {
            case 1:
              redirect = this.getRoutePath('admin')
              break
            case 2:
              redirect = this.getRoutePath('approve')
              break
            default:
              redirect = this.getRoutePath('client')
              break
          }
          window.location = redirect
        },
        (err) => {
          this.$log.error(err)
          this.showErrorMessage(err, formName)
        }
      )
      this.endLoading()
    },
  },
}
</script>

<style lang="scss">
.error {
  color: red;
}
</style>
