import Joi from 'joi'
import Router from 'koa-router'
import loginCheck from '../middlewares/loginCheck'
import * as fileService from '../services/fileService'

import validate from '../libs/validate'
import { JsonResp } from '../libs/stats'

const router = new Router({
  prefix: '/api/file',
})

router.get('/getImg', loginCheck, async (ctx) => {
  const { filename } = validate(
    ctx.query,
    Joi.object({
      filename: Joi.string().required(),
    })
  )
  const data = await fileService.getImg(filename)
  ctx.body = data
})

router.get('/listVideo', loginCheck, async (ctx) => {
  const data = await fileService.listVideo()
  ctx.body = new JsonResp(data)
})

router.get('/fetchVideo', loginCheck, async (ctx) => {
  const { index } = validate(
    ctx.query,
    Joi.object({
      index: Joi.number().integer().min(0).required(),
    })
  )
  ctx.body = new JsonResp('ok')
  await fileService.fetchVideo(index, ctx)
})

export default router.routes()
