<template>
  <div class="mt-3">
    <div class="form-login">
      <el-form ref="ruleForm" :model="formData" :rules="rules">
        <div class="d-flex justify-content-between">
          <div>Current password</div>
        </div>
        <el-form-item prop="password_old">
          <el-input
            v-model="formData.password_old"
            class="input-left"
            placeholder="Enter current password here"
            autocomplete="off"
            type="password"
            :maxlength="50"
          />
        </el-form-item>
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
          class="btn btn-login meta btn-create yellow"
          @click="changePassword('ruleForm')"
        >
          Save
        </button>
      </el-form>
    </div>
  </div>
</template>
<script>
import validate from '@/helpers/custom-rules-validate'

export default {
  mixins: [validate],
  data() {
    return {
      formData: {
        password: '',
        password_confirm: '',
      },
      rules: {
        password_old: this.validatePassword('current password'),
        password: this.validatePassword('password'),
        password_confirm: this.validatePassword('confirm password'),
      },
    }
  },
  methods: {
    changePassword(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.startLoading()
          this.$services.station.ChangeInfoPasswordUpdate(
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
