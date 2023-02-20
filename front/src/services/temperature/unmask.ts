// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 添加未戴口罩人员信息 POST /api/unmask/add */
export async function add(body: API.IAddUnmask, options?: { [key: string]: any }) {
  return request<API.ApiResp<{ _id: string }>>('/api/unmask/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 通过姓名查看未戴口罩的人员 POST /api/unmask/listByName */
export async function listByName(body: API.IAddUnmask, options?: { [key: string]: any }) {
  return request<API.ApiResp<{ _id: string }>>('/api/unmask/listByName', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 未带口罩人数总结 GET /api/unmask/countUnmask */
export async function countUnmask(options?: { [key: string]: any }) {
  return request<API.ApiResp<API.ICountUnmsk>>('/api/unmask/countUnmask', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/** 未戴口罩人员列表 GET /api/unmask/list */
export async function list(params: API.IUnmaskList, options?: { [key: string]: any }) {
  return request<API.ApiResp<{ result: API.IUnmask[]; total: number }>>('/api/unmask/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params,
    ...(options || {}),
  });
}

/** 未带口罩人员体温和时间列表 GET /api/unmask/chartList */
export async function chartList(options?: { [key: string]: any }) {
  return request<API.ApiResp<API.IUnmask[]>>('/api/unmask/chartList', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}
