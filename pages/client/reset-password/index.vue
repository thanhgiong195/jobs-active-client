<template>
  <section class="page-login">
    <div class="page-login-box">
      <h2 class="text-center brand">
        {{ $t('reset_password') }}
      </h2>
      <div class="content">
        <FormResetPassword />
      </div>
    </div>
  </section>
</template>
<script>
import FormResetPassword from '@/components/oauth/FormResetPassword'
export default {
  components: { FormResetPassword },
  data() {
    return {}
  },
}
</script>
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
      margin: 0 auto;
      position: relative;
      max-width: 450px;
      padding: 1.5rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);

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

      &.no-box {
        box-shadow: none;
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
