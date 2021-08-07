import Vue from 'vue'

export default function ({ redirect }) {
  const $authInfo = Vue.prototype.$authInfo
  if ($authInfo.checkAuth()) {
    // eslint-disable-next-line eqeqeq
    let role = $authInfo.role()
    switch (role) {
      case 1:
        return redirect({ name: 'admin-client' })
      default:
        return redirect({ name: 'client-survey' })
    }
  }
}
