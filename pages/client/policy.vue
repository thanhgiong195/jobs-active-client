<template>
  <div class="mx-3 my-4">
    <h2 class="text-center brand">
      {{ $t('Policy') }}
    </h2>
    <div class="d-flex align-items-start mb-3">
      <div class="ml-3 w-100">
        <VueEditor v-model="policy" />
      </div>
    </div>
    <div class="dialog-footer text-right">
      <el-button type="primary" class="btn-create yellow" @click="saveData()">
        {{ $t('save') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'

export default {
  layout: 'admin',
  middleware: 'client',
  components: {
    VueEditor,
  },
  data() {
    return {
      policy: '',
    }
  },
  created() {
    this.getStationInfo()
  },
  methods: {
    getStationInfo() {
      this.startLoading()
      this.$services.station.getPolicy(
        this.$authInfo.id(),
        (res) => {
          this.endLoading()
          this.policy = res.policy
        },
        (err) => {
          this.$log.error(err)
          this.endLoading()
        }
      )
    },
    saveData() {
      if (this.policy) {
        this.startLoading()
        this.$services.station.updatePolicy(
          { content: this.policy },
          () => {
            this.endLoading()
            this.$notify({
              title: this.$t('success'),
              message: this.$t('update_successfully'),
              type: 'success',
            })
            this.$router.push({
              name: 'client-survey',
            })
          },
          (err) => {
            this.$log.error(err)
            this.endLoading()
          }
        )
      }
    },
  },
}
</script>

<style scoped lang="scss">
.brand {
  color: $color-text-base;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  font-weight: bold;
}
</style>
