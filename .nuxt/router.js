import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _fbcd42a8 = () => interopDefault(import('..\\pages\\admin\\index.vue' /* webpackChunkName: "pages/admin/index" */))
const _addb1c24 = () => interopDefault(import('..\\pages\\client\\index.vue' /* webpackChunkName: "pages/client/index" */))
const _0b9fa75f = () => interopDefault(import('..\\pages\\jobs.vue' /* webpackChunkName: "pages/jobs" */))
const _3d74eaac = () => interopDefault(import('..\\pages\\register.vue' /* webpackChunkName: "pages/register" */))
const _fa9686ca = () => interopDefault(import('..\\pages\\admin\\account\\index.vue' /* webpackChunkName: "pages/admin/account/index" */))
const _51dc3081 = () => interopDefault(import('..\\pages\\admin\\client\\index.vue' /* webpackChunkName: "pages/admin/client/index" */))
const _4bc101c3 = () => interopDefault(import('..\\pages\\admin\\login.vue' /* webpackChunkName: "pages/admin/login" */))
const _36e8fd92 = () => interopDefault(import('..\\pages\\admin\\survey\\index.vue' /* webpackChunkName: "pages/admin/survey/index" */))
const _0c7a5155 = () => interopDefault(import('..\\pages\\client\\change-line\\index.vue' /* webpackChunkName: "pages/client/change-line/index" */))
const _72ba1505 = () => interopDefault(import('..\\pages\\client\\login.vue' /* webpackChunkName: "pages/client/login" */))
const _1b0b1784 = () => interopDefault(import('..\\pages\\client\\password-change\\index.vue' /* webpackChunkName: "pages/client/password-change/index" */))
const _ee116a72 = () => interopDefault(import('..\\pages\\client\\password-current\\index.vue' /* webpackChunkName: "pages/client/password-current/index" */))
const _a361e074 = () => interopDefault(import('..\\pages\\client\\policy.vue' /* webpackChunkName: "pages/client/policy" */))
const _418df916 = () => interopDefault(import('..\\pages\\client\\reset-password\\index.vue' /* webpackChunkName: "pages/client/reset-password/index" */))
const _ba78a258 = () => interopDefault(import('..\\pages\\client\\survey\\index.vue' /* webpackChunkName: "pages/client/survey/index" */))
const _290e2daf = () => interopDefault(import('..\\pages\\driver\\application.vue' /* webpackChunkName: "pages/driver/application" */))
const _5998c85a = () => interopDefault(import('..\\pages\\client\\survey\\_id\\list.vue' /* webpackChunkName: "pages/client/survey/_id/list" */))
const _7beb45ce = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/admin",
    component: _fbcd42a8,
    name: "admin"
  }, {
    path: "/client",
    component: _addb1c24,
    name: "client"
  }, {
    path: "/jobs",
    component: _0b9fa75f,
    name: "jobs"
  }, {
    path: "/register",
    component: _3d74eaac,
    name: "register"
  }, {
    path: "/admin/account",
    component: _fa9686ca,
    name: "admin-account"
  }, {
    path: "/admin/client",
    component: _51dc3081,
    name: "admin-client"
  }, {
    path: "/admin/login",
    component: _4bc101c3,
    name: "admin-login"
  }, {
    path: "/admin/survey",
    component: _36e8fd92,
    name: "admin-survey"
  }, {
    path: "/client/change-line",
    component: _0c7a5155,
    name: "client-change-line"
  }, {
    path: "/client/login",
    component: _72ba1505,
    name: "client-login"
  }, {
    path: "/client/password-change",
    component: _1b0b1784,
    name: "client-password-change"
  }, {
    path: "/client/password-current",
    component: _ee116a72,
    name: "client-password-current"
  }, {
    path: "/client/policy",
    component: _a361e074,
    name: "client-policy"
  }, {
    path: "/client/reset-password",
    component: _418df916,
    name: "client-reset-password"
  }, {
    path: "/client/survey",
    component: _ba78a258,
    name: "client-survey"
  }, {
    path: "/driver/application",
    component: _290e2daf,
    name: "driver-application"
  }, {
    path: "/client/survey/:id/list",
    component: _5998c85a,
    name: "client-survey-id-list"
  }, {
    path: "/",
    component: _7beb45ce,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
