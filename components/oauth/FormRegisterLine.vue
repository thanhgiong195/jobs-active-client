<template>
  <div class="mt-3">
    <div class="form-register-line">
      <el-form ref="UpdateLineConfig" :rules="rules" :model="ssProfile">
        <div class="mb-3">
          <h5>■&nbsp;{{ $t('line_channel_registration') }}</h5>
        </div>
        <table
          class="
            table table-bordered table-hover
            bo-table
            table-form-validation
          "
        >
          <tbody>
            <tr>
              <td>
                <div class="d-flex">
                  <div>{{ $t('channel_access_token') }}</div>
                  <div class="text-danger">
                    {{ `&nbsp(${$t('required')})` }}
                  </div>
                </div>
              </td>
              <td>
                <el-form-item prop="line_token">
                  <el-input v-model="ssProfile.line_token" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <div class="d-flex">
                  <div>{{ $t('channel_secret') }}</div>
                  <div class="text-danger">
                    {{ `&nbsp(${$t('required')})` }}
                  </div>
                </div>
              </td>
              <td>
                <el-form-item prop="line_channel_key">
                  <el-input v-model="ssProfile.line_channel_key" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <div class="d-flex">
                  <div>{{ $t('LIFF ID') }}</div>
                  <div class="text-danger">
                    {{ `&nbsp(${$t('required')})` }}
                  </div>
                </div>
              </td>
              <td>
                <el-form-item prop="liff_app_id">
                  <el-input v-model="ssProfile.liff_app_id" />
                </el-form-item>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="error">{{ error }}</div>
        <div class="d-flex justify-content-end">
          <el-button type="" class="btn-create yellow" @click="updateData()">
            {{ $t('save') }}
          </el-button>
        </div>
      </el-form>
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
      ssProfile: {
        line_token: '',
        line_channel_key: '',
        liff_app_id: '',
      },
      oldValue: {},
      error: '',
      rules: {
        line_token: [
          {
            required: true,
            message: this.$t('pls_enter_channel_access_token'),
          },
        ],
        line_channel_key: [
          {
            required: true,
            whitespace: true,
            message: this.$t('pls_enter_channel_secret'),
          },
        ],
        liff_app_id: [
          {
            required: true,
            whitespace: true,
            message: this.$t('pls_enter_liff_id'),
          },
        ],
      },
    }
  },
  created() {
    this.getLineConfig()
  },
  methods: {
    getLineConfig() {
      this.startLoading()
      this.$services.station.getStationInfo(
        (res) => {
          this.endLoading()
          this.ssProfile = {
            line_token: res.line_token || '',
            line_channel_key: res.line_channel_key || '',
            liff_app_id: res.liff_app_id || '',
          }
          this.oldValue = this.ssProfile
        },
        (err) => {
          this.$log.error(err)
          this.endLoading()
        }
      )
    },
    diffValue(value1, value2) {
      const val1 = JSON.stringify(value1)
      const val2 = JSON.stringify(value2)

      return val1 !== val2
    },
    updateData() {
      this.$refs['UpdateLineConfig'].validate((valid) => {
        if (valid) {
          this.startLoading()
          this.$services.station.registerLine(
            this.ssProfile,
            () => {
              this.endLoading()
              this.$alert(this.$t('thank_for_sending_channel'), {
                confirmButtonText: 'OK',
                type: 'success',
              }).then(() => {
                this.$router.push({
                  name: 'client-survey',
                })
              })
            },
            (err) => {
              this.showErrorMessage(err, 'UpdateLineConfig')
              this.endLoading()
            }
          )
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
.form-register-line {
  width: 1000px;
  margin: auto;
}

.hover-text:hover {
  cursor: pointer;
}
.error {
  color: red;
}

.btn-login {
  background-color: #353a40;
  border-color: #353a40;
  color: white;
  width: 100px;
  margin-top: 10px;

  &:hover {
    opacity: 0.8;
    color: white;
  }
}
</style>
