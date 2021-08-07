<template>
  <el-form
    ref="form-change-image"
    :rules="rules"
    :model="profile"
    label-position="left"
  >
    <table class="table table-borderless bo-table table-form-validation">
      <tbody>
        <tr>
          <td class="text-form">
            {{ $t('SS名') }}
          </td>
          <td>
            <el-form-item prop="name" class="mb-3">
              <el-input
                v-model="profile.name"
                class="text-input"
                :disabled="!isUpdate"
              />
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td class="text-form">
            {{ $t('SS発行レシート') }}
          </td>
          <td>
            <el-form-item prop="img_receipt" class="mb-0">
              <el-button
                class="d-flex border border-secondary img-border justify-content-center align-items-center"
                style="width: 150px; height: 150px; cursor: default"
                type="text"
              >
                <template v-if="previewReceipt">
                  <img :src="previewReceipt" alt="" class="box-content-img" />
                </template>
                <template v-else>
                  {{ $t('写真をアップロード') }}
                </template>
              </el-button>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <el-form-item class="d-flex justify-content-center">
              <el-button
                :type="isUpdate ? 'primary' : 'success'"
                class="mt-1 button-submit"
                @click="
                  isUpdate ? submitImage('form-change-image') : updateProfile()
                "
              >
                {{ !isUpdate ? $t('編集') : $t('更新') }}
              </el-button>
            </el-form-item>
          </td>
        </tr>
      </tbody>
    </table>
  </el-form>
</template>

<script>
export default {
  name: 'ChangeInfoStation',
  props: {
    profile: {
      type: Object,
    },
    previewReceipt: {
      type: String,
    },
  },
  data() {
    return {
      isUpdate: false,
      typeImage: 'avatar',
      receipt: '',
      visibleChild: false,
      image_type: ['png', 'jpg', 'jpeg'],
      errors: '',
      message_error: '',
      rules: {
        name: [
          {
            required: true,
            message: this.$t('SS名を入力してください。'),
          },
        ],
      },
    }
  },
  methods: {
    updateProfile() {
      this.isUpdate = true
    },
    submitImage(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let formData = new FormData()
          formData.append('name', this.profile.name)
          this.startLoading()
          await this.$services.station.ChangeInfoImageUpdate(
            formData,
            (res) => {
              this.$notify({
                title: '成功',
                message: this.$t('成功しました。'),
                type: 'success',
              })
              this.$refs['form-change-image'].clearValidate()
              this.errors = ''
              this.isUpdate = false
              this.endLoading()
            },
            (err) => {
              this.showErrorMessage(err, 'form-change-image')
              this.$log.error(err)
              this.endLoading()
            }
          )
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.box-content-img {
  width: 150px;
  height: 150px;
  object-fit: initial;
  border-radius: 30px;
}
.border-secondary {
  border: 1px solid #dee2e6 !important;
}
.custom-file {
  margin-top: 10px;
}
.msg-dialog {
  &-img {
    margin: 1.2rem;
    border: 1px solid #dee2e6;
    height: 360px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .msg-dialog-upload {
      width: 200px;
    }
  }

  &-txt {
    margin-left: 1.2rem;
  }
}

.row-data {
  display: flex;
  label {
    width: 200px;
    text-align: left;
    margin-right: -120px;
  }
  .row-input {
    flex: 7;
  }
}

.mgl-35-pc {
  margin-left: 35.5%;
}
.message-error {
  color: #f56c6c;
  font-size: 12px;
}
.custom-file-label::after {
  content: '+';
}
.text-form {
  width: 180px;
}
.text-form-line {
  width: 220px;
}
.text-input {
  width: 60%;
}
.text-input-line {
  width: 80%;
}
.img-border {
  border-radius: 30px;
}
.button-submit {
  width: 100px;
}
</style>
