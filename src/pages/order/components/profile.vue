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
        </view>

        <!-- 结余统计展示 -->
        <view class="balance-section">
            <view v-if="channelsLoading" class="balance-loading">
                <view class="loading-spinner"></view>
                <text class="loading-text">加载中...</text>
            </view>
            <view v-else-if="channels && channels.length" class="balance-row">
                <template v-for="(item, index) in channels" :key="index">
                    <view class="balance-item" :class="{ 'is-disabled': item.balance_count === null }">
                        <text class="balance-value"
                            :style="item.balance_count !== null ? { color: getCountColor(item.balance_count) } : {}">
                            {{ item.balance_count !== null ? item.balance_count : '-' }}
                        </text>
                        <text class="balance-label">{{ item.title }}</text>
                    </view>
                    <view v-if="index < channels.length - 1" class="balance-divider"></view>
                </template>
            </view>
            <view v-else class="balance-empty">
                <text class="empty-text">暂无结余数据</text>
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
import { useUserStore } from '@/stores/user';

const props = defineProps<{
    channels: {
        title: string
        balance_count: number | null
    }[],
    channelsLoading: boolean,
    noticeTitle: string,
}>()

const userStore = useUserStore();

const getCountColor = (count: number) => {
    const val = Number(count) || 0;
    if (val > 0) return '#52c41a';
    if (val < 0) return '#faad14';
    return '#bfbfbf';
};

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
        padding: 16rpx 32rpx;

        .user-info {
            display: flex;
            align-items: center;

            .avatar {
                width: 96rpx;
                height: 96rpx;
                border-radius: 50%;
                margin-right: 24rpx;
                background-color: #f8f8f8;
                flex-shrink: 0;
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
    }

    .balance-section {
        padding: 16rpx 32rpx;
        border-top: 1rpx solid #f5f5f5;

        .balance-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 8rpx 0;

            .loading-text {
                font-size: 24rpx;
                color: #999;
                margin-left: 12rpx;
            }
        }

        .balance-row {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .balance-item {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                &.is-disabled {

                    .balance-value,
                    .balance-label {
                        color: #bfbfbf !important;
                    }
                }

                .balance-value {
                    font-size: 32rpx;
                    font-weight: 700;
                    color: #0F172A;
                    font-family: 'DIN Alternate', 'Helvetica Neue', sans-serif;
                    margin-bottom: 4rpx;
                    line-height: 1;
                }

                .balance-label {
                    font-size: 24rpx;
                    color: #333;
                    letter-spacing: 1rpx;
                }
            }

            .balance-divider {
                width: 2rpx;
                height: 40rpx;
                background-color: #f0f0f0;
            }
        }

        .balance-empty {
            text-align: center;
            padding: 8rpx 0;

            .empty-text {
                font-size: 24rpx;
                color: #999;
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
