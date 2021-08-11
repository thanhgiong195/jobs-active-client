<template>
  <div>
    <div class="d-flex justify-content-between mb-5">
      <h5 class="title-page">{{ $t(title) }}</h5>

      <el-button class="btn-create yellow" type="primary" @click="handleCreate">
        {{ $t('create_new_category') }}
      </el-button>
    </div>

    <el-table
      v-if="tableData"
      v-loading="loading"
      :header-cell-style="{ background: '#D2D6E1' }"
      :data="tableData"
      style="width: 100%"
      :empty-text="$t('empty_corresponding_data')"
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        prop="name"
        :label="$t('category_name')"
        :resizable="false"
      />
      <el-table-column
        prop="description"
        :label="$t('category_description')"
        width="500px"
        :resizable="false"
      />
      <el-table-column
        :resizable="false"
        :label="$t('action')"
        :width="this.$store.state.i18n.locale == 'en' ? 380 : 400"
      >
        <template slot-scope="scope">
          <div class="d-flex list-button-action">
            <div>
              <el-button
                class="table-button button-info"
                type="info"
                size="medium"
                @click="editSurvey(scope.row)"
              >
                {{ $t('job_creation') }}
              </el-button>
              <el-button
                class="table-button button-download"
                type="info"
                size="medium"
                @click="handleDownload(scope.row)"
              >
                {{ $t('View data') }}
              </el-button>
              <el-button
                size="medium"
                class="table-button button-delete"
                @click="handleDelCategoryDialog(scope.row)"
              >
                {{ $t('delete') }}
              </el-button>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <table v-else class="table table-bordered table-hover">
      <tr>
        <td class="text-center">$t('')</td>
      </tr>
    </table>
    <div
      style="margin-top: 1em"
      class="d-flex justify-content-end align-items-center mb-2"
    >
      <SimplePagination
        v-if="!isEmptyCustom(tableData) && totalPage > 1"
        v-model="page"
        :change-page="changePageData"
        :total-page="totalPage"
      />
    </div>
    <FormCategory
      :visible="dialogVisible"
      :categories="categories"
      :list-category-data="tableData"
      :flat-create="flatCreate"
      @close="handleClose"
    />
    <confirm-dialog
      :dialog-visible="dialogSentVisible"
      :dialog-type="dialogSentType"
      :dialog-message="dialogSentMessage"
      @handleCloseDialog="listenCloseSendDialog"
    />
    <confirm-dialog
      :dialog-visible="dialogDelCategoryVisible"
      :dialog-type="dialogDelCategoryType"
      :dialog-message="dialogDelCategoryMsg"
      @handleCloseDialog="listenDelCategoryDialog"
    />
    <confirm-dialog
      :dialog-visible="dialogCopyVisible"
      :dialog-type="dialogCopyType"
      :dialog-message="dialogCopyMsg"
      @handleCloseDialog="listenCopyCategoryDialog"
    />
    <section>
      <DialogPreview
        :visible="previewVisible"
        :list-survey="previewSurvey"
        :category-detail="categoryDetail"
        @close="handlePreviewClose()"
      />
    </section>

    <section>
      <PreviewCsvDialog
        :preview-visible="previewCsvVisible"
        :category-detail="curRow"
        :survey-answers="surveyAnswers"
        :preview-survey="previewSurvey"
        @listenCsvPreview="listenCsvPreview"
        @openBoxChat="openBoxChat"
      />
    </section>

    <el-dialog
      title="Chat"
      class="chat"
      :visible.sync="visibleBoxChat"
      width="450px"
    >
      <div>
        <p class="client chat-content">面談は明日にお願いします。</p>
        <p class="user chat-content">了解いたしました。</p>
        <p class="client chat-content">場所と担当は後で連絡します</p>
      </div>
      <el-input
        v-model="textChating"
        class="mt-4"
        placeholder="Enter text chatting..."
        type="text"
      >
        <el-button slot="append" icon="el-icon-s-promotion"></el-button>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeBoxChatting">Close</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FormCategory from '@/components/categories/FormCategory'
import PreviewCsvDialog from '@/components/categories/PreviewCsvDialog'
import SimplePagination from '@/components/pagination/SimplePagination'
import ConfirmDialog from '@/components/ConfirmDialog'
import DialogPreview from '@/components/admin/surveys/DialogPreview'

