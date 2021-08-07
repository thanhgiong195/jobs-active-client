<template>
  <div>
    <el-dialog
      title="予約時間変更"
      :visible.sync="dialogChangeDateTime"
      :close-on-click-modal="false"
      width="540px"
    >
      <el-form :model="formDateTime" ref="form-change-time">
        <div class="d-flex mb-2">
          <el-form-item label="予約日" class="mr-3">
            <el-date-picker
              v-model="formDateTime.date"
              :disabled="formDateTime.driver_confirm === 1"
              format="yyyy-MM-dd"
              :clearable="false"
              :editable="false"
              type="date"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          <el-form-item label="予約時間" prop="time">
            <el-time-select
              v-model="formDateTime.time"
              :disabled="formDateTime.driver_confirm === 1"
              :picker-options="{
                start: '06:00',
                step: '00:30',
                end: '22:00',
              }"
              :clearable="false"
              :editable="false"
            >
            </el-time-select>
          </el-form-item>
          <div v-if="errors.time" class="el-form-item__error">
            {{ errors.time }}
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          :disabled="formDateTime.driver_confirm === 1 || notChangeDatetime"
          type="primary"
          @click="changeTime()"
        >
          編集
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="予約の詳細結果"
      :visible.sync="popupVisible"
      :close-on-click-modal="false"
      width="70%"
    >
      <el-form ref="form" label-width="200px">
        <el-form-item label="サービス名" style="font-weight: bold">
          <div style="font-weight: normal; margin-left: 30px">
            {{ serviceInfo.service_name }}
          </div>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loadingData"
        :data="dataTable"
        :empty-text="$t('empty_corresponding_data')"
        border
        class="my-table"
      >
        <el-table-column label="番号" width="60" class-name="text-center">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="order_number"
          label="順番"
          width="80"
          class-name="text-right"
        >
          <template slot-scope="{ row }">
            {{ row.order_number }}
          </template>
        </el-table-column>
        <el-table-column prop="order_date" label="注文日時" width="180">
          <template slot-scope="{ row }">
            {{
              row.order_date_type == 'PM'
                ? showDateTime(
                    row.statistics_time,
                    constant.jp_date_format_full
                  )
                : showDateTime(row.order_date, constant.jp_date_format_full)
            }}
          </template>
        </el-table-column>
        <el-table-column prop="driver_name_kanji" label="お名前（漢字）">
          <template slot-scope="{ row }">
            {{ row.driver_name_kanji }}
          </template>
        </el-table-column>
        <el-table-column prop="driver_name_kana" label="お名前（カナ）">
          <template slot-scope="{ row }">
            {{ row.driver_name_kana }}
          </template>
        </el-table-column>
        <el-table-column prop="driver_tel" label="電話番号">
          <template slot-scope="{ row }">
            {{ row.driver_tel }}
          </template>
        </el-table-column>
        <el-table-column prop="driver_car" label="車種">
          <template slot-scope="{ row }">
            {{ row.driver_car }}
          </template>
        </el-table-column>
        <el-table-column prop="driver_note" label="注意">
          <template slot-scope="{ row }">
            {{ row.driver_note }}
          </template>
        </el-table-column>
        <el-table-column prop="driver_note" label="" width="100">
          <template slot-scope="{ row }">
            <el-button
              type="info"
              :disabled="moment(row.order_date) < moment()"
              @click="showChangeDateTime(row)"
            >
              編集
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import Constant from '@/constant.json'
import moment from 'moment'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: null,
    },
    serviceInfo: {
      type: Object,
      default: {
        color: '',
        order_date_type: null,
        service_id: 0,
        service_name: '',
        time_frame: '',
        total: 0,
      },
    },
  },
  data() {
    return {
      formDateTime: {},
      dialogChangeDateTime: false,
      notChangeDatetime: true,
      loadingData: false,
      constant: Constant,
      dataTable: [],
      service_name: '',
      pickerOptions: {
        disabledDate(time) {
          return (
            moment(new Date(time)).format('YYYY-MM-DD') <
            moment(new Date()).add(1, 'days').format('YYYY-MM-DD')
          )
        },
      },
      errors: [],
    }
  },
  computed: {
    popupVisible: {
      get: function () {
        return this.showDialog || this.innerValue
      },
      set: function (newValue) {
        // this.resetData()
        if (!newValue) {
          this.$emit('close')
        }
        this.innerValue = newValue
      },
    },
  },
  watch: {
    showDialog() {
      this.getDetail()
    },
    formDateTime: {
      handler: function (newVal) {
        const newDate = moment(newVal.date + ' ' + newVal.time).format(
          'YYYY-MM-DD HH:mm'
        )
        const oldDate = moment(newVal.old_date).format('YYYY-MM-DD HH:mm')
        this.notChangeDatetime = oldDate == newDate
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    async changeTime() {
      this.$refs['form-change-time'].clearValidate()
      const data = this.formDateTime
      if (this.$authInfo.role() == 5) {
        data.ssId = this.$route.params.ss
      }
      this.startLoading()
      await this.$services.station.changeDateTimeBooking(
        data,
        () => {
          this.dialogChangeDateTime = false
          this.getDetail()
          this.endLoading()
          this.$notify({
            title: '成功',
            message: this.$t('保存成功しました。'),
            type: 'success',
          })
        },
        (err) => {
          this.$log.error(err)
          this.showErrorMessage(err, 'form-change-time')
          this.endLoading()
        }
      )
    },
    showChangeDateTime(row) {
      this.formDateTime = {
        date: moment(
          row.driver_confirm ? row.order_date_change : row.order_date
        ).format('YYYY-MM-DD'),
        time: moment(
          row.driver_confirm ? row.order_date_change : row.order_date
        ).format('HH:mm'),
        driver_confirm: row.driver_confirm,
        old_date: row.order_date,
        id: row.id,
      }
      this.dialogChangeDateTime = true
    },
    async getDetail() {
      let param = {
        orderDate: this.serviceInfo.time_frame,
      }
      if (!this.isEmptyCustom(this.serviceInfo.order_date_type)) {
        param['orderDateType'] = this.serviceInfo.order_date_type
      }
      if (this.$authInfo.role() == 5) {
        param['ssId'] = this.$route.params.ss
      }
      this.loadingData = true
      await this.$services.station.getDetailResult(
        this.serviceInfo.service_id,
        param,
        (response) => {
          this.dataTable = response.detailResults
          this.loadingData = false
        },
        (err) => {
          this.$log.error(err)
          this.loadingData = false
          this.showErrorMessage(err)
        }
      )
    },
  },
}
</script>
