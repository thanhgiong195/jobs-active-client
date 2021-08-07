export const state = () => ({
  data: {},
  listBlack: [],
})

export const mutations = {
  saveUserName(state, name) {
    state.data = { ...state.data, name }
  },
  saveAvatar(state, avatar) {
    state.data.profile = { ...state.data.profile, avatar }
  },
  saveUserInfo(state, data) {
    state.data = data
  },
  setRoleUser(state, role) {
    state.data.role = role
  },
  setAvatar(state, data) {
    state.data.station_profile.avatar = data
  },
  logoutAction(state) {
    state.data = {}
  },
}
