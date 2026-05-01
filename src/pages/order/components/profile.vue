<template>
    <view class="profile-container">
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
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';

const props = defineProps<{
    balanceCount: number,
    balanceCountLoading: boolean,
}>()

const userStore = useUserStore();

const balanceColor = computed(() => {
    const count = props.balanceCount || 0;
    if (count > 0) return '#52c41a';
    if (count < 0) return '#faad14';
    return '#bfbfbf';
});
</script>

<style lang="scss" scoped>
.profile-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32rpx;
    background-color: #ffffff;
    border-radius: 16rpx;
    margin-bottom: 24rpx;

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

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>
