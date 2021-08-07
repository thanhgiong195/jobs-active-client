<template>
  <div class="mx-3 my-4">
    <ListSurvey :category-id="categoryId" :max-list-survey="100" />
  </div>
</template>

<script>
import FrontendBase from '@/components/layouts/FrontendBase'
import ListSurvey from '@/components/survey/ListSurvey'
export default {
  components: {
    ListSurvey,
  },
  layout: 'admin',
  middleware: 'client',
  extends: FrontendBase,
  data() {
    return {
      categoryId: Number(this.$route.params.id),
    }
  },
}
</script>

<style lang="scss" scoped>
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

.add-new {
  margin-top: 20px;
  float: right;
}

.el-form-item__error {
  min-width: 200px;
}

.el-dialog__footer {
  text-align: center;
}
</style>
