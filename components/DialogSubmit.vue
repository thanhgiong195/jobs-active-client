<template>
  <el-dialog
    title="応募"
    :visible.sync="popupVisible"
    :close-on-click-modal="true"
    width="300px"
  >
    <div class="dialog-footer el-dialog--end">
      <div>
        <el-button
          class="btn-create yellow w-100"
          type="primary"
          @click="usingLine()"
        >
          LINE応募する
        </el-button>
      </div>
      <div class="mt-3">
        <el-button
          class="w-100"
          type="info"
          :disabled="true"
          @click="usingFacebook()"
        >
          WEBから応募
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    flatCreate: {
      type: Boolean,
      default: true,
    },
    visible: {
      type: Boolean,
      default: null,
    },
    categories: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      innerValue: false,
    }
  },
  computed: {
    popupVisible: {
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
  methods: {
    usingLine() {
      console.log('LINE')
      this.$emit('close', 'LINE')
    },
    usingFacebook() {
      console.log('Facebook')
      this.$emit('close', 'Facebook')
    },
  },
}
</script>
<style lang="scss">
.image-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin: auto;
}
.image-uploader .el-upload:hover {
  border-color: #409eff;
}
.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.image-preview {
  width: 200px;
  display: block;
}
.el-cascader-node > .el-radio {
  margin-top: 10px;
}
.el-cascader-menu__wrap {
  min-height: 350px;
}
</style>
<style lang="scss" scoped>
.text-error {
  color: red;
  margin-bottom: unset;
  margin-top: 4px;
}
.border-error {
  border: solid 1px red !important;
}
.upload-box {
  position: relative;
}
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
