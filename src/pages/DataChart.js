import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Container} from 'semantic-ui-react';

export default function DataChart({ data }) {
  if (!data) {
    return <p>Loading dashboard...</p>;
  }

  const chartData = [];
  for (let year in data.future_salaries) {
    chartData.push({
      year: parseInt(year) + 1,
      total_incomes: data.total_incomes[year],
      total_expenses: data.total_expenses[year],
    });
  }
  


  // 計算不同年份的數量

  return (
    <Container>
      <LineChart width={800} height={400} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="total_incomes" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="total_expenses" stroke="#82ca9d" />
      </LineChart>
    </Container>
  );
};
