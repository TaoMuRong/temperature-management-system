// @ts-ignore
/* eslint-disable */

declare namespace API {
  type IAdmin = {
    _id: string;
    avatar: string;
    // 账号
    account: string;
    // 昵称
    nickname: string;
    // 是否是超级管理员
    isSuperAdmin: boolean;
    createdAt: number;
  };

  type IAddAdmin = {
    account: string;
    nickname: string;
    password: string;
  };

  type IListAdmin = {
    condition?: string;
    current?: number;
    pageSize?: number;
    order?: string;
  };

  type IListAdminResult = {
    isSuperAdmin: boolean;
    account: string;
    nickname: string;
    createdAt: number;
  };

  type ILogin = {
    // 账号
    account: string;
    // 密码
    password: string;
  };

  type ILoginResult = {
    status?: string;
    type?: string;
  };

  type IChangePwd = {
    // 旧密码
    oldPassword: string;
    // 新密码
    newPassword: string;
    // 确认新密码
    confirmPwd: string;
  };

  type IStudent = {
    _id: string;
    // 姓名
    name: string;
    // 专业
    speciality: string;
    // 学院
    college: string;
    // 学号
    studentId: number;
  };

  type IListStudent = {
    condition?: string;
    current?: number;
    pageSize?: number;
    order?: string;
    college?: string;
    speciality?: string;
  };

  type IAddStudent = {
    // 姓名
    name: string;
    // 专业
    speciality: string;
    // 学院
    college: string;
    // 学号
    studentId: number;
  };

  type IUnmask = {
    _id: string;
    // 姓名
    name: string;
    // 体温
    temperature: number;
    // 抓拍文件名
    filename: string;
    // 创建时间
    createdAt: number;
    base64: string;
  };

  type IUnmaskList= {
    name?: string;
    condition?: string;
    current?: number;
    pageSize?: number;
  }

  type IAddUnmask = {
    // 姓名
    name: string;
    // 体温
    temperature: number;
    // 抓拍文件名
    filename: string;
    // 创建时间
    createdAt: number;
  };

  type IAbnormal = {
    _id: string;
    // 体温
    temperature: number;
    // 创建时间
    createdAt: number;
    // 抓拍文件名
    filename: string;
    base64: string;
  };

  type IAddAbnormal = {
    // 体温
    temperature: number;
    // 创建时间
    createdAt: number;
    // 抓拍文件名
    filename: string;
  };

  type TableListPagination = {
    total: number;
    pageSize: number;
    current: number;
  };

    type IListVideoResult = {
      createdAt : string,
      size: number
    }

  type ICountUnmsk = {
    today: number;
    week: number;
    month: number;
    year: number;
    all: number;
  };

  type ApiResp<T = any> = {
    code: number;
    errorMessage: string;
    data: T;
    success: boolean;
  };
}
