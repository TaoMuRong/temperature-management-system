import * as crypto from 'crypto'
import { ObjectId } from 'mongodb'

import { ISession } from '../models/types'
import * as db from '../db'
import { stats } from '../libs/stats'

/**
 * nextjs设置session
 * @param sid
 * @returns
 */
export async function setSession(sid: string) {
  const session = await db.session.findOne({ sid })
  if (!session) throw stats.ErrSessionNotFound
}

/**
 * 获取session
 * @param sid
 * @returns
 */
export async function getSession(sid: string) {
  const session = await db.session.findOne({ sid })
  if (!sid || !session) {
    throw stats.ErrSessionNotFound
  }
  return session
}

/**
 * 浏览器创建session
 * @param adminId
 * @param ip
 * @returns
 */
export async function createSession(adminId: ObjectId, ip: string) {
  const sid = crypto.randomBytes(12).toString('hex')
  const session = {
    sid,
    adminId,
    ip,
    createdAt: new Date(),
  } as ISession
  await db.session.insertOne(session)
  return sid
}
