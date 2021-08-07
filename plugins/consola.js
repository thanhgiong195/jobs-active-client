import Vue from 'vue'
import consola from 'consola'

const isProduction = process.env.NODE_ENV === 'production'

const logger = consola.create({
  level: isProduction ? 0 : 4, // https://github.com/nuxt/consola/blob/master/src/types.js
  defaults: {
    additionalColor: 'white',
  },
})

Vue.prototype.$log = logger
