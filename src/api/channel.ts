import request from "@/utils/request";
import { HttpRequestConfig } from "luch-request";

export function getChannelListApi(options?: HttpRequestConfig) {
  return request({
    method: "GET",
    url: "/channel/list",
    ...options,
  });
}

export function applyChannelApi(
  data: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request({
    url: "/channel/apply",
    method: "POST",
    data,
    ...options,
  });
}
