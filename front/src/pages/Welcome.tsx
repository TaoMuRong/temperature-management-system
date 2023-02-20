import { PageContainer } from '@ant-design/pro-components';
import { useModel, history } from '@umijs/max';
import { Card, theme } from 'antd';
import React from 'react';

/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */
const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: string;
  href: string;
}> = ({ title, href, index, desc }) => {
  const { useToken } = theme;

  const { token } = useToken();

  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        fontSize: '14px',
        color: token.colorTextSecondary,
        lineHeight: '22px',
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            lineHeight: '22px',
            backgroundSize: '100%',
            textAlign: 'center',
            padding: '8px 16px 16px 12px',
            color: '#FFF',
            fontWeight: 'bold',
            backgroundImage:
              "url('https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
          }}
        >
          {index}
        </div>
        <div
          style={{
            fontSize: '16px',
            color: token.colorText,
            paddingBottom: 8,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          fontSize: '14px',
          color: token.colorTextSecondary,
          textAlign: 'justify',
          lineHeight: '22px',
          marginBottom: 8,
        }}
      >
        {desc}
      </div>
      <a onClick={() => history.push(href)}>去看看 {'>'}</a>
    </div>
  );
};

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
        bodyStyle={{
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '580px 220px',
            backgroundImage:
              "url('/images/院徽.png')",
          }}
        >
          <div
            style={{
              fontSize: '20px',
              color: token.colorTextHeading,
            }}
          >
            欢迎使用 智能体温防控系统
          </div>
          <p
            style={{
              fontSize: '14px',
              color: token.colorTextSecondary,
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 32,
              width: '50%',
            }}
          >
            智能体温防控系统 是一个整合了 防控管理终端， 防控管理后台，防控管理后端
            和 数据库
            的测温管理一体化解决方案。致力于在无感测温防控的基础上，加上智能化管理后台，人、温关联，进一步提升测温的方便性和管理的统一性。
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <InfoCard
              index={1}
              href="/dashboard/analysis"
              title="分析页"
              desc="分析页用各式各样的图表准确而高效、精简而全面地展示了当前场所的体温和人员相关信息。对疫情情况进行数据统计分析，多维度对数据图形展示，曲线分析，辅助防疫决策。"
            />
            <InfoCard
              index={2}
              title="监控页"
              href="/dashboard/monitor"
              desc="监控页可用于实现实时视频查看、历史视频回看。监测现场体温异常、未穿戴口罩的情况，以便疫情的及时发现和处置。"
            />
            <InfoCard
              index={3}
              title="体温异常列表"
              href="/list/abnormal"
              desc="体温异常列表可以查看体温异常人员相关信息，浏览抓拍到的图片等功能。"
            />
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