export default {
  components: {
    FormCategory,
    SimplePagination,
    ConfirmDialog,
    DialogPreview,
    PreviewCsvDialog,
  },
  props: {
    title: {
      type: String,
      default: 'カテゴリ一覧',
    },
    showCreate: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      flatCreate: true,
      textChating: '',
      categories: {},
      categoryDetail: {},
      previewSurvey: [],
      previewVisible: false,
      visibleBoxChat: false,
      tableData: [],
      dialogVisible: false,
      totalPage: '',
      page: this.$route.query.page || 1,
      // send form dialog
      dialogSentVisible: false,
      dialogSentType: 'info',
      dialogSentMessage: 'vertification_message',
      // delete category dialog
      dialogDelCategoryVisible: false,
      dialogDelCategoryType: 'warning',
      dialogDelCategoryMsg: 'delete_msg',
      // copy Category dialog
      dialogCopyVisible: false,
      dialogCopyType: 'info',
      dialogCopyMsg: 'confirm_copy',
      curRow: [],
      previewCsvVisible: false,
      surveyAnswers: [],
    }
  },
  computed: {
    profile() {
      return this.$authInfo.getData('station_profile')
    },
  },
  created() {
    this.getListCategory(this.page)
  },
  methods: {
    closeBoxChatting() {
      this.visibleBoxChat = false
      this.textChating = ''
    },
    openBoxChat() {
      this.visibleBoxChat = true
    },
    handlePreviewClose() {
      this.previewSurvey = []
      this.categoryDetail = {}
      this.previewVisible = false
    },
    async handlePreviewDialog(category) {
      await this.getListSurvey(category.id)
      this.categoryDetail = category
      this.previewVisible = true
    },
    async getListSurvey(categoryId) {
      this.loading = true
      await this.$services.common.getListSurvey(
        { category_id: categoryId },
        (response) => {
          response.listItem.map((value) => {
            value.status = value.status ? true : false
          })
          this.previewSurvey = response.listItem
          this.loading = false
        },
        (err) => {
          this.loading = false
          this.$log.error(err)
        }
      )
    },
    listenCsvPreview(dialogStatus, confirmStatus) {
      this.previewCsvVisible = false
      if (confirmStatus) {
        this.downloadCsv(this.curRow)
      }
    },
    listenCloseSendDialog(dialogStatus, sentStatus) {
      if (sentStatus) {
        this.sendMessageToDriver(this.curRow)
      }
      this.dialogSentVisible = dialogStatus
    },
    listenDelCategoryDialog(dialogStatus, delStatus) {
      if (delStatus) {
        this.deleteCategory(this.curRow)
      }
      this.dialogDelCategoryVisible = dialogStatus
    },
    listenCopyCategoryDialog(dialogStatus, copyStatus) {
      if (copyStatus) {
        this.copyCategory(this.curRow)
      }
      this.dialogCopyVisible = dialogStatus
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row'
      }
      return 'success-row'
    },
    getListCategory(page) {
      this.loading = true
      this.$services.admin.getListCategory(
        { page },
        (response) => {
          this.tableData = response.data.listItem
          this.totalPage = response.pagination.total_pages
          this.loading = false
        },
        (err) => {
          this.$log.error(err)
          this.loading = false
        }
      )
    },
    handleCreate() {
      this.dialogVisible = true
      this.flatCreate = true
      this.categories = {
        id: '',
        name: '',
        order: '',
        image: '',
      }
    },
    handleCopyUrl(row) {
      let codeToCopy = document.querySelector('#survey_' + row.id)
      codeToCopy.setAttribute('type', 'text')
      codeToCopy.select()

      try {
        const successful = document.execCommand('copy')
        const msg = successful
          ? this.$t('Copy URL success')
          : this.$t('Copy URL fail')
        this.$notify({
          title: this.$t('success'),
          message: msg,
          type: 'success',
        })
      } catch (err) {
        this.$notify({
          title: this.$t('error'),
          message: err,
          type: 'warning',
        })
      }

      codeToCopy.setAttribute('type', 'hidden')
      window.getSelection().removeAllRanges()
    },
    handleCopyDialog(row) {
      this.curRow = row
      this.dialogCopyVisible = true
    },
    copyCategory(item) {
      this.loading = true
      this.$services.admin.copyCategory(
        { id: item.id },
        () => {
          this.loading = false
          this.getListCategory(this.page)
          this.$notify({
            title: this.$t('success'),
            message: this.$t('Clone success'),
            type: 'success',
          })
        },
        (err) => {
          this.loading = false
          this.$log.error(err)
        }
      )
    },
    changePageData(page) {
      this.page = page
      this.getListCategory(this.page)
    },
    handleClose(flag) {
      this.dialogVisible = false
      if (flag) {
        this.getListCategory(this.page)
      }
    },
    editSurvey(row) {
      this.dialogVisible = true
      this.flatCreate = false
      this.categories = row
    },
    handleSendMessageDialog(row) {
      this.dialogSentVisible = true
      this.curRow = row
    },
    sendMessageToDriver(row) {
      const data = {
        category_id: row.id,
      }
      this.$services.common.sendMessageToLine(
        data,
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
    handleDelCategoryDialog(row) {
      this.dialogDelCategoryVisible = true
      this.curRow = row
    },
    deleteCategory(row) {
      this.$services.admin.deleteCategory(
        row.id,
        () => {
          this.page = this.checkPage(this.tableData, this.page)
          this.getListCategory(this.page)
          this.$notify({
            title: this.$t('success'),
            message: this.$t('delete_successfully'),
            type: 'success',
          })
        },
        (err) => {
          this.showErrorMessage(err)
          this.$log.error(err)
        }
      )
    },
    async handleDownload(row) {
      this.curRow = row
      this.getListSurvey(row.id)
      await this.$services.common.getAnswerData(
        row.id,
        (success) => {
          if (success) {
            this.surveyAnswers = success.dataToDownload.data
          }
        },
        (error) => {
          console.log(error)
        }
      )
      this.previewCsvVisible = true
    },
    downloadCsv(row) {
      const fileName = row.name
      this.$services.common.downloadSurveyAnswer(
        row.id,
        {},
        (success) => {
          if (success) {
            const arrayBuffer = this.base64ToArrayBuffer(success)
            this.createAndDownloadBlobFile(arrayBuffer, fileName)
          }
        },
        (error) => {
          console.log(error)
        }
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.chat {
  .chat-content {
    width: 80%;
    border: 2px solid #2557a4;
    padding: 5px 10px;
    border-radius: 10px;
    color: white;

    &.user {
      margin-left: 20%;
      text-align: right;
      background-color: #50aa5f;
    }

    &.client {
      background-color: #3a6ebf;
    }
  }
}
.el-table tr th {
  background-color: #f5f7fa;
}
.demo-input-label {
  display: inline-block;
  width: 130px;
}
.demo-input-suffix {
  display: flex;
  align-items: flex-end;
  .el-input {
    width: 180px;
  }
}
.preview-img {
  height: 60px;
}
th div {
  text-align: center !important;
}
.list-button-action {
  > div:not(:last-child) {
    margin-right: 15px;
  }
}
.table-button {
  margin-left: 10px;
}
</style>
