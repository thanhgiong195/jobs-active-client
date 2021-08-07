import https from 'https'
import Vue from 'vue'
import Cookies from 'js-cookie'

export default function ({ $axios }) {
  $axios.onRequest((config) => {
    // console.log(config)
    const header = config.headers
    // const $authInfo = Vue.prototype.$authInfo
    const token = Cookies.get('access_token')
    // eslint-disable-next-line eqeqeq
    if (token != undefined && token.length != 0) {
      header.Authorization = 'Bearer ' + token
    }

    // eslint-disable-next-line eqeqeq
    if (config.timeout == 0) {
      config.timeout = 600000 // 10m
    }

    let code = Cookies.get('language_code')
    // eslint-disable-next-line eqeqeq
    if (code == undefined) {
      code = 'en'
    }

    config.headers = {
      ...header,
      Accept: 'application/mynuxt+json',
      'x-locale': code,
    }
    // eslint-disable-next-line eqeqeq
    if (process.env.ENV != 'production') {
      config.httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      })
    }
  })

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    console.log(code)
    console.log(error.response)
    if (code === 400) {
      // eslint-disable-next-line no-prototype-builtins
      if (error.response.hasOwnProperty('data')) {
        Vue.prototype.$notify.error({
          title: '失敗',
          message: error.response.data.message,
          duration: 3000,
        })
      }
    }
  })
}
