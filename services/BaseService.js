export default class BaseService {
  constructor(axios, log, prefix) {
    this.api = axios
    this.log = log
    this.prefix = prefix
  }

  processResponse(response) {
    let data = response.data
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty('data')) {
      return data.data
    }

    return data
  }

  logError(e, error) {
    this.log.error(e.toString())
    if (error != undefined && e.response != undefined) {
      // eslint-disable-next-line no-prototype-builtins
      if (e.response.hasOwnProperty('status')) {
        let errorMessage = {}
        if (e.response.status == 422) {
          let errors = e.response.data.errors
          Object.keys(errors).forEach(function (key) {
            errorMessage[key] = errors[key][0]
          })
        }
        if ([200, 422].indexOf(e.response.status) === -1) {
          errorMessage['error'] = e.response.data.message
        }
        error({
          code: e.response.status,
          error: errorMessage,
        })
      }
    }
  }

  async get(endpoint, success, error) {
    await this.api
      .get(this.prefix + endpoint)
      .then((response) => this.processResponse(response))
      .then((json) => success(json))
      .catch((e) => this.logError(e, error))
  }

  async post(endpoint, params = {}, success, error) {
    await this.api
      .post(this.prefix + endpoint, params)
      .then((response) => this.processResponse(response))
      .then((json) => success(json))
      .catch((e) => this.logError(e, error))
  }

  async put(endpoint, params = {}, success, error) {
    await this.api
      .put(this.prefix + endpoint, params)
      .then((response) => this.processResponse(response))
      .then((json) => success(json))
      .catch((e) => this.logError(e, error))
  }

  async delete(endpoint, params = {}, success, error) {
    await this.api
      .delete(this.prefix + endpoint, params)
      .then((response) => this.processResponse(response))
      .then((json) => success(json))
      .catch((e) => this.logError(e, error))
  }

  urlParse(obj) {
    let str = []
    // eslint-disable-next-line no-prototype-builtins
    for (let p in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
      }
    }
    return str.join('&')
  }
}
