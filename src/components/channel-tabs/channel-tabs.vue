<template>
    <view v-if="channelList?.length" class="channel-wrapper">
        <uni-segmented-control :current="currentChannelIndex" :values="channelList.map(item => item.title)"
            @clickItem="handleClickTab" styleType="text" activeColor="#0170fe" />
    </view>
</template>

<script setup lang="ts">
import { useChannelStore } from '@/stores/channel';
import { storeToRefs } from 'pinia';

const emit = defineEmits(['approvedChannelClick'])

const channelStore = useChannelStore()
const { channelList, currentChannel, currentChannelIndex, isCurrentChannelApproved } = storeToRefs(channelStore)

const handleClickTab = ({ currentIndex }) => {
    currentChannel.value = channelList.value[currentIndex]
    if (isCurrentChannelApproved.value) {
        emit('approvedChannelClick', currentChannel.value)
    }
}
</script>

<style lang="scss">
.channel-wrapper {
    background-color: #ffffff;
    padding: 10rpx 30rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.02);
}
</style>
