import {React, useState, useEffect} from "react";
import { Card, Icon, Label, Menu, Table} from 'semantic-ui-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import tw from "twin.macro";
import styled from "styled-components"; //eslint-disable-line
import Header from "components/headers/light.js";
import TableCard from "components/cards/TableCard";
import firebase from 'utils/firebase';
import 'firebase/compat/firestore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
const PrimaryButton = styled(PrimaryButtonBase)(props => [
  tw`mt-8 md:mt-8 text-sm inline-block mx-auto md:mx-0`,
  props.buttonRounded && tw`rounded-full`
]);
const Subheading = tw.span`uppercase tracking-wider text-sm`;
export default () => {
  const [basicData, setbasicData] = useState([]);
  const [uid, setUid] = useState(null);
  const [rate, setRate] = useState(0.04);
  const navigate = useNavigate();
  function navigateto(path) {
      navigate(path);
  };
  useEffect(() => {
    // 检查 localStorage 是否存在 uid
    const sessionData = sessionStorage.getItem('currentUser');
    if (sessionData) {
      const userData = JSON.parse(sessionData);
      const uid = userData.uid;
      setUid(uid)
    } else {
      console.log("currentUser data not found in Session Storage.");
    }
  }, []);
  useEffect(() => {
    handleCalculate(); // 在状态更新后执行 handleCalculate
  }, [rate]); 
  const scoreMappings = {
    "最low": 0.2,
    "中low": 0.2,
    "小low": 0.2,
    "最mid": 0.5,
    "中mid": 0.5,
    "小mid": 0.5,
    "最high": 0.8,
    "中high": 0.8,
    "小high": 0.8,
  };
  const [calculating, setCalculating] = useState(false); // 新增計算狀態
  const handleCalculate = async () => {
    try {
      
      setCalculating(true); // 設置計算中狀態
      const userRef = firebase.firestore().collection('userinfo').doc(uid);
      const doc = await userRef.get();

      const userInfoData = doc.data();
        
      const response = await axios.post('http://localhost:5000/calculate_future_income', {
          data: {
            current_salary: parseFloat(userInfoData.basic_info.current_salary),
            inflation_rate: 0.0096,
            investment_rate: parseFloat(rate) * scoreMappings[userInfoData.score],
            living_expense: parseFloat(userInfoData.basic_info.living_expense),
            salary_growth_rate: 0.0193,
            savings: parseFloat(userInfoData.basic_info.savings),
          },
          loans_data: {
            car: {
              down_payment: parseFloat(userInfoData.loans_data.car.down_payment),
              money: parseFloat(userInfoData.loans_data.car.money),
              rate: parseFloat(userInfoData.loans_data.car.rate),
              time: parseFloat(userInfoData.loans_data.car.time),
            },
            house: {
              down_payment: parseFloat(userInfoData.loans_data.house.down_payment),
              money: parseFloat(userInfoData.loans_data.house.money),
              rate: parseFloat(userInfoData.loans_data.house.rate),
              time: parseFloat(userInfoData.loans_data.house.time),
            },
            stu: {
              money: parseFloat(userInfoData.loans_data.stu.money),
              rate: parseFloat(userInfoData.loans_data.stu.rate),
              time: parseFloat(userInfoData.loans_data.stu.time),
              down_payment: 0,
            },
          },
        });
      
      setbasicData(response.data);
      setCalculating(false); // 設置計算完成狀態

    } catch (error) {
      console.error('Error calculating future income:', error);
      setCalculating(false); // 設置計算完成狀態（即使發生錯誤，也要設置）
    }
  };
  const updateRate = function(){
    const storedAlReturn = sessionStorage.getItem('al_return');
    setRate(storedAlReturn);
    handleCalculate()
  }

  return (
    <AnimationRevealPage>
      <Header />
        <TableCard
          subheading={<Subheading>柴神爺幫你算 !</Subheading>}
          heading="您的試算結果"
          textLeft=    {
            basicData && typeof basicData === 'object' && Object.keys(basicData).length > 0 ? (
            <div style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', padding: '1rem', borderRadius: '8px' }}>         
              <h2 style={{ color: 'orange', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>
              🎉 您可以在第{basicData.retire_year} 年退休
              </h2>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>計劃：</h3>
                <ul style={{ listStyleType: 'none', padding: '0' }}>
                  <li><span role="img" aria-label="checkmark" style={{ marginRight: '8px' }}>✅</span>第{basicData.stu_buy_year} 年開始繳學貸</li>
                  <li><span role="img" aria-label="checkmark" style={{ marginRight: '8px' }}>✅</span>第{basicData.stu_done_year} 年還完學貸</li>
                  <li><span role="img" aria-label="checkmark" style={{ marginRight: '8px' }}>✅</span>第{basicData.car_buy_year} 年買車</li>
                  <li><span role="img" aria-label="checkmark" style={{ marginRight: '8px' }}>✅</span>第{basicData.car_done_year} 年還完車貸</li>
                  <li><span role="img" aria-label="checkmark" style={{ marginRight: '8px' }}>✅</span>第{basicData.house_buy_year} 年買房</li>
                  <li><span role="img" aria-label="checkmark" style={{ marginRight: '8px' }}>✅</span>第{basicData.house_done_year} 年還完房貸</li>
                </ul>
            </div>
              <p><PrimaryButton onClick={updateRate} disabled={calculating}>使用柴源廣進策略</PrimaryButton></p>
            </div>
          ) : (
            <p><PrimaryButton onClick={handleCalculate} disabled={calculating}>開始計算</PrimaryButton></p>
          )}
          textRight={
            basicData && typeof basicData === 'object' && Object.keys(basicData).length > 0 ? (
            <div style={{ width: "100%", maxHeight: "500px", overflowY: "auto", overflowX: "auto" ,boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', padding: '1rem', borderRadius: '8px'}}>
            <Table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: 'gray' }}>年份</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: 'gray' }}>薪資收入</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: 'gray' }}>投資收入</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: 'gray' }}>總收入</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: 'gray' }}>存款</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: 'gray' }}>生活費</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: 'gray' }}>總支出</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(basicData.future_salaries).map((year) => (
                  <tr key={year}>
                    <td style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: 'white' }}>第{parseInt(year) + 1}年</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: 'white' }}>{Math.floor(basicData.future_salaries[year])}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: 'white' }}>{Math.floor(basicData.future_investments[year])}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: 'white' }}>{Math.floor(basicData.total_incomes[year])}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: 'white' }}>{Math.floor(basicData.total_savings[year])}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: 'white' }}>{Math.floor(basicData.living_expenses[year])}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: 'white' }}>{Math.floor(basicData.total_expenses[year])}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            </div>
          ) : (
            <p>{calculating ? '計算中...' : '尚未計算或無計算結果。'}</p>
          )}
          textDown = {
            basicData && typeof basicData === 'object' && Object.keys(basicData).length > 0 ?(
              <div>
                <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                  總收入與總支出走勢
                </h1>
              <ResponsiveContainer width="100%" height={300}>
              <LineChart  data={basicData && basicData.future_salaries && Object.keys(basicData.future_salaries).map((year) => ({
                year: parseInt(year) + 1,
                總收入: Math.floor(basicData.total_incomes[year]),
                總支出: Math.floor(basicData.total_expenses[year]),
                總存款: Math.floor(basicData.total_savings[year]),
                }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tick={{ fontSize: 16 }} tickFormatter={value => `${value / 1000000}M`} /> {/* 將數值除以 1,000,000，並顯示為百萬單位 */}
                <Tooltip />
                <Legend wrapperStyle={{ background: 'hsla(0, 0%, 95%, 0.8)', padding: '10px', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="總收入" stroke="#8884d8" />
                <Line type="monotone" dataKey="總支出" stroke="#82ca9d" />
                <Line type="monotone" dataKey="總存款" stroke="orange" />
              </LineChart>
              </ResponsiveContainer>
            </div>):(
            <p>{calculating ? '計算中...' : '尚未計算或無計算結果。'}</p>
          )
          }
      />

    </AnimationRevealPage>
  );
};
