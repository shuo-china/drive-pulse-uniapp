import request from "@/utils/request";
import { HttpRequestConfig } from "luch-request";

export type Order = {
  id: number;
  user: {
    uid: string;
    nickname: string;
    avatar_path: string;
  };
  targetUser: {
    uid: string;
    nickname: string;
    avatar_path: string;
  };
  count: number;
  create_time: string;
};

export function getOrderPaginationApi(
  params: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request({
    method: "GET",
    url: "/order/pagination",
    params,
    ...options,
  });
}

export function createOrderApi(
  data: Record<string, any>,
  options?: HttpRequestConfig,
) {
  return request({
    url: "/order/create",
    method: "POST",
    data,
    ...options,
  });
}
