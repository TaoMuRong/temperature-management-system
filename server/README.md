# 数据库数据结构

```typescript
// 用户
export interface IUser {
  // 账号
  account: string
  // 昵称
  nickname: string
  // 加密之后的密码
  password: string
  // 密码加密的盐
  salt: string
  // 创建时间
  createdAt: number
}

// 会话
export interface ISession {
  // session id
  sid: string
  // 关联的用户_id
  userId: ObjectId
  // 登录的ip地址
  ip: string
  // 创建时间
  createdAt: Date
}

// 文件信息
export interface IFile {
  // 文件_id
  _id: string
  // 文件名
  title: string
  // 内容
  content: string
  // 是否是文件夹
  folder: boolean
  // 是否被分享
  shared: boolean
  // 父文件夹的_id
  parentId: ObjectId
  // 用户_id
  userId: string
  // 修改时间
  modifyAt: number
  // 创建时间
  createdAt: number
}

// 分享文件信息
export interface ISharedFile {
  // 分享文件_id
  _id: string
  // 文件名
  title: string
  // 内容
  content: string
  // 关联的文件_id
  fileId: string
  // 用户_id
  userId: ObjectId
  // 观看次数
  watchTime: number
  // 创建时间
  createdAt: number
}
```



# API列表

### User

- 注册

```ts
URL: /api/user/register
Method: POST
Body: {
  account: string
  nickname: string
  password: string
}
```

- 登录

```ts
URL: /api/user/login
Method: POST
Body: {
  account: string
  password: string
}
```

- 退出登录

```ts
URL: /api/user/logout
Method: POST
```

- 获取用户信息

```ts
URL: /api/user/getInfo
Method: GET
```

- 修改密码

```ts
URL: /api/user/changePwd
Method: POST
Body: {
  oldPassword: string
  newPassword: string
}
```

### File

- 获取文件列表

```ts
URL: /api/file/list
Method: POST
Body: {
  condition?: string
  skip?: number
  limit?: number
  parentId?: string
}
```

- 添加文件

```ts
URL: /api/file/add
Method: POST
Body: {
  title: string
  folder: boolean
  parentId: string
}
```

- 更新文件

```ts
URL: /api/file/update
Method: POST
Body: {
    _id: string
    content: string
}
```

- 删除文件

```ts
URL: /api/file/delete
Method: POST
Body: {
    _id: string
}
```

- 查看文件

```ts
URL: /api/file/view
Method: POST
Body: {
  _id: string
}
```

- 文件重命名

```ts
URL: /api/file/rename
Method: POST
Body: {
  _id: string
  title: string
}
```

### Shae

- 分享文件

```typescript
URL: /api/share/share
Method: POST
Body: {
    // 文件的_id
    _id: string
}
```

- 其他用户查看分享的文件

```typescript
URL: /api/share/view
Method: POST
Body: {
    // 被分享的文件的_id
    _id: string
}
```

- 取消分享文件

```typescript
URL: /api/file/cancel
Method: POST
Body: {
    // 文件的_id
    _id: string
}
```