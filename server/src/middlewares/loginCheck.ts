import { Middleware } from 'koa'
import * as db from '../db'
import { stats } from '../libs/stats'

const loginCheck: Middleware = async (ctx, next) => {
  const session_id = ctx.cookies.get('session_id')
  const session = await db.session.findOne({ sid: session_id })
  if (!session) throw stats.ErrNotLogin
  const userInfo = await db.admin.findOne({ _id: session.adminId })
  if (!userInfo) throw stats.ErrUserNotFound
  ctx.state.user = userInfo
  await next()
}

export default loginCheck
