<template>
  <div class="mx-5 my-4">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="mb-5">
      <el-breadcrumb-item :to="{ name: 'admin' }" class="cursor-pointer">
        <fa icon="home" />
        {{ $t('homepage') }}
      </el-breadcrumb-item>
      <el-breadcrumb-item> アンケート項目設定 </el-breadcrumb-item>
    </el-breadcrumb>
    <h5 class="mb-0">{{ $t('アンケート設定項目') }}</h5>
    <hr />
    <ListSurvey
      :is-admin="isAdmin"
      :show-create="showCreate"
      :max-list-survey="10"
      :title="''"
    />
  </div>
</template>
<script>
import ListSurvey from '@/components/survey/ListSurvey'
export default {
  layout: 'admin',
  middleware: 'admin',
  components: {
    ListSurvey,
  },
  data() {
    return {
      isAdmin: true,
      showCreate: true,
    }
  },
}
</script>
