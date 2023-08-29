import React from 'react';
import { Container, List, Table} from 'semantic-ui-react';
import PieChart from './PieChart';
export default function PortfolioDashboard({ data }) {
  console.log(data);
  if (!data) {
    return <p>Loading dashboard...</p>;
  }

  const mean_return =  parseFloat(data.backtest_results.mean_return).toFixed(4)
  // 將日期轉換成年份
  const uniqueYears = new Set();
  data['result_time_stamps'].forEach(timestamp => {
    const year = new Date(timestamp).getFullYear();
    uniqueYears.add(year);
  });

  // 計算不同年份的數量
  const numberOfYears = uniqueYears.size;

  const al_return = parseFloat(data['result_values'][data['result_values'].length - 1]+1) ** (1/numberOfYears) -1
  
  // 在页面重新渲染时，清除al_return值

  function setSeesion() {
    sessionStorage.setItem('al_return', al_return.toFixed(2));
  }
  return (
    <Container>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ flex: 1, marginRight: '20px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>回測數據</h2>
      <List>
          <List.Item>
            <span role="img" aria-label="checkmark" style={{ marginRight: '8px' }}>⭐️</span>
            最大下跌 : {`${(data.backtest_results.max_drawdown * 100).toFixed(2)}%`}
          </List.Item>
          <List.Item>
            <span role="img" aria-label="checkmark" style={{ marginRight: '8px' }}>⭐️</span>
            平均月報酬 : {(mean_return * 100).toFixed(2)}%
          </List.Item>
          <List.Item>
            <span role="img" aria-label="checkmark" style={{ marginRight: '8px' }}>⭐️</span>
            平均年報酬 : {(al_return * 100).toFixed(2)}%
          </List.Item>
          <List.Item>
            <span role="img" aria-label="checkmark" style={{ marginRight: '8px' }}>⭐️</span>
            夏普比率(通常大於0為正績效策略) : {`${(data.backtest_results.sharpe_ratio * 100).toFixed(2)}%`}
          </List.Item>
          <List.Item>
            <span role="img" aria-label="checkmark" style={{ marginRight: '8px' }}>⭐️</span>
            勝率 : {`${(data.backtest_results.win_rate * 100).toFixed(2)}%`}
          </List.Item>
      </List>

                  </div>
                  <div style={{ flex: 1 }}>
                <Table >
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: 'lightgray' }}>每月推薦持股</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: 'lightgray' }}>股票代號</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: 'lightgray' }}>收盤價</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: 'lightgray' }}>每日成交金額(元)</th>
                    </tr>
                  </thead>
                  <Table.Body>
                  {Object.keys(data.stock_info).map((stockId) => (
          <Table.Row key={stockId}>
            <Table.Cell>{data.stock_info[stockId].名稱}</Table.Cell>
            <Table.Cell>{stockId}</Table.Cell>
            <Table.Cell>{data.stock_info[stockId].收盤價}</Table.Cell>
            <Table.Cell>{data.stock_info[stockId].成交金額}</Table.Cell>
          </Table.Row>
        ))}
                  </Table.Body>
                </Table>   
              </div>
          </div>
          <div><PieChart data={data}/></div>
          {setSeesion()}
    </Container>
  );
};
