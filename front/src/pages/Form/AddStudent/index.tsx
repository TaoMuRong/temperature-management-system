import React from 'react';
import { Card, message } from 'antd';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { add } from '@/services/temperature/student';
import { history } from '@umijs/max';

const AddStudent = () => {
  const containerClassName = useEmotionCss(() => {
    return {
      minWidth: 280,
      maxWidth: '800px',
      margin: 'auto',
    };
  });

  const handleSubmit = async (values: API.IAddStudent) => {
    try {
      const msg = await add(values);
      if (msg.success) {
        message.success('添加成功！');
        history.replace('/list/student');
      } else message.error(msg.errorMessage);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card title="添加学生信息">
      <ProForm
        className={containerClassName}
        onFinish={async (values) => {
          await handleSubmit(values as API.IAddStudent);
        }}
      >
        <ProFormText name="name" label="姓名" rules={[{ required: true }]} placeholder="如：胡涛" />
        <ProFormText
          name="college"
          label="学院"
          rules={[{ required: true }]}
          placeholder="如：计算机与信息工程学院"
        />
        <ProFormText
          name="speciality"
          label="专业"
          rules={[{ required: true }]}
          placeholder="如：计算机科学与技术1901班"
        />
        <ProFormText
          name="studentId"
          label="学号"
          rules={[{ required: true, len: 15 }]}
          placeholder="如：201931119020201"
        />
      </ProForm>
    </Card>
  );
};

export default AddStudent;
