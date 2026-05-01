<template>
    <view class="page-container">
        <view class="record-group" v-for="group in groupedData" :key="group.date">
            <!-- 极简日期头 -->
            <view class="group-header">
                <text class="date-text">{{ group.date }}</text>
                <text class="count-text">共 {{ group.items.length }} 笔</text>
            </view>

            <view class="record-item" v-for="item in group.items" :key="item.id">
                <view class="flow-content">

                    <!-- 左侧：发起方 -->
                    <view class="user-box">
                        <image class="avatar" :src="item.user?.avatar_path" mode="aspectFill" />
                        <text class="nickname">{{ item.user?.nickname || '未知' }}</text>
                        <text class="uid">NO.{{ item.user?.uid || '--' }}</text>
                    </view>

                    <!-- 中间：流转核心区 (数量 -> 箭头 -> 时间) -->
                    <view class="flow-center">
                        <!-- 上：数量 -->
                        <text class="amount-text">+{{ item.count }}</text>

                        <!-- 中：设计感流转箭头 -->
                        <view class="arrow-container">
                            <view class="node-origin"></view> <!-- 起点圆圈 -->
                            <view class="line"></view> <!-- 极简细线 -->
                            <view class="arrow"></view> <!-- 终点箭头 -->
                        </view>

                        <!-- 下：时间 -->
                        <text class="time-text">{{ formatRecordTime(item.create_time) }}</text>
                    </view>

                    <!-- 右侧：接收方 -->
                    <view class="user-box">
                        <image class="avatar" :src="item.target_user?.avatar_path" mode="aspectFill" />
                        <text class="nickname">{{ item.target_user?.nickname || '未知' }}</text>
                        <text class="uid">NO.{{ item.target_user?.uid || '--' }}</text>
                    </view>

                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { Order } from "@/api/order";
import dayjs from "dayjs";
import { computed } from "vue";

const props = defineProps<{
    data: Order[]
}>()

const formatRecordDate = (value: string) => {
    const date = dayjs(value)
    if (!date.isValid()) return value

    const now = dayjs()
    if (date.isSame(now, 'day')) {
        return '今天'
    }
    if (date.isSame(now.subtract(1, 'day'), 'day')) {
        return '昨天'
    }

    return date.format("YYYY-MM-DD")
}

const formatRecordTime = (value: string) => {
    const date = dayjs(value)
    return date.isValid() ? date.format("HH:mm") : value
}

const groupedData = computed(() => {
    const groups = new Map<string, Order[]>()

    for (const item of props.data || []) {
        const date = formatRecordDate(item.create_time)
        const currentGroup = groups.get(date)
        if (currentGroup) {
            currentGroup.push(item)
        } else {
            groups.set(date, [item])
        }
    }

    return Array.from(groups, ([date, items]) => ({
        date,
        items,
    }))
})
</script>

<style scoped lang="scss">
/* 页面背景建议为浅灰 #F7F8FA，以凸显白色卡片质感 */
.page-container {
    padding: 32rpx;
    background-color: #F7F8FA;
    min-height: 100vh;
    box-sizing: border-box;
}

.record-group {
    margin-bottom: 40rpx;
}

/* 极简大气标题 */
.group-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 24rpx;
    padding: 0 8rpx;

    .date-text {
        font-size: 34rpx;
        color: #1D2129;
        font-weight: 600;
        letter-spacing: 1rpx;
    }

    .count-text {
        font-size: 24rpx;
        color: #86909C;
    }
}

/* 卡片样式：微阴影 + 柔和边框，打造极简呼吸感 */
.record-item {
    background-color: #FFFFFF;
    border-radius: 24rpx;
    padding: 40rpx 32rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.02);
    border: 2rpx solid #F2F3F5;

    .flow-content {
        display: flex;
        align-items: center;
        /* 整体居中对称 */
        justify-content: space-between;
    }

    /* 左右侧人员信息 */
    .user-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 140rpx;
        /* 固定宽度，防止中间区域被挤压 */

        .avatar {
            width: 88rpx;
            height: 88rpx;
            border-radius: 50%;
            background-color: #F2F3F5;
            margin-bottom: 16rpx;
        }

        .nickname {
            font-size: 26rpx;
            color: #1D2129;
            font-weight: 500;
            width: 100%;
            text-align: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-bottom: 6rpx;
        }

        .uid {
            font-size: 22rpx;
            color: #86909C;
            font-family: monospace;
        }
    }

    /* 中间流转信息区 */
    .flow-center {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 32rpx;
        margin-top: -12rpx;
        /* 视觉微调，让箭头更对齐头像中心 */

        /* 数量 (上) */
        .amount-text {
            font-size: 40rpx;
            color: #1D2129;
            /* 高级深石墨色 */
            font-weight: 700;
            font-family: 'DIN Alternate', monospace;
            margin-bottom: 12rpx;
        }

        /* 箭头组件 (中) */
        .arrow-container {
            width: 100%;
            display: flex;
            align-items: center;
            margin-bottom: 12rpx;

            /* 起点小圆圈 */
            .node-origin {
                width: 8rpx;
                height: 8rpx;
                border-radius: 50%;
                border: 2rpx solid #C9CDD4;
                background-color: #FFFFFF;
            }

            /* 连线 */
            .line {
                flex: 1;
                height: 2rpx;
                background-color: #C9CDD4;
            }

            /* 终点箭头 */
            .arrow {
                width: 0;
                height: 0;
                border-top: 6rpx solid transparent;
                border-bottom: 6rpx solid transparent;
                border-left: 8rpx solid #C9CDD4;
            }
        }

        /* 时间 (下) */
        .time-text {
            font-size: 22rpx;
            color: #86909C;
            font-family: 'DIN Alternate', monospace;
            letter-spacing: 1rpx;
        }
    }
}
</style>