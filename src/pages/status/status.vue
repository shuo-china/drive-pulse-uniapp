<template>
    <view class="status-container">
        <view class="icon-wrap">
            <uni-icons v-if="pageType === 'banned'" type="clear" size="80" color="#dd524d"></uni-icons>
        </view>
        <view class="title">
            {{ pageTitle }}
        </view>
        <view class="desc">
            {{ pageDesc }}
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const pageType = ref<string>('banned')

onLoad((options: any) => {
    if (options && options.type) {
        pageType.value = options.type
    }
})

const pageTitle = computed(() => {
    if (pageType.value === 'banned') return '账号已被禁用'
    return '未知状态'
})

const pageDesc = computed(() => {
    if (pageType.value === 'banned') return '您的账号存在违规行为或异常，已被系统禁用。'
    return ''
})


</script>

<style lang="scss" scoped>
.status-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100rpx 40rpx;
    background-color: #f8f8f8;
    min-height: 100vh;
    box-sizing: border-box;

    .icon-wrap {
        margin-bottom: 40rpx;
        margin-top: 100rpx;
    }

    .title {
        font-size: 40rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 20rpx;
    }

    .desc {
        font-size: 28rpx;
        color: #666;
        text-align: center;
        line-height: 1.6;
        margin-bottom: 80rpx;
        padding: 0 40rpx;
    }
}
</style>
