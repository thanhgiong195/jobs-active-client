<template>
  <el-popover v-model="visible" placement="top">
    <div style="text-align: right; margin: 0">
      <div class="list-color">
        <div
          v-if="resetColor"
          class="choose-color cursor-pointer"
          style="background-color: transparent"
          @click="handleClick()"
        />
        <div
          v-for="(colorCode, key) in listColor"
          :key="key"
          class="choose-color cursor-pointer"
          :style="'background-color: rgb(' + colorCode + ')'"
          @click="handleClick(colorCode)"
        />
      </div>
    </div>
    <el-tooltip
      slot="reference"
      class="item"
      effect="dark"
      :content="tooltipData.title"
      placement="top"
    >
      <el-button class="rounded-0" :icon="tooltipData.icon" />
    </el-tooltip>
  </el-popover>
</template>
<script>
export default {
  props: {
    listColor: {
      type: Array,
      default: () => [],
    },
    resetColor: {
      type: Boolean,
      default: false,
    },
    tooltipData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      visible: false,
    }
  },
  methods: {
    handleClick(colorCode = false) {
      this.visible = false
      this.$emit('handleClick', colorCode)
    },
  },
}
</script>

<style lang="scss" scoped>
.list-color {
  width: 160px;
  height: 160px;
  display: flex;
  flex-wrap: wrap;
}
.choose-color {
  width: 30px;
  height: 30px;
  padding: 5px;
  margin: 5px;
  border: 3px solid lavender;
}
.slot-color {
  width: 100%;
  height: 100%;
  border: 3px solid lavender;
}
</style>
