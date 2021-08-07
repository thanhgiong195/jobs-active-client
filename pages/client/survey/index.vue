<template>
  <div class="mx-3 my-4">
    <ListCategoriesSurvey
      :show-create="showCreate"
      :title="$t('application_job_list')"
    />
  </div>
</template>
<script>
import ListCategoriesSurvey from '@/components/categories/ListCategoriesSurvey'

export default {
  layout: 'admin',
  middleware: 'client',
  components: {
    ListCategoriesSurvey,
  },
  data() {
    return {
      showCreate: true,
    }
  },
  created() {},
}
</script>
