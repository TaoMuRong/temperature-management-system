import * as crypto from 'crypto'

import { IAdmin } from '../models/types'
import * as db from '../db'
import { stats } from '../libs/stats'
import { ObjectId, SortDirection, WithId } from 'mongodb'

interface IChangePwd {
  oldPassword: string
  newPassword: string
}

/**
 * 用户登录
 * @param user
 * @returns
 */
export async function login(user: IAdmin) {
  const userinfo = await db.admin.findOne({
    account: user.account,
  })
  if (!userinfo) throw stats.ErrUserNotFound
  const confirmPwd = crypto
    .createHmac('sha1', userinfo.salt)
    .update(user.password)
    .digest('hex')
  if (confirmPwd !== userinfo.password) throw stats.ErrPassword
  return userinfo._id
}

/**
 * 获取用户信息
 * @param userinfo
 * @returns
 */
export async function getInfo(userinfo: WithId<IAdmin>) {
  Reflect.deleteProperty(userinfo, 'password')
  Reflect.deleteProperty(userinfo, 'salt')
  return userinfo
}

/**
 * 添加管理员
 * @param user
 * @param userInfo
 * @returns
 */
export async function addAdmin(user: IAdmin, userInfo: WithId<IAdmin>) {
  if (!userInfo.isSuperAdmin) throw stats.ErrNoPermission
  const account = await db.admin.findOne({
    account: user.account,
  })
  const nickname = await db.admin.findOne({
    nickname: user.nickname,
  })
  if (account) throw stats.ErrAccountNotEmpty
  if (nickname) throw stats.ErrNicknameNotEmpty
  user.salt = crypto.randomBytes(12).toString('hex')
  user.createdAt = Date.now()
  user.isSuperAdmin = false
  user.password = crypto
    .createHmac('sha1', user.salt)
    .update(user.password)
    .digest('hex')
  const result = await db.admin.insertOne(user)
  return result.insertedId
}

const searchAdmin = async (
  condition: string,
  skip: number,
  pageSize: number,
  order: number
) => {
  let str = { createdAt: 1 } as { [key: string]: SortDirection }
  switch (condition) {
    case 'nickname':
      str = { nickname: order } as { [key: string]: SortDirection }
      break
    case 'createdAt':
      str = { createdAt: order } as { [key: string]: SortDirection }
      break
    default:
      break
  }

  const result = await db.admin
    .find()
    .sort(str)
    .skip(skip)
    .limit(pageSize)
    .project({ account: 1, nickname: 1, createdAt: 1, isSuperAdmin: 1 })
    .toArray()
  const total = await db.admin.countDocuments()

  return { result, total }
}

/**
 * 管理员列表
 * @param userInfo
 * @param condition
 * @param current
 * @param pageSize
 * @param order 1代表正序，-1代表倒序
 * @returns
 */
export async function listAdmin(
  userInfo: WithId<IAdmin>,
  condition: string,
  current: number,
  pageSize: number,
  order: string
) {
  if (!userInfo.isSuperAdmin) throw stats.ErrNoPermission
  let skip = (current - 1) * pageSize
  const orderMap = { ascend: 1, descend: -1 }
  const result = await searchAdmin(condition, skip, pageSize, orderMap[order])
  return result
}

/**
 * 删除管理员
 * @param account
 * @param userInfo
 * @returns
 */
export async function delAdmin(account: string, userInfo: WithId<IAdmin>) {
  if (!userInfo.isSuperAdmin) throw stats.ErrNoPermission
  let user = await db.admin.findOne({
    account: account,
  })
  if (!user) throw stats.ErrUserNotFound
  await db.admin.deleteOne({ account: account })
  return '删除成功'
}

/**
 * 修改密码
 * @param user
 * @param userInfo
 * @returns
 */
export async function changePwd(user: IChangePwd, userInfo: WithId<IAdmin>) {
  const confirmPwd = crypto
    .createHmac('sha1', userInfo.salt)
    .update(user.oldPassword)
    .digest('hex')
  if (confirmPwd !== userInfo.password) throw stats.ErrPassword
  const salt = crypto.randomBytes(12).toString('hex')
  const password = crypto
    .createHmac('sha1', salt)
    .update(user.newPassword)
    .digest('hex')
  // 更改密码并且删除有关session
  await db.admin.updateOne(
    {
      _id: new ObjectId(userInfo._id),
    },
    {
      $set: { password, salt },
    }
  )
  await db.session.deleteMany({ userId: userInfo._id })
  return '密码修改成功'
}

/**
 * 退出登录
 * @param userInfo
 * @returns
 */
export async function logout(userInfo: WithId<IAdmin>) {
  await db.session.deleteMany({ userId: userInfo._id })
  return '成功登出'
}
