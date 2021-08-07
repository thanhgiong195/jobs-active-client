<template>
  <div v-if="status === 1" class="table-datetime">
    <el-row style="display: flex; width: 100%">
      <el-col style="margin-top: 20px; width: 25%">
        {{ $t('契約期間') }}
      </el-col>
      <el-col style="margin-top: 10px; width: 75%">
        <div class="date-picker">
          <el-date-picker
            v-model="form.begin_reward_exchange_contract"
            align="right"
            placeholder="YYYY年MM月DD日"
            type="date"
            @change="getDatetime()"
          ></el-date-picker>
          ~
          <el-date-picker
            v-model="form.end_reward_exchange_contract"
            align="right"
            placeholder="YYYY年MM月DD日"
            @change="getDatetime()"
          ></el-date-picker>
        </div>
        <label v-if="rewardVisible">
          時間（自）には時間（至）より小さい値を指定して下さい。
        </label>
      </el-col>
    </el-row>

    <el-row v-if="isReceipt" style="display: flex; width: 100%">
      <el-col style="margin-top: 20px; width: 25%">
        {{ $t('商品交換期間') }}
      </el-col>
      <el-col style="margin-top: 10px; width: 75%">
        <div class="date-picker">
          <el-date-picker
            v-model="form.begin_contract"
            align="right"
            placeholder="YYYY年MM月DD日"
            type="date"
            @change="getDatetime()"
          ></el-date-picker>
          ~
          <el-date-picker
            v-model="form.end_contract"
            align="right"
            placeholder="YYYY年MM月DD日"
            @change="getDatetime()"
          ></el-date-picker>
        </div>
        <label v-if="contractVisible">
          時間（自）には時間（至）より小さい値を指定して下さい。
        </label>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss">
.table-datetime {
  label {
    color: #dc3545;
    margin-top: 5px;
  }
}

@media screen and (max-width: 1367px) {
  .date-picker {
    width: 150px;
    .el-date-editor {
      width: unset;
    }
  }

  label {
    font-size: 0.8rem;
  }
}
</style>

<script>
import validate from '@/helpers/custom-rules-validate'
import Constant from '@/constant.json'
import moment from 'moment'

export default {
  mixins: [validate],
  props: {
    status: {
      type: Number,
      default: 0,
    },
    screenType: {
      type: String,
      default: '',
    },
    serviceType: {
      type: Number,
      default: 0,
    },
    serviceId: {
      type: Number,
      default: 0,
    },
    formData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isReceipt: false,
      form: {
        begin_reward_exchange_contract: null,
        end_reward_exchange_contract: null,
        begin_contract: null,
        end_contract: null,
      },
      innerForm: {
        begin_reward_exchange_contract: null,
        end_reward_exchange_contract: null,
        begin_contract: null,
        end_contract: null,
      },
      rewardVisible: false,
      contractVisible: false,
    }
  },
  watch: {
    status(newValue) {
      if (newValue === 0) {
        this.form = this.innerForm
      }
    },
    screenType(newValue) {
      this.form = this.formData
      if (newValue === 'SSアカウント編集画面') {
        this.form = this.formData
      }
    },
    'form.begin_reward_exchange_contract'(newValue) {
      let startDateReward = moment(newValue).format('YYYY-MM-DD')
      let endDateReward = this.isEmptyCustom(
        this.form.end_reward_exchange_contract
      )
        ? null
        : moment(this.form.end_reward_exchange_contract).format('YYYY-MM-DD')

      if (
        !this.isEmptyCustom(endDateReward) &&
        startDateReward > endDateReward
      ) {
        this.rewardVisible = true
      } else {
        this.rewardVisible = false
      }
    },
    'form.end_reward_exchange_contract'(newValue) {
      let startDateReward = this.isEmptyCustom(
        this.form.begin_reward_exchange_contract
      )
        ? null
        : moment(this.form.begin_reward_exchange_contract).format('YYYY-MM-DD')
      let endDateReward = moment(this.form.end_reward_exchange_contract).format(
        'YYYY-MM-DD'
      )

      if (
        !this.isEmptyCustom(startDateReward) &&
        startDateReward > endDateReward
      ) {
        this.rewardVisible = true
      } else {
        this.rewardVisible = false
      }
    },
    'form.begin_contract'(newValue) {
      let startDateContract = moment(this.form.begin_contract).format(
        'YYYY-MM-DD'
      )
      let endDateContract = this.isEmptyCustom(this.form.end_contract)
        ? null
        : moment(this.form.end_contract).format('YYYY-MM-DD')

      if (
        !this.isEmptyCustom(endDateContract) &&
        startDateContract > endDateContract
      ) {
        this.contractVisible = true
      } else {
        this.contractVisible = false
      }
    },
    'form.end_contract'(newValue) {
      let startDateContract = this.isEmptyCustom(this.form.begin_contract)
        ? null
        : moment(this.form.begin_contract).format('YYYY-MM-DD')
      let endDateContract = moment(this.form.end_contract).format('YYYY-MM-DD')

      if (
        !this.isEmptyCustom(startDateContract) &&
        startDateContract > endDateContract
      ) {
        this.contractVisible = true
      } else {
        this.contractVisible = false
      }
    },
  },
  created() {
    this.isReceipt = this.serviceType === Constant.services.receipt.type
    this.form = this.formData
    if (this.screenType === 'SSアカウント編集画面') {
      this.form = this.formData
    }
  },
  methods: {
    getDatetime() {
      const data = {
        begin_reward_exchange_contract: this.form.begin_reward_exchange_contract
          ? moment(this.form.begin_reward_exchange_contract).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          : null,
        end_reward_exchange_contract: this.form.end_reward_exchange_contract
          ? moment(this.form.end_reward_exchange_contract).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          : null,
        begin_contract: this.form.begin_contract
          ? moment(this.form.begin_contract).format('YYYY-MM-DD HH:mm:ss')
          : null,
        end_contract: this.form.end_contract
          ? moment(this.form.end_contract).format('YYYY-MM-DD HH:mm:ss')
          : null,
      }

      this.$emit('sendData', {
        serviceId: this.serviceId,
        data: data,
        flagService: this.contractVisible || this.rewardVisible ? false : true,
      })
      return data
    },
  },
}
</script>
