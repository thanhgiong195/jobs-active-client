<template>
  <div v-loading="loadingData">
    <el-divider></el-divider>

    <div class="d-flex justify-content-end mb-5 position-relative">
      <h5 class="title-page">
        {{ $t('question_title') }}
      </h5>
      <div>
        <el-button
          class="btn-create yellow"
          type="primary"
          :disabled="tableData.length >= maxListSurvey || created"
          @click="handleCreate()"
        >
          {{ $t('add_question') }}
        </el-button>
      </div>
    </div>

    <el-table
      v-if="tableData"
      :header-cell-style="{ background: '#D2D6E1' }"
      :data="tableData"
      style="width: 100%"
      class="table-serenade my-table"
      :empty-text="$t('empty_corresponding_data')"
      :row-class-name="tableRowClassName"
    >
      <el-table-column :resizable="false" :label="$t('style')" width="130">
        <template slot-scope="{ row }">
          {{ $t(showText(row.pattern, patterns)) }}
        </template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        prop="question"
        :label="$t('question')"
      />
      <el-table-column
        :resizable="false"
        :label="$t('required_title')"
        width="90"
      >
        <template slot-scope="{ row }" class="text-center">
          {{ row.required ? $t('required_text') : '' }}
        </template>
      </el-table-column>
      <el-table-column
        :resizable="false"
        :label="$t('option_or_display_condition')"
      >
        <template slot-scope="{ row }">
          {{ showPatternInput(row) }}
        </template>
      </el-table-column>
      <el-table-column
        :resizable="false"
        class-name="text-center"
        prop="action"
        :label="$t('action')"
        width="360"
      >
        <template slot-scope="scope">
          <el-button
            class="table-button button-edit"
            size="medium"
            @click="handleUpdate(scope.$index)"
          >
            {{ $t('edit') }}
          </el-button>
          <el-button
            size="medium"
            class="table-button button-delete"
            @click="handleDelSurveyDialog(scope.row)"
          >
            {{ $t('delete') }}
          </el-button>
          <el-button
            class="table-button button-action-sort"
            size="medium"
            :disabled="scope.$index == 0 ? true : false"
            @click="handleUp(scope.$index, scope.row)"
          >
            {{ $t('up') }}
          </el-button>
          <el-button
            class="table-button button-action-sort"
            size="medium"
            :disabled="scope.$index == tableData.length - 1 ? true : false"
            @click="handleDown(scope.$index, scope.row)"
          >
            {{ $t('down') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <DialogSurvey
      :category-id="categoryId"
      :visible="visible"
      :survey="survey"
      :list-survey="previewSurvey"
      :is-image-survey-existed="isImageSurveyExisted"
      @close="handleClose"
    />

    <confirm-dialog
      :dialog-visible="dialogDelSurveyVisible"
      :dialog-type="dialogDelSurveyType"
      :dialog-message="dialogDelSureyMsg"
      @handleCloseDialog="listenDelSurveyDialog"
    />
  </div>
</template>

<script>
import FrontendBase from '@/components/layouts/FrontendBase'
import validate from '@/helpers/custom-rules-validate'
import DialogSurvey from '@/components/survey/DialogSurvey'
import FormCategory from '@/components/categories/FormCategory'

export default {
  components: {
    DialogSurvey,
    FormCategory,
  },
  extends: FrontendBase,
  mixins: [validate],
  props: {
    maxListSurvey: {
      type: Number,
      default: 10,
    },
    categoryId: {
      type: Number,
      default: 0,
    },
    created: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      previewVisible: false,
      visible: false,
      dialogEditForm: false,
      flatCreate: true,
      tableData: [],
      previewSurvey: [],
      loadingData: false,
      categoryDetail: {},
      categoryName: this.$route.query.categoryName,
      isImageSurveyExisted: false,
      dialogDelSurveyVisible: false,
      dialogDelSurveyType: 'warning',
      dialogDelSureyMsg: 'delete_msg',
      curRow: [],
      survey: null,
      patterns: [
        {
          value: 1,
          label: 'text_input',
        },
        {
          value: 2,
          label: 'drop_down',
        },
        {
          value: 3,
          label: 'multiple_choice',
        },
        {
          value: 4,
          label: 'checkboxes',
        },
        {
          value: 5,
          label: 'date',
        },
        {
          value: 6,
          label: 'image_upload',
        },
      ],
      pattern_inputs: [
        {
          value: 1,
          label: 'no_compulsion',
        },
        {
          value: 2,
          label: 'full_width_characters_only',
        },
        {
          value: 3,
          label: 'half_width_characters_only',
        },
        // {
        //   value: 4,
        //   label: 'half_width_alphabet_only',
        // },
        {
          value: 5,
          label: 'half_width_numbers_only',
        },
        {
          value: 6,
          label: 'email_only',
        },
      ],
      required: [
        {
          value: '0',
          label: 'random',
        },
        {
          value: '1',
          label: 'required',
        },
      ],
      rules: {
        name: [
          {
            required: true,
            message: this.$t('item_name_required'),
            trigger: 'blur',
          },
        ],
        question: [
          {
            required: true,
            message: this.$t('question_name_required'),
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    if (!this.created) {
      this.getCategoryDetail()
      this.getListSurvey()
    }
  },
  methods: {
    listenDelSurveyDialog(dialogStatus, delStatus) {
      if (delStatus) {
        this.deleteSurvey(this.curRow)
      }
      this.dialogDelSurveyVisible = dialogStatus
    },
    async getCategoryDetail() {
      this.loadingData = true
      await this.$services.admin.getCategoryById(
        this.categoryId,
        (response) => {
          this.categoryDetail = response
          this.loadingData = false
        },
        (err) => {
          this.$log.error(err)
          this.loadingData = false
        }
      )
    },
    handleUpdateForm(item) {
      this.dialogEditForm = true
      this.flatCreate = false
    },
    async getListSurvey() {
      this.loadingData = true
      await this.$services.common.getListSurvey(
        { category_id: this.categoryId },
        (response) => {
          response.listItem.map((value) => {
            value.status = value.status ? true : false
          })
          this.tableData = response.listItem
          this.previewSurvey = response.listItem
          this.loadingData = false
          this.checkImageSurveyExisted()
        },
        (err) => {
          this.loadingData = false
          this.$log.error(err)
        }
      )
    },
    handleCreate() {
      this.survey = {
        pattern: 1,
        question: '',
        answer_option: '',
        pattern_input: '',
        min_length: '',
        max_length: '',
        required: 0,
        type: 0,
        status: true,
        min_date: '',
        max_date: '',
      }
      this.visible = true
    },
    handleUpdate(index) {
      this.visible = true
      this.survey = {
        ...Object.assign(this.tableData[index] ? this.tableData[index] : ''),
      }
    },
    showText: function (val, lists) {
      for (var i = 0; i < lists.length; i++) {
        if (lists[i].value == val) {
          if (val) {
            return this.$t(lists[i].label)
          }

          return this.$t(lists[i].label)
        }
      }
      return ''
    },
    showAnswerOption(val) {
      if (val == null) {
        return ''
      }
      let lines = val.split('\n').filter(Boolean)
      return lines.join('/')
    },
    showPatternInput: function (row) {
      if (row.pattern == 1) {
        if (!row.min_length) {
          if (row.max_length) {
            return (
              this.showText(row.pattern_input, this.pattern_inputs) +
              this.$t('pls_enter_within') +
              ' ' +
              row.max_length +
              ' ' +
              this.$t('characters')
            )
          } else {
            return this.$t('upper_limit_characters')
          }
        } else {
          if (!row.max_length) {
            return (
              this.showText(row.pattern_input, this.pattern_inputs) +
              ', ' +
              this.$t('pls_enter_at_least') +
              ' ' +
              row.min_length +
              ' ' +
              this.$t('characters')
            )
          } else {
            return (
              this.showText(row.pattern_input, this.pattern_inputs) +
              ', ' +
              row.min_length +
              ' ' +
              this.$t('characters_at_least') +
              row.max_length +
              ' ' +
              this.$t('characters_at_most')
            )
          }
        }
      } else if (
        row.pattern == 5 &&
        (row.min_date != null || row.max_date != null)
      ) {
        if (row.min_date != null && row.max_date != null) {
          return (
            this.$t('min_date') +
            ': ' +
            row.min_date +
            this.$t(' - ') +
            this.$t('max_date') +
            ': ' +
            row.max_date
          )
        } else if (row.min_date != null && row.max_date == null) {
          return this.$t('min_date') + ': ' + row.min_date
        } else {
          return this.$t('max_date') + ': ' + row.max_date
        }
      } else {
        return this.showAnswerOption(row.answer_option)
      }
    },
    handleDelSurveyDialog(row) {
      this.curRow = row
      this.dialogDelSurveyVisible = true
      console.log(this.curRow)
    },
    deleteSurvey(row) {
      row.ssId = this.$route.params.ss
      this.loadingData = true
      this.$services.common.removeSurvey(
        row,
        () => {
          this.getListSurvey()
          this.$notify({
            title: this.$t('success'),
            message: this.$t('delete_successfully'),
            type: 'success',
          })
        },
        (err) => {
          this.loadingData = false
          this.showErrorMessage(err)
        }
      )
    },
    handleClose(flag) {
      this.visible = false
      if (flag) {
        this.getListSurvey()
      }
    },
    handleCloseEditForm(flag) {
      this.dialogEditForm = false
      if (flag) {
        this.getCategoryDetail()
      }
    },
    handleUp(index, row) {
      if (index === 0) {
        return
      }
      let rewardBefore = this.tableData[index - 1]
      this.changeOrder({
        new_order: rewardBefore.order,
        old_order: row.order,
        id: row.id,
        id_change: rewardBefore.id,
      })
    },
    handleDown(index, row) {
      if (index === this.tableData.length - 1) {
        return
      }
      let rewardAfter = this.tableData[index + 1]
      this.changeOrder({
        new_order: rewardAfter.order,
        old_order: row.order,
        id: row.id,
        id_change: rewardAfter.id,
      })
    },
    changeOrder(params) {
      this.loadingData = true
      this.$services.common.changeOrderSurvey(
        params,
        () => {
          this.getListSurvey()
        },
        (err) => {
          this.$log.error(err)
          this.loadingData = false
        }
      )
    },
    handlePreviewClose() {
      this.previewVisible = false
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row'
      }
      return 'success-row'
    },
    checkImageSurveyExisted() {
      for (const survey of this.previewSurvey) {
        if (survey['pattern'] === 6) {
          this.isImageSurveyExisted = true
          return
        }
      }
      this.isImageSurveyExisted = false
    },
  },
}
</script>
<style lang="scss" scoped>
.title-page {
  position: absolute;
  top: -40px;
  left: 0;
  background-color: white;
  padding-right: 10px;
  font-size: 20px;
}
.el-table tr th {
  background-color: #f5f7fa;
}

.demo-input-label {
  display: inline-block;
  width: 45px;
  text-align: center;
}

.demo-input-suffix .el-input {
  width: 80px;
}

.el-form-item__label {
  text-align: left;
}

.line {
  margin-top: -30px;
}

.el-form-item__error {
  min-width: 200px;
}

.el-dialog__footer {
  text-align: center;
}
</style>
