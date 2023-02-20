import { del, listStudent, update } from '@/services/temperature/student';
import { ExclamationCircleFilled } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProCoreActionType,
  ProForm,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';

import { Popconfirm, message, Modal, Descriptions } from 'antd';
import { SorterResult } from 'antd/es/table/interface';
import React, { useRef, useState } from 'react';

const Student = () => {
  const actionRef = useRef<ActionType>();
  const currentRecord = useRef({} as API.IStudent);
  const { confirm } = Modal;
  const [params, setParams] = useState<API.IListStudent>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const editStudent = (action: ProCoreActionType) => {
    confirm({
      title: '修改学生信息',
      icon: <ExclamationCircleFilled />,
      closable: true,
      maskClosable: true,
      content: (
        <>
          <ProForm
            initialValues={currentRecord.current}
            onFinish={async (values: API.IStudent) => {
              try {
                const msg = await update(values);
                if (msg.success) {
                  message.success('修改成功');
                  Modal.destroyAll();
                  action.reload();
                } else message.error(msg.errorMessage);
              } catch (error) {
                console.log(error);
              }
            }}
          >
            <ProFormText name="name" label="姓名" rules={[{ required: true }]} />
            <ProFormText name="college" label="学院" rules={[{ required: true }]} />
            <ProFormText name="speciality" label="专业" rules={[{ required: true }]} />
            <ProFormText name="studentId" label="学号" disabled />
          </ProForm>
        </>
      ),
      footer: null,
    });
  };

  const columns: ProColumns<API.IStudent>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },

    {
      title: '姓名',
      dataIndex: 'name',
      ellipsis: true,
      copyable: true,
      sorter: true,
      search: false,
      render: (text, record) => {
        return [
          <a
            key="name"
            onClick={() => {
              setIsModalOpen(true);
              currentRecord.current = record;
            }}
          >
            {text}
          </a>,
          <Modal
            key="studentDetial"
            title="学生详细信息"
            open={isModalOpen}
            onOk={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
            mask={false}
            footer={false}
          >
            <Descriptions column={1} bordered>
              <Descriptions.Item label="姓名"> {currentRecord.current.name}</Descriptions.Item>
              <Descriptions.Item label="学院"> {currentRecord.current.college}</Descriptions.Item>
              <Descriptions.Item label="专业">
                {' '}
                {currentRecord.current.speciality}
              </Descriptions.Item>
              <Descriptions.Item label="学号"> {currentRecord.current.studentId}</Descriptions.Item>
            </Descriptions>
          </Modal>,
        ];
      },
    },
    {
      title: '专业',
      dataIndex: 'speciality',
      ellipsis: true,
    },
    {
      title: '学院',
      dataIndex: 'college',
      ellipsis: true,
    },
    {
      title: '学号',
      dataIndex: 'studentId',
      sorter: true,
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      render: (text, record, index, action) => {
        return [
          <a
            href="#"
            key="edit"
            onClick={() => {
              currentRecord.current = record;
              editStudent(action as ProCoreActionType);
            }}
          >
            编辑
          </a>,
          <Popconfirm
            key="confirm"
            title="删除管理员"
            description="确定删除管理员？此操作不可逆！"
            onConfirm={async () => {
              try {
                const msg = await del(record.studentId);
                if (msg.success) {
                  action?.reload();
                  message.success('删除成功');
                } else message.error(msg.errorMessage);
              } catch (error) {
                console.log(error);
              }
            }}
            okText="确认"
            cancelText="取消"
          >
            <a key="update">删除</a>,
          </Popconfirm>,
        ];
      },
    },
  ];

  return (
    <ProTable<API.IStudent>
      columns={columns}
      params={params}
      rowKey={(record) => record.studentId}
      actionRef={actionRef}
      headerTitle="管理员列表"
      request={async (params) => {
        const msg = await listStudent({
          condition: params.condition,
          current: params.current,
          pageSize: params.pageSize,
          order: params.order,
          college: params.college,
          speciality: params.speciality,
        });
        return { data: msg.data.result, success: msg.success, total: msg.data.total };
      }}
      pagination={{
        pageSize: 10,
      }}
      onChange={(pagination, filters, sorter) => {
        const sort = sorter as SorterResult<API.IListAdminResult>;
        if (sort.field && sort.order)
          setParams({ condition: sort.field as string, order: sort.order });
      }}
    />
  );
};

export default Student;
