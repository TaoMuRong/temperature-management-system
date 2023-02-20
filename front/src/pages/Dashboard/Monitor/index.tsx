import { listVideo } from '@/services/temperature/file';
import { PlaySquareTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, List, message, Row } from 'antd';
import { useEffect, useState } from 'react';

const Monitor = () => {
  const [videoList, setVideoList] = useState<API.IListVideoResult[]>([]);
  const asyncFetch = async () => {
    const result = await listVideo();
    if (result.success) {
      setVideoList(result.data);
    } else message.error(result.errorMessage);
  };

  useEffect(() => {
    asyncFetch();
  }, []);

  const [videoSrc, setVideoSrc] = useState(-1);

  return (
    <PageContainer>
      <Row gutter={24}>
        <Col xl={18} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <Card title="监控视频回放" bordered={false}>
            <video
              src={`/api/file/fetchVideo?index=${videoSrc}`}
              controls
              style={{ width: '100%' }}
              autoPlay
            ></video>
          </Card>
        </Col>
        <Col xl={6} lg={24} md={24} sm={24} xs={24}>
          <Card title="监控视频列表" style={{ marginBottom: 24 }} bordered={false}>
            <List
              bordered
              dataSource={videoList}
              renderItem={(item, index) => (
                <List.Item
                  key={item.size}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setVideoSrc(index);
                  }}
                >
                  <List.Item.Meta
                    avatar={<PlaySquareTwoTone />}
                    title={`${item.size.toFixed(2)}MB`}
                    description={item.createdAt}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Monitor;
