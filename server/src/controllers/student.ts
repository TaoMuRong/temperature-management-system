import Joi from 'joi'
import Router from 'koa-router'

import validate from '../libs/validate'
import { JsonResp } from '../libs/stats'
import * as studentService from '../services/studentService'
import loginCheck from '../middlewares/loginCheck'

const router = new Router({
  prefix: '/api/student',
})

// 通过名字获取学生信息
router.post('/getInfoByName', loginCheck, async (ctx) => {
  const { name } = validate(
    ctx.request.body,
    Joi.object({
      name: Joi.string().required(),
    })
  )
  const data = await studentService.getInfoByName(name)
  ctx.body = new JsonResp(data)
})

// 通过专业或学院获取学生列表
router.get('/listStudent', loginCheck, async (ctx) => {
  const { condition, current, pageSize, speciality, college, order } = validate(
    ctx.query,
    Joi.object({
      speciality: Joi.string().default(''),
      condition: Joi.string().default(''),
      college: Joi.string().default(''),
      current: Joi.number().integer().min(0).default(1),
      pageSize: Joi.number().integer().min(1).max(20).default(10),
      order: Joi.string().default('ascend'),
    })
  )
  const data = await studentService.listStudent(
    condition,
    speciality,
    college,
    current,
    pageSize,
    order
  )
  ctx.body = new JsonResp(data)
})

// 添加学生
router.post('/add', loginCheck, async (ctx) => {
  const { name, speciality, college, studentId } = validate(
    ctx.request.body,
    Joi.object({
      name: Joi.string().required(),
      speciality: Joi.string().required(),
      college: Joi.string().required(),
      studentId: Joi.number().required(),
    })
  )
  const data = await studentService.add(name, speciality, college, studentId)
  ctx.body = new JsonResp(data)
})

// 更新学生信息
router.post('/update', loginCheck, async (ctx) => {
  const student = validate(
    ctx.request.body,
    Joi.object({
      name: Joi.string().required(),
      speciality: Joi.string().required(),
      college: Joi.string().required(),
      studentId: Joi.number().required(),
    })
  )
  const data = await studentService.update(student)
  ctx.body = new JsonResp(data)
})

// 删除学生
router.post('/delete', loginCheck, async (ctx) => {
  const { studentId } = validate(
    ctx.request.body,
    Joi.object({
      studentId: Joi.number().required(),
    })
  )
  const data = await studentService.del(studentId)
  ctx.body = new JsonResp(data)
})

export default router.routes()
