import Vue from 'vue'

export default function ({ redirect, route }) {
  const $authInfo = Vue.prototype.$authInfo
  if (!$authInfo.checkAuth()) {
    return redirect({
      name: 'client-login',
      query: { continue: route.fullPath },
    })
  }
}
