<template>
  <div class="heading" style="padding: 10px">
    <Chatting />
  </div>
</template>

<script>
/* eslint-disable no-undef */
import Chatting from '@/components/liffApp/Chatting'

export default {
  components: {
    Chatting,
  },
  created() {
    if (this.$route.query['liff.state']) {
      const search = this.$route.query['liff.state'].substring(1)
      const query = JSON.parse(
        '{"' +
          decodeURI(search)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
          '"}'
      )
      this.liffInit(query)
    } else {
      this.liffInit(this.$route.query)
    }
  },
  methods: {
    liffInit(query) {
      liff
        .init({
          liffId: query.liffApp,
        })
        .then(() => {
          const app_url = process.env.APP_URL
          if (!liff.isLoggedIn()) {
            const q = this.urlParse(query)
            liff.login({
              redirectUri: `${app_url}/driver/application?${q}`,
            })
          }
        })
        .catch((err) => this.$log.error(err))
    },
  },
}
</script>
