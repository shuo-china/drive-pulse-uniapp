<template>
    <view class="profile-container">
        <view class="profile-wrapper">
            <view class="user-info">
                <image class="avatar" :src="userStore.userInfo?.avatarPath" mode="aspectFill"></image>
                <view class="details">
                    <text class="nickname">{{ userStore.userInfo?.nickname }}</text>
                    <text class="uid">编号: {{ userStore.userInfo?.uid }}</text>
                </view>
            </view>
            <view class="balance">
                <view v-if="balanceCountLoading" class="balance-loading">
                    <view class="loading-spinner"></view>
                </view>
                <text v-else class="balance-value" :style="{ color: balanceColor }">{{ balanceCount }}<text
                        class="unit">人</text></text>
                <text class="balance-label">结余数量</text>
            </view>
        </view>

        <!-- 消息公告跳转链接 -->
        <view v-if="noticeTitle" class="notice-bar" @tap="goToNotice">
            <view class="notice-left">
                <view class="notice-left-icon">
                    <uni-icons type="sound" size="20" color="#fa8c16"></uni-icons>
                </view>
                <text class="notice-text">{{ noticeTitle }}</text>
            </view>
            <view class="notice-right">
                <text class="notice-link">查看更多</text>
                <view class="notice-right-icon">
                    <uni-icons type="right" size="14" color="#fa8c16"></uni-icons>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';

const props = defineProps<{
    balanceCount: number,
    balanceCountLoading: boolean,
    noticeTitle: string,
}>()

const userStore = useUserStore();

const balanceColor = computed(() => {
    const count = props.balanceCount || 0;
    if (count > 0) return '#52c41a';
    if (count < 0) return '#faad14';
    return '#bfbfbf';
});

const goToNotice = () => {
    uni.navigateTo({
        url: '/pages/notice/notice'
    });
};
</script>

<style lang="scss" scoped>
.profile-container {
    overflow: hidden;
    background-color: #ffffff;
    border-radius: 16rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.02);

    .profile-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 32rpx;

        .user-info {
            display: flex;
            align-items: center;

            .avatar {
                width: 96rpx;
                height: 96rpx;
                border-radius: 50%;
                margin-right: 24rpx;
                background-color: #f8f8f8;
            }

            .details {
                display: flex;
                flex-direction: column;
                justify-content: center;

                .nickname {
                    font-size: 32rpx;
                    font-weight: 600;
                    color: #111111;
                    margin-bottom: 10rpx;
                }

                .uid {
                    font-size: 26rpx;
                    font-weight: 500;
                    color: #333;
                    align-self: flex-start;
                }
            }
        }

        .balance {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: center;

            .balance-loading {
                height: 52rpx;
                display: flex;
                align-items: center;
                margin-bottom: 6rpx;
            }

            .loading-spinner {
                width: 34rpx;
                height: 34rpx;
                border: 4rpx solid #d9d9d9;
                border-top-color: #0170fe;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            }

            .balance-value {
                font-size: 48rpx;
                font-weight: bold;
                line-height: 1.1;
                margin-bottom: 6rpx;

                .unit {
                    font-size: 28rpx;
                    font-weight: normal;
                    margin-left: 4rpx;
                }
            }

            .balance-label {
                font-size: 24rpx;
                color: #666666;
            }
        }
    }

    .notice-bar {
        padding: 16rpx 24rpx;
        background: linear-gradient(to right, #fff1f0, #fff7f6);
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fa8c16;
        font-size: 26rpx;

        .notice-left {
            display: flex;
            align-items: center;
            flex: 1;
            margin-right: 20rpx;
            overflow: hidden;

            .notice-left-icon {
                display: flex;
                align-items: center;
                margin-right: 12rpx;
            }

            .notice-text {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.2;
            }
        }

        .notice-right {
            display: flex;
            align-items: center;
            flex-shrink: 0;

            .notice-link {
                line-height: 1.2;
            }

            .notice-right-icon {
                line-height: 1;
                display: flex;
                align-items: center;
                margin-left: 4rpx;
            }
        }
    }

}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>
