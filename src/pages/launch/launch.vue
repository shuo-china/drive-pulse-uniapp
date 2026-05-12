<template>
    <view class="launch-container">
        <view class="brand-box">
            <view class="logo-wrapper">
                <image class="logo-img" src="/static/logo.png" mode="aspectFit" />
            </view>
            <view class="app-info">
                <text class="app-name">万里顺行</text>
            </view>
        </view>

        <view class="loading-box">
            <view class="loading-bar">
                <view class="loading-progress"></view>
            </view>
            <text class="loading-text">正在启动系统...</text>
        </view>

        <view class="footer">
            <text class="copyright">© 2026 万里顺行. All rights reserved.</text>
        </view>
    </view>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { useUserStore } from "@/stores/user";
import { UserLevel } from "@/utils/enums";
import { useChannelStore } from "@/stores/channel";

const userStore = useUserStore()

onLoad(async () => {
    await userStore.getAccessToken()
    if (userStore.userLevel === UserLevel.Bound) {
        await userStore.getUserInfo()
    }
    await useChannelStore().getChannelList()
    uni.reLaunch({
        url: "/pages/order/order"
    })
})
</script>

<style lang="scss" scoped>
.launch-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    padding: 160rpx 0 80rpx;
    box-sizing: border-box;
}

.brand-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 120rpx;
}

.logo-wrapper {
    width: 240rpx;
    height: 240rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 48rpx;
    box-sizing: border-box;
    border-radius: 4px;
    overflow: hidden;

    .logo-img {
        width: 100%;
        height: 100%;
    }
}

.app-info {
    text-align: center;
}

.app-name {
    font-size: 48rpx;
    font-weight: 600;
    color: #333333;
    letter-spacing: 8rpx;
    display: block;
    font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.loading-box {
    width: 320rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 120rpx;
}

.loading-bar {
    width: 100%;
    height: 4rpx;
    background-color: #f0f0f0;
    border-radius: 2rpx;
    overflow: hidden;
    margin-bottom: 24rpx;
}

.loading-progress {
    width: 40%;
    height: 100%;
    background: linear-gradient(90deg, rgba(1, 112, 254, 0.2) 0%, #0170fe 50%, rgba(1, 112, 254, 0.2) 100%);
    border-radius: 2rpx;
    animation: progressMove 1.5s infinite linear;
}

.loading-text {
    font-size: 24rpx;
    color: #999;
    letter-spacing: 2rpx;
}

.copyright {
    font-size: 22rpx;
    color: #d1d1d1;
    font-family: 'DIN Alternate', sans-serif;
}

@keyframes progressMove {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(250%);
    }
}
</style>