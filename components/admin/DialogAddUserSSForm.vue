<template>
  <el-dialog
    :title="screenTitle"
    :close-on-click-modal="false"
    :visible.sync="addFormVisible"
    width="60%"
  >
    <el-form ref="stationCreate" :model="userData" :rules="rules">
      <div class="form-group row">
        <label class="col-sm-3 col-form-label text-right">
          {{ $t('ss_name') }}
          <span class="text-danger">
            {{ '&nbsp(' + $t('required') + ')' }}
          </span>
        </label>
        <el-form-item prop="station_profile_name" class="col-sm-9">
          <el-input v-model="userData.station_profile_name" class="w-100" />
        </el-form-item>
      </div>
      <div class="form-group row">
        <label class="col-sm-3 col-form-label text-right">
          {{ $t('account_name_id') }}
          <span class="text-danger">
            {{ '&nbsp(' + $t('required') + ')' }}
          </span>
        </label>
        <el-form-item prop="login_id" class="col-sm-9">
          <el-input
            v-if="isCreate"
            v-model="userData.login_id"
            class="focus-select w-100"
            :disabled="flagDisableID"
          />
          <el-label
            v-else
            :disabled="flagDisableID"
            class="focus-select"
            v-html="userData.login_id"
          />
        </el-form-item>
      </div>
      <div class="form-group row">
        <label class="col-sm-3 col-form-label text-right">
          {{ $t('password') }}
          <span class="text-danger">
            {{ '&nbsp(' + $t('required') + ')' }}
          </span>
        </label>
        <el-form-item prop="ss_station_profile_password" class="col-sm-9">
          <el-input
            v-model="userData.ss_station_profile_password"
            class="focus-select w-100"
            show-password
          />
          <small class="form-text" style="line-height: 15px">
            (*){{ $t('dialog_add_ss_user_password_notes') }}
          </small>
        </el-form-item>
      </div>
      <div class="form-group row">
        <label class="col-sm-3 col-form-label text-right">
          {{ $t('password_confirmation') }}
          <span class="text-danger">
            {{ '&nbsp(' + $t('required') + ')' }}
          </span>
        </label>
        <el-form-item
          prop="ss_station_profile_password_confirm"
          class="col-sm-9"
        >
          <el-input
            v-model="userData.ss_station_profile_password_confirm"
            class="focus-select w-100"
            show-password
          />
        </el-form-item>
      </div>
      <div class="form-group row">
        <label class="col-sm-3 col-form-label text-right">
          {{ $t('address') }}
        </label>
        <el-form-item prop="station_profile_address" class="col-sm-9">
          <el-input v-model="userData.station_profile_address" class="w-100" />
        </el-form-item>
      </div>
      <div class="form-group row">
        <label class="col-sm-3 col-form-label text-right">
          {{ $t('phone_number') }}
        </label>
        <el-form-item prop="station_profile_phone" class="col-sm-9">
          <el-input v-model="userData.station_profile_phone" class="w-100" />
        </el-form-item>
      </div>
      <div class="form-group row">
        <label class="col-sm-3 col-form-label text-right">
          {{ $t('mail_address') }}
          <span class="text-danger">
            {{ '&nbsp(' + $t('required') + ')' }}
          </span>
        </label>
        <el-form-item prop="station_profile_mail_address" class="col-sm-9">
          <el-input
            v-model="userData.station_profile_mail_address"
            class="w-100"
          />
        </el-form-item>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button class="btn-confirm-custom" @click="handlingSubmit()">
        {{ btnTextSubmit }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import validate from '@/helpers/custom-rules-validate'
import Constant from '@/constant.json'

export default {
  components: {},
  mixins: [validate],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    ssProfile: {
      type: Object,
      default: null,
    },
    ssList: {
      type: Array,
      default: () => {},
    },
  },
  data() {
    const matchPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('empty_password_confirmation_err')))
      } else if (value !== this.userData.ss_station_profile_password) {
        callback(new Error(this.$t('incorrect_password_confirmation_err')))
      } else {
        callback()
      }
    }

    const uniqueSsLogin = (rule, value, callback) => {
      const findSsLogin = this.ssList.find((item) => item.login_id === value)
      if (findSsLogin && this.isCreate) {
        callback(
          new Error(this.$t('Login ID is available, please use another ID'))
        )
      } else {
        callback()
      }
    }

    return {
      btnTextSubmit: this.$t('create_new'),
      originalBand: Constant.originalBandName,
      flagDisableID: false,
      userData: {
        login_id: '',
        station_profile_id: 0,
        station_profile_address: '',
        station_profile_line_channel_key: '',
        station_profile_line_token: '',
        station_profile_liff_app_id: '',
        station_profile_mail_address: '',
        station_profile_name: '',
        ss_station_profile_password: '',
        ss_station_profile_password_confirm: '',
        station_profile_phone: '',
      },
      flagService: true,
      rules: {
        station_profile_name: [
          {
            required: true,
            message: this.$t(`empty_ss_name_err`),
          },
          {
            max: 254,
            message:
              this.$t('pls_enter_within') + ' 254 ' + this.$t('characters'),
          },
        ],
        station_profile_mail_address: this.validateEmailAddress(),
        login_id: [
          {
            required: true,
            whitespace: true,
            message: this.$t('empty_account_name_id_err'),
          },
          {
            pattern: /^[^ぁ-んァ-ヶａ-ｚＡ-Ｚ０-９ー・]*$/,
            message: this.$t(`empty_single_byte_number_err`),
            trigger: 'blur',
          },
          {
            max: 128,
            message:
              this.$t('pls_enter_within') + ' 128 ' + this.$t('characters'),
          },
          {
            validator: uniqueSsLogin,
          },
        ],
        ss_station_profile_password: [
          {
            required: true,
            whitespace: true,
            message: this.$t(`new_password_alert`),
          },
          {
            pattern: /^[^ぁ-んァ-ヶａ-ｚＡ-Ｚ０-９ー・]*$/,
            message: this.$t(`incorrect_password_confirmation_err`),
          },
          {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
            message: this.$t(`incorrect_password_confirmation_err`),
          },
          {
            max: 16,
            message:
              this.$t('pls_enter_within') + ' 16 ' + this.$t('characters'),
          },
        ],
        ss_station_profile_password_confirm: [
          {
            validator: matchPassword,
          },
        ],

        station_profile_address: [
          {
            max: 254,
            message:
              this.$t('pls_enter_within') + ' 254 ' + this.$t('characters'),
          },
        ],
        station_profile_phone: [
          {
            pattern: /^[0-9]*$/,
            message: this.$t(`empty_single_byte_number_err`),
          },
          {
            min: 10,
            max: 11,
            message: `Please enter 10 digits at least and 11 digits at most.`,
            trigger: 'blur',
          },
        ],
      },
      innerValue: false,
    }
  },
  computed: {
    screenTitle: function () {
      return this.isEmptyCustom(this.ssProfile)
        ? this.$t('introduced_user_creation')
        : this.$t('introducing_user_details')
    },
    isCreate: function () {
      return this.isEmptyCustom(this.ssProfile)
    },
    addFormVisible: {
      get: function () {
        return this.visible || this.innerValue
      },
      set: function (newValue) {
        if (!newValue) {
          this.$emit('close', false)
        }
        this.innerValue = newValue
      },
    },
  },
  watch: {
    addFormVisible: function (newValue) {
      if (newValue) {
        if (!this.isCreate) {
          this.userData.id = this.getNullValue(this.ssProfile.id)
          this.userData.profile_id = this.getNullValue(
            this.ssProfile.station_profile.id
          )
          this.btnTextSubmit = this.$t('update')
          this.flagDisableID = true
          this.userData.login_id = this.getNullValue(this.ssProfile.login_id)
          this.userData.station_profile_address = this.getNullValue(
            this.ssProfile.station_profile.address
          )
          this.userData.station_profile_line_channel_key = this.getNullValue(
            this.ssProfile.station_profile.line_channel_key
          )
          this.userData.station_profile_line_token = this.getNullValue(
            this.ssProfile.station_profile.line_token
          )
          this.userData.station_profile_liff_app_id = this.getNullValue(
            this.ssProfile.station_profile.liff_app_id
          )
          this.userData.station_profile_mail_address = this.getNullValue(
            this.ssProfile.station_profile.mail_address
          )
          this.userData.station_profile_name = this.getNullValue(
            this.ssProfile.station_profile.name
          )
          this.userData.ss_station_profile_password = this.getNullValue(
            this.ssProfile.station_profile.password
          )
          this.userData.ss_station_profile_password_confirm = this.getNullValue(
            this.ssProfile.station_profile.password
          )
          this.userData.station_profile_phone = this.getNullValue(
            this.ssProfile.station_profile.phone
          )
          this.userData.station_profile_id = this.getNullValue(
            this.ssProfile.station_profile.id
          )
        }
        if (this.isCreate) {
          this.btnTextSubmit = this.$t('create')
          this.flagDisableID = false
        }
      } else {
        this.resetForm()
      }
      this.$nextTick(() => {
        this.$refs['stationCreate'].clearValidate()
      })
    },
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    async handlingSubmit() {
      this.turnOffErrorMessage('stationCreate')
      if (this.flagService) {
        this.$refs['stationCreate'].validate((valid) => {
          if (valid) {
            this.submit()
          }
        })
      }
    },
    submit() {
      this.startLoading()
      if (this.isCreate) {
        this.$services.admin.addNewStation(
          this.convertParams(this.userData),
          () => {
            this.$emit('close', true, this.btnTextSubmit)
            this.endLoading()
          },
          (err) => {
            this.endLoading()
            this.showErrorMessage(err, 'stationCreate')
          }
        )
      }
      if (!this.isCreate) {
        this.$services.admin.saveStationInfo(
          this.ssProfile.id,
          this.convertParams(this.userData),
          () => {
            this.$emit('close', true, this.btnTextSubmit)
            this.endLoading()
          },
          (err) => {
            this.endLoading()
            this.showErrorMessage(err, 'stationCreate')
          }
        )
      }
    },
    resetForm() {
      this.userData = {
        login_id: '',
        station_profile_id: 0,
        station_profile_address: '',
        station_profile_line_channel_key: '',
        station_profile_line_token: '',
        station_profile_liff_app_id: '',
        station_profile_mail_address: '',
        station_profile_name: '',
        ss_station_profile_password: '',
        ss_station_profile_password_confirm: '',
        station_profile_phone: '',
      }
      this.$nextTick(() => {
        this.$refs['stationCreate'].clearValidate()
        this.$emit('close', false)
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.btn-upload label {
  border: 1px solid #dcdfe6;
}
</style>
