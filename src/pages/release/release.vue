<template>
    <view class="container">
        <channel-tabs class="sticky-tabs" @approved-channel-click="approvedInit" />
        <view v-if="currentChannel" class="content-section">
            <template v-if="isCurrentChannelApproved">
                <view class="list-header">
                    <text class="total-text">共 {{ total }} 条记录</text>
                    <view class="filter-btn" @tap="searchFormVisible = true">
                        <uni-icons type="tune" size="16" color="#666"></uni-icons>
                        <text class="filter-text">筛选</text>
                    </view>
                </view>
                <flow-record :data="data" />
                <uni-load-more :status="loadMoreStatus" />
                <pro-search-form v-model:visible="searchFormVisible" @reset="searchReset" @search="search">
                    <uni-forms label-position="top">
                        <uni-row :gutter="36">
                            <uni-col :span="12">
                                <uni-forms-item label="昵称" name="nickname">
                                    <uni-easyinput v-model="searchFormData.nickname" type="text" placeholder="请输入姓名" />
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
import { onShow } from '@dcloudio/uni-app';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const channelStore = useChannelStore()
const { isCurrentChannelApproved, currentChannel } = storeToRefs(channelStore)

const searchFormVisible = ref(false)
const getInitialSearchFormData = () => ({
    nickname: '',
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
            margin-bottom: 20rpx;

            .total-text {
                font-size: 28rpx;
                color: #666;
            }

            .filter-btn {
                display: flex;
                align-items: center;
                gap: 8rpx;

                .filter-text {
                    font-size: 28rpx;
                    color: #666;
                }
            }
        }
    }
}
</style>