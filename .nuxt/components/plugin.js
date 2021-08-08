import Vue from 'vue'
import { wrapFunctional } from './utils'

const components = {
  CheckboxElement: () => import('../..\\components\\admin\\surveys\\CheckboxElement.vue' /* webpackChunkName: "components/checkbox-element" */).then(c => wrapFunctional(c.default || c)),
  DatePickerElement: () => import('../..\\components\\admin\\surveys\\DatePickerElement.vue' /* webpackChunkName: "components/date-picker-element" */).then(c => wrapFunctional(c.default || c)),
  DialogPreview: () => import('../..\\components\\admin\\surveys\\DialogPreview.vue' /* webpackChunkName: "components/dialog-preview" */).then(c => wrapFunctional(c.default || c)),
  ImagePickerElement: () => import('../..\\components\\admin\\surveys\\ImagePickerElement.vue' /* webpackChunkName: "components/image-picker-element" */).then(c => wrapFunctional(c.default || c)),
  InputElement: () => import('../..\\components\\admin\\surveys\\InputElement.vue' /* webpackChunkName: "components/input-element" */).then(c => wrapFunctional(c.default || c)),
  RadioElement: () => import('../..\\components\\admin\\surveys\\RadioElement.vue' /* webpackChunkName: "components/radio-element" */).then(c => wrapFunctional(c.default || c)),
  SelectElement: () => import('../..\\components\\admin\\surveys\\SelectElement.vue' /* webpackChunkName: "components/select-element" */).then(c => wrapFunctional(c.default || c)),
  DialogAddUserForm: () => import('../..\\components\\admin\\DialogAddUserForm.vue' /* webpackChunkName: "components/dialog-add-user-form" */).then(c => wrapFunctional(c.default || c)),
  DialogAddUserSSForm: () => import('../..\\components\\admin\\DialogAddUserSSForm.vue' /* webpackChunkName: "components/dialog-add-user-s-s-form" */).then(c => wrapFunctional(c.default || c)),
  TableDatetime: () => import('../..\\components\\admin\\TableDatetime.vue' /* webpackChunkName: "components/table-datetime" */).then(c => wrapFunctional(c.default || c)),
  FormCategory: () => import('../..\\components\\categories\\FormCategory.vue' /* webpackChunkName: "components/form-category" */).then(c => wrapFunctional(c.default || c)),
  ListCategoriesSurvey: () => import('../..\\components\\categories\\ListCategoriesSurvey.vue' /* webpackChunkName: "components/list-categories-survey" */).then(c => wrapFunctional(c.default || c)),
  PreviewCsvDialog: () => import('../..\\components\\categories\\PreviewCsvDialog.vue' /* webpackChunkName: "components/preview-csv-dialog" */).then(c => wrapFunctional(c.default || c)),
  Footer: () => import('../..\\components\\layouts\\Footer.vue' /* webpackChunkName: "components/footer" */).then(c => wrapFunctional(c.default || c)),
  FrontendBase: () => import('../..\\components\\layouts\\FrontendBase.vue' /* webpackChunkName: "components/frontend-base" */).then(c => wrapFunctional(c.default || c)),
  Header: () => import('../..\\components\\layouts\\Header.vue' /* webpackChunkName: "components/header" */).then(c => wrapFunctional(c.default || c)),
  LeftMenu: () => import('../..\\components\\layouts\\LeftMenu.vue' /* webpackChunkName: "components/left-menu" */).then(c => wrapFunctional(c.default || c)),
  TopMenu: () => import('../..\\components\\layouts\\TopMenu.vue' /* webpackChunkName: "components/top-menu" */).then(c => wrapFunctional(c.default || c)),
  FormChangePassword: () => import('../..\\components\\oauth\\FormChangePassword.vue' /* webpackChunkName: "components/form-change-password" */).then(c => wrapFunctional(c.default || c)),
  FormChangePasswordForget: () => import('../..\\components\\oauth\\FormChangePasswordForget.vue' /* webpackChunkName: "components/form-change-password-forget" */).then(c => wrapFunctional(c.default || c)),
  FormLogin: () => import('../..\\components\\oauth\\FormLogin.vue' /* webpackChunkName: "components/form-login" */).then(c => wrapFunctional(c.default || c)),
  FormRegister: () => import('../..\\components\\oauth\\FormRegister.vue' /* webpackChunkName: "components/form-register" */).then(c => wrapFunctional(c.default || c)),
  FormRegisterLine: () => import('../..\\components\\oauth\\FormRegisterLine.vue' /* webpackChunkName: "components/form-register-line" */).then(c => wrapFunctional(c.default || c)),
  FormResetPassword: () => import('../..\\components\\oauth\\FormResetPassword.vue' /* webpackChunkName: "components/form-reset-password" */).then(c => wrapFunctional(c.default || c)),
  SimplePagination: () => import('../..\\components\\pagination\\SimplePagination.vue' /* webpackChunkName: "components/simple-pagination" */).then(c => wrapFunctional(c.default || c)),
  DialogSurvey: () => import('../..\\components\\survey\\DialogSurvey.vue' /* webpackChunkName: "components/dialog-survey" */).then(c => wrapFunctional(c.default || c)),
  ListSurvey: () => import('../..\\components\\survey\\ListSurvey.vue' /* webpackChunkName: "components/list-survey" */).then(c => wrapFunctional(c.default || c)),
  BreadCrumb: () => import('../..\\components\\BreadCrumb.vue' /* webpackChunkName: "components/bread-crumb" */).then(c => wrapFunctional(c.default || c)),
  ConfirmDialog: () => import('../..\\components\\ConfirmDialog.vue' /* webpackChunkName: "components/confirm-dialog" */).then(c => wrapFunctional(c.default || c)),
  DialogSubmit: () => import('../..\\components\\DialogSubmit.vue' /* webpackChunkName: "components/dialog-submit" */).then(c => wrapFunctional(c.default || c)),
  FormSubmitJob: () => import('../..\\components\\FormSubmitJob.vue' /* webpackChunkName: "components/form-submit-job" */).then(c => wrapFunctional(c.default || c)),
  Logo: () => import('../..\\components\\Logo.vue' /* webpackChunkName: "components/logo" */).then(c => wrapFunctional(c.default || c)),
  LiffAppEditInfo: () => import('../..\\components\\liffApp\\EditInfo.vue' /* webpackChunkName: "components/liff-app-edit-info" */).then(c => wrapFunctional(c.default || c)),
  LiffAppFormDataServey: () => import('../..\\components\\liffApp\\FormDataServey.vue' /* webpackChunkName: "components/liff-app-form-data-servey" */).then(c => wrapFunctional(c.default || c)),
  StationChangeInfoStation: () => import('../..\\components\\station\\ChangeInfoStation.vue' /* webpackChunkName: "components/station-change-info-station" */).then(c => wrapFunctional(c.default || c)),
  StationDialogResult: () => import('../..\\components\\station\\DialogResult.vue' /* webpackChunkName: "components/station-dialog-result" */).then(c => wrapFunctional(c.default || c)),
  UtilsButton: () => import('../..\\components\\utils\\Button.vue' /* webpackChunkName: "components/utils-button" */).then(c => wrapFunctional(c.default || c)),
  UtilsElInputTag: () => import('../..\\components\\utils\\ElInputTag.vue' /* webpackChunkName: "components/utils-el-input-tag" */).then(c => wrapFunctional(c.default || c)),
  UtilsIcon: () => import('../..\\components\\utils\\Icon.vue' /* webpackChunkName: "components/utils-icon" */).then(c => wrapFunctional(c.default || c)),
  UtilsLoading: () => import('../..\\components\\utils\\Loading.vue' /* webpackChunkName: "components/utils-loading" */).then(c => wrapFunctional(c.default || c)),
  UtilsNl2br: () => import('../..\\components\\utils\\Nl2br.vue' /* webpackChunkName: "components/utils-nl2br" */).then(c => wrapFunctional(c.default || c)),
  UtilsPopover: () => import('../..\\components\\utils\\Popover.vue' /* webpackChunkName: "components/utils-popover" */).then(c => wrapFunctional(c.default || c)),
  UtilsSelect: () => import('../..\\components\\utils\\Select.vue' /* webpackChunkName: "components/utils-select" */).then(c => wrapFunctional(c.default || c))
}

for (const name in components) {
  Vue.component(name, components[name])
  Vue.component('Lazy' + name, components[name])
}
