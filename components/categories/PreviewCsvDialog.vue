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
        <el-table-column label="#" type="index" width="50" fixed />
        <el-table-column
          :label="$t('answer_date_time')"
          width="170px"
          prop="answer_datetime"
          :resizable="false"
          fixed
        >
        </el-table-column>
        <el-table-column
          width="150px"
          :label="$t('user_name')"
          prop="driver.name"
          :resizable="false"
          fixed
        />
        <el-table-column
          width="150px"
          :label="$t('line_id')"
          prop="driver.line_id"
          :resizable="false"
          fixed
        />
        <el-table-column
          v-for="(survey, index) in previewSurvey"
          :key="index"
          :width="previewSurvey.length >= 4 ? 250 : ''"
          :prop="`details[` + index + `].answer_content`"
          :label="survey.question"
          :resizable="false"
        >
        </el-table-column>
      </el-table>
    </div>
    <div v-else class="text-center">
      <h5>
        {{ $t('this_survey_has_no_answer') }}
      </h5>
    </div>
    <div slot="footer" class="dialog-footer el-dialog--end">
      <el-button class="cancel-btn" @click="emitDialogVisible(false)">
        {{ this.$t('cancel') }}
      </el-button>
      <el-button
        class="btn-create yellow"
        type="primary"
        :disabled="isEmptyCustom(surveyAnswers) ? true : false"
        @click="emitDialogVisible(false, true)"
      >
        {{ $t('download') }}
      </el-button>
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
    emitDialogVisible(dialogStatus, confirmStatus = false) {
      this.$emit('listenCsvPreview', dialogStatus, confirmStatus)
    },
  },
}
</script>
