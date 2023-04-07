import { IAbnormal } from '../models/types'
import * as db from '../db'
import { stats } from '../libs/stats'
import { ObjectId } from 'mongodb'
import * as fs from 'fs'

/**
 * 添加体温异常人员信息
 * @param abnormal
 * @returns
 */
export async function add(abnormal: IAbnormal) {
  const filename = await db.abnormal.findOne({ filename: abnormal.filename })
  if (filename && (abnormal.createdAt - filename.createdAt) / 1000 < 3)
    throw stats.ErrTimeSpace
  const createdAt = await db.abnormal.findOne({ createdAt: abnormal.createdAt })
  if (createdAt) throw stats.ErrTimeSame
  await db.abnormal.insertOne(abnormal)
  return '添加成功'
}

/**
 * 体温异常人员列表
 * @returns
 */
export async function list() {
  const result = await db.abnormal.find().sort({ createdAt: -1 }).toArray()
  result.forEach((value) => {
    // let fileDir = `E:/DeepLearning/ComputerVision/yolov7/yolov7-main/utils/nomask_people/${value.filename}`
    let fileDir = `/data/management/nomask_people/${value.filename}`
    let exists = fs.existsSync(fileDir)
    let fileData = ''
    if (exists) {
      fileData = fs.readFileSync(fileDir, 'base64')
    }
    value['base64'] = 'data:image/jpg;base64,' + fileData
  })
  return result
}

/**
 * 删除体温异常人员
 * @param _id
 * @returns
 */
export async function del(id: string) {
  const result = await db.abnormal.deleteOne({ _id: new ObjectId(id) })
  if (result.deletedCount !== 1) throw stats.ErrIDNotFind
  return '删除成功'
}
