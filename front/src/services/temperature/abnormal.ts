// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 添加体温异常人员信息 POST /api/abnormal/add */
export async function add(body: API.IAddAbnormal, options?: { [key: string]: any }) {
  return request<API.ApiResp<{ _id: string }>>('/api/abnormal/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除体温异常人员 POST /api/abnormal/del */
export async function del(_id: string, options?: { [key: string]: any }) {
  return request<API.ApiResp<string>>('/api/abnormal/del', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { _id },
    ...(options || {}),
  });
}

/** 体温异常人员列表 GET /api/abnormal/list */
export async function listAbnormal(options?: { [key: string]: any }) {
  return request<API.ApiResp<API.IAbnormal[]>>('/api/abnormal/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}
