import { IStudent, IAdmin } from '../models/types'
import * as db from '../db'
import { stats } from '../libs/stats'
import { SortDirection } from 'mongodb'

/**
 * 通过名字获取学生信息
 * @param name
 * @returns
 */
export async function getInfoByName(name: string) {
  const student = await db.student.findOne({ name })
  if (!student) throw stats.ErrUserNotFound
  return student
}

const searchStudent = async (
  condition: string,
  skip: number,
  pageSize: number,
  order: number,
  college: string,
  speciality: string
) => {
  let str = { studentId: 1 } as { [key: string]: SortDirection }
  switch (condition) {
    case 'studentId':
      str = { studentId: order } as { [key: string]: SortDirection }
      break
    case 'name':
      str = { name: order } as { [key: string]: SortDirection }
      break
    default:
      break
  }
  let searchStr = {}
  college
    ? (searchStr = { college: new RegExp(college) })
    : speciality
    ? (searchStr = { speciality: new RegExp(speciality) })
    : { undefined }

  const result = await db.student
    .find(searchStr)
    .sort(str)
    .skip(skip)
    .limit(pageSize)
    .toArray()
  const total = await db.student.countDocuments(searchStr)

  return { result, total }
}

/**
 * 查看学生列表
 * @param condition
 * @param speciality
 * @param college
 * @param current
 * @param pageSize
 * @param order
 * @returns
 */
export async function listStudent(
  condition: string,
  speciality: string,
  college: string,
  current: number,
  pageSize: number,
  order: string
) {
  let skip = (current - 1) * pageSize
  const orderMap = { ascend: 1, descend: -1 }
  const result = await searchStudent(
    condition,
    skip,
    pageSize,
    orderMap[order],
    college,
    speciality
  )
  return result
}

/**
 * 添加学生
 * @param name
 * @param speciality
 * @param college
 * @param studentId
 * @returns
 */
export async function add(
  name: string,
  speciality: string,
  college: string,
  studentId: number
) {
  if (studentId.toString().length !== 15) throw stats.ErrSIDWrong
  const data = await db.student.findOne({ studentId })
  if (data) throw stats.ErrStudentNotEmpty
  const student = {
    name,
    speciality,
    college,
    studentId,
  } as IStudent
  const result = await db.student.insertOne(student)
  return '成功添加学生'
}

/**
 * 更新学生信息
 * @param student
 * @returns
 */
export async function update(student: IStudent) {
  const studentId = await db.student.findOne({ studentId: student.studentId })
  if (!studentId) throw stats.ErrStudentNotFound
  await db.student.updateOne(
    { studentId: studentId.studentId },
    {
      $set: {
        name: student.name,
        speciality: student.speciality,
        college: student.college,
        studentId: student.studentId,
      },
    }
  )
  return '更新成功'
}

/**
 * 删除学生
 * @param studentId
 * @returns
 */
export async function del(studentId: number) {
  const student = await db.student.findOne({ studentId })
  if (!student) throw stats.ErrStudentNotFound
  await db.student.deleteOne({ studentId })
  return '删除成功'
}
