import React from 'react';
import { Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Container} from 'semantic-ui-react';

export default function PortfolioDashboard({ data }) {
  if (!data) {
    return <p>等等哦...</p>;
  }

  const resultTimeStampsSet = new Set(data['result_time_stamps']);
  const combinedData = data['0050_time_stamps'].map((timeStamp) => ({
    date: timeStamp,
    '0050累積報酬率': data['0050_return'][data['0050_time_stamps'].indexOf(timeStamp)],
    '策略累積報酬率': resultTimeStampsSet.has(timeStamp) ? data['result_values'][data['result_time_stamps'].indexOf(timeStamp)] : null,
  }));
  // 將日期轉換成年份
  const uniqueYears = new Set();
  data['result_time_stamps'].forEach(timestamp => {
    const year = new Date(timestamp).getFullYear();
    uniqueYears.add(year);
  });

  // 計算不同年份的數量

  return (
    <Container>
      <div>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold', color: 'orange' }}>
      🐕 柴原廣進策略
      </h1>
      <ResponsiveContainer width="100%" height={300}>
                <LineChart width={600} height={300} data={combinedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend wrapperStyle={{ background: 'hsla(0, 0%, 95%, 0.8)', padding: '10px', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="策略累積報酬率" stroke="hsla(30, 100%, 50%, 1)" dot={{ stroke: 'hsla(30, 100%, 50%, 1)', fill: 'hsla(30, 100%, 50%, 1)'}} connectNulls={true}/>
                  <Line type="monotone" dataKey="0050累積報酬率" stroke="hsla(280, 50%, 45%, 1)" dot={{ stroke: 'hsla(280, 50%, 45%, 1)', fill: 'hsla(280, 50%, 45%, 1)' }} connectNulls={true}/>
                  <Area type="monotone" dataKey="策略累積報酬率" fill="hsla(30, 100%, 50%, 0.5)" />
        <Area type="monotone" dataKey="0050累積報酬率" fill="hsla(280, 50%, 45%, 0.5)" />
                </LineChart>
      </ResponsiveContainer>
      </div>
    </Container>
  );
};
