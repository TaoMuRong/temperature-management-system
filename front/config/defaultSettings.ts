import { Settings as LayoutSettings } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  menu:  {
    locale: false,
  },
  title: '图书馆防控管理后台',
  pwa: false,
  logo: 'https://ts1.cn.mm.bing.net/th/id/R-C.b899efbf1136a4429dd8bc227cf439dc?rik=pR5TdLSQnzr6SA&riu=http%3a%2f%2fwww.xingxiancn.com%2fueditor%2fphp%2fupload%2fimage%2f20190710%2f1562715490436448.gif&ehk=4Cw4%2bCJ76fdwa61rk57IS%2fDX0AbqnWLiapG2%2bp8iH1w%3d&risl=&pid=ImgRaw&r=0',
  iconfontUrl: '',
};

export default Settings;
