<template>
  <view class="order-container">
    <channel-tabs class="sticky-tabs" @approved-channel-click="approvedInit" />
    <view v-if="currentChannel" class="content-section">
      <uni-notice-bar v-if="notice" show-icon show-close scrollable :text="notice" :speed="50" class="notice-wrapper" />
      <template v-if="isCurrentChannelApproved">
        <profile :balance-count="balanceCount" :balance-count-loading="balanceCountLoading" />
        <submit :user-options="userOptions" :user-options-loading="userOptionsLoading"
          @submit-success="getBalanceCount" />
      </template>
      <channel-audit v-else />
    </view>
  </view>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useChannelStore } from '@/stores/channel';
import profile from './components/profile.vue'
import submit from './components/submit.vue'
import { ref } from 'vue';
import { getBalanceCountByChannelIdApi, getUserOptionsByChannelIdApi } from '@/api/user';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { getNoticeApi } from '@/api/notice';

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

const approvedInit = () => {
  getBalanceCount()
  getUserOptions()
}

onShow(() => {
  if (isCurrentChannelApproved.value) {
    approvedInit()
  }
})

const notice = ref('')
onLoad(() => {
  getNoticeApi().then(res => {
    notice.value = res || ''
  })
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

:deep(.notice-wrapper) .uni-noticebar {
  padding: 16rpx 24rpx;
  border-radius: 16rpx;
}
</style>