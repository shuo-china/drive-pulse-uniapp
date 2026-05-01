import request from "@/utils/request";
import { HttpRequestConfig } from "luch-request";

export function getAccessTokenApi(
  data: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request({
    method: "POST",
    url: "/access/createAccessToken",
    data,
    ...options,
  });
}

export function getCurrentUserInfoApi(options?: HttpRequestConfig) {
  return request({
    url: "/user/currentUser",
    method: "GET",
    ...options,
  });
}

export function improveUserInfoApi(
  data: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request({
    url: "/user/improve",
    method: "POST",
    data,
    ...options,
  });
}

export type UserOption = {
  id: number;
  uid: string;
  avatar_path: string;
  nickname: string;
};

export function getUserOptionsByChannelIdApi(
  channelId: number,
  options?: HttpRequestConfig,
) {
  return request({
    url: "/user/getOptionsByChannelId",
    method: "GET",
    params: { channel_id: channelId },
    ...options,
  });
}

export function getBalanceCountByChannelIdApi(
  channelId: number,
  options?: HttpRequestConfig,
) {
  return request({
    url: "/user/getBananceCountByChannelId",
    method: "GET",
    params: { channel_id: channelId },
    ...options,
  });
}
