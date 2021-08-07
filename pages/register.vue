<template>
  <section class="page-login">
    <div class="page-login-box">
      <div class="content">
        <h4>{{ $t('Register') }}</h4>
        <form-register :rule-form="ruleForm" @data="getData" />
      </div>
    </div>
  </section>
</template>

<script>
import FormRegister from '@/components/oauth/FormRegister'
import FrontendBase from '~/components/layouts/FrontendBase'

export default {
  components: {
    FormRegister,
  },
  extends: FrontendBase,
  layout: 'default',
  middleware: 'guest',
  data() {
    return {
      stringCommon: '',
      ruleForm: {
        email: '',
        password: '',
        form: 'login',
      },
    }
  },
  methods: {
    getData(data) {
      console.log(data)
    },
  },
}
</script>
