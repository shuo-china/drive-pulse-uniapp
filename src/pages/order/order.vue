<template>
  <view class="order-container">
    <view class="content-section">
      <profile v-if="userStore.userInfo" :channels="channels" :channels-loading="channelsLoading"
        :notice-title="noticeTitle" />
      <submit :user-options="userOptions" :user-options-loading="userOptionsLoading" @submit-success="getChannels" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getUserOptionsApi } from '@/api/user';
import { onShow } from '@dcloudio/uni-app';
import { getNoticeApi } from '@/api/notice';
import profile from './components/profile.vue'
import submit from './components/submit.vue'
import { getChannelsApi } from '@/api/channel';
import { useUserStore } from '@/stores/user';
import { useChannelStore } from '@/stores/channel';

const userStore = useUserStore()
const channelStore = useChannelStore()

const channels = ref([])
const channelsLoading = ref(true)
const getChannels = () => {
  channelsLoading.value = true
  getChannelsApi().then(res => {
    channels.value = res || []
  }).finally(() => {
    channelsLoading.value = false
  })
}

let userOptionsLoaded = false
const userOptions = ref({})
const userOptionsLoading = ref(false)
const getUserOptions = () => {
  if (userOptionsLoaded) {
    return
  }
  userOptionsLoaded = true
  userOptionsLoading.value = true
  getUserOptionsApi().then(res => {
    userOptions.value = res || {}
  })
    .catch(() => {
      userOptionsLoaded = false
    })
    .finally(() => {
      userOptionsLoading.value = false
    })
}

let noticeLoaded = false
const noticeTitle = ref('')
const getNoticeTitle = () => {
  if (noticeLoaded) {
    return
  }
  if (!channelStore.channelList.some(item => item.auditStatus === 2)) {
    return
  }
  noticeLoaded = true
  getNoticeApi().then(res => {
    noticeTitle.value = res?.title || ''
  }).catch(() => {
    noticeLoaded = false
  })
}


onShow(() => {
  if (!userStore.userInfo) {
    return
  }
  getChannels()
  getUserOptions()
  getNoticeTitle()

  if (channelStore.channelList.some(item => item.auditStatus === 1)) {
    channelStore.getChannelList()
  }
})
</script>

<style>
page {
  background-color: #f5f7fa;
}
</style>

<style lang="scss" scoped>
.sticky-tabs {
  position: sticky;
  top: 0;
  z-index: 10;
}

.order-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .content-section {
    flex: 1;
    padding: 0 30rpx 30rpx;
  }
}
</style>