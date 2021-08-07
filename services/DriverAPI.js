import BaseService from './BaseService'

export default class DriverAPI extends BaseService {
  async getSurveyInfo(params, success, error) {
    await this.post(`driver/get-survey-question`, params, success, error)
  }

  async answerSurvey(param, success, error) {
    await this.post(`driver/answer-survey`, param, success, error)
  }

  async submitJob(param, success, error) {
    await this.post(`driver/submit-job`, param, success, error)
  }

  async getListJobs(param, success, error) {
    await this.post(`driver/list-jobs`, param, success, error)
  }

  async updateLoadImageToS3(params, success, error) {
    await this.post('driver/upload-s3', params, success, error)
  }
}
