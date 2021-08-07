<template>
  <div class="mx-5 my-4">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="mb-5">
      <el-breadcrumb-item :to="{ name: 'admin' }" class="cursor-pointer">
        <fa icon="home" />
        {{ $t('homepage') }}
      </el-breadcrumb-item>
      <el-breadcrumb-item> 管理アカウント作成 </el-breadcrumb-item>
    </el-breadcrumb>
    <h5 class="mb-0">{{ $t('管理アカウント作成') }}</h5>
    <hr />
    <div>
      <div class="demo-input-suffix mb-4">
        <el-col :span="4" :offset="20">
          <el-button
            style="width: 100%"
            type="primary"
            @click="handlingOpenForm()"
          >
            {{ $t('管理アカウント作成') }}
          </el-button>
        </el-col>
      </div>
      <el-table
        :data="listItem"
        :empty-text="$t('empty_corresponding_data')"
        highlight-current-row
        style="width: 100%"
        border
        class="table-serenade my-table"
      >
        <el-table-column
          :resizable="false"
          :label="$t('順番.')"
          class-name="text-center"
          width="100"
        >
          <template slot-scope="scope">
            {{ (page - 1) * perPage + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column :resizable="false" :label="$t('アカウント種別')">
          <template slot-scope="scope">
            {{ showTextRole(scope.row.role) }}
          </template>
        </el-table-column>
        <el-table-column
          :resizable="false"
          :label="$t('アカウント名（ID)')"
          prop="login_id"
        />
        <el-table-column
          :resizable="false"
          :label="$t('取引先名')"
          prop="user_profile.customer"
        />
        <el-table-column
          :resizable="false"
          :label="$t('取引先担当者名')"
          prop="user_profile.contact_name"
        />
        <el-table-column
          class-name="text-center"
          :resizable="false"
          :label="$t('アクション')"
          width="200"
        >
          <template slot-scope="scope">
            <el-button
              class="btn-edit"
              type="success"
              @click="handlingEdit(scope.$index)"
            >
              {{ $t('編集') }}
            </el-button>
            <el-button
              class="btn-delete"
              type="danger"
              @click="handleDelete(scope.row.id)"
            >
              {{ $t('削除') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="d-flex justify-content-between mt-3">
        <div style="width: 224px"></div>
        <div
          v-if="!isEmptyCustom(listItem) && totalPage > 1"
          class="justify-content-center mt2"
        >
          <SimplePagination
            v-model="page"
            :change-page="changePageData"
            :total-page="totalPage"
          />
        </div>
        <div v-if="!isEmptyCustom(listItem)" class="justify-content-end mt2">
          <el-button type="primary" @click="exportCsv()">
            {{ $t('管理アカウントデータダウンロード') }}
          </el-button>
        </div>
      </div>
    </div>
    <dialog-add-user-form
      :visible="visible"
      :user="currentUser"
      :flag-create="flagCreate"
      @close="handlingClose"
    />
  </div>
</template>

<script>
import FrontendBase from '@/components/layouts/FrontendBase'
import DialogAddUserForm from '@/components/admin/DialogAddUserForm'
import SimplePagination from '~/components/pagination/SimplePagination'
import Constant from '~/constant.json'

export default {
  components: {
    DialogAddUserForm,
    SimplePagination,
  },
  extends: FrontendBase,
  layout: 'admin',
  middleware: 'admin',
  data() {
    return {
      constant: Constant,
      visible: false,
      flagCreate: true,
      currentUser: {
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
      listItem: [],
      listAccount: [],
      totalPage: '',
      totalItem: '',
      perPage: '',
      page: 1,
    }
  },
  created() {
    let queryPageParams = this.$route.query.page
    if (!this.isEmptyCustom(queryPageParams)) {
      this.page = parseInt(queryPageParams)
    }
    this.getListOtherAccount(this.page)
  },
  methods: {
    async getListOtherAccount(page) {
      this.startLoading()
      await this.$services.admin.getListOtherAccount(
        { page: page },
        (response) => {
          this.listItem = response.listItem
          this.listAccount = response.listAccount
          this.totalPage = response.pagination.total_pages
          this.totalItem = response.pagination.total
          this.endLoading()
        },
        (err) => {
          this.$log.error(err)
          this.endLoading()
        }
      )
    },
    changePageData(page) {
      this.getListOtherAccount(page)
      this.$router.push({
        name: 'admin-account',
        query: {
          page,
        },
      })
      this.page = page
    },
    handlingOpenForm() {
      this.visible = true
      this.flagCreate = true
    },
    handleDelete(id) {
      this.$confirm('削除しますか？', '警告', {
        confirmButtonText: 'OK',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      }).then(() => {
        this.$services.admin.removeUserAccount(
          id,
          () => {
            this.checkPage()
            this.getListOtherAccount(this.page)
            this.$notify({
              title: '成功',
              message: this.$t('削除成功しました。'),
              type: 'success',
            })
          },
          (err) => {
            this.$log.error(err)
          }
        )
      })
    },
    exportCsv: async function () {
      this.startLoading()
      await this.$services.admin.exportCsvUser(
        (response) => {
          if (response) {
            const arrayBuffer = this.base64ToArrayBuffer(response)
            this.createAndDownloadBlobFile(arrayBuffer, 'アカウント名一覧')
          }
          this.endLoading()
        },
        (err) => {
          this.$log.error(err)
          this.showErrorMessage(err)
        }
      )
    },
    checkPage() {
      if (this.listItem.length == 1) {
        this.page = this.page - 1
      }
    },
    handlingEdit(index) {
      this.visible = true
      this.flagCreate = false
      this.currentUser = {
        ...this.listAccount[index],
        user_profile: {
          ...this.listAccount[index].user_profile,
          password_confirm: this.listAccount[index].user_profile.password,
        },
      }
    },
    handlingClose(flag) {
      this.visible = false
      this.currentUser = {
        login_id: '',
        role: 2,
        user_profile: {
          customer: '',
          contact_name: '',
          supplier_code: '',
          password: '',
          password_confirm: '',
        },
      }
      if (flag) {
        this.getListOtherAccount(this.page)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
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
@media screen and (min-width: 1024px) {
  .btn-delete {
    margin-left: unset;
  }
  .btn-edit {
    margin-bottom: 5px;
  }
}
</style>
