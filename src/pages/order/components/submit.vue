<template>
    <view class="submit-container">
        <view class="form-card">
            <view class="form-wrapper">
                <view class="title">我要报单</view>

                <!-- 用户编号输入 -->
                <view class="form-item">
                    <text class="label">编号/微信名</text>
                    <input class="input" type="text" v-model="formData.keyword" placeholder="请输入对方编号或微信名" />
                </view>

                <!-- 对方用户信息展示 -->
                <view class="user-status-wrapper">
                    <!-- 状态1：未输入 -->
                    <view class="status-box empty" v-if="!formData.keyword">
                        <text class="status-text">输入编号或微信名自动匹配用户</text>
                    </view>

                    <!-- 状态2：未找到 -->
                    <view class="status-box error" v-else-if="!matchedUser">
                        <text class="status-text">未找到该用户，请核对编号或微信名</text>
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

        <!-- 确认信息弹窗 -->
        <uni-popup ref="confirmPopup" type="dialog">
            <uni-popup-dialog type="info" cancelText="取消" confirmText="确定" title="确认信息" @confirm="handleConfirm">
                <view class="modal-content">
                    确定在<text class="highlight">{{ currentChannel?.title }}</text>放给对方<text class="highlight">{{
                        formData.count }}</text>人吗？
                </view>
            </uni-popup-dialog>
        </uni-popup>
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
    keyword: '',
    count: 1,
})

const formData = ref(getInitialFormData())

const matchedUser = computed(() => {
    const keyword = String(formData.value.keyword ?? '').trim()
    if (!keyword) return null
    return props.userOptions.find(user => String(user.uid) === keyword) || props.userOptions.find(user => user.nickname?.includes(keyword))
})

const canSubmit = computed(() => {
    return matchedUser.value && formData.value.count && !props.userOptionsLoading && !submitting.value
})

const submitting = ref(false)
const confirmPopup = ref()

const handleSubmit = () => {
    confirmPopup.value.open()
}

const handleConfirm = () => {
    const channelId = currentChannel.value?.id
    if (!channelId) return
    submitting.value = true
    createOrderApi({
        channel_id: channelId,
        uid: matchedUser.value?.uid,
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
</script>

<style lang="scss" scoped>
.submit-container {
    padding: 0;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.02);

    .form-card {
        overflow: hidden;
        background-color: #fff;
        border-radius: 16rpx;

        .form-wrapper {
            padding: 40rpx 30rpx;

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
                            flex: 1;
                            min-width: 0;
                            margin-right: 20rpx;

                            .avatar {
                                width: 60rpx;
                                height: 60rpx;
                                border-radius: 50%;
                                margin-right: 16rpx;
                                background-color: #f5f5f5;
                                border: none;
                                flex-shrink: 0;
                            }

                            .name {
                                font-size: 30rpx;
                                color: #333;
                                font-weight: 500;
                                display: -webkit-box;
                                -webkit-box-orient: vertical;
                                // 不限制行数
                                -webkit-line-clamp: none;
                                overflow: hidden;
                                word-break: break-all;
                            }
                        }

                        .id {
                            font-size: 26rpx;
                            color: #666;
                            background: #f7f7f7;
                            padding: 4rpx 12rpx;
                            border-radius: 4rpx;
                            flex-shrink: 0;
                        }
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
        }
    }

    .modal-content {
        padding: 20rpx 0;
        font-size: 30rpx;
        color: #333;
        line-height: 1.6;
        text-align: center;

        .highlight {
            color: #0170fe;
            font-weight: bold;
            margin: 0 4rpx;
        }
    }
}
</style>
