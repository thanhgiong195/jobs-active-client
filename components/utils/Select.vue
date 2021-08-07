<template>
  <el-select
    v-model="value"
    clearable
    :placeholder="placeholder"
    class="search-area-item"
  >
    <el-option
      v-for="(item, index) in options"
      :key="index"
      :label="item[keyLabel]"
      :value="item[keyValue]"
    >
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'Select',
  props: {
    placeholder: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
    keyLabel: {
      type: String,
      default: 'label',
    },
    keyValue: {
      type: String,
      default: 'value',
    },
  },
  data() {
    return {
      value: '',
    }
  },
  watch: {
    value: {
      handler: function (newVal) {
        this.$emit('input', newVal)
      },
      immediate: true,
    },
  },
}
</script>

<style scoped></style>
