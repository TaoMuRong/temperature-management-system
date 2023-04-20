import Joi from 'joi'
import Router from 'koa-router'

import validate from '../libs/validate'
import { JsonResp } from '../libs/stats'
import * as abnormalService from '../services/abnormalService'
import loginCheck from '../middlewares/loginCheck'

const router = new Router({
  prefix: '/api/abnormal',
})

// 添加体温异常人员信息
router.post('/add', async (ctx) => {
  const value = validate(
    ctx.request.body,
    Joi.object({
      temperature: Joi.number().required(),
      filename: Joi.string().min(8).required(),
      createdAt: Joi.number().required(),
    })
  )
  const text = await abnormalService.add(value)
  ctx.body = new JsonResp(text)
})

// 删除体温异常人员
router.post('/del', async (ctx) => {
  const {_id} = validate(
    ctx.request.body,
    Joi.object({
      _id: Joi.string().required(),
    })
  )
  const data = await abnormalService.del(_id)
  ctx.body = new JsonResp(data)
})

// 体温异常人员列表
router.get('/list', loginCheck, async (ctx) => {
  const data = await abnormalService.list()
  ctx.body = new JsonResp(data)
})

export default router.routes()
