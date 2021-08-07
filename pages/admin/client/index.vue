<template>
  <div class="mx-3 my-4">
    <div class="d-flex justify-content-between mb-5">
      <h5 class="title-page">{{ $t('station_list') }}</h5>
    </div>
    <div class="d-flex mb-3 justify-content-between">
      <div style="width: calc(100% - 180px); position: relative">
        <div class="admin-search-box w-100">
          <div class="pr-2">
            <el-form
              ref="form"
              :model="searchParams"
              class="d-flex align-items-center"
              @keydown.native.enter.prevent="handlingSearch"
            >
              <el-input
                v-model="searchParams.ssName"
                :placeholder="$t('Search by name')"
                :rules="[
                  {
                    required: true,
                    message: this.$t('Please type something here to search.'),
                    trigger: 'blur',
                  },
                ]"
              />
            </el-form>
          </div>
        </div>
        <div class="search-button">
          <el-button icon="el-icon-search" @click="handlingSearch" />
        </div>
      </div>
      <el-button
        class="btn-create yellow"
        type="primary"
        @click="handleShowPopup(null)"
      >
        {{ $t('create_new_user') }}
      </el-button>
    </div>

    <el-table
      :data="listItem"
      :empty-text="$t('empty_corresponding_data')"
      :header-cell-style="{ background: '#D2D6E1' }"
      style="width: 100%"
      class="table-serenade my-table"
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="index" :label="$t('No')" :resizable="false" />
      <el-table-column
        :resizable="false"
        :label="$t('ss_name')"
        prop="station_profile.name"
      />
      <el-table-column
        :resizable="false"
        :label="$t('phone_number')"
        prop="station_profile.phone"
        width="120"
      />
      <el-table-column
        :resizable="false"
        :label="$t('mail_address')"
        prop="station_profile.mail_address"
      />
      <el-table-column :resizable="false" :label="$t('action')" width="200">
        <template slot-scope="scope">
          <div>
            <el-button
              size="medium"
              class="table-button button-edit"
              @click="handleShowPopup(scope.row)"
            >
              {{ $t('edit') }}
            </el-button>
            <el-button
              size="medium"
              class="table-button button-delete"
              @click="handleDelete(scope.$index, scope.row)"
            >
              {{ $t('delete') }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="d-flex justify-content-between mt-3">
      <div style="width: 196px"></div>
      <div
        v-if="!isEmptyCustom(listItem) && totalPage > 1"
        class="justify-content-center mt-2"
      >
        <SimplePagination
          v-model="page"
          :change-page="changePageData"
          :total-page="totalPage"
        />
      </div>
    </div>
    <dialog-add-user-s-s-form
      :visible="visible"
      :ss-profile="ssUserEdit"
      :ss-list="listItem"
      @close="handleClosePopup"
    />
    <confirm-dialog
      :dialog-visible="dialogDelUserVisible"
      :dialog-type="dialogDelUserType"
      :dialog-message="dialogDelUserMessage"
      @handleCloseDialog="listenDelUserDialog"
    />
  </div>
</template>

<script>
import FrontendBase from '@/components/layouts/FrontendBase'
import DialogAddUserSSForm from '@/components/admin/DialogAddUserSSForm'
import SimplePagination from '@/components/pagination/SimplePagination'
import ConfirmDialog from '@/components/ConfirmDialog'
import Constant from '~/constant.json'
import moment from 'moment'

export default {
  components: { DialogAddUserSSForm, SimplePagination, ConfirmDialog },
  extends: FrontendBase,
  layout: 'admin',
  middleware: 'admin',
  data() {
    return {
      Constant: Constant,
      searchParams: {
        ssName: '',
      },
      csvParams: {
        ssName: '',
      },
      ssUserEdit: {},
      visible: false,
      listItem: [],
      totalPage: '',
      totalItem: '',
      page: 1,
      links: [],
      state2: '',
      value: '',
      // Properties of delete User dialog
      dialogDelUserVisible: false,
      dialogDelUserMessage: 'delete_msg',
      dialogDelUserType: 'warning',
      curIndex: null,
      curRow: [],
    }
  },
  created() {
    let queryPageParams = this.$route.query.page
    if (!this.isEmptyCustom(queryPageParams)) {
      this.page = parseInt(queryPageParams)
    }
    this.getListStation(this.page)
  },
  methods: {
    listenDelUserDialog(dialogStatus, confirmStatus) {
      if (confirmStatus) {
        this.deleteUser(this.curIndex, this.curRow)
      }
      this.dialogDelUserVisible = dialogStatus
    },
    deleteUser(index, row) {
      this.$services.admin.removeStation(
        row['station_profile'].id,
        () => {
          this.listItem.splice(index, 1)
          this.checkPage()
          this.getListStation(this.page)
          this.$notify({
            title: this.$t('success'),
            message: this.$t('delete_successfully'),
            type: 'success',
          })
        },
        (err) => {
          this.$log.error(err)
        }
      )
    },
    async getListStation(page) {
      this.startLoading()
      let data = {
        page: page,
        name: this.searchParams.ssName,
      }

      await this.$services.admin.getListStation(
        data,
        (response) => {
          this.listItem = response.listItem
          this.totalPage = response.pagination.total_pages
          this.totalItem = response.pagination.total

          this.$router.push({
            name: 'admin-client',
            query: data,
          })
          this.endLoading()
        },
        (err) => {
          this.$log.error(err)
          this.endLoading()
        }
      )
    },
    changePageData(page) {
      this.getListStation(page)
      this.page = page
      this.$router.push({
        name: 'admin-client',
        query: { page: page },
      })
    },
    handleShowPopup(item) {
      this.ssUserEdit = item
      this.visible = true
    },
    handleDelete(index, row) {
      this.curIndex = index
      this.curRow = row
      this.dialogDelUserVisible = true
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row'
      }
      return 'success-row'
    },
    checkPage() {
      if (this.listItem.length == 0) {
        this.page = this.page - 1
      }
    },
    handleClosePopup(flag = false, formStatus) {
      this.visible = false
      if (flag) {
        console.log(flag)
        this.getListStation(this.page)
        if (formStatus == 'Update') {
          this.$notify({
            title: this.$t('success'),
            message: this.$t('update_successfully'),
            type: 'success',
          })
        } else {
          this.$notify({
            title: this.$t('success'),
            message: this.$t('create_successfully'),
            type: 'success',
          })
        }
      }
    },
    handlingSearch() {
      this.csvParams.ssName = this.searchParams.ssName
      this.getListStation(1)
    },
    showContractDateTime(startDate, endDate, formatString) {
      let strDate = ''
      if (startDate) {
        strDate = moment(startDate).format(formatString)
      }

      if (startDate || endDate) {
        strDate += ' ~ '
      } else {
        strDate += this.$t('indefinite')
      }

      if (endDate) {
        strDate += moment(endDate).format(formatString)
      }
      return strDate
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
  },
}
</script>

<style lang="scss" scoped>
.el-tooltip__popper {
  position: absolute;
  border-radius: 4px;
  padding: 12px;
  z-index: 2000;
  font-size: 12px;
  line-height: 1.2;
  width: 200px !important;
  word-wrap: break-word;
}

.el-table tr th {
  background-color: #f5f7fa;
}

.demo-input-label {
  display: flex;
  width: 130px;
  align-items: center;
  height: 40px;
}

.demo-input-suffix {
  display: flex;
  align-items: flex-end;
  width: 100%;

  .el-input {
    width: 180px;
  }
}

.btn-create-introduced-company {
  position: absolute;
  right: 3rem;
}

@media screen and (min-width: 1024px) {
  .btn-delete {
    margin-left: unset;
  }
  .btn-show {
    margin-bottom: 5px;
  }
}
.station-title {
  width: 70%;
  float: left;
}
.admin-search-box {
  width: 25%;
  float: left;
  padding-bottom: 15px;
}
.search-button {
  position: absolute;
  right: 0;
}
</style>
