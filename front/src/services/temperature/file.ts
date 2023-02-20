import { request } from '@umijs/max';

/** 获取图片 GET /api/file/getImg */
export async function getImg(filename: string) {
  return await request<Blob>('/api/file/getImg', {
    method: 'GET',
    params: { filename },
    responseType: 'blob',
  });
}

/** 获取视频列表 GET /api/file/listVideo */
export async function listVideo() {
  return await request<API.ApiResp<API.IListVideoResult[]>>('/api/file/listVideo', {
    method: 'GET',
  });
}
