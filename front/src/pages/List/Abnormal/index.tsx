import { del, listAbnormal } from '@/services/temperature/abnormal';
import { getImg } from '@/services/temperature/file';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Card, Image, List, message, Modal, Popconfirm, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import styles from './style.less';

const { Paragraph, Text } = Typography;

const Abnormal = () => {
  const [list, setList] = useState([] as API.IAbnormal[]);
  const { info } = Modal;

  useEffect(() => {
    async function fetchData() {
      const { success, errorMessage, data } = await listAbnormal();
      if (success) {
        console.log(data);
        setList(data);
      } else message.error(errorMessage);
    }
    fetchData();
  }, []);

  const content = (
    <div className={styles.pageHeaderContent}>
      <Text type="danger">
        体温异常详情：以下为体温异常高危人群，请认真对待，仔细核查相关信息，如有必要请前往现场排查。
      </Text>
      <div className={styles.contentLink}>
        <a onClick={() => history.push('/list/student')}>
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" />{' '}
          学生列表
        </a>
        <a onClick={() => history.push('/list/unmask')}>
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg" />{' '}
          未戴口罩列表
        </a>
      </div>
    </div>
  );

  const extraContent = (
    <div className={styles.extraImg}>
      <img
        alt="这是一个标题"
        src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
      />
    </div>
  );

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
    <PageContainer content={content} extraContent={extraContent}>
      <div className={styles.cardList}>
        <List
          rowKey={(record) => record.filename + Date.now()}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={[...list]}
          renderItem={(item, index) => {
            return (
              <List.Item key={item.createdAt}>
                <Card
                  hoverable
                  className={styles.card}
                  actions={[
                    <a key="option1" onClick={() => showImg(item.filename)}>
                      查看
                    </a>,
                    <Popconfirm
                      key="confirm"
                      title="删除管理员"
                      description="确定删除管理员？此操作不可逆！"
                      onConfirm={async () => {
                        try {
                          const msg = await del(item._id);
                          if (msg.success) {
                            list.splice(index, 1);
                            setList([...list]);
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
                  ]}
                >
                  <Card.Meta
                    avatar={
                      <img
                        alt="浏览图片"
                        className={styles.cardAvatar}
                        src={item.base64}
                        onClick={() => showImg(item.filename)}
                      />
                    }
                    title={<Text type="danger">{item.temperature}</Text>}
                    description={
                      <>
                        <Paragraph className={styles.item} ellipsis={{ rows: 3 }}>
                          {moment(item.createdAt).format('YYYY-MM-DD HH:mm')}
                        </Paragraph>
                        <Paragraph className={styles.item} ellipsis={{ rows: 3 }}>
                          {item.filename}
                        </Paragraph>
                      </>
                    }
                  />
                </Card>
              </List.Item>
            );
          }}
        />
      </div>
    </PageContainer>
  );
};

export default Abnormal;
