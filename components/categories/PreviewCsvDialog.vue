<template>
  <el-dialog
    width="90%"
    :data="surveyAnswers"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @close="emitDialogVisible(false)"
  >
    <div slot="title" class="dialog-title">{{ categoryDetail.name }}</div>
    <div v-if="!isEmptyCustom(surveyAnswers)">
      <el-table :data="surveyAnswers" style="width: 100%" height="450">
        <el-table-column label="#" type="index" width="50" />
        <el-table-column
          :label="$t('Name')"
          width="170px"
          prop="name"
          :resizable="false"
        >
        </el-table-column>
        <el-table-column
          :label="$t('Email')"
          width="170px"
          prop="email"
          :resizable="false"
        >
        </el-table-column>
        <el-table-column
          :label="$t('Phone')"
          width="170px"
          prop="phone"
          :resizable="false"
        >
        </el-table-column>
        <el-table-column
          width="300px"
          :label="$t('line_id')"
          prop="line_id"
          :resizable="false"
        />
        <el-table-column
          :label="$t('Description')"
          prop="description"
          :resizable="false"
        />
        <el-table-column :resizable="false" :label="$t('action')" width="100px">
          <template slot-scope="scope">
            <div class="d-flex list-button-action">
              <div>
                <el-button
                  class="table-button button-info"
                  type="info"
                  size="medium"
                  @click="openBoxChat()"
                >
                  {{ $t('Chat') }}
                </el-button>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else class="text-center">
      <h5>
        {{ $t('this_job_has_no_answer') }}
      </h5>
    </div>
    <div slot="footer" class="dialog-footer el-dialog--end">
      <el-button class="cancel-btn" @click="emitDialogVisible(false)">
        {{ $t('Close') }}
      </el-button>
      <!-- <el-button
        class="btn-create yellow"
        type="primary"
        :disabled="isEmptyCustom(surveyAnswers) ? true : false"
        @click="emitDialogVisible(false, true)"
      >
        {{ $t('download') }}
      </el-button> -->
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    previewVisible: {
      type: Boolean,
      default: false,
    },
    previewSurvey: {
      type: Array,
      default: null,
    },
    categoryDetail: {
      type: [Object, Array],
      default: null,
    },
    surveyAnswers: {
      type: [Object, Array],
      default: null,
    },
  },
  data() {
    return {
      visible: false,
    }
  },
  watch: {
    previewVisible() {
      this.visible = this.previewVisible
    },
  },
  methods: {
    sendMessage(row) {
      this.$services.common.sendMessageToLine(
        row,
        (res) => {
          if (res.status) {
            this.$notify({
              title: this.$t('send'),
              message: res.message,
              type: 'success',
            })
            this.getListCategory()
          } else {
            this.$notify({
              title: this.$t('Fail'),
              message: res.message,
              type: 'warning',
            })
          }
        },
        (error) => {
          console.log(error)
        }
      )
    },
    emitDialogVisible(dialogStatus, confirmStatus = false) {
      this.$emit('listenCsvPreview', dialogStatus, confirmStatus)
    },
    openBoxChat() {
      this.$emit('openBoxChat')
    },
  },
}
</script>
