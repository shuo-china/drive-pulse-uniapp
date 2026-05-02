<template>
    <view class="submit-container">
        <view class="form-card">
            <view class="title">我要报单</view>

            <!-- 用户编号输入 -->
            <view class="form-item">
                <text class="label">对方编号</text>
                <input class="input" type="number" v-model="formData.uid" placeholder="请输入对方编号" />
            </view>

            <!-- 用户信息展示 -->
            <view class="user-status-wrapper">
                <!-- 状态1：未输入 -->
                <view class="status-box empty" v-if="!formData.uid">
                    <text class="status-text">输入编号自动匹配用户</text>
                </view>

                <!-- 状态2：未找到 -->
                <view class="status-box error" v-else-if="!matchedUser">
                    <text class="status-text">未找到该用户，请核对编号</text>
                </view>

                <!-- 状态3：已找到 -->
                <view class="status-box success" v-else>
                    <view class="user-basic">
                        <image class="avatar" :src="matchedUser.avatar_path" mode="aspectFill" />
                        <text class="name">{{ matchedUser.nickname }}</text>
                    </view>
                    <text class="id">编号: {{ matchedUser.uid }}</text>
                </view>
            </view>

            <!-- 数量输入 -->
            <view class="form-item">
                <text class="label">报单数量</text>
                <uni-number-box v-model="formData.count" :min="1" />
            </view>

            <!-- 提交按钮 -->
            <button class="submit-btn" :disabled="!canSubmit" :loading="submitting" @tap="handleSubmit">
                提交
            </button>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia';
import { useChannelStore } from '@/stores/channel';
import { createOrderApi } from '@/api/order';
import { type UserOption } from '@/api/user'

const emit = defineEmits(['submitSuccess'])

const props = defineProps<{
    userOptions: UserOption[]
    userOptionsLoading: boolean
}>()

const channelSotre = useChannelStore()
const { currentChannel } = storeToRefs(channelSotre)

const getInitialFormData = () => ({
    uid: '',
    count: 1,
})

const formData = ref(getInitialFormData())

const matchedUser = computed(() => {
    if (!formData.value.uid) return null
    return props.userOptions.find(user => user.uid === formData.value.uid)
})

const canSubmit = computed(() => {
    return matchedUser.value && formData.value.count && !props.userOptionsLoading && !submitting.value
})

const submitting = ref(false)
const handleSubmit = () => {
    uni.showModal({
        title: '确认提交',
        content: `确定要放给【${matchedUser.value?.nickname || ''}】 ${formData.value.count} 人吗？`,
        success: (res) => {
            if (res.confirm) {
                const channelId = currentChannel.value?.id
                if (!channelId) return
                submitting.value = true
                createOrderApi({
                    channel_id: channelId,
                    uid: formData.value.uid,
                    count: formData.value.count,
                }, {
                    custom: {
                        showErrorMessage: false,
                    }
                }).then(() => {
                    formData.value = getInitialFormData()
                    emit('submitSuccess')
                    uni.showToast({ title: '提交成功', icon: 'success' })
                })
                    .catch((err) => {
                        if (err.code === 'BALANCE_LIMIT') {
                            uni.showModal({
                                title: '对方结余不足',
                                content: err.message,
                                showCancel: false,
                            })
                        } else {
                            uni.showToast({
                                title: err.message,
                                icon: "none",
                                duration: 2000,
                            })
                        }
                    })
                    .finally(() => {
                        submitting.value = false
                    })
            }
        }
    })
}
</script>

<style lang="scss" scoped>
.submit-container {
    padding: 0;
}

.form-card {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 40rpx 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.02);
}

.title {
    font-size: 34rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 40rpx;
    display: flex;
    align-items: center;
    line-height: 1;

    &::before {
        content: '';
        display: block;
        width: 8rpx;
        height: 32rpx;
        background-color: #0170fe;
        border-radius: 4rpx;
        margin-right: 16rpx;
    }
}

.form-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30rpx;
    border-bottom: 2rpx solid #f0f0f0;
    padding-bottom: 24rpx;
    transition: all 0.3s;

    &:focus-within {
        border-bottom-color: #0170fe;
    }

    .label {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
    }

    .input {
        flex: 1;
        font-size: 28rpx;
        text-align: right;
    }
}

.user-status-wrapper {
    margin-bottom: 40rpx;
}

.status-box {
    display: flex;
    align-items: center;
    padding: 24rpx 32rpx;
    border-radius: 12rpx;
    transition: all 0.3s ease;

    &.empty {
        background-color: #fafafa;
        border: 2rpx dashed #e8e8e8;
        justify-content: center;

        .status-text {
            font-size: 26rpx;
            color: #999;
        }
    }

    &.error {
        background-color: #fff2f0;
        border: 2rpx solid #ffccc7;
        justify-content: center;

        .status-text {
            font-size: 26rpx;
            color: #ff4d4f;
        }
    }

    &.success {
        background-color: transparent;
        border: 2rpx solid #f0f0f0;
        padding: 20rpx 24rpx;
        justify-content: space-between;

        .user-basic {
            display: flex;
            align-items: center;

            .avatar {
                width: 60rpx;
                height: 60rpx;
                border-radius: 50%;
                margin-right: 16rpx;
                background-color: #f5f5f5;
                border: none;
            }

            .name {
                font-size: 30rpx;
                color: #333;
                font-weight: 500;
            }
        }

        .id {
            font-size: 26rpx;
            color: #666;
            background: #f7f7f7;
            padding: 4rpx 12rpx;
            border-radius: 8rpx;
        }
    }
}

.submit-btn {
    background-color: #0170fe;
    color: #fff;
    font-size: 32rpx;
    font-weight: 500;
    border-radius: 44rpx;
    margin-top: 40rpx;
    height: 88rpx;
    line-height: 88rpx;
    box-shadow: 0 8rpx 20rpx rgba(1, 112, 254, 0.2);
    transition: all 0.2s;

    &:active {
        transform: scale(0.98);
        background-color: #0162e0;
    }

    &::after {
        border: none;
    }

    &[disabled] {
        background-color: #a0cfff;
        color: #fff;
        box-shadow: none;
    }
}
</style>
