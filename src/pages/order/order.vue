<template>
  <view class="order-container">
    <channel-tabs class="sticky-tabs" @approved-channel-click="approvedInit" />
    <view v-if="currentChannel" class="content-section">
      <template v-if="isCurrentChannelApproved">
        <profile :balance-count="balanceCount" :balance-count-loading="balanceCountLoading"
          :notice-title="noticeTitle" />
        <submit :user-options="userOptions" :user-options-loading="userOptionsLoading" :notice-title="noticeTitle"
          @submit-success="getBalanceCount" />
      </template>
      <channel-audit v-else />
    </view>
  </view>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useChannelStore } from '@/stores/channel';
import { ref } from 'vue';
import { getBalanceCountByChannelIdApi, getUserOptionsByChannelIdApi } from '@/api/user';
import { onShow } from '@dcloudio/uni-app';
import { getNoticeApi } from '@/api/notice';
import profile from './components/profile.vue'
import submit from './components/submit.vue'

const store = useChannelStore()
const { currentChannel, isCurrentChannelApproved } = storeToRefs(store)

const balanceCount = ref(0)
const balanceCountLoading = ref(false)
const getBalanceCount = () => {
  const channelId = currentChannel.value?.id
  if (channelId) {
    balanceCountLoading.value = true
    getBalanceCountByChannelIdApi(channelId).then(res => {
      if (currentChannel.value?.id === channelId) {
        balanceCount.value = res || 0
      }
    }).finally(() => {
      balanceCountLoading.value = false
    })
  }
}

const userOptions = ref([])
const userOptionsLoading = ref(false)
const getUserOptions = () => {
  const channelId = currentChannel.value?.id
  if (channelId) {
    userOptionsLoading.value = true
    getUserOptionsByChannelIdApi(channelId).then(res => {
      if (currentChannel.value?.id === channelId) {
        userOptions.value = res || []
      }
    }).finally(() => {
      userOptionsLoading.value = false
    })
  }
}

let isNoticeTitleLoaded = false
const noticeTitle = ref('')
const getNoticeTitle = () => {
  if (!isNoticeTitleLoaded) {
    getNoticeApi().then(res => {
      noticeTitle.value = res?.title || ''
      isNoticeTitleLoaded = true
    })
  }
}

const approvedInit = () => {
  getBalanceCount()
  getUserOptions()
  getNoticeTitle()
}

onShow(() => {
  if (isCurrentChannelApproved.value) {
    approvedInit()
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
    padding: 30rpx;
  }
}
</style>