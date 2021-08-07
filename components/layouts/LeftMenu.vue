<template>
  <aside
    class="
      overflow-auto
      w-fix-280
      flex-shrink-0 flex-grow-0
      position-relative
      border-right
      left-menu
    "
  >
    <div class="container-fluid py-3">
      <ul class="nav flex-column">
        <li
          v-for="(item, index) in menuList"
          :key="index"
          :class="item.lineBottom ? 'nav-item line-bottom' : 'nav-item'"
        >
          <span
            v-if="item.route == '#'"
            class="nav-link d-inline-block disabled"
          >
            {{ $t(item.title) }}
          </span>
          <nuxt-link
            v-else-if="isEmptyCustom(item.child)"
            :to="{ name: item.route }"
            class="nav-link d-inline-block"
          >
            {{ $t(item.title) }}
          </nuxt-link>
          <span
            v-else-if="!isEmptyCustom(item.child)"
            class="nav-link d-inline-block item-menu-parent"
            @click="item.flagChild = !item.flagChild"
          >
            {{ $t(item.title) }}
            <i v-if="!item.flagChild" class="el-icon-caret-bottom"></i>
            <i v-else class="el-icon-caret-top"></i>
          </span>
          <ul
            v-if="!isEmptyCustom(item.child) && item.flagChild"
            class="nav flex-column ml-3"
          >
            <li v-for="(child, i) in item.child" :key="i" class="nav-item">
              <span
                v-if="child.route == '#'"
                class="nav-link d-inline-block disabled"
              >
                {{ $t(child.title) }}
              </span>
              <nuxt-link
                v-else
                :to="{ name: child.route }"
                class="nav-link d-inline-block"
              >
                {{ $t(child.title) }}
              </nuxt-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script>
import LeftMenu from '~/constant'
export default {
  data() {
    return {
      menuList: [],
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      let role = this.$authInfo.role()
      switch (role) {
        case 1:
          this.menuList = LeftMenu.leftMenu.admin
          break
        case 3:
          this.menuList = LeftMenu.leftMenu.client
          break
        default:
          break
      }
    },
  },
}
</script>

<style lang="scss">
.nav-link {
  color: black !important;
  &.disabled {
    color: #6c757d !important;
    pointer-events: none;
    cursor: default;
  }
}
.item-menu-parent {
  cursor: pointer;

  &:hover {
    color: $color-text-base !important;
  }
}
.line-bottom {
  border-bottom: 1px solid #dee2e6;
}
</style>
