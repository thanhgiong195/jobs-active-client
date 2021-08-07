<template>
  <nav class="bg-white border-bottom pt-1 flex-shrink-0 page-nav">
    <div
      class="container-fluid d-flex justify-content-between align-items-center"
    >
      <ul class="nav nav-bordered">
        <li
          v-for="(item, index) in menuList"
          :key="index"
          class="nav-item position-relative"
        >
          <span
            v-if="item.path === '#'"
            class="nav-link active-ignore disabled"
          >
            {{ item.title }}
          </span>
          <nuxt-link
            v-else
            :to="{ name: item.path }"
            class="nav-link active-ignore"
          >
            {{ item.title }}
          </nuxt-link>
        </li>
      </ul>
      <ul class="nav nav-bordered">
        <li class="nav-item">
          <a href="javascript:void(0);" target="_blank" class="nav-link">
            <fa icon="cog" />&nbsp;{{ $t('設定') }}
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      menuList: [
        {
          path: 'admin',
          title: this.$t('ホーム'),
        },
        {
          path: '#',
          title: this.$t('通知'),
        },
        {
          path: '#',
          title: this.$t('分析'),
        },
        {
          path: '#',
          title: this.$t('タイムライン'),
        },
        {
          path: '#',
          title: this.$t('チャット'),
        },
        {
          path: '#',
          title: this.$t('プロフィール'),
        },
      ],
    }
  },
}
</script>
