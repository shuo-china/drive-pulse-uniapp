import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";
import { CHANNEL_KEY } from "@/utils/constants";
import { getChannelListApi } from "@/api/channel";

export interface Channel {
  id: number;
  title: string;
  auditStatus: number;
  refuseReason: string;
}

export const useChannelStore = defineStore("channel", () => {
  const channelList = ref<Channel[]>([]);
  const currentChannel = ref<Nullable<Channel>>(null);

  const currentChannelIndex = computed(() => {
    return channelList.value.findIndex(
      (item) => item.id === currentChannel.value?.id,
    );
  });

  const isCurrentChannelApproved = computed(() => {
    return currentChannel.value?.auditStatus === 2;
  });

  const getChannelList = () => {
    return getChannelListApi().then((res) => {
      const list = res.map((item) => ({
        id: item.id,
        title: item.title,
        auditStatus: item.audit_status ?? 0,
        refuseReason: item.refuse_reason,
      }));
      channelList.value = list;
      const storageChannelId = uni.getStorageSync(CHANNEL_KEY);
      if (storageChannelId) {
        const findChannel = list.find((item) => item.id === storageChannelId);
        if (findChannel) {
          currentChannel.value = findChannel;
          return;
        }
      }
      currentChannel.value = list.length ? list[0] : null;
    });
  };

  watch(currentChannel, (newVal) => {
    if (newVal) {
      uni.setStorageSync(CHANNEL_KEY, newVal.id);
    }
  });

  return {
    channelList,
    currentChannel,
    currentChannelIndex,
    isCurrentChannelApproved,
    getChannelList,
  };
});
