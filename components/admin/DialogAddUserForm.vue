<template>
  <el-dialog :visible.sync="addFormVisible" :close-on-click-modal="false">
    <el-form ref="dialogAddAccountFrom" :rules="rules" :model="user">
      <h5>■&nbsp;{{ $t('ユーザー情報の詳細') }}</h5>
      <table class="table table-bordered table-hover bo-table">
        <tbody>
          <tr>
            <td>アカウント種別</td>
            <td>
              <el-form-item prop="role" class="mb-0">
                <el-radio-group v-model="user.role" :disabled="!flagCreate">
                  <div>
                    <el-radio :label="constant.user_role.approve">
                      レシート承認管理
                    </el-radio>
                  </div>
                  <div>
                    <el-radio :label="constant.user_role.supplier">
                      SS請求データ作成（BO）
                    </el-radio>
                  </div>
                  <div>
                    <el-radio :label="constant.user_role.supplier_3th">
                      SS請求データ作成（仕入れ先）
                    </el-radio>
                  </div>
                </el-radio-group>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              アカウント名（ID）
              <span v-if="flagCreate" class="text-danger">（必須）</span>
            </td>
            <td>
              <el-form-item prop="login_id">
                <el-input
                  v-if="flagCreate"
                  v-model="user.login_id"
                  class="w-100"
                />
                <el-label v-else v-html="user.login_id" class="focus-select" />
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>パスワード<span class="text-danger">（必須）</span></td>
            <td>
              <el-form-item prop="user_profile.password">
                <el-input
                  v-model="user.user_profile.password"
                  class="w-100"
                  type="password"
                  show-password
                />
              </el-form-item>
              <small style="white-space: normal; font-size: 100%">
                <span class="text-danger">(*)</span>
                パスワード半角英字小文字、半角英字大文字、半角数字をそれぞれ一つ以上かつ、八桁以上で入力してください。
              </small>
            </td>
          </tr>
          <tr>
            <td>パスワード確認<span class="text-danger">（必須）</span></td>
            <td>
              <el-form-item prop="user_profile.password_confirm">
                <el-input
                  v-model="user.user_profile.password_confirm"
                  class="w-100"
                  type="password"
                  show-password
                />
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>取引先コード<span class="text-danger">（必須）</span></td>
            <td>
              <el-form-item prop="user_profile.supplier_code">
                <el-input
                  v-model="user.user_profile.supplier_code"
                  class="w-100"
                />
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>取引先名<span class="text-danger">（必須）</span></td>
            <td>
              <el-form-item prop="user_profile.customer">
                <el-input v-model="user.user_profile.customer" class="w-100" />
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>取引先担当者名<span class="text-danger">（必須）</span></td>
            <td>
              <el-form-item prop="user_profile.contact_name">
                <el-input
                  v-model="user.user_profile.contact_name"
                  class="w-100"
                />
              </el-form-item>
            </td>
          </tr>
        </tbody>
      </table>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        :type="flagCreate ? 'success' : 'primary'"
        @click="flagCreate ? handlingCreate() : handlingEdit()"
      >
        {{ flagCreate ? $t('作成') : $t('編集') }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import validate from '@/helpers/custom-rules-validate'
import Constant from '~/constant.json'

export default {
  /* eslint-disable vue/require-default-prop */
  mixins: [validate],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    flagCreate: {
      type: Boolean,
      default: true,
    },
    user: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {
        login_id: '',
        role: 2,
        user_profile: {
          customer: '',
          contact_name: '',
          supplier_code: '',
          password: '',
          password_confirm: '',
        },
      },
    },
  },
  data() {
    const matchPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('パスワード確認ドを入力してください。')))
      } else if (value !== this.user.user_profile.password) {
        callback(new Error(this.$t('パスワード確認を正しく入力してください。')))
      } else {
        callback()
      }
    }
    return {
      innerValue: false,
      constant: Constant,
      rules: {
        user_profile: {
          supplier_code: [
            { type: 'string' },
            {
              required: true,
              message: this.$t(`取引先コードを入力してください。`),
            },
            {
              max: 7,
              message: this.$t(`7文字以内で入力してください。`),
            },
            {
              pattern: /^[0-9]*$/,
              message: this.$t(`取引先コードを数字で入力してください。`),
            },
            {
              pattern: /^\S+$/g,
              message: this.$t(`空の文字は入力しないでください。`),
            },
          ],
          customer: [
            {
              required: true,
              message: this.$t(`取引先名を入力してください。`),
            },
            {
              max: 255,
              message: '255文字以内で入力してください。',
            },
          ],
          contact_name: [
            {
              required: true,
              message: this.$t(`取引先担当者名を入力してください。`),
            },
            {
              max: 255,
              message: '255文字以内で入力してください。',
            },
          ],
          password: [
            {
              required: true,
              whitespace: true,
              message: this.$t(`新しいパスワードを入力してください。`),
            },
            {
              pattern: /^[^ぁ-んァ-ヶａ-ｚＡ-Ｚ０-９ー・]*$/,
              message: this.$t(`パスワードを正しく入力してください。`),
            },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
              message: this.$t(`パスワードを正しく入力してください。`),
            },
            {
              max: 16,
              message: '１６文字以内で入力してください。',
            },
          ],
          password_confirm: [
            {
              validator: matchPassword,
            },
          ],
        },
        login_id: [
          {
            required: true,
            whitespace: true,
            message: 'アカウント名（ID）を入力してください。',
          },
          { ...this.validateAlphabetHalfSize()[1] },
          {
            max: 50,
            message: '50文字以内で入力してください。',
          },
        ],
      },
    }
  },
  computed: {
    addFormVisible: {
      get: function () {
        return this.visible || this.innerValue
      },
      set: function (newValue) {
        if (!newValue) {
          this.offPopup()
        }
        this.innerValue = newValue
      },
    },
  },
  watch: {
    visible() {
      this.$nextTick(() => {
        this.turnOffErrorMessage('dialogAddAccountFrom')
      })
    },
  },
  methods: {
    handlingCreate() {
      this.$refs['dialogAddAccountFrom'].validate((valid) => {
        if (valid) {
          this.startLoading()
          this.$services.admin.addNewUserAccount(
            this.user,
            () => {
              this.$emit('close', true)
              this.endLoading()
              this.$notify({
                title: '成功',
                message: this.$t('成功しました。'),
                type: 'success',
              })
            },
            (err) => {
              this.endLoading()
              this.showErrorMessage(err, 'dialogAddAccountFrom')
            }
          )
        }
      })
    },
    handlingEdit() {
      this.$refs['dialogAddAccountFrom'].validate((valid) => {
        if (valid) {
          this.startLoading()
          this.$services.admin.editUserAccount(
            this.user.id,
            this.user,
            () => {
              this.$emit('close', true)
              this.endLoading()
              this.$notify({
                title: '成功',
                message: this.$t('更新の成功。'),
                type: 'success',
              })
            },
            (err) => {
              this.showErrorMessage(err, 'dialogAddAccountFrom')
              this.endLoading()
            }
          )
        }
      })
    },
    offPopup() {
      this.$refs['dialogAddAccountFrom'].clearValidate()
      this.$emit('close', false)
    },
  },
}
</script>
