<template>
    <view class="container">
        <channel-tabs class="sticky-tabs" @approved-channel-click="approvedInit" />
        <view v-if="currentChannel" class="content-section">
            <template v-if="isCurrentChannelApproved">
                <view class="list-header">
                    <view class="total-text">
                        共<text class="count">{{ total }}</text>条记录
                    </view>
                    <view class="filter-btn" @tap="searchFormVisible = true">
                        <uni-icons type="tune" size="16" color="#303133"></uni-icons>
                        <text class="filter-text">筛选</text>
                    </view>
                </view>
                <flow-record :data="data" />
                <uni-load-more :status="loadMoreStatus" />
                <pro-search-form v-model:visible="searchFormVisible" @reset="searchReset" @search="search">
                    <uni-forms label-position="top">
                        <uni-row :gutter="36">
                            <uni-col :span="24">
                                <uni-forms-item label="选择日期" name="date">
                                    <uni-datetime-picker type="date" v-model="searchFormData.date" />
                                </uni-forms-item>
                            </uni-col>
                            <uni-col :span="24">
                                <uni-forms-item label="对方编号" name="uid">
                                    <uni-easyinput v-model="searchFormData.target_user_uid" type="text"
                                        placeholder="请输入对方编号" />
                                </uni-forms-item>
                            </uni-col>
                            <uni-col :span="24">
                                <uni-forms-item label="对方微信名" name="nickname">
                                    <uni-easyinput v-model="searchFormData.target_user_nickname" type="text"
                                        placeholder="请输入对方微信名" />
                                </uni-forms-item>
                            </uni-col>
                        </uni-row>
                    </uni-forms>
                </pro-search-form>
            </template>
            <channel-audit v-else />
        </view>
    </view>
</template>

<script setup lang="ts">
import { getOrderPaginationApi } from '@/api/order';
import useLoadMore from '@/hooks/useLoadMore';
import { useChannelStore } from '@/stores/channel';
import { useUserStore } from '@/stores/user';
import { onShow } from '@dcloudio/uni-app';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const channelStore = useChannelStore()
const { isCurrentChannelApproved, currentChannel } = storeToRefs(channelStore)

const searchFormVisible = ref(false)
const getInitialSearchFormData = () => ({
    target_user_uid: '',
    target_user_nickname: '',
    date: '',
})
const searchFormData = ref(getInitialSearchFormData())
const searchReset = () => {
    searchFormData.value = getInitialSearchFormData()
    search()
}

const { data, loadMoreStatus, total, search: _search, } =
    useLoadMore(getOrderPaginationApi, { manual: true });

const search = () => {
    _search({
        ...searchFormData.value,
        channel_id: currentChannel.value?.id,
        user_id: userInfo.value?.id,
    })
}

const approvedInit = () => {
    const channelId = currentChannel.value?.id
    if (channelId) {
        search()
    }
}

onShow(() => {
    if (isCurrentChannelApproved.value) {
        approvedInit()
    }
})
</script>

<style>
page {
    background-color: #f5f7fa;
}
</style>

<style scoped lang="scss">
.sticky-tabs {
    position: sticky;
    top: 0;
    z-index: 10;
}

.container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;

    .content-section {
        flex: 1;
        padding: 30rpx;

        .list-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24rpx;

            .total-text {
                font-size: 26rpx;
                color: #909399;
                display: flex;
                align-items: center;
                line-height: 1;

                &::before {
                    content: '';
                    display: block;
                    width: 6rpx;
                    height: 28rpx;
                    background-color: #3B82F6;
                    border-radius: 6rpx;
                    margin-right: 16rpx;
                }

                .count {
                    color: #303133;
                    font-weight: 600;
                    margin: 0 8rpx;
                    font-size: 30rpx;
                    line-height: 1;
                }
            }

            .filter-btn {
                display: flex;
                align-items: center;
                background-color: #fff;
                padding: 6rpx 20rpx;
                border-radius: 100rpx;
                box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
                transition: all 0.2s;

                &:active {
                    transform: scale(0.95);
                    background-color: #f5f7fa;
                }

                .filter-text {
                    font-size: 26rpx;
                    color: #303133;
                    margin-left: 8rpx;
                    font-weight: 500;
                }
            }
        }
    }
}
</style>
