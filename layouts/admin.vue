<template>
  <div class="page">
    <Header />
    <div class="bg-light d-flex flex-column page-container">
      <div class="d-flex align-items-stretch flex-fill">
        <!-- <LeftMenu /> -->
        <main class="w-100 d-flex flex-column position-relative bg-white">
          <nuxt />
        </main>
      </div>
    </div>
    <Footer />
  </div>
</template>
<script>
import Header from '~/components/layouts/Header'
import Footer from '~/components/layouts/Footer'
import LeftMenu from '~/components/layouts/LeftMenu'

export default {
  components: {
    Header,
    Footer,
    LeftMenu,
  },
}
</script>

<style lang="scss" scoped>
.bo-table tr th {
  width: 30%;
}
</style>
