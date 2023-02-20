/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  { path: '/welcome', name:'欢迎',icon: 'smile', component: './Welcome' },
  {
    path: '/dashboard',
    icon: 'dashboard',
    name: '数据展示',
    routes: [
      { path: '/dashboard', redirect: '/dashboard/analysis' },
      { path: '/dashboard/analysis', name:'分析页',component: './Dashboard/Analysis' },
      { path: '/dashboard/monitor', name:'监控页',component: './Dashboard/Monitor' },
    ],
  },
  {
    name:'表单页',
    path: '/form',
    icon: 'form',
    routes: [
      { path: '/form', redirect: '/form/basic-form' },
      { path: '/form/add-student',name:'添加学生', component: './Form/AddStudent' },
    ],
  },
  {
    name:'超级管理员',
    path: '/SuperAdmin',
    icon: 'crown',
    access: 'canSuperAdmin',
    routes: [
      { path: '/SuperAdmin', redirect: '/SuperAdmin/add' },
      { path: '/SuperAdmin/add',name:'添加管理员', component: './Admin/AddAdmin' },
      { path: '/SuperAdmin/list',name:'管理员列表', component: './Admin/ListAdmin' },
    ],
  },
  {
    name:'列表页',
    path: '/list',
    icon: 'unorderedList',
    routes: [
      { path: '/list', redirect: '/list/student' },
      { path: '/list/student',name:'学生列表', component: './List/Student' },
      { path: '/list/unmask', name:'未带口罩',component: './List/Unmask' },
      { path: '/list/abnormal', name:'体温异常',component: './List/Abnormal' },
    ],
  },
  {
    name:'个人主页',
    path: '/account',
    icon: 'user',
    routes: [
      { path: '/account', redirect: '/account/center' },
      { path: '/account/center',name:'个人中心', component: './User/UserCenter' },
      { path: '/account/change-password', name:'修改密码',component: './User/ChangePwd' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
