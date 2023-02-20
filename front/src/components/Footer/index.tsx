import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  const defaultMessage = '计算机科学与技术1901班'

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'HuBei University',
          title: '湖北大学',
          href: 'https://hubu.edu.cn/',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://gitee.com/taomurong',
          blankTarget: true,
        },
        {
          key: 'hubu csi',
          title: '计算机与信息工程学院',
          href: 'https://csi.hubu.edu.cn/',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
