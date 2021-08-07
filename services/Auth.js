import Constant from '@/constant.json'

export default class Auth {
  constructor(store) {
    this.data = null
    this.store = store
    if (store.state.user.data != {}) {
      this.data = store.state.user.data
    }
  }

  checkAuth() {
    return this.id() != null
  }

  id() {
    return this.getData('id')
  }

  name() {
    return this.getData('name')
  }

  avatar() {
    return this.data?.station_profile?.avatar || ''
  }

  isCompany() {
    return this.role() == Constant.user_role.company
  }

  isStation() {
    return this.role() == Constant.user_role.station
  }

  isGroupSs() {
    let roles = [Constant.user_role.company, Constant.user_role.station]
    return roles.includes(this.role())
  }

  isAdmin() {
    return this.role() == Constant.user_role.admin
  }

  email() {
    return this.getData('login_id')
  }

  role() {
    return this.getData('role')
  }
  profile() {
    return this.getData('profile')
  }

  getData(field) {
    if (this.data == null) {
      return null
    }
    // eslint-disable-next-line no-prototype-builtins
    if (this.data.hasOwnProperty(field)) {
      return this.data[field]
    }
    return null
  }

  loginAction(response) {
    this.store.commit('user/saveUserInfo', response)
    this.data = response
  }

  setRole(role) {
    this.store.commit('user/setRoleUser', role)
  }

  setAvatar(data) {
    this.store.commit('user/setAvatar', data)
  }

  logoutAction() {
    this.store.commit('user/logoutAction')
    this.store.commit('companyStation/resetData')
    this.data = null
  }
}
