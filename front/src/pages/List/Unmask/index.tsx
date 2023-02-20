import { getImg } from '@/services/temperature/file';
import { getInfoByName } from '@/services/temperature/student';
import { countUnmask, list } from '@/services/temperature/unmask';
import { PageContainer } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import {
  Avatar,
  Card,
  Col,
  Descriptions,
  Image,
  Input,
  List,
  message,
  Modal,
  PaginationProps,
  Radio,
  Row,
  Typography,
} from 'antd';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';

import styles from './style.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;
const { Text } = Typography;

const Info: FC<{
  title: React.ReactNode;
  value: React.ReactNode;
  bordered?: boolean;
}> = ({ title, value, bordered }) => (
  <div className={styles.headerInfo}>
    <span>{title}</span>
    <p>{value}</p>
    {bordered && <em />}
  </div>
);

const ListContent = ({ data: { temperature, createdAt } }: { data: API.IUnmask }) => (
  <div className={styles.listContent}>
    <div className={styles.listContentItem}>
      <span>温度</span>
      <p>
        {temperature > 37.3 ? (
          <Text type="danger">{temperature}</Text>
        ) : (
          <Text type="success">{temperature}</Text>
        )}
      </p>
    </div>
    <div className={styles.listContentItem}>
      <span>时间</span>
      <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p>
    </div>
  </div>
);

const Unmask = () => {
  const { info } = Modal;
  const [countUnmasks, setCountUnmasks] = useState<API.ICountUnmsk>({
    today: 0,
    week: 0,
    month: 0,
    year: 0,
    all: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      const result = await countUnmask();
      if (result.success) setCountUnmasks(result.data);
      else message.error(result.errorMessage);
    };
    fetchCounts();
  }, []);

  const { data: listData, loading } = useRequest(() => {
    return list({ condition: 'all' });
  });

  const [unmaskList, setUnmaskList] = useState({
    list: listData?.result || [],
    search: undefined,
    condition: undefined,
  });

  const paginationProps: PaginationProps = {
    showQuickJumper: true,
    pageSize: 5,
    total: listData?.total,
    async onChange(page) {
      const result = await list({
        condition: unmaskList.condition,
        name: unmaskList.search,
        current: page,
      });
      if (result.success) {
        setUnmaskList({
          list: result.data.result,
          search: unmaskList.search,
          condition: unmaskList.condition,
        });
      } else {
        message.error(result.errorMessage);
      }
    },
  };

  const extraContent = (
    <div className={styles.extraContent}>
      <RadioGroup
        defaultValue="today"
        onChange={async (e) => {
          let name = undefined;
          if (unmaskList.search !== '') name = unmaskList.search;
          const result = await list({ condition: e.target.value, name });
          if (result.success) {
            paginationProps.total = result.data.total;
            setUnmaskList({ list: result.data.result, search: name, condition: e.target.value });
          } else {
            message.error(result.errorMessage);
          }
        }}
      >
        <RadioButton value="all">全部</RadioButton>
        <RadioButton value="today">今日</RadioButton>
        <RadioButton value="week">本周</RadioButton>
        <RadioButton value="month">本月</RadioButton>
      </RadioGroup>
      <Search
        className={styles.extraContentSearch}
        placeholder="请输入"
        onSearch={async (value) => {
          const result = await list({ condition: unmaskList.condition, name: value });
          if (result.success) {
            paginationProps.total = result.data.total;
            setUnmaskList({
              list: result.data.result,
              search: value as any,
              condition: unmaskList.condition,
            });
          } else {
            message.error(result.errorMessage);
          }
        }}
      />
    </div>
  );

  const showStudent = async (name: string) => {
    const result = await getInfoByName(name);
    if (result.success) {
      info({
        title: '学生详情信息',
        closable: true,
        maskClosable: true,
        content: (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="姓名"> {result.data.name}</Descriptions.Item>
            <Descriptions.Item label="专业"> {result.data.speciality}</Descriptions.Item>
            <Descriptions.Item label="学院"> {result.data.college}</Descriptions.Item>
            <Descriptions.Item label="学号"> {result.data.studentId}</Descriptions.Item>
          </Descriptions>
        ),
        footer: null,
      });
    } else message.error(result.errorMessage);
  };

  const showImg = async (filename: string) => {
    const url = await getImg(filename);
    const src = window.URL.createObjectURL(url);
    info({
      title: '抓拍照片查看',
      closable: true,
      maskClosable: true,
      content: <Image src={src} alt="图片详情" />,
      footer: null,
    });
  };

  return (
    <PageContainer>
      <div className={styles.standardList}>
        <Card bordered={false}>
          <Row>
            <Col sm={8} xs={24}>
              <Info title="今日未带口罩" value={countUnmasks.today} bordered />
            </Col>
            <Col sm={8} xs={24}>
              <Info title="本周未带口罩" value={countUnmasks.week} bordered />
            </Col>
            <Col sm={8} xs={24}>
              <Info title="本月未带口罩" value={countUnmasks.month} />
            </Col>
          </Row>
        </Card>

        <Card
          className={styles.listCard}
          bordered={false}
          title="未戴口罩人员列表"
          style={{ marginTop: 24 }}
          bodyStyle={{ padding: '0 32px 40px 32px' }}
          extra={extraContent}
        >
          <List
            size="large"
            rowKey={(record) => record.filename + Date.now()}
            loading={loading}
            pagination={paginationProps}
            dataSource={[...unmaskList.list]}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <>
                    {item.name === 'unknow' ? (
                      <p>无法查看</p>
                    ) : (
                      <a
                        key={item.createdAt}
                        onClick={() => {
                          if (item.name !== 'unknow') showStudent(item.name);
                        }}
                      >
                        查看
                      </a>
                    )}
                  </>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      shape="square"
                      size="large"
                      src={item.base64}
                      onClick={() => showImg(item.filename)}
                      style={{ cursor: 'pointer' }}
                    />
                  }
                  title={
                    <a
                      onClick={() => {
                        if (item.name !== 'unknow') showStudent(item.name);
                      }}
                    >
                      {item.name}
                    </a>
                  }
                  description={item.filename}
                />
                <ListContent data={item} />
              </List.Item>
            )}
          />
        </Card>
      </div>
    </PageContainer>
  );
};

export default Unmask;
