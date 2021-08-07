<template>
  <div class="m-5">
    <section>
      <div class="d-flex justify-content-end align-items-center mb-2">
        <button class="el-button el-button--primary" @click="logout">
          {{ $t('logout') }}
        </button>
      </div>
      <hr />
    </section>
  </div>
</template>

<script>
import FrontendBase from '~/components/layouts/FrontendBase'

export default {
  extends: FrontendBase,
  layout: 'admin',
  middleware: 'admin',
  data() {
    return {
      listItem: [],
      totalPage: '',
      totalItem: '',
      status: '',
      page: 1,
      message: '',
    }
  },
  created() {},
  mounted() {},
  methods: {
    async logout() {
      this.startLoading()
      await this.$services.common.logout(
        (response) => {
          if (response.success) {
            this.removeAccessToken()
            this.$authInfo.logoutAction()
            window.location = this.getRoutePath('login')
          }
        },
        (err) => {
          if (err.code === 422) {
            this.notifyError(err.error.token)
          }
          this.notifyError(err.message)
        }
      )
      this.endLoading()
    },
  },
}
</script>
