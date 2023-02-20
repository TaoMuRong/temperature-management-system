import Joi from 'joi'
import Router from 'koa-router'

import validate from '../libs/validate'
import { JsonResp } from '../libs/stats'
import * as unmaskService from '../services/unmaskService'
import loginCheck from '../middlewares/loginCheck'

const router = new Router({
  prefix: '/api/unmask',
})

// 添加未带口罩人员信息
router.post('/add', async (ctx) => {
  const value = validate(
    ctx.request.body,
    Joi.object({
      name: Joi.string().max(20).required(),
      temperature: Joi.number().required(),
      filename: Joi.string().min(8).required(),
      createdAt: Joi.number().required(),
    })
  )
  const _id = await unmaskService.add(value)
  ctx.body = new JsonResp({ _id })
})

// 未带口罩人数总结
router.get('/countUnmask', loginCheck, async (ctx) => {
  const result = await unmaskService.countUnmask()
  ctx.body = new JsonResp(result)
})

// 未带口罩人员列表
router.get('/list', loginCheck, async (ctx) => {
  const { current, pageSize, condition, name } = validate(
    ctx.query,
    Joi.object({
      name: Joi.string().default(''),
      condition: Joi.string().default('all'),
      current: Joi.number().integer().min(0).default(1),
      pageSize: Joi.number().integer().min(1).max(20).default(5),
    })
  )
  const data = await unmaskService.list(name, current, pageSize, condition)
  ctx.body = new JsonResp(data)
})

// 未带口罩人员体温和时间列表
router.get('/chartList', loginCheck, async (ctx) => {
  const data = await unmaskService.chartList()
  ctx.body = new JsonResp(data)
})

export default router.routes()