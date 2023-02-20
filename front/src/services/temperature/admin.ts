// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 登录 POST /api/admin/login */
export async function login(body: API.ILogin, options?: { [key: string]: any }) {
  return request<API.ApiResp<string>>('/api/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取用户信息 GET /api/admin/getInfo */
export async function getInfo(options?: { [key: string]: any }) {
  return request<API.ApiResp<API.IAdmin>>('/api/admin/getInfo', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 添加管理员 Post /api/admin/addAdmin */
export async function addAdmin(body: API.IAddAdmin, options?: { [key: string]: any }) {
  return request<API.ApiResp<{ _id: string }>>('/api/admin/addAdmin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除管理员 Post /api/admin/delAdmin */
export async function delAdmin(account: string, options?: { [key: string]: any }) {
  return request<API.ApiResp<{ _id: string }>>('/api/admin/delAdmin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { account },
    ...(options || {}),
  });
}

/** 管理员列表 GET /api/admin/listAdmin */
export async function listAdmin(params: API.IListAdmin, options?: { [key: string]: any }) {
  return request<API.ApiResp<{ result: API.IListAdminResult[]; total: number }>>(
    '/api/admin/listAdmin',
    {
      method: 'GET',
      params,
      ...(options || {}),
    },
  );
}

/** 修改密码 Post /api/admin/changePwd */
export async function changePwd(body: API.IChangePwd, options?: { [key: string]: any }) {
  return request<API.ApiResp<{ _id: string }>>('/api/admin/changePwd', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 退出登录 Post /api/admin/logout */
export async function logout(options?: { [key: string]: any }) {
  return request<API.ApiResp<{ _id: string }>>('/api/admin/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}
