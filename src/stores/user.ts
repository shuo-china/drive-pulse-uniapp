import {
  getAccessTokenApi,
  getCurrentUserInfoApi,
  improveUserInfoApi,
} from "@/api/user";
import { UserLevel } from "@/utils/enums";
import { defineStore } from "pinia";
import { ref } from "vue";

interface UserInfo {
  id: number;
  uid: string;
  nickname: string;
  avatarPath: string;
  status: number;
  auditStatus: number;
}

export const useUserStore = defineStore("user", () => {
  const token = ref<Nullable<string>>(null);
  const userInfo = ref<Nullable<UserInfo>>(null);
  const userLevel = ref<UserLevel>(UserLevel.Anonymous);

  function getAccessToken() {
    return new Promise((resolve, reject) => {
      uni.login({
        provider: "weixin",
        success: (res) => {
          if (res.errMsg === "login:ok") {
            getAccessTokenApi({
              code: res.code,
            })
              .then((res) => {
                token.value = res.token_info.access_token;
                userLevel.value = res.level;
                resolve(res);
              })
              .catch((err) => {
                reject(err);
              });
          }
        },
        fail(err) {
          reject(err);
        },
      });
    });
  }

  function getUserInfo() {
    return new Promise((resolve, reject) => {
      getCurrentUserInfoApi()
        .then((res) => {
          if (res.status === 0) {
            uni.reLaunch({
              url: "/pages/status/status?type=banned",
            });
            reject(res);
            return;
          }
          const info = {
            id: res.id,
            uid: res.uid,
            nickname: res.nickname,
            avatarPath: res.avatar_path,
            status: res.status,
            auditStatus: res.audit_status,
          };
          userInfo.value = info;
          resolve(info);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async function improveUserInfo(data) {
    await improveUserInfoApi(data);
    await getAccessToken();
    await getUserInfo();
  }

  return {
    token,
    userInfo,
    userLevel,
    getAccessToken,
    getUserInfo,
    improveUserInfo,
  };
});
