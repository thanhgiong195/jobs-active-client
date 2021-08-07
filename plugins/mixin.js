import Vue from 'vue'
import moment from 'moment'
import Cookies from 'js-cookie'
import Constant from '@/constant.json'

const nuxtConfig = {}
Vue.mixin({
  data() {
    return {
      moment,
      sendingFlag: false,
    }
  },
  computed: {
    config() {
      return this.storeGetData('session', 'config')
    },
    checkSendingFlag() {
      return this.sendingFlag
    },
    getTitle() {
      const result = this.storeGetData('meta', 'title')
      if (this.isEmptyCustom(result)) {
        return ''
      }
      return result
    },
  },

  created() {
    this.popupEnv = process.env.popupEnv
    const envMode = this.isEmptyCustom(process.env.ENV)
      ? 'dev'
      : process.env.ENV
    // eslint-disable-next-line eqeqeq
    this.isDev = envMode == 'dev'
    this.env = process.env
    this.sendingFlag = false
  },

  methods: {
    setSendingFlag(bool) {
      this.sendingFlag = bool
      return this.sendingFlag
    },
    objectEmpty(obj) {
      if (this.isEmptyCustom(obj)) {
        return true
      }
      const keys = Object.keys(obj)
      // eslint-disable-next-line eqeqeq
      if (keys.length == 0) {
        return true
      }

      let status = true
      keys.forEach((item) => {
        if (!this.isEmptyCustom(obj[item])) {
          status = false
        }
      })

      return status
    },
    // https://webbjocke.com/javascript-check-data-types/
    isEmptyCustom(value) {
      // Array
      if (Array.isArray(value)) {
        // eslint-disable-next-line eqeqeq
        return value.length == 0
      }

      // Object
      if (value && typeof value === 'object' && value.constructor === Object) {
        // eslint-disable-next-line eqeqeq
        return Object.keys(value).length == 0
      }

      // string
      if (typeof value === 'string' || value instanceof String) {
        // eslint-disable-next-line eqeqeq
        return value.trim().length == 0
      }

      // Null & undefined
      if (value === null || typeof value === 'undefined') {
        return true
      }

      // Number
      if (value === 0) {
        return true
      }
      return false
    },
    /**
     * không được phép gọi trực tiếp, phải gán lại vào 1 biến của component
     * Direct call is not allowed, must be re-assigned to a variable of the component
     * @param key
     * @returns {null|*}
     */
    getConfig(key) {
      // eslint-disable-next-line no-prototype-builtins
      if (!nuxtConfig.hasOwnProperty(key)) {
        const config = this.storeGetData('session', 'config')
        // eslint-disable-next-line no-prototype-builtins
        if (config == null || !config.hasOwnProperty(key)) {
          return null
        }
        nuxtConfig[key] = config[key]
      }
      return nuxtConfig[key]
    },
    getRoutePath(name) {
      const routes = this.$router.options.routes
      // eslint-disable-next-line eqeqeq
      const result = routes.filter((item) => item.name == name)
      // eslint-disable-next-line eqeqeq
      if (result.length == 0) {
        return '/'
      }
      return result[0].path
    },
    saveAccessToken(value, rolePermission) {
      // console.log(process.env.TOKEN_EXPIRED)
      Cookies.set('access_token', value, {
        expires: 60 * 60 * 24 * process.env.TOKEN_EXPIRED,
      })
      Cookies.set('role_permission', rolePermission, {
        expires: 60 * 60 * 24 * process.env.TOKEN_EXPIRED,
      })
    },
    removeAccessToken() {
      Cookies.remove('access_token')
      Cookies.remove('role_permission')
      Cookies.remove('company_token')
      Cookies.remove('is_company')
    },
    storeGetData(module, variable) {
      const result = this.$store.state[module][variable]
      if (this.isEmptyCustom(result)) {
        return []
      }
      return this.cloneObject(result)
    },
    storeCommit(name, value = undefined) {
      // eslint-disable-next-line eqeqeq
      if (value == undefined) {
        this.$store.commit(name)
        return
      }

      this.$store.commit(name, value)
    },
    arrayChunk(array, size) {
      const chunkedArr = []
      for (let i = 0; i < array.length; i++) {
        const last = chunkedArr[chunkedArr.length - 1]
        if (!last || last.length === size) {
          chunkedArr.push([array[i]])
        } else {
          last.push(array[i])
        }
      }
      return chunkedArr
    },

    startLoading() {
      this.loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    },

    endLoading() {
      if (!this.isEmptyCustom(this.loading)) {
        this.loading.close()
      }
    },

    formShowErrorMessage(errors, formName) {
      const fieldError = Object.keys(errors)
      this.$log.debug('fieldError: ', fieldError)

      this.$refs[formName].$children.forEach((children) => {
        this.$log.debug('fieldError_prop: ', children.prop)
        if (!fieldError.includes(children.prop)) {
          if (fieldError.includes('data')) {
            this.notifyError(errors.data)
          }
          return
        }
        children.validateState = 'error'
        children.validateMessage = errors[children.prop]
      })
    },

    turnOffErrorMessage(formName) {
      this.$refs[formName].$children.forEach((children) => {
        children.validateState = ''
        children.validateMessage = ''
      })
    },

    showErrorMessage(errors, formName = undefined) {
      // eslint-disable-next-line eqeqeq
      this.$log.info(errors)
      if (errors.code == 422) {
        this.$log.debug(errors.error)
        this.$log.debug(formName)
        this.formShowErrorMessage(errors.error, formName)
        return
      }
      if (errors.code == 500 && errors.error.error == 'Unauthenticated.') {
        let currentRole = this.$authInfo.role()
        this.$authInfo.logoutAction()
        this.$router.push({
          name: this.getRouterLogin(currentRole),
        })
        return
      }

      const errorMessage = Object.values(errors.error).map((item) => {
        return '• ' + item
      })
      this.notifyError(errorMessage.join('\n'))
    },
    getRouterLogin(role) {
      switch (this.$authInfo.role()) {
        case Constant.user_role.admin:
          return 'admin-login'
        case Constant.user_role.station:
          return 'client-login'
        default:
          return 'client-login'
      }
    },
    notifyError(message) {
      this.$notify.error({
        title: this.$t(`Error`),
        message,
        duration: 5000,
      })
    },

    notifySuccess(message) {
      this.$notify.success({
        title: this.$t(`Success`),
        message,
        duration: 5000,
      })
    },
    showStartToEndDateTime(
      start = '',
      end = '',
      formatString = '',
      prefix = ' - '
    ) {
      const validFormat = [
        'YYYY-MM-DD',
        'YYYY/MM/DD',
        'YYYY-MM-DD hh:mm:ss',
        'YYYY/MM/DD hh:mm:ss',
      ]

      let startFormat, endFormat

      if (moment(start, validFormat, true)) {
        startFormat = moment(start).format(formatString)
      } else {
        startFormat = start
      }

      if (moment(end, validFormat, true)) {
        endFormat = moment(end).format(formatString)
      } else {
        endFormat = end
      }

      return startFormat + prefix + endFormat
    },
    countDateJob(date) {
      return moment(date).fromNow()
    },
    showDateTime(dateTime, formatString = undefined) {
      // eslint-disable-next-line eqeqeq
      if (formatString == undefined) {
        formatString = process.env.FORMATDATE
      }
      return moment(dateTime).format(formatString)
    },
    showTimeDuration(time) {
      // eslint-disable-next-line eqeqeq
      let formatString = 'mm:ss'
      if (time >= 3600) {
        formatString = 'HH:mm:ss'
      }
      return moment.utc(time * 1000).format(formatString)
    },
    showAge(dateTime = '') {
      // eslint-disable-next-line eqeqeq
      if (dateTime == '') {
        return dateTime
      }

      return moment().diff(dateTime, 'years')
    },
    showDateAgo(date) {
      if (this.moment().diff(this.moment(date), 'days') > 3) {
        return this.showDateTime(date, process.env.formatDate.dmyhm)
      }

      return this.moment(date).fromNow()
    },
    formatTimeCreate(date) {
      if (this.moment().diff(this.moment(date), 'days') < 1) {
        return this.showDateTime(date, process.env.formatDate.hm)
      }
      const currentYear = new Date().getFullYear()
      // eslint-disable-next-line eqeqeq
      if (parseInt(currentYear) == parseInt(this.showDateTime(date, 'YYYY'))) {
        return this.showDateTime(date, process.env.formatDate.dmhm)
      } else {
        return this.showDateTime(date, process.env.formatDate.dmyhm)
      }
    },
    objToArray(obj, keyField, valueField) {
      // Object
      if (obj && typeof obj === 'object' && obj.constructor === Object) {
        const response = []
        Object.keys(obj).forEach((k) => {
          const newObj = {}
          let vl = k
          if (!isNaN(Number(vl))) {
            vl = parseInt(vl)
          }
          newObj[keyField] = vl
          newObj[valueField] = obj[k]
          response.push(newObj)
        })
        return response
      }
      return []
    },

    validateCallbackForm(fields, type = undefined, action = undefined) {
      this.$log.debug('type: ', type)
      this.$log.debug('action: ', action)
      setTimeout(() => {
        fields.forEach((f) => {
          this.$refs.ruleForm.validateField(f)
        })
      }, 200)
    },

    getNullValue(text) {
      return this.isEmptyCustom(text) ? '' : text
    },

    cloneObject(obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    /**
     * @param money
     * @param decimal
     * @param sections_delimiter
     * @param currency
     * @returns {*}
     */
    formatCurrency(money, decimal = 0, s_delimiter = ',', currency = '円') {
      if (!money) return ''

      const rex = '\\d(?=(\\d{3})+' + (decimal > 0 ? '\\D' : '$') + ')',
        num = money.toFixed(Math.max(0, ~~decimal))

      const str = num.replace(new RegExp(rex, 'g'), '$&' + (s_delimiter || ','))

      if (currency === '$') {
        return currency + str
      }

      return str + currency
    },

    getLanguageCode() {
      let code = Cookies.get('language_code')
      if (this.isEmptyCustom(code)) {
        code = 'en'
      }
      return code
    },

    setLanguageCode(code) {
      Cookies.set('language_code', code, {
        expires: 60 * 60 * 24 * process.env.TOKEN_EXPIRED,
      })
    },

    changeFlagLanguage() {
      let code = this.getLanguageCode()

      // eslint-disable-next-line eqeqeq
      if (code == 'en') {
        code = 'vi'
      } else {
        code = 'en'
      }

      this.setLanguageCode(code)

      window.location.reload()
    },
    tinyMCE(name, content = undefined) {
      /* eslint-disable */
      this.$log.debug('tinyMCE', name)
      let editor = tinymce.get(name)
      if (this.isEmptyCustom(editor)) {
        return ''
      }

      if (content != undefined) {
        return editor.setContent(content)
      }

      return editor.getContent()
      /* eslint-enable */
    },
    tinyInit(selector, height = 250, callback = undefined) {
      /* eslint-disable */
      setTimeout(() => {
        this.$log.debug('selector', selector)
        tinymce.init({
          selector: '#' + selector,
          height: height,
          menubar: false,
          plugins: [
            'advlist autolink lists link images charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
          ],
          toolbar:
            'undo redo | formatselect | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat',
        })
        if (callback != undefined) {
          callback()
        }
      }, 500)
      /* eslint-enable */
    },
    focusError() {
      setTimeout(() => {
        this.$scrollTo('.el-form-item__error', { offset: -250 })
      }, 500)
    },
    randomString(len = 7) {
      const randomStr = Math.random().toString(36).substring(len)
      return randomStr
    },
    makeTextId(name) {
      return name + '_' + this.randomString()
    },
    makeQueryStringWithoutEmpty(obj) {
      /* eslint-disable */
      return Object.entries(obj).reduce(
        (a, [k, v]) =>
          v === null || v === '' || v === undefined ? a : ((a[k] = v), a),
        {}
      )
      /* eslint-enable */
    },
    getFullPathImage(image_path, base_path = '') {
      if (!base_path) base_path = process.env.AWS_S3_URL
      if (this.isEmptyCustom(image_path)) {
        return false
      }

      return base_path + image_path
    },
    imageLoadError(event) {
      event.target.src = require(`@/static/default_gift.png`)
    },
    isObject(value) {
      return value && typeof value === 'object' && value.constructor === Object
    },
    dataURItoBlob(dataURI) {
      const binary = atob(dataURI.split(',')[1])
      let array = []
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i))
      }
      return new Blob([new Uint8Array(array)], { type: 'image/jpeg' })
    },
    formatNumber(number, unit = 2) {
      return number.toFixed(unit).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    },
    isNumeric(str) {
      if (typeof str != 'string') return false
      return !isNaN(str) && !isNaN(parseFloat(str))
    },
    diffDate(date, dateCompare, type = 'days') {
      return moment(date).diff(moment(dateCompare), type)
    },
    showExtraText(text, max = 20) {
      if (this.isEmptyCustom(text) || text.length < max) {
        return text
      } else {
        let str = text.substr(0, max)
        return str + '...'
      }
    },
    storeBreadCrumb(route, pageName) {
      let breadcrumbArray = []
      let path_home = route.name.slice(0, route.name.indexOf('-'))
      let home = {
        name: 'homepage',
        path: '/' + path_home + '/',
      }
      let currentPage = { name: pageName, path: route.fullPath }

      let breadcrumbs = localStorage.getItem('breadcrumbs')
      if (breadcrumbs) {
        breadcrumbArray = JSON.parse(breadcrumbs)
      }
      if (!this.containsObject(breadcrumbArray, home)) {
        breadcrumbArray.unshift(home)
      }
      var idx = this.containsObject(breadcrumbArray, currentPage)
      if (idx) {
        breadcrumbArray.splice(idx + 1, breadcrumbArray.length - idx)
        //breadcrumbArray = breadcrumbArray.filter((item, index) => index <= idx)
      } else {
        breadcrumbArray.push(currentPage)
      }

      var breadcrumbList = breadcrumbArray.reduce((first, second) => {
        if (first.filter((i) => i.name == second.name).length == 0) {
          first.push(second)
        }
        return first
      }, [])

      localStorage.setItem('breadcrumbs', JSON.stringify(breadcrumbList))
      return breadcrumbList
    },
    pushEnable(ssId) {
      let ssEnables = []
      let storeEnable = localStorage.getItem('ss_enable')
      if (!this.isEmptyCustom(storeEnable)) {
        ssEnables = JSON.parse(storeEnable)
      }
      ssEnables.push(ssId)
      localStorage.setItem('ss_enable', JSON.stringify(ssEnables))
      return ssEnables
    },
    pushDisable(ssId) {
      let ssDisables = []
      let storeDisables = localStorage.getItem('ss_disable')
      if (!this.isEmptyCustom(storeDisables)) {
        ssDisables = JSON.parse(storeDisables)
      }
      ssDisables.push(ssId)
      localStorage.setItem('ss_disable', JSON.stringify(storeDisables))
      return ssDisables
    },
    containsObject(lists, obj) {
      for (var i = 0; i < lists.length; i++) {
        if (lists[i].name === obj.name) {
          return i
        }
      }
      return false
    },
    convertParams(obj) {
      let formData = new FormData()
      Object.entries(obj).forEach(([key, value]) => {
        if (value != undefined && value != null && value !== '') {
          if (Array.isArray(value)) {
            value = JSON.stringify(value)
          }
          formData.append(key, value)
        }
      })
      return formData
    },
    base64ToArrayBuffer(base64) {
      const binaryString = window.atob(base64) // Comment this if not using base64
      const bytes = new Uint8Array(binaryString.length)
      return bytes.map((byte, i) => binaryString.charCodeAt(i))
    },
    createAndDownloadBlobFile(body, filename, extension = 'csv') {
      const blob = new Blob([body])
      const fileName = `${filename}.${extension}`
      if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, fileName)
      } else {
        const link = document.createElement('a')
        // Browsers that support HTML5 download attribute
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob)
          link.setAttribute('href', url)
          link.setAttribute('download', fileName)
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    },
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
    },
    getPrefixRoute() {
      return 'client'
    },
    buildRouteParams(params) {
      if (this.$authInfo.role() == Constant.user_role.company) {
        params.ss = this.$route.params.ss
      }
      return params
    },
    rule(survey) {
      if (survey.pattern == 1) {
        const pattern_inputs = {
          1: this.$t('no_compulsion'),
          2: this.$t('full_width_characters_only'),
          3: this.$t('half_width_characters_only'),
          4: this.$t('half_width_alphabet_only'),
          5: this.$t('half_width_numbers_only'),
          6: this.$t('email'),
        }
        let pattern_input_text = ''
        if (survey.pattern_input !== null) {
          if (pattern_inputs[`${survey.pattern_input}`]) {
            pattern_input_text =
              pattern_inputs[`${survey.pattern_input}`] + this.$t('and')
          } else {
            pattern_input_text = pattern_inputs[`${survey.pattern_input}`]
          }
        }

        if (!survey.min_length) {
          if (survey.max_length) {
            return `${pattern_input_text} ${this.$t('pls_enter_at_most')}
              ${survey.max_length} ${this.$t('characters')}`
          } else {
            return pattern_input_text + this.$t('upper_limit_characters')
          }
        } else {
          if (!survey.max_length) {
            return `${pattern_input_text} ${this.$t('pls_enter_at_least')}
              ${survey.min_length} ${this.$t('characters')}`
          } else {
            return [
              pattern_input_text,
              survey.min_length,
              this.$t('characters_at_least'),
              survey.max_length,
              this.$t('characters_at_most'),
            ].join(' ')
          }
        }
        //If is Date pattern and have value in min_date or max_date
      } else if (survey.pattern == 5 && (survey.min_date || survey.max_date)) {
        if (!survey.min_date && survey.max_date) {
          return (
            this.$t('max_date') +
            ': ' +
            moment(survey.max_date).format('YYYY/MM/DD')
          )
        } else if (survey.min_date && !survey.max_date) {
          return (
            this.$t('min_date') +
            ': ' +
            moment(survey.min_date).format('YYYY/MM/DD')
          )
        } else {
          return (
            this.$t('min_date') +
            ': ' +
            moment(survey.min_date).format('YYYY/MM/DD') +
            ' , ' +
            this.$t('max_date') +
            ': ' +
            moment(survey.max_date).format('YYYY/MM/DD')
          )
        }
      } else {
        return ''
      }
    },
    chunkArr(arr, lengthChunk = 10) {
      let i,
        j,
        temparray = []
      for (i = 0, j = arr.length; i < j; i += lengthChunk) {
        temparray.push(arr.slice(i, i + lengthChunk))
      }

      return temparray
    },
    showStep(value) {
      switch (value) {
        case 1:
          return this.$t('text_mixin')
        case 2:
          return this.$t('menu')
        default:
          return ''
      }
    },
    showDataStep(value) {
      if (!value) return ''

      const valueArray = value.match(/<p>.*?<\/p>/g)
      const result = valueArray.slice(0, 3)

      if (valueArray.length > 3) {
        return result.join('') + '<p>...</p>'
      }

      return result.join('')
    },
    showSender(value) {
      switch (value) {
        case 1:
          return this.$t('driver')
        case 2:
          return 'SS'
        default:
          return ''
      }
    },
    sortByKey(array, key) {
      return array.sort(function (a, b) {
        var x = a[key]
        var y = b[key]
        return x < y ? -1 : x > y ? 1 : 0
      })
    },
    checkPage(dataTable, page) {
      if (dataTable.length === 1) {
        return page - 1
      }
      return page
    },

    getTextStatusResearch(status) {
      switch (status) {
        case 0:
          return this.$t(`draft`)
        case 1:
          return this.$t(`deliverable`)
        case 2:
          return this.$t(`active`)
        case 3:
          return this.$t(`end_of_period`)
        default:
          return ''
      }
    },

    resizeImage(settings) {
      let file = settings.file
      let maxSize = settings.maxSize
      let reader = new FileReader()
      let image = new Image()
      let canvas = document.createElement('canvas')
      let dataURItoBlobA = function (dataURI) {
        let bytes =
          dataURI.split(',')[0].indexOf('base64') >= 0
            ? atob(dataURI.split(',')[1])
            : unescape(dataURI.split(',')[1])
        let mime = dataURI.split(',')[0].split(':')[1].split(';')[0]
        let max = bytes.length
        let ia = new Uint8Array(max)
        for (let i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i)
        return new Blob([ia], { type: mime })
      }
      let resize = function () {
        let width = image.width
        let height = image.height
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height
            height = maxSize
          }
        }
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(image, 0, 0, width, height)
        let dataUrl = canvas.toDataURL('image/jpeg')
        return dataURItoBlobA(dataUrl)
      }
      return new Promise(function (ok, no) {
        if (!file.type.match(/image.*/)) {
          no(new Error('Not an image'))
          return
        }
        reader.onload = function (readerEvent) {
          image.onload = function () {
            return ok(resize())
          }
          image.src = readerEvent.target.result
        }
        reader.readAsDataURL(file)
      })
    },

    showTextRole(role) {
      switch (role) {
        case Constant.user_role.admin:
          return 'BO管理者'
        case Constant.user_role.approve:
          return 'レシート承認管理'
        case Constant.user_role.station:
          return 'SSサービスステーション'
        case Constant.user_role.supplier:
          return 'SS請求データ作成（BO)'
        case Constant.user_role.company:
          return 'Company'
        case Constant.user_role.supplier_3th:
          return 'SS請求データ作成（仕入先)'
        default:
          return ''
      }
    },
    splitEndLine(data) {
      return data.split(/(?:\r\n|\r|\n|↵)/g)
    },
    getParameterByName(name, url) {
      if (!url) return ''

      name = name.replace(/[\\[\]]/g, '\\$&')
      const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url)
      if (!results) return null
      if (!results[2]) return ''
      return decodeURIComponent(results[2].replace(/\+/g, ' '))
    },
  },
})
