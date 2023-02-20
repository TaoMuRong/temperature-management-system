import { ObjectId } from 'mongodb'

// 管理员
export interface IAdmin {
  // 账号
  account: string
  // 昵称
  nickname: string
  // 是否是超级管理员
  isSuperAdmin: boolean
  // 加密之后的密码
  password: string
  // 密码加密的盐
  salt: string
  // 创建时间
  createdAt: number
}

// 会话
export interface ISession {
  // session id
  sid: string
  // 关联的管理员_id
  adminId: ObjectId
  // 登录的ip地址
  ip: string
  // 创建时间
  createdAt: Date
}

// 学生信息
export interface IStudent {
  // 姓名
  name: string
  // 专业
  speciality: string
  // 学院
  college: string
  // 学号
  studentId: number
}

// 未带口罩人员信息
export interface IUnmask {
  // 姓名
  name: string
  // 体温
  temperature: number
  // 抓拍文件名
  filename: string
  // 创建时间
  createdAt: number
}

// 体温异常人员信息
export interface IAbnormal {
  // 体温
  temperature: number
  // 创建时间
  createdAt: number
  // 抓拍文件名
  filename: string
}
