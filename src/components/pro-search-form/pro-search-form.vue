<template>
    <uni-popup ref="popupRef" type="bottom" :safe-area="false" @change="handleChange">
        <view class="popup-wrapper">
            <view class="popup-header">
                <view class="handle-bar"></view>
                <view class="title">筛选条件</view>
            </view>
            <view class="content-wrapper">
                <slot></slot>
            </view>
            <view class="btn-wrapper">
                <button class="btn-reset" @tap="handleReset">重置</button>
                <button class="btn-search" @tap="handleSearch">查询</button>
            </view>
        </view>
    </uni-popup>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const emit = defineEmits(["search", "reset"]);

const visible = defineModel('visible', { type: Boolean, default: false })
let currentShow = visible.value

const popupRef = ref()

const handleChange = ({ show }: { show: boolean }) => {
    currentShow = show
    visible.value = show
}

const handleReset = () => {
    visible.value = false
    emit('reset')
}

const handleSearch = () => {
    visible.value = false
    emit('search')
}

watch(visible, (newVal) => {
    if (newVal === currentShow) {
        return
    }
    if (newVal) {
        popupRef.value.open()
    } else {
        popupRef.value.close()
    }
})
</script>

<style lang="scss" scoped>
$primary-color: #0170fe;

.popup-wrapper {
    background-color: #ffffff;
    border-radius: 16px 16px 0 0;
    overflow: hidden;
    padding-bottom: calc(20px + env(safe-area-inset-bottom));

    .popup-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px 0 8px;

        .handle-bar {
            width: 36px;
            height: 4px;
            background-color: #e5e5e5;
            border-radius: 2px;
            margin-bottom: 12px;
        }

        .title {
            font-size: 16px;
            font-weight: 600;
            color: #333333;
        }
    }

    .content-wrapper {
        padding: 0 20px;
        max-height: 70vh;
        overflow-y: auto;
    }

    .btn-wrapper {
        display: flex;
        padding: 6px 20px 0;
        column-gap: 12px;

        button {
            flex: 1;
            height: 44px;
            line-height: 44px;
            font-size: 15px;
            font-weight: 500;
            border-radius: 22px;
            border: none;
            transition: all 0.2s ease;

            &::after {
                border: none;
            }

            &:active {
                opacity: 0.8;
                transform: scale(0.98);
            }
        }

        .btn-reset {
            background-color: #f5f5f5;
            color: #666666;
        }

        .btn-search {
            background-color: $primary-color;
            color: #ffffff;
            box-shadow: 0 4px 12px rgba($primary-color, 0.2);
        }
    }
}
</style>