import Vue from 'vue'
import Cookies from 'js-cookie'

export default function ({ redirect, route }) {
  const $authInfo = Vue.prototype.$authInfo
  const allowRoles = [3]

  if (!$authInfo.checkAuth()) {
    return redirectNotPermission(redirect, route)
  }

  if (allowRoles.indexOf($authInfo.role()) === -1) {
    return redirectNotPermission(redirect, route)
  }
}

function redirectNotPermission(redirect, route) {
  const $authInfo = Vue.prototype.$authInfo
  Cookies.remove('access_token')
  Cookies.remove('role_permission')
  $authInfo.logoutAction()
  return redirect({
    name: 'client-login',
    query: { continue: route.fullPath },
  })
}
