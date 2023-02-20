import React from 'react';
import { LoginForm, PageContainer, ProFormText } from '@ant-design/pro-components';
import { CheckCircleOutlined, LockOutlined, StopOutlined } from '@ant-design/icons';
import { changePwd } from '@/services/temperature/admin';
import { message } from 'antd';
import { history } from '@umijs/max';
import { stringify } from 'querystring';

const ChangePwd = () => {
  const handleSubmit = async (values: API.IChangePwd) => {
    try {
      // 登录
      const msg = await changePwd(values);
      if (msg.success) {
        message.success('修改成功！');
        const { search, pathname } = window.location;
        const urlParams = new URL(window.location.href).searchParams;
        /** 此方法会跳转到 redirect 参数所在的位置 */
        const redirect = urlParams.get('redirect');
        // Note: There may be security issues, please note
        if (window.location.pathname !== '/user/login' && !redirect) {
          history.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: pathname + search,
            }),
          });
        }
        return;
      }
      console.log(msg);
      message.error(msg.errorMessage);
    } catch (error) {
      console.log(error);
      message.error('修改密码失败，请重试！');
    }
  };

  return (
    <PageContainer>
      <LoginForm
        title="修改密码"
        subTitle=" "
        submitter={{
          searchConfig: {
            submitText: '确认修改',
          },
        }}
        onFinish={async (values) => {
          await handleSubmit(values as API.IChangePwd);
        }}
      >
        {
          <>
            <ProFormText.Password
              name="oldPassword"
              fieldProps={{
                size: 'large',
                prefix: <StopOutlined className={'prefixIcon'} />,
              }}
              placeholder={'原密码'}
              rules={[
                {
                  required: true,
                  min: 8,
                  message: '原密码长度至少为八位!',
                },
              ]}
            />
            <ProFormText.Password
              name="newPassword"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
              }}
              placeholder={'新密码'}
              rules={[
                {
                  required: true,
                  min: 8,
                  message: '新密码长度至少为八位!',
                },
              ]}
            />
            <ProFormText.Password
              name="confirmPwd"
              fieldProps={{
                size: 'large',
                prefix: <CheckCircleOutlined className={'prefixIcon'} />,
              }}
              placeholder={'确认新密码'}
              rules={[
                {
                  required: true,
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (value && getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('两次密码输入不一致');
                  },
                }),
              ]}
            />
          </>
        }
      </LoginForm>
    </PageContainer>
  );
};

export default ChangePwd;
