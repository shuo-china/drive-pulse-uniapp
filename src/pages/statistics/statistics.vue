<template>
    <view class="container">
        <view class="content-section">
            <view class="list-header">
                <view class="total-text">
                    共<text class="count">{{ total }}</text>位用户
                </view>
                <view class="filter-btn" @tap="searchFormVisible = true">
                    <uni-icons type="tune" size="16" color="#303133"></uni-icons>
                    <text class="filter-text">筛选</text>
                </view>
            </view>
            <user-list :data="data as StatisticsUser[]" />
            <uni-load-more :status="loadMoreStatus" />
            <pro-search-form v-model:visible="searchFormVisible" @reset="searchReset" @search="search">
                <uni-forms label-position="top">
                    <uni-row :gutter="36">
                        <uni-col :span="24">
                            <uni-forms-item label="编号" name="uid">
                                <uni-easyinput v-model="searchFormData.uid" type="text" placeholder="请输入编号" />
                            </uni-forms-item>
                        </uni-col>
                        <uni-col :span="24">
                            <uni-forms-item label="微信名" name="nickname">
                                <uni-easyinput v-model="searchFormData.nickname" type="text" placeholder="请输入微信名" />
                            </uni-forms-item>
                        </uni-col>
                    </uni-row>
                </uni-forms>
            </pro-search-form>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import useLoadMore from '@/hooks/useLoadMore'
import { getUserStatisticsPaginationApi, StatisticsUser } from '@/api/user'
import UserList from './components/user-list.vue'

const searchFormVisible = ref(false)
const getInitialSearchFormData = () => ({
    nickname: '',
    uid: '',
})
const searchFormData = ref(getInitialSearchFormData())
const searchReset = () => {
    searchFormData.value = getInitialSearchFormData()
    search()
}

const { data, loadMoreStatus, total, search: _search, } =
    useLoadMore(getUserStatisticsPaginationApi, { manual: true });

const search = () => {
    _search(searchFormData.value)
}

onShow(() => {
    search()
})
</script>

<style>
page {
    background-color: #f5f7fa;
}
</style>

<style lang="scss" scoped>
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