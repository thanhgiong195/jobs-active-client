<template>
  <el-dialog
    class="confirm-dialog-custom"
    :visible.sync="dialogVisibleStatus"
    width="30%"
    :close-on-click-modal="false"
    center
    @close="emitDialogVisible(false)"
  >
    <div v-if="dialogType == 'warning'" slot="title" class="dialog-title">
      {{ $t('warning') }}
    </div>
    <div v-if="dialogType == 'info'" slot="title" class="dialog-title">
      {{ $t('vertification') }}
    </div>
    <img
      v-if="dialogType == 'warning'"
      src="../assets/img/exclamation-circle.svg"
      class="center del-icon-svg custom-svg"
    />
    <img
      v-if="dialogType == 'info'"
      src="../assets/img/info-circle.svg"
      class="center info-icon-svg custom-svg"
    />
    <br />
    <span>
      <p class="dialog-content">
        {{ $t(dialogMessage) }}
      </p>
      <el-alert
        v-if="description"
        type="success"
        :description="description"
        :closable="false"
      />
    </span>
    <div class="delete-dialog-footer">
      <span>
        <el-button class="cancel-btn" @click="emitDialogVisible(false)">
          <p class="dialog-footer-text">{{ this.$t('cancel') }}</p>
        </el-button>
        <el-button
          class="btn-confirm-custom"
          type="success"
          @click="emitDialogVisible(false, true)"
        >
          <p class="dialog-footer-text">{{ this.$t('yes') }}</p>
        </el-button>
      </span>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    dialogType: {
      type: String,
      default: 'info',
    },
    dialogMessage: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialogVisibleStatus: false,
    }
  },
  watch: {
    dialogVisible() {
      this.dialogVisibleStatus = this.dialogVisible
    },
  },
  methods: {
    emitDialogVisible(dialogStatus, confirmStatus = false) {
      this.$emit('handleCloseDialog', dialogStatus, confirmStatus)
    },
  },
}
</script>
<style>
.el-dialog {
  border-radius: 12px;
}
.dialog-title {
  text-align: left !important;
  font-weight: bold;
  margin-bottom: 0 !important;
}
.del-icon-svg {
  filter: invert(70%) sepia(69%) saturate(5795%) hue-rotate(331deg)
    brightness(95%) contrast(86%);
}
.info-icon-svg {
  filter: invert(55%) sepia(92%) saturate(1554%) hue-rotate(173deg)
    brightness(90%) contrast(89%);
}
.custom-svg {
  width: 65px;
  height: auto;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.dialog-content {
  font-family: 'Noto Sans JP';
  font-weight: 500;
  text-align: center;
  font-size: 20px;
  color: #6c757d;
  word-break: break-word;
}
.delete-dialog-footer {
  margin-top: 30px;
  border: none;
  display: flex;
  justify-content: center;
}
.dialog-footer-text {
  font-size: 16px;
  margin-bottom: 0;
}
.cancel-btn:hover {
  background-color: white;
  color: #4e392d;
}
</style>
