// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 通过名字获取学生信息 POST /api/student/getInfoByName */
export async function getInfoByName(name: string, options?: { [key: string]: any }) {
  return request<API.ApiResp<API.IStudent>>('/api/student/getInfoByName', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { name },
    ...(options || {}),
  });
}

/** 学生列表列表 GET /api/student/listStudent */
export async function listStudent(params: API.IListStudent, options?: { [key: string]: any }) {
  return request<API.ApiResp<{ result: API.IStudent[]; total: number }>>(
    '/api/student/listStudent',
    {
      method: 'GET',
      params,
      ...(options || {}),
    },
  );
}

/** 添加学生 POST /api/student/add */
export async function add(body: API.IAddStudent, options?: { [key: string]: any }) {
  return request<API.ApiResp<string>>('/api/student/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新学生信息 POST /api/student/update */
export async function update(body: API.IAddStudent, options?: { [key: string]: any }) {
  return request<API.ApiResp<string>>('/api/student/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除学生 POST /api/student/delete */
export async function del(studentId: number, options?: { [key: string]: any }) {
  return request<API.ApiResp<string>>('/api/student/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { studentId },
    ...(options || {}),
  });
}
