<template>
  <div class="mt-3">
    <div class="form-login">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        @keydown.native.enter.prevent="submitForm('ruleForm')"
      >
        <el-form-item prop="login_id">
          <el-input
            v-model="ruleForm.login_id"
            class="input-left"
            placeholder="Account"
            type="email"
            autocomplete="off"
            :maxlength="50"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            class="input-left"
            placeholder="Password"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <div class="error">{{ error }}</div>
        <button
          type="button"
          class="btn btn-login btn-create yellow"
          @click="submitForm('ruleForm')"
        >
          Login
        </button>
      </el-form>
    </div>
    <div v-if="checkRole()" class="actions">
      <a class="text-dark mb-3 hover-text" @click="resetPassword()">
        <u>Forgot your password</u>
      </a>
    </div>
  </div>
</template>

<script>
import validate from '@/helpers/custom-rules-validate'
import LoginSocial from '@/helpers/login-social'
import Cookies from 'js-cookie'

export default {
  mixins: [validate, LoginSocial],
  props: {
    idRole: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      messageLogin: '',
      stringCommon: '',
      error: '',
      rules: {
        login_id: [
          {
            required: true,
            message: 'Please enter your account name.',
          },
          {
            max: 50,
            message: 'Please enter within 50 characters',
            trigger: 'blur',
          },
          {
            pattern: /^[^ぁ-んァ-ヶ　ａ-ｚＡ-Ｚ０-９ー・]*$/,
            message: 'Please enter in half-width characters',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            whitespace: true,
            message: 'Please enter your password.',
          },
          {
            max: 16,
            message: 'Enter a value of 16 digits or less for the password.',
            trigger: 'blur',
          },
          {
            min: 8,
            message: 'Enter a value of 8 digits or more for the password.',
            trigger: 'blur',
          },
          {
            pattern: /^[^ぁ-んァ-ヶ　ａ-ｚＡ-Ｚ０-９ー・]*$/,
            message: 'Please enter in half-width characters.',
            trigger: 'blur',
          },
        ],
      },
      ruleForm: {
        login_id: '',
        password: '',
        form: 'login',
        idRole: -1,
      },
    }
  },
  created() {
    this.ruleForm.idRole = this.idRole
  },
  methods: {
    checkRole() {
      return [3].includes(this.idRole)
    },
    resetPassword() {
      let routerName = ''
      switch (this.idRole) {
        case 2:
          routerName = 'approver-reset-password'
          break
        case 3:
          routerName = 'client-reset-password'
          break
        default:
          routerName = ''
          break
      }
      this.$router.push({
        name: routerName,
      })
    },
    saveCompanyToken(value) {
      Cookies.set('company_token', value, {
        expires: 60 * 60 * 24 * process.env.TOKEN_EXPIRED,
      })
      Cookies.set('is_company', true, {
        expires: 60 * 60 * 24 * process.env.TOKEN_EXPIRED,
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postLogin(formName)
        } else {
          this.focusError()
          return false
        }
      })
    },
    async postLogin(formName) {
      this.startLoading()
      await this.$services.common.login(
        this.ruleForm,
        (response) => {
          this.saveAccessToken(response.access_token, response.user_obj.role)
          let redirect
          switch (response.user_obj.role) {
            case 1:
              redirect = '/admin/client'
              break

            default:
              redirect = '/client/survey'
              break
          }
          this.endLoading()
          window.location = redirect
        },
        (err) => {
          this.$log.info(err)
          this.showErrorMessage(err, formName)
          this.endLoading()
        }
      )
    },
  },
}
</script>

<style lang="scss">
.hover-text:hover {
  cursor: pointer;
}
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
