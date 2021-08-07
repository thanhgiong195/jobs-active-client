export const strict = false
import Cookies from 'js-cookie'
import Vue from 'vue'

const syncObject = {
  commit: null,
  context: null,
  async getUserInfo() {
    const token = Cookies.get('access_token')
    if (token == undefined || token.length == 0) {
      Vue.prototype.$log.warn('Session not found')
      return
    }

    let rolePermission = Cookies.get('role_permission')
    Vue.prototype.$log.warn('Get user info', token, rolePermission)
    await Vue.prototype.$services.common.getUserInfo(
      (response) => {
        Vue.prototype.$authInfo.loginAction(response)
      },
      (err) => {
        Cookies.remove('access_token')
        Vue.prototype.$log.error(err)
      }
    )

    if (token !== Cookies.get('access_token')) {
      Cookies.set('access_token', token)
      await Vue.prototype.$services.common.getUserInfo(
        (response) => {
          Vue.prototype.$companyStation.setStationId(response.id)
        },
        (err) => {
          Cookies.remove('access_token')
          Vue.prototype.$log.error(err)
        }
      )
    }
  },
}

export const actions = {
  async nuxtClientInit({ commit }) {
    syncObject.commit = commit
    syncObject.context = this

    //begin get user info
    await syncObject.getUserInfo()
    //end begin get user info
  },
}
