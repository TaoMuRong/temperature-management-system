import { useEmotionCss } from '@ant-design/use-emotion-css';
import { useModel } from '@umijs/max';
import { Avatar, Form, Input, Typography } from 'antd';
import React from 'react';

const UserCenter = () => {
  const { initialState } = useModel('@@initialState');
  const user = initialState!.currentUser;

  const { Text } = Typography;
  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% auto',
      form: {
        width: '60vw',
        margin: 'auto',
      },
    };
  });

  const DataFormat = (time: number) => {
    let date = new Date(time);
    return date.toLocaleString();
  };

  return (
    <div className={containerClassName}>
      <Form
        name="account"
        initialValues={user}
        layout="vertical"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 8 }}
        size="large"
        disabled={true}
      >
        <Form.Item label="头像" name="avatar">
          <Avatar
            shape="square"
            size={{ xs: 48, sm: 64, md: 80, lg: 128, xl: 160, xxl: 200 }}
            src={user?.avatar}
          />
        </Form.Item>
        <Form.Item label="账号" name="account">
          <Input />
        </Form.Item>
        <Form.Item label="昵称" name="nickname">
          <Input />
        </Form.Item>
        <Form.Item label="是否是超级管理员" name="isSuperAdmin">
          {user?.isSuperAdmin ? (
            <Text strong type="success">
              是
            </Text>
          ) : (
            <Text strong type="danger">
              否
            </Text>
          )}
        </Form.Item>
        <Form.Item label="创建时间" name="createdAt">
          <Text strong type="success">
            {DataFormat(user!.createdAt)}
          </Text>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserCenter;
