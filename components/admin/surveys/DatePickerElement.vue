<template>
  <div>
    <el-date-picker
      v-model="value"
      :prop="`owner.surveys.` + index"
      :disabled="isDisabled"
      :placeholder="$t('pick_a_day')"
      class="w-100"
    >
    </el-date-picker>
    <div v-if="!isEmptyCustom(rule(element))" class="mt-3 form-rule">
      {{ rule(element) }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'DatepickerElement',
  props: {
    isDisabled: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      default: 0,
    },
    element: {
      type: Object,
      default: () => {},
    },
    answer: {
      type: Object,
      default: () => {},
    },
    driver: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style scoped lang="scss">
.form-rule {
  margin-left: 0;
  padding-top: 6px;
  font-size: 11px;
  padding-left: 12px;
  position: relative;

  &:after {
    content: '*';
    position: absolute;
    left: 3px;
    top: 9px;
    font-size: 16px;
  }
}
</style>
