import request from "@/utils/request";
import { HttpRequestConfig } from "luch-request";

export function getNoticeApi(options?: HttpRequestConfig) {
  return request({
    method: "GET",
    url: "/notice/index",
    ...options,
  });
}
