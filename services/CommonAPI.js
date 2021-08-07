import BaseService from './BaseService'

export default class CommonAPI extends BaseService {
  async demoCommon(success, error) {
    await this.get('common', success, error)
  }

  async getUserInfo(success, error) {
    await this.get('common/auth/me', success, error)
  }

  async saveStationInfo(params, success, error) {
    await this.post('admin/save-station', params, success, error)
  }

  async register(params, success, error) {
    await this.post('common/auth/register', params, success, error)
  }

  async login(params, success, error) {
    await this.post('common/auth/login', params, success, error)
  }

  async logout(success, error) {
    await this.post('common/auth/logout', {}, success, error)
  }

  async refreshPassword(params, success, error) {
    await this.post('common/auth/reset-password', params, success, error)
  }

  async checkToken(params, success, error) {
    await this.get(
      'common/auth/check-token?' + this.urlParse(params),
      success,
      error
    )
  }

  async updateNewPassword(params, success, error) {
    await this.post('common/auth/update-password', params, success, error)
  }

  async forgetPassword(params, success, error) {
    await this.post('common/password/forget', params, success, error)
  }

  async resetPasswordVerifyURL(params, success, error) {
    await this.post('common/password/verify', params, success, error)
  }

  async resetPassword(params, success, error) {
    await this.post('common/password/reset', params, success, error)
  }

  async createReward(params, success, error) {
    await this.post('common/reward/create', params, success, error)
  }

  async customTimeReward(id, params, success, error) {
    await this.post(
      'common/reward/' + id + '/custom-time',
      params,
      success,
      error
    )
  }

  async getListDriver(param, success, error) {
    await this.get('common/driver?' + this.urlParse(param), success, error)
  }

  async getDriverById(param, success, error) {
    await this.get('common/driver/' + param.id, success, error)
  }

  async updateDriver(param, success, error) {
    await this.post(
      'common/driver/' + param.id + '/edit',
      param,
      success,
      error
    )
  }

  async exportCsvDriver(param, success, error) {
    await this.get('common/driver/csv?' + this.urlParse(param), success, error)
  }

  async getListSurvey(param, success, error) {
    await this.get('common/survey?' + this.urlParse(param), success, error)
  }

  async createSurvey(param, success, error) {
    await this.post('common/survey/add', param, success, error)
  }

  async editSurvey(params, success, error) {
    await this.post('common/survey/edit', params, success, error)
  }

  async removeSurvey(params, success, error) {
    await this.post('common/survey/delete', params, success, error)
  }

  async changeOrderSurvey(params, success, error) {
    await this.post('common/survey/change_order', params, success, error)
  }

  async sendMessageToLine(params, success, error) {
    await this.post(
      'common/survey/send-message-to-line',
      params,
      success,
      error
    )
  }

  async downloadSurveyAnswer(id, params, success, error) {
    await this.post(
      `common/survey/${id}/download-answer-file`,
      params,
      success,
      error
    )
  }

  async getAnswerData(id, success, error) {
    await this.get(`common/survey/${id}/get-answer-data`, success, error)
  }
}
