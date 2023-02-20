import 'dotenv/config'
import Koa from 'koa'
import KoaBody from 'koa-body'

import admin from './controllers/admin'
import student from './controllers/student'
import unmask from './controllers/unmask'
import abnormal from './controllers/abnormal'
import file from './controllers/file'
import session from './controllers/session'
import logger from './middlewares/logger'
import checkError from './middlewares/checkError'
import * as db from './db'

const app = new Koa({keys: JSON.parse(process.env.KEYS)})
app.use(logger)
app.use(checkError)
app.use(KoaBody())
app.use(admin)
app.use(student)
app.use(unmask)
app.use(abnormal)
app.use(file)
app.use(session)

async function run() {
  // 先等待数据库连接
  await db.init()
  // 监听端口
  app.listen(process.env.PORT, () => {
    console.log('监听端口：', process.env.PORT)
  })
}

run()
