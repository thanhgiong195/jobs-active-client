<template>
  <div v-loading="loading" class="mx-3 my-4">
    <h4 class="text-center">NEW JOBS</h4>

    <DialogSubmit
      :visible="dialogVisible"
      :job="jobChoose"
      @close="handleCloseSocial"
    />

    <FormSubmitJob
      :visible="dialogVisibleForm"
      :line-profile="lineProfile"
      :job-id="jobId"
      @close="handleCloseForm"
    />

    <ul class="cards">
      <li v-for="(job, index) in listJobs" :key="index" class="cards__item">
        <div class="card w-100">
          <div
            v-if="job.image"
            class="card__image"
            :style="
              'background-image: url(' + getFullPathImage(job.image) + ')'
            "
          />
          <div
            v-else
            class="card__image"
            :style="'background-image: url(https://icenet.work/assets/Themes/default/images/album-default.png)'"
          />
          <div class="card__content">
            <div class="card__title">{{ job.name }}</div>
            <p class="card__text">
              <span
                v-for="(item, key) in splitEndLine(job.description)"
                :key="key"
              >
                {{ item }} <br />
              </span>
            </p>
            <button
              class="btn btn--block card__btn"
              @click="chooseSocialSubmit(job)"
            >
              Recruitment
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import liff from '@line/liff'
import DialogSubmit from '@/components/DialogSubmit'
import FormSubmitJob from '@/components/FormSubmitJob'

export default {
  layout: 'default',
  components: { DialogSubmit, FormSubmitJob },
  data() {
    return {
      listJobs: [],
      jobChoose: {},
      lineProfile: {},
      jobId: '',
      loading: false,
      dialogVisible: false,
      dialogVisibleForm: false,
      appUrl:
        process.env.LINE_URL_CALLBACK || 'https://jobs-xyz.vercel.app/jobs',
    }
  },
  async created() {
    liff
      .init({
        liffId: '1656294864-L42BqGwx',
      })
      .then(async () => {
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile()
          this.lineProfile = profile
        }
      })
      .catch((err) => this.$log.error(err))

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

      this.jobId = query.jobId || this.$route.query.jobId
      this.dialogVisibleForm = true
    }
    if (this.$route.query.open == 'form' && this.$route.query.jobId) {
      this.jobId = this.$route.query.jobId
      this.dialogVisibleForm = true
    }
    this.getListJobs()
  },
  methods: {
    handleCloseForm(social) {
      this.dialogVisibleForm = false
    },
    handleCloseSocial(social) {
      this.dialogVisible = false
      if (!social) return
      if (social == 'LINE') {
        this.actionLINE(this.jobChoose)
      }
    },
    chooseSocialSubmit(job) {
      this.$router.push({
        name: 'jobs',
        query: {
          jobId: job.id,
        },
      })
      this.jobChoose = job
      this.dialogVisible = true
    },
    actionLINE(job) {
      liff
        .init({
          liffId: '1656294864-L42BqGwx',
        })
        .then(async () => {
          if (!liff.isLoggedIn()) {
            liff.login({
              redirectUri: `${this.appUrl}/?jobId=${job.id}&open=form`,
            })
          } else {
            const profile = await liff.getProfile()
            this.lineProfile = profile
            this.dialogVisibleForm = true
          }
        })
        .catch((err) => this.$log.error(err))
    },
    getListJobs(page) {
      this.loading = true
      this.$services.driver.getListJobs(
        { page },
        (response) => {
          this.listJobs = response
          this.loading = false
        },
        (err) => {
          this.$log.error(err)
          this.loading = false
        }
      )
    },
  },
}
</script>

<style lang="scss" scoped>
html {
  background-color: #f0f0f0;
}

body {
  color: #999999;
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0;
  padding: 1rem;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img {
  height: auto;
  max-width: 100%;
  vertical-align: middle;
}

.btn {
  background-color: white;
  border: 1px solid #cccccc;
  color: #696969;
  padding: 0.5rem;
}

.btn--block {
  display: block;
  width: 100%;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
}

.cards__item {
  display: flex;
  padding: 1rem;
  @media (max-width: 40rem) {
    width: 100%;
  }
  @media (min-width: 40rem) {
    width: 50%;
  }
  @media (min-width: 56rem) {
    width: 33.3333%;
  }
}

.card {
  background-color: white;
  border-radius: 0.25rem;
  box-shadow: 0 20px 40px -14px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  &:hover {
    .card__image {
      filter: contrast(100%);
    }
  }
}

.card__content {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  padding: 1rem;
}

.card__image {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  filter: contrast(70%);
  //filter: saturate(180%);
  overflow: hidden;
  position: relative;
  transition: filter 0.5s cubic-bezier(0.43, 0.41, 0.22, 0.91);
  &::before {
    content: '';
    display: block;
    padding-top: 56.25%; // 16:9 aspect ratio
  }
  @media (min-width: 40rem) {
    &::before {
      padding-top: 66.6%; // 3:2 aspect ratio
    }
  }
}

.card__title {
  color: #696969;
  font-size: 1.25rem;
  font-weight: 300;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.card__text {
  flex: 1 1 auto;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1.25rem;
}
</style>
