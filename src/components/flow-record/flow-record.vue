<template>
    <view class="page-container">
        <view class="record-group" v-for="group in groupedData" :key="group.date">
            <!-- 居中日期头 -->
            <view class="group-header">
                <view class="header-line"></view>
                <text class="date-text">{{ group.date }}</text>
                <view class="header-line"></view>
            </view>

            <view class="record-item" v-for="item in group.items" :key="item.id">
                <view class="flow-content">

                    <!-- 左侧：发起方 -->
                    <view class="user-box">
                        <image class="avatar" :src="item.user?.avatar_path" mode="aspectFill" />
                        <text class="nickname">{{ item.user?.nickname }}</text>
                        <text class="uid">编号：{{ item.user?.uid }}</text>
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
                        <image class="avatar" :src="item.targetUser?.avatar_path" mode="aspectFill" />
                        <text class="nickname">{{ item.targetUser?.nickname || '未知' }}</text>
                        <text class="uid">编号：{{ item.targetUser?.uid || '--' }}</text>
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
    background-color: #F7F8FA;
    min-height: 100vh;
    box-sizing: border-box;
}

.record-group {
    margin-bottom: 60rpx;

    &:last-child {
        margin-bottom: 0;
    }
}

/* 极简居中日期标题 */
.group-header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20rpx;
    padding: 0 20rpx;

    .header-line {
        flex: 1;
        height: 1px;
        background: linear-gradient(to right, transparent, #E5E6EB, transparent);
    }

    .date-text {
        margin: 0 24rpx;
        font-size: 24rpx;
        color: #666;
        font-weight: 500;
        background-color: #F2F3F5;
        padding: 4rpx 20rpx;
        border-radius: 100rpx;
        letter-spacing: 1rpx;
    }
}

/* 卡片样式：微阴影 + 柔和边框，打造极简呼吸感 */
.record-item {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    padding: 24rpx 12rpx;
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
        flex: 1;
        min-width: 0;
        /* 确保 flex 容器内文本省略生效 */
        /* 自适应宽度 */

        .avatar {
            width: 88rpx;
            height: 88rpx;
            border-radius: 50%;
            background-color: #F2F3F5;
            margin-bottom: 16rpx;
        }

        .nickname {
            font-size: 26rpx;
            color: #111;
            font-weight: 500;
            width: 100%;
            text-align: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-bottom: 6rpx;
        }

        .uid {
            font-size: 24rpx;
            color: #666;
        }
    }

    /* 中间流转信息区 */
    .flow-center {
        width: 200rpx;
        /* 固定宽度，缩短箭头 */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 12rpx;
        margin-top: -12rpx;
        /* 视觉微调，让箭头更对齐头像中心 */

        /* 数量 (上) */
        .amount-text {
            font-size: 40rpx;
            color: #0170fe;
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

        /* 时间 (下) - 重新设计为标签样式，更醒目 */
        .time-text {
            font-size: 26rpx;
            color: #4E5969;
            background-color: #F2F3F5;
            padding: 6rpx 12rpx;
            border-radius: 100rpx;
            /* 圆角胶囊形状 */
            font-family: 'DIN Alternate', monospace;
            font-weight: 600;
            letter-spacing: 1rpx;
            margin-top: 8rpx;
            display: inline-block;
        }
    }
}
</style>