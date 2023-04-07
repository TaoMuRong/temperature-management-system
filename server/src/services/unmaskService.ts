import { IUnmask } from '../models/types'
import * as db from '../db'
import { stats } from '../libs/stats'
import * as fs from 'fs'

/**
 * 添加未带口罩人员信息
 * @param unmask
 * @returns
 */
export async function add(unmask: IUnmask) {
  const filename = await db.unmask.findOne({ filename: unmask.filename })
  if (filename && (unmask.createdAt - filename.createdAt) / 1000 < 3)
    throw stats.ErrTimeSpace
  const createdAt = await db.unmask.findOne({ createdAt: unmask.createdAt })
  if (createdAt) throw stats.ErrTimeSame
  await db.unmask.insertOne(unmask)
  return '添加成功'
}

/**
 * 未带口罩人数总结
 * @returns
 */
export async function countUnmask() {
  const currentTime = new Date().getTime()
  let today = currentTime - 1000 * 60 * 60 * 24
  let week = currentTime - 1000 * 60 * 60 * 24 * 7
  let month = currentTime - 1000 * 60 * 60 * 24 * 7 * 30
  let year = currentTime - 1000 * 60 * 60 * 24 * 7 * 30 * 12
  today = await db.unmask.countDocuments({ createdAt: { $gt: today } })
  week = await db.unmask.countDocuments({ createdAt: { $gt: week } })
  month = await db.unmask.countDocuments({ createdAt: { $gt: month } })
  year = await db.unmask.countDocuments({ createdAt: { $gt: year } })
  let all = await db.unmask.countDocuments()
  return { today, week, month, year, all }
}

/**
 * 未带口罩人员列表
 * @param condition
 * @param current
 * @param pageSize
 * @returns
 */
export async function list(
  name: string,
  current: number,
  pageSize: number,
  condition: string
) {
  const skip = (current - 1) * pageSize
  const currentTime = new Date().getTime()
  let today = currentTime - 1000 * 60 * 60 * 24
  let week = currentTime - 1000 * 60 * 60 * 24 * 7
  let month = currentTime - 1000 * 60 * 60 * 24 * 7 * 30
  let searchName = {}
  name ? (searchName = { name: new RegExp(name) }) : {}
  let str = {}
  switch (condition) {
    case 'today':
      str = { createdAt: { $gt: today } }
      break
    case 'week':
      str = { createdAt: { $gt: week } }
      break
    case 'month':
      str = { createdAt: { $gt: month } }
      break
    default:
      break
  }
  let searchStr = Object.assign(str, searchName)
  const result = await db.unmask
    .find(searchStr)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .toArray()
  const total = await db.unmask.countDocuments(searchStr)
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
  return { result, total }
}

/**
 * 未带口罩人员体温和时间列表
 * @returns
 */
export async function chartList() {
  const today = new Date().getTime() - 1000 * 60 * 60 * 24
  const result = await db.unmask
    .find({ createdAt: { $gt: today } })
    .project({ temperature: 1, createdAt: 1 })
    .toArray()
  return result
}
