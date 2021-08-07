<template>
  <div v-loading="loading">
    <div v-if="!flag" style="text-align: center; font-size: 16px color: red">
      {{ message }}
    </div>
    <div v-else class="mt-3">
      <div class="form-login">
        <el-form ref="ruleForm" :model="formData" :rules="rules">
          <div class="d-flex justify-content-between">
            <div>Password</div>
          </div>
          <el-form-item prop="password">
            <el-input
              v-model="formData.password"
              class="input-left"
              placeholder="Enter password here"
              autocomplete="off"
              type="password"
              :maxlength="50"
            />
          </el-form-item>
          <div class="d-flex justify-content-between">
            <div>Confirm password</div>
          </div>
          <el-form-item prop="password_confirm">
            <el-input
              v-model="formData.password_confirm"
              class="input-left"
              placeholder="Re-type password here"
              type="password"
              autocomplete="off"
              :maxlength="50"
            />
          </el-form-item>
          <button
            type="button"
            class="btn btn-login btn-create yellow"
            @click="updatePassword('ruleForm')"
          >
            Save
          </button>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import validate from '@/helpers/custom-rules-validate'

export default {
  mixins: [validate],
  data() {
    return {
      error: '',
      message: '',
      flag: true,
      loading: false,
      formData: {
        password: '',
        password_confirm: '',
      },
      rules: {
        password: this.validatePassword('password'),
        password_confirm: this.validatePassword('confirm password'),
      },
    }
  },
  created() {
    this.checkToken()
  },
  methods: {
    checkToken() {
      this.loading = true
      this.$services.common.checkToken(
        { token: this.$route.query.token },
        (response) => {
          this.flag = response.status
          this.message = response.message
          this.loading = false
        },
        (err) => {
          this.loading = false
          this.showErrorMessage(err)
        }
      )
    },
    updatePassword(formName) {
      this.formData.token = this.$route.query.token
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.startLoading()
          this.$services.common.updateNewPassword(
            this.formData,
            () => {
              this.endLoading()
              this.$alert(
                'The password has been changed successfully.',
                'Success',
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
              this.endLoading()
              this.showErrorMessage(err, formName)
            }
          )
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.btn-login {
  width: 100%;
  margin-top: 10px;

  &:hover {
    opacity: 0.8;
    color: white;
  }
}
</style>
