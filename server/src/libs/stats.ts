/**
 * 统一JSON返回封装类
 */
export class JsonResp {
  code: number
  success: boolean
  data?: any

  constructor(data?: any, code = 0, success = true) {
    this.data = data
    this.code = code
    this.success = success
  }
}

/**
 * 错误状态
 */
export class ErrorStat extends JsonResp {
  errorMessage: string
  status: number

  constructor(code: number, errorMessage: string, status = 200) {
    super(undefined, code,false)
    this.errorMessage = errorMessage
    this.status = status
  }

  toJSON() {
    return {
      code: this.code,
      errorMessage: this.errorMessage,
      success: this.success,
    }
  }
}

/**
 * 业务状态错误码
 */
export const stats = {
  ErrUserNotFound: new ErrorStat(20001, '账号不存在', 404),
  ErrAccountNotEmpty: new ErrorStat(20002, '账号已存在'),
  ErrNicknameNotEmpty: new ErrorStat(20003, '昵称已存在'),
  ErrPassword: new ErrorStat(20004, '密码错误'),
  ErrNotLogin: new ErrorStat(20005, '用户未登录', 401),
  ErrStudentNotFound: new ErrorStat(30001, '该学生不存在'),
  ErrSIDWrong: new ErrorStat(30002, '学号必须为15位数字'),
  ErrStudentNotEmpty: new ErrorStat(30003, '该学生已存在'),
  ErrDuplicateFileName: new ErrorStat(30004, '文件重名'),
  ErrTimeSame: new ErrorStat(30005, '不能在同一时间创建'),
  ErrIDNotFind: new ErrorStat(30006, 'id不存在'),
  ErrFileNotFind: new ErrorStat(30007, '文件不存在'),
  ErrTimeSpace: new ErrorStat(30008, '两次请求要间隔三秒'),
  ErrSessionNotFound: new ErrorStat(40001, '会话不存在'),
  ErrNoPermission: new ErrorStat(40002, '无操作权限'),
}
