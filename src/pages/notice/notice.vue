<template>
    <view class="notice-container">
        <template v-if="data">
            <view class="notice-header">
                <text class="notice-title">{{ data.title }}</text>
                <text class="notice-time">{{ data.create_time }}</text>
            </view>
            <view class="notice-content">
                <text class="content-text">{{ data.content }}</text>
            </view>
        </template>
        <view v-else class="loading-state">
            <text>加载中...</text>
        </view>
    </view>
</template>

<script setup>
import { getNoticeApi } from '@/api/notice';
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app';

const data = ref(null)

onLoad(() => {
    getNoticeApi().then(res => {
        data.value = res
    })
})
</script>

<style scoped>
.notice-container {
    padding: 40rpx 32rpx;
    background-color: #ffffff;
    min-height: 100vh;
    box-sizing: border-box;
}

.notice-header {
    display: flex;
    flex-direction: column;
    margin-bottom: 40rpx;
    padding-bottom: 30rpx;
    border-bottom: 1rpx solid #f0f0f0;
}

.notice-title {
    font-size: 44rpx;
    font-weight: 600;
    color: #333333;
    line-height: 1.4;
    margin-bottom: 16rpx;
}

.notice-time {
    font-size: 26rpx;
    color: #999999;
}

.notice-content {
    font-size: 32rpx;
    color: #444444;
    line-height: 1.8;
}

.content-text {
    /* 保留可能存在的换行符，并自动换行 */
    white-space: pre-wrap;
    word-break: break-all;
}

.loading-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
    color: #999999;
    font-size: 28rpx;
}
</style>