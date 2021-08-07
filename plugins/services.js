import Vue from 'vue'
import CommonAPI from '~/services/CommonAPI'
import DriverAPI from '~/services/DriverAPI'
import AdminAPI from '~/services/AdminAPI'
import StationAPI from '~/services/StationAPI'
import Auth from '~/services/Auth'

export default function ({ $axios, store }) {
  const log = Vue.prototype.$log
  const services = {
    common: new CommonAPI($axios, log, '/'),
    driver: new DriverAPI($axios, log, '/'),
    admin: new AdminAPI($axios, log, '/admin/'),
    station: new StationAPI($axios, log, '/station/'),
    // applicant: new ApplicantAPI($axios, log, '/applicant/'),
  }

  Vue.prototype.$services = services
  Vue.prototype.$authInfo = new Auth(store)
}
