import BaseService from './BaseService'

export default class AdminAPI extends BaseService {
  async getListReceipt(query, success, error) {
    await this.get('receipts?' + this.urlParse(query), success, error)
  }

  async getStationInfo(params, success, error) {
    await this.get('station/' + params.id, success, error)
  }

  async getAllStation(success, error) {
    await this.get('station/get-all', success, error)
  }

  async getListStation(param, success, error) {
    await this.get('station?' + this.urlParse(param), success, error)
  }

  async saveStationInfo(id, params, success, error) {
    await this.post('station/' + id + '/edit', params, success, error)
  }

  async exportCsvStation(param, success, error) {
    await this.get('station/csv?' + this.urlParse(param), success, error)
  }

  async removeStation(id, success, error) {
    await this.post('station/' + id + '/delete', null, success, error)
  }

  //category
  async getCategoryById(id, success, error) {
    await this.get('category/detail/' + id, success, error)
  }
  //get category list
  async getListCategory(param, success, error) {
    await this.get('category/list?' + this.urlParse(param), success, error)
  }
  //delete
  async deleteCategory(id, success, error) {
    await this.post('category/' + id + '/delete', id, success, error)
  }
  //edit
  async editCategory(id, params, success, error) {
    await this.post('category/' + id + '/edit', params, success, error)
  }
  //add
  async createCategory(param, success, error) {
    await this.post('category/add', param, success, error)
  }

  async copyCategory(id, success, error) {
    await this.post('category/clone', id, success, error)
  }

  async addNewStation(params, success, error) {
    await this.post('station/addUserSS', params, success, error)
  }

  async checkDuplicateStation(id, params, success, error) {
    await this.post(
      'station/' + id + '/checkDuplicate',
      this.urlParse(params),
      success,
      error
    )
  }
}
