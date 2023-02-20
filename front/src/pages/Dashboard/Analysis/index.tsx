import React, { useEffect, useState } from 'react';
import { Line, Bullet, Gauge } from '@ant-design/plots';
import { Card, Col, message, Row } from 'antd';
import { chartList, countUnmask } from '@/services/temperature/unmask';
import moment from 'moment';
import { PageContainer } from '@ant-design/pro-components';

const Analysis = () => {
  const [data, setData] = useState([] as { temperature: number; time: string }[]);
  const [bulletData, setBulletData] = useState([] as any[]);
  const [todayVal, setTodayVal] = useState<number>();
  const ticks = [0, 1 / 3, 2 / 3, 1];
  const color = ['#30BF78', '#FAAD14', '#F4664A'];

  const asyncFetch = async () => {
    const result = await chartList();
    if (result.success) {
      let chartArr = [] as { temperature: number; time: string }[];
      result.data.map((value) =>
        chartArr.push({
          temperature: value.temperature,
          time: moment(value.createdAt).format('HH:mm:ss'),
        }),
      );
      setData(chartArr);
    } else message.error(result.errorMessage);

    const bulletResult = await countUnmask();
    if (bulletResult.success) {
      let allData = bulletResult.data;
      // 场所总人数为基数
      setTodayVal(allData.today / 100);
      let tempData = [
        {
          title: '时间占比',
          measures: Object.values(allData),
          target: allData.all,
          ranges: [allData.week, allData.month, allData.year],
        },
      ];
      setBulletData(tempData);
    } else message.error(bulletResult.errorMessage);
  };

  useEffect(() => {
    asyncFetch();
  }, []);

  // 折线图
  const lineConfig = {
    data,
    padding: 'auto',
    xField: 'time',
    yField: 'temperature',
    color: '#52c41a',
    yAxis: {
      min: 32,
      title: {
        text: '体温',
      },
    },
    slider: {
      start: 0,
      end: 1,
    },
    annotations: [
      {
        type: 'regionFilter',
        start: ['min', 36.5],
        end: [36.5, 'max'],
        color: '#F4664A',
      },
      {
        type: 'text',
        position: ['min', 36.5],
        content: '体温异常线',
        offsetY: -4,
        style: {
          textBaseline: 'bottom',
        },
      },
      {
        type: 'line',
        start: ['min', 36.5],
        end: ['max', 36.5],
        style: {
          stroke: '#F4664A',
          lineDash: [2, 2],
        },
      },
    ],
  };

  // 子弹图
  const bulletConfig = {
    data: bulletData,
    measureField: 'measures',
    rangeField: 'ranges',
    targetField: 'target',
    xField: 'title',
    color: {
      range: ['#bfeec8', '#FFe0b0', '#FFbcb8'],
      measure: ['#62d9ab', '#74cbed', '#6395f9', '#7666f9', 'black'],
      target: 'red',
    },
    label: {
      measure: {
        position: 'middle',
        style: {
          fill: '#fff',
        },
      },
    },
    xAxis: {
      line: null,
    },
    yAxis: false,
    tooltip: {
      showMarkers: false,
      shared: true,
    },
    legend: {
      custom: true,
      position: 'bottom',
      items: [
        {
          value: '周占比',
          name: '周占比',
          marker: {
            symbol: 'square',
            style: {
              fill: '#bfeec8',
              r: 5,
            },
          },
        },
        {
          value: '月占比',
          name: '月占比',
          marker: {
            symbol: 'square',
            style: {
              fill: '#FFe0b0',
              r: 5,
            },
          },
        },
        {
          value: '年占比',
          name: '年占比',
          marker: {
            symbol: 'square',
            style: {
              fill: '#FFbcb8',
              r: 5,
            },
          },
        },
        {
          value: '今日',
          name: '今日',
          marker: {
            symbol: 'square',
            style: {
              fill: '#62d9ab',
              r: 5,
            },
          },
        },
        {
          value: '本周',
          name: '本周',
          marker: {
            symbol: 'square',
            style: {
              fill: '#74cbed',
              r: 5,
            },
          },
        },
        {
          value: '本月',
          name: '本月',
          marker: {
            symbol: 'square',
            style: {
              fill: '#6395f9',
              r: 5,
            },
          },
        },
        {
          value: '今年',
          name: '今年',
          marker: {
            symbol: 'square',
            style: {
              fill: '#7666f9',
              r: 5,
            },
          },
        },
        {
          value: '总共',
          name: '总共',
          marker: {
            symbol: 'line',
            style: {
              stroke: '#39a3f4',
              r: 5,
            },
          },
        },
      ],
    },
  };

  // 仪表盘
  const gaugeConfig = {
    percent: todayVal,
    range: {
      ticks: [0, 1],
      color: ['l(0) 0:#30BF78 0.5:#FAAD14 1:#F4664A'],
    },
    indicator: {
      pointer: {
        style: {
          stroke: '#D0D0D0',
        },
      },
      pin: {
        style: {
          stroke: '#D0D0D0',
        },
      },
    },
    statistic: {
      title: {
        formatter: ({ percent }) => {
          if (percent < ticks[1]) {
            return '安全';
          }

          if (percent < ticks[2]) {
            return '警告';
          }

          return '危险';
        },
        style: ({ percent }) => {
          return {
            fontSize: '36px',
            lineHeight: 1,
            color: percent < ticks[1] ? color[0] : percent < ticks[2] ? color[1] : color[2],
          };
        },
      },
    },
  };

  return (
    <PageContainer>
      <Card title="今日温度检测变化图">
        <Line {...lineConfig} />;
      </Card>
      <Row
        gutter={24}
        style={{
          marginTop: 24,
        }}
      >
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Card title="未戴口罩占比图">
            <Bullet {...bulletConfig}></Bullet>
          </Card>
        </Col>
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Card title="疫情预警">
            <Gauge {...gaugeConfig}></Gauge>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Analysis;
