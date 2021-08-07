<template>
  <section class="">
    <div class="mt-5">
      <div>
        <h2 class="text-center brand">
          {{ $t('edit_line_channel') }}
        </h2>
        <h5 class="d-flex justify-content-center">
          {{ $t('change_line_guide_1') }}<br />
          {{ $t('change_line_guide_2') }}<br />
        </h5>
      </div>
      <div class="mx-4 my-4">
        <FormRegisterLine />
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.content {
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
  margin: 0 auto;
  position: relative;
  max-width: 900px;
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
</style>

<script>
import FormRegisterLine from '@/components/oauth/FormRegisterLine'
import FrontendBase from '~/components/layouts/FrontendBase'

export default {
  components: {
    FormRegisterLine,
  },
  extends: FrontendBase,
  layout: 'admin',
  middleware: 'client',
}
</script>
