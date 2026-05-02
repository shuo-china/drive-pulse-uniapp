<template>
    <view class="audit-container">
        <!-- 0 = 未申请 -->
        <view v-if="currentChannel?.auditStatus === 0" class="status-wrapper">
            <view class="empty-state">
                <uni-icons type="chat" size="80" color="#0170fe"></uni-icons>
                <text class="tips">您还未申请加入该群</text>
                <text class="sub-tips">加入群后即可开始使用</text>
            </view>
            <button class="primary-btn" :loading="submitting" :disabled="submitting" @tap="handleApply">申请加入群</button>
        </view>

        <!-- 1 = 待审核 -->
        <view v-else-if="currentChannel?.auditStatus === 1" class="status-wrapper">
            <view class="empty-state">
                <uni-icons type="info" size="80" color="#faad14"></uni-icons>
                <text class="tips">您的申请正在审核中</text>
                <text class="sub-tips">请耐心等待管理员审核</text>
            </view>
        </view>

        <!-- 3 = 已拒绝 -->
        <view v-else-if="currentChannel?.auditStatus === 3" class="status-wrapper">
            <view class="empty-state">
                <uni-icons type="clear" size="80" color="#dd524d"></uni-icons>
                <text class="tips">抱歉，您的申请已被拒绝</text>
                <text class="reason" v-if="currentChannel.refuseReason">拒绝原因：{{ currentChannel.refuseReason }}</text>
            </view>
            <button class="primary-btn" :loading="submitting" :disabled="submitting" @tap="handleApply">重新提交</button>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { applyChannelApi } from '@/api/channel';
import { storeToRefs } from 'pinia';
import { useChannelStore } from '@/stores/channel';
import { useUserStore } from '@/stores/user';

const channelStore = useChannelStore()
const { channelList, currentChannel } = storeToRefs(channelStore)

const submitting = ref(false)

const handleApply = () => {
    if (!useUserStore().userInfo) {
        uni.showModal({
            title: '提示',
            content: '请您先完善个人信息',
            confirmText: '去完善',
            success: (res) => {
                if (res.confirm) {
                    uni.navigateTo({
                        url: '/pages/improve/improve',
                    })
                }
            }
        })
        return
    }

    uni.showModal({
        title: '提示',
        content: '确定要提交申请吗？',
        success: (res) => {
            if (res.confirm) {
                const channelId = currentChannel.value?.id
                if (channelId) {
                    submitting.value = true
                    applyChannelApi({
                        channel_id: channelId,
                    })
                        .then(() => {
                            const channel = channelList.value.find(item => item.id === channelId)
                            if (channel) {
                                channel.auditStatus = 1
                            }
                        })
                        .finally(() => {
                            submitting.value = false
                        })
                }
            }
        }
    })
}
</script>

<style scoped lang="scss">
.audit-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    box-sizing: border-box;
}

.status-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    border-radius: 24rpx;
    padding: 80rpx 40rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.02);
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 60rpx;

    .tips {
        margin-top: 40rpx;
        font-size: 34rpx;
        font-weight: 500;
        color: #333;
    }

    .sub-tips {
        margin-top: 16rpx;
        font-size: 28rpx;
        color: #999;
    }

    .reason {
        margin-top: 24rpx;
        font-size: 28rpx;
        color: #dd524d;
        background-color: rgba(221, 82, 77, 0.1);
        padding: 12rpx 24rpx;
        border-radius: 12rpx;
    }
}

.primary-btn {
    width: 80%;
    height: 88rpx;
    line-height: 88rpx;
    background-color: #0170fe;
    color: #fff;
    border-radius: 44rpx;
    font-size: 32rpx;
    font-weight: 500;
    text-align: center;
    border: none;
    box-shadow: 0 8rpx 20rpx rgba(1, 112, 254, 0.2);
    transition: all 0.2s;

    &:active {
        transform: scale(0.98);
        background-color: #0162e0;
    }

    &::after {
        border: none;
    }
}
</style>