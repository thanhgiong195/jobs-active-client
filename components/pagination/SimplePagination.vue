<template>
  <nav class="d-flex-center position-relative">
    <Paginate
      v-model="page"
      :page-count="totalPage"
      :click-handler="clickCallback"
      :prev-text="$t(`prev`)"
      :next-text="$t(`next`)"
      :container-class="containerClass ? containerClass : 'pagination'"
      page-class="page-item"
      page-link-class="page-link"
      prev-link-class="page-link"
      next-link-class="page-link"
      disabled-class="page-item disabled"
    />
    <div class="total-page-info text-right d-none">
      {{ value }}件/{{ totalPage }}件
    </div>
  </nav>
</template>

<script>
// import Paginate from 'vuejs-paginate'
import Paginate from 'vuejs-paginate/src/components/Paginate.vue'

export default {
  components: {
    Paginate,
  },
  props: {
    totalPage: {
      type: Number,
      required: true,
    },
    changePage: {
      type: Function,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    containerClass: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      innerValue: 1,
    }
  },
  computed: {
    page: {
      get: function () {
        return this.value || this.innerValue
      },
      set: function (newValue) {
        this.innerValue = newValue
      },
    },
  },
  methods: {
    clickCallback(pageNum) {
      this.changePage(pageNum)
    },
  },
}
</script>
<style scoped>
.total-page-info {
  position: absolute;
  top: 10px;
  right: 20px;
}
.page-link {
  background-color: #4e392d;
}
</style>
