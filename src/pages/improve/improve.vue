<template>
    <view class="container">
        <view class="header">
            <text class="title">完善个人信息</text>
            <text class="subtitle">请设置您的头像和昵称</text>
        </view>

        <view class="form-group">
            <view class="avatar-wrapper">
                <button class="avatar-btn" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
                    <image class="avatar-img" :src="formData.avatarPath || defaultAvatar" mode="aspectFill" />
                    <!-- 用一个简单的+号或者不加图标，保持清爽 -->
                </button>
                <text class="avatar-tip">点击更换头像</text>
            </view>

            <view class="input-wrapper">
                <text class="label">昵称</text>
                <input class="nickname-input" type="nickname" v-model="formData.nickname" placeholder="请输入昵称"
                    placeholder-class="placeholder" />
            </view>
        </view>

        <button class="submit-btn" :class="{ 'is-disabled': !canSubmit }" :disabled="!canSubmit" :loading="submitting"
            @tap="onSubmit">
            确认登录
        </button>
    </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { uploadFileApi } from '@/api/file';
import { useChannelStore } from '@/stores/channel';

const defaultAvatar = '/static/default_avatar.png';
const uploading = ref(false)
const submitting = ref(false)

const formData = ref({
    nickname: '',
    avatarKey: '',
    avatarPath: ''
})

const canSubmit = computed(() => {
    return formData.value.avatarKey && formData.value.nickname.trim() && !uploading.value && !submitting.value;
});

const onChooseAvatar = (e: any) => {
    const { avatarUrl: url } = e.detail;
    uploading.value = true
    uploadFileApi(url).then((res) => {
        formData.value.avatarKey = res.key;
        formData.value.avatarPath = res.path;
    }).finally(() => {
        uploading.value = false
    })
};

const onSubmit = () => {
    if (!canSubmit.value) {
        uni.showToast({
            title: '请完善头像和昵称',
            icon: 'none'
        });
        return;
    }

    submitting.value = true
    const userStore = useUserStore()
    userStore.improveUserInfo({
        nickname: formData.value.nickname,
        avatarKey: formData.value.avatarKey,
    })
        .then(() => useChannelStore().getChannelList())
        .then(() => {
            uni.navigateBack()
        }).finally(() => {
            submitting.value = false
        })
};
</script>

<style lang="scss" scoped>
.container {
    min-height: 100vh;
    background-color: #f7f8fa;
    padding: 60rpx 40rpx;
    box-sizing: border-box;
}

.header {
    margin-bottom: 60rpx;
    margin-top: 40rpx;
    text-align: center;

    .title {
        font-size: 48rpx;
        font-weight: 600;
        color: #333;
        display: block;
        margin-bottom: 16rpx;
    }

    .subtitle {
        font-size: 28rpx;
        color: #999;
        display: block;
    }
}

.form-group {
    background-color: #fff;
    border-radius: 24rpx;
    padding: 60rpx 40rpx;
    box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.02);
    margin-bottom: 60rpx;
}

.avatar-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 60rpx;

    .avatar-btn {
        width: 160rpx;
        height: 160rpx;
        padding: 0;
        margin: 0;
        border-radius: 50%;
        background-color: #f0f0f0;
        position: relative;
        overflow: hidden;
        border: 4rpx solid #fff;
        box-shadow: 0 8rpx 24rpx rgba(1, 112, 254, 0.15);

        &::after {
            border: none;
        }

        .avatar-img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }

    .avatar-tip {
        font-size: 24rpx;
        color: #999;
        margin-top: 24rpx;
    }
}

.input-wrapper {
    border-bottom: 2rpx solid #eee;
    padding-bottom: 20rpx;
    display: flex;
    align-items: center;
    transition: all 0.3s;

    &:focus-within {
        border-bottom-color: #0170fe;
    }

    .label {
        font-size: 32rpx;
        color: #333;
        font-weight: 500;
        margin-right: 40rpx;
        width: 80rpx;
    }

    .nickname-input {
        flex: 1;
        font-size: 32rpx;
        color: #333;
        height: 80rpx;
        text-align: right;
    }

    .placeholder {
        color: #ccc;
    }
}

.submit-btn {
    background-color: #0170fe;
    color: #fff;
    border-radius: 48rpx;
    height: 96rpx;
    line-height: 96rpx;
    font-size: 32rpx;
    font-weight: 500;
    box-shadow: 0 12rpx 32rpx rgba(1, 112, 254, 0.3);
    transition: all 0.3s;

    &::after {
        border: none;
    }

    &:active {
        transform: translateY(2rpx);
        box-shadow: 0 6rpx 16rpx rgba(1, 112, 254, 0.3);
    }

    &.is-disabled {
        background-color: #a0c6ff;
        box-shadow: none;
        color: #fff;
    }
}
</style>