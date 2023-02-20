import { addAdmin } from '@/services/temperature/admin';
import { PageContainer, ProFormText, StepsForm } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Alert, Button, Card, Descriptions, Divider, message, Result } from 'antd';
import React, { useState } from 'react';

const AddAdmin = () => {
  const [formData, setFormData] = useState<API.IAddAdmin>({} as API.IAddAdmin);

  const handleSubmit = async () => {
    try {
      const msg = await addAdmin(formData);
      if (msg.success) {
        message.success('添加成功！');
        return true;
      } else {
        message.error(msg.errorMessage);
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <PageContainer>
      <Card title="添加管理员">
        <StepsForm
          submitter={{
            render: (props, dom) => {
              if (props.step === 2) {
                return null;
              }
              return dom;
            },
          }}
        >
          <StepsForm.StepForm
            title="添加管理员"
            onFinish={async (values) => {
              setFormData(values as API.IAddAdmin);
              return true;
            }}
          >
            <ProFormText
              name="account"
              label="账号"
              rules={[{ required: true }]}
              placeholder="请输入"
            />
            <ProFormText
              name="nickname"
              label="昵称"
              rules={[{ required: true }]}
              placeholder="请输入"
            />
            <ProFormText
              name="password"
              label="密码"
              rules={[{ required: true, min: 8 }]}
              placeholder="请输入"
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm
            title="确认管理员信息"
            onFinish={async () => {
              const flag = await handleSubmit();
              return flag;
            }}
          >
            <Alert closable showIcon message="确定管理员信息无误" style={{ marginBottom: 24 }} />
            <Descriptions column={1} bordered>
              <Descriptions.Item label="账号"> {formData.account}</Descriptions.Item>
              <Descriptions.Item label="昵称"> {formData.nickname}</Descriptions.Item>
              <Descriptions.Item label="密码"> {formData.password}</Descriptions.Item>
            </Descriptions>
            <Divider style={{ margin: '24px 0' }} />
          </StepsForm.StepForm>
          <StepsForm.StepForm title="完成">
            <Result
              status="success"
              title="添加成功"
              subTitle="点击查看管理员列表"
              extra={
                <Button type="primary" onClick={() => history.replace('/SuperAdmin/list')}>
                  管理员列表
                </Button>
              }
            ></Result>
          </StepsForm.StepForm>
        </StepsForm>
      </Card>
    </PageContainer>
  );
};

export default AddAdmin;
