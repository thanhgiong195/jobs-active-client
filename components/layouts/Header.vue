<template>
  <header class="page-header">
    <div class="d-flex align-items-stretch">
      <div
        class="
          d-flex
          align-items-center
          justify-content-center
          flex-shrink-0 flex-grow-0
          header-logo
        "
      >
        <nuxt-link :to="{ path: homepage }">
          <img alt="img-error" src="~assets/img/Logo.png" />
        </nuxt-link>
      </div>
    </div>
    <div class="d-flex align-items-stretch">
      <div class="d-flex align-items-center pl-3">
        <el-col>
          <el-dropdown
            trigger="click"
            size="medium"
            class="ml-2 d-flex align-items-center cursor-pointer"
            @command="handleCommand"
          >
            <div class="dropdown btn-group">
              <div id="username-text">
                <span>
                  {{ toUpperCaseName(email) }}
                </span>
              </div>
              <div id="my-icon-down">
                <span>
                  <i class="el-icon-caret-bottom my-icon-down"></i>
                </span>
              </div>
              <div class="d-flex align-items-center cursor-pointer">
                <span class="mx-1 text-muted d-flex align-items-center">
                  <img
                    v-if="avatar"
                    :src="getFullPathImage(avatar)"
                    alt="avatar"
                    class="rounded-circle img-thumbnail avatar"
                  />
                  <img
                    v-else
                    class="rounded-circle img-thumbnail avatar"
                    src="~/assets/img/no-image-profile.png"
                  />
                </span>
              </div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item
                v-if="role === 'Service-client'"
                command="changeLine"
                class="avatar-dropdown-list"
              >
                {{ $t('edit_line_channel') }}
              </el-dropdown-item>
              <el-dropdown-item
                v-if="role === 'Service-client'"
                command="changePolicy"
                class="avatar-dropdown-list"
              >
                {{ $t('edit_policy') }}
              </el-dropdown-item> -->
              <el-dropdown-item
                v-if="role === 'Service-client'"
                command="changePassword"
                class="avatar-dropdown-list"
              >
                {{ $t('change_password') }}
              </el-dropdown-item>
              <el-dropdown-item command="logout" class="avatar-dropdown-logout">
                {{ $t('logout') }}
                <span>
                  <img src="~/static/power.svg" class="logout-icon" />
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col hidden>
          <el-dropdown
            class="locale-dropdown"
            size="medium"
            trigger="click"
            @command="changeLang"
          >
            <el-button class="btn-locale">
              {{ $t('locale') }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="en">
                {{ $t('English') }}
              </el-dropdown-item>
              <el-dropdown-item command="jp">
                {{ $t('Japanese') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      isSSPage: false,
      isShowUserDropdown: false,
      role: '',
      email: '',
      homepage: '',
      changePassword: '',
      changeInfo: '',
      changeLine: '',
    }
  },
  computed: {
    avatar() {
      return this.$authInfo.avatar()
    },
    locale() {
      return this.$store.state.i18n.locale
    },
  },
  watch: {
    avatar() {
      return this.$authInfo.avatar()
    },
  },
  created() {
    this.initData()
  },
  methods: {
    toUpperCaseName(name) {
      return name.charAt(0).toUpperCase() + name.slice(1)
    },
    changeLang(lang) {
      localStorage.setItem('lang', lang)
      this.$store.commit('i18n/SET_LANG', lang)

      const query = { ...this.$router.currentRoute.query, lang }
      this.$router.push({
        path: `${this.$router.currentRoute.path}?${this.urlParse(query)}`,
      })
    },
    handleCommand(command) {
      if (command == 'logout') {
        this.logout()
      }
      if (command == 'showApplicationFormList') {
        this.$router.push({
          name: 'client-survey',
        })
      }
      if (command == 'showIntroducedCompanies') {
        this.$router.push({
          name: 'admin-client',
        })
      }
      if (command == 'changeInfo') {
        this.$router.push({
          name: 'client-change-info',
        })
      }
      if (command == 'changePassword') {
        console.log(command)

        this.$router.push({
          name: 'client-password-current',
        })
      }
      if (command == 'changeLine') {
        this.$router.push({
          name: 'client-change-line',
        })
      }
      if (command == 'changePolicy') {
        this.$router.push({
          name: 'client-policy',
        })
      }
    },
    initData() {
      this.email = this.$authInfo.email()
      let role = this.$authInfo.role()
      switch (role) {
        case 1:
          this.isSSPage = false
          this.role = 'Super Admin'
          this.homepage = '/admin/client'
          break
        case 3:
          this.isSSPage = true
          this.role = 'Service-client'
          this.homepage = '/client/survey'
          break
        default:
          break
      }
    },
    async logout() {
      this.startLoading()
      await this.$services.common.logout(
        (response) => {
          if (response.success) {
            this.removeAccessToken()
            let currentRole = this.$authInfo.role()
            this.$authInfo.logoutAction()
            this.$router.push({
              name: this.redirect(currentRole),
            })
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
    redirect(role) {
      switch (role) {
        case 1:
          return 'admin-login'
        case 3:
          return 'client-login'
        default:
          return 'admin-login'
      }
    },
  },
}
</script>

<style lang="scss">
.el-dropdown {
  display: inline-block;
  position: relative;
  color: #606266;
  font-size: 17px;
}
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down:before {
  font-size: 14px;
}
.btn-locale {
  font-size: 14px;
  padding: 4px 15px 5px 20px;
  border-radius: 5px;
  margin-top: 0;
}
.locale-dropdown {
  padding-left: 20px;
}
.locale-flag {
  width: 2em;
  height: auto;
  margin-right: 7px;
}
</style>
<style lang="scss" scoped>
#username-text {
  color: black;
  font-weight: 620;
  font-size: 16px;
  padding-top: 12px;
  margin-right: 5px;
}
#my-icon-down {
  padding-top: 10px;
}
.my-icon-down {
  font-size: 12px;
}
.avatar {
  padding: 2px;
  max-width: 50px;
  max-height: 50px;
}
.avatar-dropdown-list {
  color: #312f39;
  font-weight: 400;
}
.avatar-dropdown-list:hover {
  background-color: #ffffff;
  color: #4e392d;
}
.avatar-dropdown-logout {
  color: #312f39;
  background-color: #bad646;
}
.avatar-dropdown-logout:hover {
  font-weight: 500;
  color: #4e392d;
  background-color: #bad646;
}
.logout-icon {
  font-size: 12px;
  float: right;
  margin-top: 7px;
  margin-left: 4px;
  width: 16px;
  height: 16px;
}
.avatar-dropdown-fade {
  color: #bac0c5;
}
</style>
