<template>
  <div class="formDataSurveyDriverIn">
    <FormDataServey @data-servey="submitFormData" />
  </div>
</template>

<script>
import FormDataServey from '@/components/liffApp/FormDataServey'
import Constant from '@/constant.json'
export default {
  /* eslint-disable no-undef */
  components: {
    FormDataServey,
  },
  data() {
    return {
      userId: '',
      serviceOff: false,
      constant: Constant,
    }
  },
  async created() {},
  methods: {
    submitFormData() {
      liff.closeWindow()
    },
  },
}
</script>

<style lang="scss" scoped>
.heading {
  margin: 0 15px;
}
</style>
<style lang="scss">
.formDataSurveyDriverIn {
  .form-rule {
    padding-top: 0 !important;
    font-size: 11px;
    padding-left: 12px;
    position: relative;
    margin-top: 0;
    &:after {
      content: '*';
      position: absolute;
      left: 3px;
      top: 2px !important;
      font-size: 16px;
    }
  }
  .el-form-item__error {
    padding-top: 4px !important;
  }
}
</style>
