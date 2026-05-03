<template>
    <view v-if="notice" class="notice-container">
        <view class="notice-title">{{ notice.title }}</view>
        <view class="notice-content">
            <text user-select>{{ notice.content }}</text>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getNoticeApi } from '@/api/notice'
import { onLoad } from '@dcloudio/uni-app';

const notice = ref<Nullable<{
    title: string;
    content: string;
}>>(null)

onLoad(() => {
    uni.showLoading({
        title: '加载中',
    })
    getNoticeApi({
        custom: {
            showErrorMessage: false,
        }
    }).then(res => {
        notice.value = res
    }).catch((err) => {
        if (err.code === 'NO_AUTH') {
            uni.showModal({
                title: '提示',
                content: '需入群审核通过，方可查看内容',
                showCancel: false,
                success: (res) => {
                    if (res.confirm) {
                        uni.navigateBack()
                    }
                }
            })
        } else {
            uni.showToast({
                title: err.message,
                icon: "none",
                duration: 2000,
            })
        }
    }).finally(() => {
        uni.hideLoading()
    })
})
</script>

<style scoped lang="scss">
.notice-container {
    min-height: 100vh;
    background-color: #f5f7fa;
    padding: 30rpx;
    box-sizing: border-box;

    .notice-title {
        font-size: 36rpx;
        font-weight: bold;
        color: #111;
        text-align: center;
        margin-bottom: 30rpx;
        padding-bottom: 30rpx;
        border-bottom: 2rpx dashed #eeeeee;
    }

    .notice-content {
        font-size: 32rpx;
        color: #333;
        line-height: 1.8;
        letter-spacing: 1rpx;
        text-align: justify;
        white-space: pre-wrap;
        word-break: break-all;
    }
}
</style>