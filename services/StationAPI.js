import BaseService from './BaseService'

export default class StationAPI extends BaseService {
  async getStationInfo(success, error) {
    await this.get('get-info/', success, error)
  }

  async checkKeyLine(params, success, error) {
    await this.post('change-info/check-line', params, success, error)
  }

  async ChangeInfoLineUpdate(params, success, error) {
    await this.post('change-info/line', params, success, error)
  }

  async ChangeInfoPasswordUpdate(params, success, error) {
    await this.post('change-info/password', params, success, error)
  }

  async registerLine(params, success, error) {
    await this.post('change-info/line', params, success, error)
  }

  async getPolicy(ssId, success, error) {
    await this.get('get-policy/' + ssId, success, error)
  }

  async updatePolicy(params, success, error) {
    await this.post('change-info/policy', params, success, error)
  }
}
