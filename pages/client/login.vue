<template>
  <section class="page-login">
    <div class="page-login-box">
      <h2 class="text-center brand">Client login</h2>
      <div class="content">
        <form-login :id-role="idRole" @data="getData" />
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.page-login {
  height: 100vh;

  &-box {
    position: absolute;
    width: 100%;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);

    .content {
      background: #fff;
      border-radius: 6px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
      margin: 0 auto;
      position: relative;
      max-width: 450px;
      padding: 1.5rem;

      .form-login,
      .form-register {
        .form-group {
          margin-bottom: 15px;
        }

        .help-block {
          color: red !important;
        }
      }

      .actions {
        color: #525252;
        text-align: center;
        border-top: 1px solid #eee;
        padding: 16px 0;
      }
    }

    .brand {
      color: $color-text-base;
      margin-bottom: 1.5rem;
      font-weight: bold;
    }
  }
}
</style>

<script>
import FormLogin from '@/components/oauth/FormLogin'
import FrontendBase from '~/components/layouts/FrontendBase'

export default {
  components: {
    FormLogin,
  },
  extends: FrontendBase,
  layout: 'default',
  middleware: 'guest',
  data() {
    return {
      stringCommon: '',
      idRole: 3,
    }
  },
  methods: {
    getData(data) {
      console.log(data)
    },
  },
}
</script>
