import { MongoClient, Collection } from 'mongodb'
import { IAdmin, ISession, IStudent, IUnmask, IAbnormal } from './models/types'

export let admin: Collection<IAdmin>
export let student: Collection<IStudent>
export let unmask: Collection<IUnmask>
export let abnormal: Collection<IAbnormal>
export let session: Collection<ISession>

export async function init() {
  const client = new MongoClient(process.env.MONGO_URL)
  await client.connect()
  const db = client.db()
  admin = db.collection('admin')
  student = db.collection('students')
  unmask = db.collection('unmask')
  abnormal = db.collection('abnormal')
  session = db.collection('session')
  // admin.insertOne({account: "admin",
  //   nickname: "admin",
  //   isSuperAdmin: true,
  //   password: "fd8dc5614aae88cec0fff148c86988342d245ee3",
  //   salt: "9db584c23efea3ace94c3320",
  //   createdAt: 1658374042295})
  // 创建唯一索引
  admin.createIndex(
    {
      account: 1,
      nickname: 1,
    },
    { unique: true }
  )
  student.createIndex(
    {
      studentId: 1,
    },
    { unique: true }
  )
  // 创建TTL索引
  session.createIndex({ createdAt: 1 }, { expireAfterSeconds: 1209600 })
}
