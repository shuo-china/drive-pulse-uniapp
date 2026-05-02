<template>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { useUserStore } from "@/stores/user";
import { UserLevel } from "@/utils/enums";
import { useChannelStore } from "@/stores/channel";

const userStore = useUserStore()

onLoad(async () => {
    uni.showLoading({
        title: "加载中",
        mask: true
    })

    await userStore.getAccessToken()
    if (userStore.userLevel === UserLevel.Bound) {
        await userStore.getUserInfo()
    }
    await useChannelStore().getChannelList()
    uni.reLaunch({
        url: "/pages/order/order"
    })
})
</script>