import { delAdmin, listAdmin } from '@/services/temperature/admin';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { message, Popconfirm, Space, Tag, Typography } from 'antd';
import { SorterResult } from 'antd/es/table/interface';
import React, { useRef, useState } from 'react';

const ListAdmin = () => {
  const { Text } = Typography;
  const actionRef = useRef<ActionType>();
  const [params, setParams] = useState<API.IListAdmin>({});

  const columns: ProColumns<API.IListAdminResult>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '账号',
      dataIndex: 'account',
      ellipsis: true,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      ellipsis: true,
      copyable: true,
      sorter: true,
      render: (_) => <a>{_}</a>,
    },
    {
      disable: true,
      title: '是否是超级管理员',
      dataIndex: 'isSuperAdmin',
      renderFormItem: (_, { defaultRender }) => {
        return defaultRender(_);
      },
      render: (_, record) => (
        <Space>
          {record.isSuperAdmin ? <Tag color="success">是</Tag> : <Tag color="error">否</Tag>}
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'date',
      sorter: true,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      render: (text, record, index, action) => {
        if (record.isSuperAdmin) {
          return [
            <Text type="danger" key="dangerText">
              无权限操作
            </Text>,
          ];
        } else
          return [
            <Popconfirm
              key="confirm"
              title="删除管理员"
              description="确定删除管理员？此操作不可逆！"
              onConfirm={async () => {
                try {
                  const msg = await delAdmin(record.account);
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
    <PageContainer>
      <ProTable<API.IListAdminResult>
        columns={columns}
        params={params}
        rowKey={(record) => record.account}
        actionRef={actionRef}
        headerTitle="管理员列表"
        request={async (params) => {
          const msg = await listAdmin({
            condition: params.condition,
            current: params.current,
            pageSize: params.pageSize,
            order: params.order,
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
        search={false}
      />
    </PageContainer>
  );
};

export default ListAdmin;
