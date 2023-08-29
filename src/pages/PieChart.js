import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Container} from 'semantic-ui-react';

import {Chart, ArcElement} from 'chart.js'
Chart.register(ArcElement);
const PieChart = ({ data }) => {
  const shouldShowChart = data.score
  const scoreMappings = {
    "最low": [80, 20],
    "中low": [80, 20],
    "小low": [80, 20],
    "最mid": [50, 50],
    "中mid": [50, 50],
    "小mid": [50, 50],
    "小high": [20, 80],
    "中high": [20, 80],
    "最high": [20, 80],
    
  };
  const chartData = {
    labels: ['現金', '股票'],
    datasets: [
      {
        data: shouldShowChart ? scoreMappings[data.score] : [0, 0],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label + ': ' + value + '%'; // 自訂標籤內容，這個例子是將標籤和數值拼接起來
        },
      },
    },
  };
  const chartContainerStyle = {
    width: '400px', // 調整容器寬度以容納圖表和圖例
    display: 'flex',
    alignItems: 'center', // 垂直居中對齊
  };

  const legendStyle = {
    marginTop: '20px', // 調整圖例與圖表之間的間距
  };

  return (
    <Container>
    <div>
      {shouldShowChart ? (
        <div style={chartContainerStyle}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>投資組合比例</h2>
          <Pie data={chartData} options={chartOptions}/>
          <div style={legendStyle}>
          <p style={{ color: '#FF6384' }}>股票 {chartData.datasets[0].data[1]}%</p>
          <p style={{ color: '#36A2EB' }}>現金 {chartData.datasets[0].data[0]}%</p>
          </div>
        </div>
      ) : (
        <p>無資料
        </p>
      )}
    </div>
    </Container>
  );
};

export default PieChart;
