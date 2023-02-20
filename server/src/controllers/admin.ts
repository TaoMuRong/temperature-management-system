import Joi from 'joi'
import Router from 'koa-router'

import validate from '../libs/validate'
import { JsonResp } from '../libs/stats'
import * as adminService from '../services/adminService'
import { createSession } from '../services/session'
import loginCheck from '../middlewares/loginCheck'

const router = new Router({
  prefix: '/api/admin',
})

// 用户登录
router.post('/login', async (ctx) => {
  const value = validate(
    ctx.request.body,
    Joi.object({
      account: Joi.string().max(20).required(),
      password: Joi.string().min(8).max(20).required(),
    })
  )
  const userId = await adminService.login(value)
  const sessionId = await createSession(userId, ctx.request.ip)
  ctx.cookies.set('session_id', sessionId)
  ctx.body = new JsonResp('登录成功')
})

// 获取用户信息
router.get('/getInfo', loginCheck, async (ctx) => {
  const user = await adminService.getInfo(ctx.state.user)
  ctx.body = new JsonResp(user)
})

// 添加管理员
router.post('/addAdmin', loginCheck, async (ctx) => {
  const value = validate(
    ctx.request.body,
    Joi.object({
      account: Joi.string().max(20).required(),
      nickname: Joi.string().max(20).required(),
      password: Joi.string().min(8).max(20).required(),
    })
  )
  const _id = await adminService.addAdmin(value, ctx.state.user)
  ctx.body = new JsonResp({ _id })
})

// 管理员列表
router.get('/listAdmin', loginCheck, async (ctx) => {
  const { condition, current, pageSize, order } = validate(
    ctx.query,
    Joi.object({
      condition: Joi.string().default('createdAt'),
      current: Joi.number().integer().min(0).default(1),
      pageSize: Joi.number().integer().min(1).max(20).default(10),
      order: Joi.string().default('ascend'),
    })
  )
  const data = await adminService.listAdmin(
    ctx.state.user,
    condition,
    current,
    pageSize,
    order
  )
  ctx.body = new JsonResp(data)
})

// 删除管理员
router.post('/delAdmin', loginCheck, async (ctx) => {
  const { account } = validate(
    ctx.request.body,
    Joi.object({
      account: Joi.string().max(20).required(),
    })
  )
  const data = await adminService.delAdmin(account, ctx.state.user)
  ctx.body = new JsonResp(data)
})

// 修改密码
router.post('/changePwd', loginCheck, async (ctx) => {
  const value = validate(
    ctx.request.body,
    Joi.object({
      oldPassword: Joi.string().min(8).max(20).required(),
      newPassword: Joi.string().min(8).max(20).required(),
    })
  )
  const data = await adminService.changePwd(value, ctx.state.user)
  ctx.cookies.set('session_id', '')
  ctx.state.user = null
  ctx.body = new JsonResp(data)
})

// 退出登录
router.post('/logout', loginCheck, async (ctx) => {
  const data = await adminService.logout(ctx.state.user)
  ctx.cookies.set('session_id', '')
  ctx.state.user = null
  ctx.body = new JsonResp(data)
})

export default router.routes()
