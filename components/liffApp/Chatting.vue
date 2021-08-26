<template>
  <div class="chat">
    <h4 class="title">JobID: {{ chattingActive.job_id }}</h4>
    <div id="listChatting">
      <p
        v-for="(item, index) in messageChat"
        :key="index"
        class="chat-content"
        :class="item.type === 1 ? 'client' : 'user'"
      >
        {{ item.content }}
      </p>
    </div>
    <el-input
      v-model="textChating"
      class="mt-4"
      placeholder="Enter text chatting..."
      type="text"
    >
      <el-button
        slot="append"
        icon="el-icon-s-promotion"
        @click="chatting()"
      ></el-button>
    </el-input>
  </div>
</template>

<script>
import Pusher from 'pusher-js'

import Constant from '@/constant.json'
export default {
  /* eslint-disable no-undef */
  components: {},
  data() {
    return {
      userId: '',
      textChating: '',
      messageChat: [],
      serviceOff: false,
      constant: Constant,
    }
  },
  computed: {
    chattingActive() {
      return {
        line_id: this.$route.query.line_id,
        job_id: this.$route.query.job_id,
      }
    },
  },
  mounted() {
    const pusher = new Pusher('a06d383acc8ffdb2d88c', {
      cluster: 'ap3',
    })

    const channel = pusher.subscribe('thanhgiongdev')

    channel.bind('App\\Events\\MessageSent', (data) => {
      const message = data.message.data
      if (
        message.line_id === this.chattingActive.line_id &&
        message.job_id == this.chattingActive.job_id
      ) {
        if (message.type == 1) {
          this.messageChat.push(message)
          setTimeout(() => {
            this.scrollToEnd()
          }, 100)
        }
      }
    })
  },
  created() {
    this.getHistoryChatting()
  },
  methods: {
    scrollToEnd() {
      const list = document.getElementById('listChatting')
      list.scrollTop = list.scrollHeight
    },
    submitFormData() {
      liff.closeWindow()
    },
    async getHistoryChatting() {
      await this.$services.common.chattingHistory(
        this.chattingActive,
        (response) => {
          this.messageChat = response
          setTimeout(() => {
            this.scrollToEnd()
          }, 100)
        },
        (err) => {
          this.$log.error(err)
        }
      )
    },
    chatting() {
      if (!this.textChating) return

      this.$services.common.chatting(
        { ...this.chattingActive, content: this.textChating, type: 2 },
        (message) => {
          this.textChating = ''
          this.messageChat.push(message)
          setTimeout(() => {
            this.scrollToEnd()
          }, 100)
        },
        (err) => {
          this.$log.error(err)
        }
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
  background-color: aliceblue;
  padding: 10px;
  margin: -10px -10px 20px;
}
.input-chat {
  position: absolute;
  bottom: 20px;
}
.heading {
  margin: 0 15px;
}
</style>
<style lang="scss">
.chat {
  position: relative;
  height: 100vh;

  #listChatting {
    height: calc(100vh - 140px);
    overflow: auto;
  }
  .chat-content {
    width: 80%;
    border: 2px solid #2557a4;
    padding: 5px 10px;
    border-radius: 10px;
    color: white;

    &.user {
      margin-left: 20%;
      text-align: right;
      background-color: #50aa5f;
    }

    &.client {
      background-color: #3a6ebf;
    }
  }
}
</style>
