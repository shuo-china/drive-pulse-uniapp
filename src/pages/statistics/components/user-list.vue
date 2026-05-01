<template>

    <!-- 列表部分 -->
    <view class="list-section">
        <view v-for="(item, index) in props.data" :key="index" class="user-card">
            <!-- 头部：头像、昵称、标签 (保持居中对齐) -->
            <view class="card-header">
                <view class="user-info">
                    <image :src="item.avatar_path" class="avatar" mode="aspectFill"></image>
                    <view class="name-box">
                        <view class="name-id-col">
                            <text class="nickname">{{ item.nickname }}</text>
                            <text class="user-id">编号: {{ item.uid }}</text>
                        </view>
                        <view class="reg-tag">
                            注册天数：
                            <text class="tag-text">{{ item.register_days }}天</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 重构：简约大气的无边界数据行 -->
            <view class="card-stats-row">
                <!-- 放人数 -->
                <view class="stat-item">
                    <text class="stat-value">{{ item.release_count_sum }}</text>
                    <text class="stat-label">放人数</text>
                </view>

                <!-- 极简分割线 -->
                <view class="stat-divider"></view>

                <!-- 要人数 -->
                <view class="stat-item">
                    <text class="stat-value">{{ item.take_count_sum }}</text>
                    <text class="stat-label">要人数</text>
                </view>

                <!-- 极简分割线 -->
                <view class="stat-divider"></view>

                <!-- 结余数 -->
                <view class="stat-item">
                    <text class="stat-value balance"
                        :class="{ 'positive': item.release_count_sum - item.take_count_sum > 0, 'negative': item.release_count_sum - item.take_count_sum < 0 }">
                        {{ item.release_count_sum - item.take_count_sum }}
                    </text>
                    <text class="stat-label">结余</text>
                </view>
            </view>
        </view>
    </view>

</template>

<script setup lang="ts">
import { StatisticsUser } from '@/api/user';

const props = defineProps<{
    data: StatisticsUser[];
}>();
</script>

<style lang="scss" scoped>
.list-section {
    .user-card {
        background-color: #ffffff;
        border-radius: 28rpx;
        padding: 24rpx;
        margin-bottom: 28rpx;
        box-shadow: 0 4rpx 20rpx rgba(15, 23, 42, 0.03);
        transition: all 0.25s ease;

        &:active {
            transform: scale(0.99);
            box-shadow: 0 2rpx 10rpx rgba(15, 23, 42, 0.02);
        }

        .card-header {
            margin-bottom: 18rpx;

            .user-info {
                display: flex;
                align-items: center;

                .avatar {
                    width: 96rpx;
                    height: 96rpx;
                    border-radius: 50%;
                    margin-right: 28rpx;
                    background-color: #F1F5F9;
                }

                .name-box {
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    min-width: 0;

                    .name-id-col {
                        flex: 1;
                        min-width: 0;
                        display: flex;
                        flex-direction: column;
                        gap: 10rpx;

                        .nickname {
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 2;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            word-break: break-all;
                            font-size: 32rpx;
                            font-weight: 600;
                            color: #0F172A;
                            line-height: 1.3;
                        }

                        .user-id {
                            display: inline-block;
                            font-size: 24rpx;
                            color: #666;
                            font-family: 'DIN Alternate', sans-serif;
                        }
                    }

                    .reg-tag {
                        flex-shrink: 0;
                        margin-left: 16rpx;
                        display: flex;
                        align-items: center;
                        background-color: #F8FAFC;
                        border: 1px solid #F1F5F9;
                        padding: 6rpx 16rpx;
                        border-radius: 12rpx;
                        font-size: 24rpx;
                        color: #64748B;

                        .tag-text {
                            font-weight: 600;
                            color: #3B82F6;
                            margin-left: 8rpx;
                        }
                    }
                }
            }
        }

        .card-stats-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 18rpx;
            border-top: 1rpx solid #F1F5F9;

            .stat-item {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                .stat-value {
                    font-size: 32rpx;
                    font-weight: 700;
                    color: #0F172A;
                    font-family: 'DIN Alternate', 'Helvetica Neue', sans-serif;
                    line-height: 1.1;
                    margin-bottom: 8rpx;
                    transition: color 0.3s ease;

                    &.balance {
                        &.positive {
                            color: #52c41a;
                        }

                        &.negative {
                            color: #faad14;
                        }
                    }
                }

                .stat-label {
                    font-size: 24rpx;
                    color: #94A3B8;
                    font-weight: 400;
                    letter-spacing: 1rpx;
                }
            }

            .stat-divider {
                width: 2rpx;
                height: 48rpx;
                background-color: #F1F5F9;
                border-radius: 2rpx;
            }
        }
    }
}
</style>
