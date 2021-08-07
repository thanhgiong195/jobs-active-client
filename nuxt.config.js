require('dotenv').config()
export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  server: {
    port: process.env.APP_PORT, // default: 3000
    // host: '0.0.0.0', // default: localhost
  },

  router: {
    middleware: ['i18n'],
  },

  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: process.env.APP_NAME || 'spa',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=1',
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.APP_DESCRIPTION || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    'element-ui/lib/theme-chalk/index.css',
    'assets/css/quily.css',
    'assets/css/util.css',
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/consola',
    '~/plugins/axios',
    '~/plugins/services',
    '~/plugins/element-ui',
    '~/plugins/mixin',
    '~/plugins/component',
    '~/plugins/i18n',
    '~/plugins/nuxt-client-init',
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: [
    '~/components',
    '~/components/admin/surveys',
    '~/components/admin',
    '~/components/categories',
    '~/components/layouts',
    '~/components/oauth',
    '~/components/pagination',
    '~/components/client',
    '~/components/survey',
  ],

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module',
    '@nuxtjs/fontawesome',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    'bootstrap-vue/nuxt',
    '@nuxtjs/style-resources',
  ],

  styleResources: {
    scss: [
      './assets/scss/mixin/main-mixin.scss',
      './assets/scss/variables.scss',
    ],
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: process.env.URL_API + '/api',
    https: process.env.MODE === 'dev' ? false : true,
  },

  fontawesome: {
    component: 'fa',
    icons: {
      solid: true,
      brands: true,
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    // extend(config, ctx) {
    //   // Run ESLint on save
    //   if (ctx.isDev && ctx.isClient) {
    //     config.module.rules.push({
    //       enforce: 'pre',
    //       test: /\.(js|vue)$/,
    //       loader: 'eslint-loader',
    //       exclude: /(node_modules)/,
    //     })
    //   }
    // },
    babel: { compact: true },
    filenames: {
      app: ({ isDev, isModern }) =>
        isDev
          ? `[name]${isModern ? '.modern' : ''}.js`
          : `[contenthash:8]${isModern ? '.modern' : ''}.js?rev=` +
            Math.floor(Date.now() / 1000),
      chunk: ({ isDev, isModern }) =>
        isDev
          ? `[name]${isModern ? '.modern' : ''}.js`
          : `[contenthash:8]${isModern ? '.modern' : ''}.js?rev=` +
            Math.floor(Date.now() / 1000),
      css: ({ isDev }) =>
        isDev
          ? '[name].css'
          : 'css/[contenthash:8].css?rev=' + Math.floor(Date.now() / 1000),
      img: ({ isDev }) =>
        isDev ? '[path][name].[ext]' : 'img/[name].[contenthash:8].[ext]',
      font: ({ isDev }) =>
        isDev ? '[path][name].[ext]' : 'fonts/[name].[contenthash:8].[ext]',
      video: ({ isDev }) =>
        isDev ? '[path][name].[ext]' : 'videos/[name].[contenthash:8].[ext]',
    },
  },
}
