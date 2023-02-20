import Joi from 'joi'
import Router from 'koa-router'

import validate from '../libs/validate'
import { JsonResp } from '../libs/stats'
import * as sessionService from '../services/session'

const router = new Router({
  prefix: '/api/v1/cookie',
})

router.get('/set', async (ctx) => {
  const { sid } = validate(
    ctx.query,
    Joi.object({
      sid: Joi.string().required(),
    })
  )
  await sessionService.setSession(sid)
  ctx.cookies.set('session_id', sid)
  ctx.body = new JsonResp('ok')
})

router.get('/get', async (ctx) => {
  const sid = ctx.cookies.get('session_id')
  const session = await sessionService.getSession(sid)
  ctx.body = new JsonResp(session)
})

export default router.routes()
