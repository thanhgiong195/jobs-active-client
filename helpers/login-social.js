export default {
  methods: {
    authenticate(provider) {
      const log = this.$log
      const self = this
      this.startLoading()
      log.debug('start authenticate with: ' + provider)
      this.$auth
        .authenticate(provider)
        .then(function (response) {
          log.debug('authenticate with: ' + provider + ' success')
          log.debug('response', response)
          // Execute application logic after successful social authentication
          self.saveSessionId(response.data.session_id, response.data.role)
          self.endLoading()
          let redirect = self.getRoutePath('applicant')
          if (!self.isEmptyCustom(self.$route.query.continue)) {
            redirect = self.$route.query.continue
          }
          window.location = redirect
        })
        .catch(function (err) {
          log.debug('authenticate with: ' + provider + ' error')
          log.error(err)
          self.endLoading()
        })
    },
  },
}
