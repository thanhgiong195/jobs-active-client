<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item
      v-for="(item, i) in crumbs"
      :key="i"
      :to="i < crumbs.length ? item.path : '#'"
      class="cursor-pointer"
    >
      <fa v-if="i === 0" icon="home" />
      {{ $t(item.name) }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  props: {
    crumbs: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
