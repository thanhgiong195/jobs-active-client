<template>
  <el-upload
    :disabled="isDisabled"
    class="picture-card"
    :on-preview="handlePictureCardPreview"
    :auto-upload="false"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
export default {
  name: 'ImagepickerElement',
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
  data() {
    return {
      imageUrl: '',
    }
  },
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.picture-card {
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  vertical-align: top;
  width: 100px;
  height: 100px;
  line-height: 100px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
