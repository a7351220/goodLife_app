import {React, useState, useEffect} from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import tw from "twin.macro";
import styled from "styled-components"; //eslint-disable-line
import Header from "components/headers/light.js";
import 'firebase/compat/firestore';
import StockCard from "components/cards/StockCard";
import axios from 'axios';
import StockChart from './StockChart.js'
import BackTest from './BackTest.js'
import firebase from 'utils/firebase';
import 'firebase/compat/firestore';
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
const PrimaryButton = styled(PrimaryButtonBase)(props => [
  tw`mt-8 md:mt-8 text-sm inline-block mx-auto md:mx-0`,
  props.buttonRounded && tw`rounded-full`
]);

export default () => {
  const [resultData, setResultData] = useState(null);
  const [score, setScore] = useState(null);
  const [uid, setUid] = useState(null);
  const [calculating, setCalculating] = useState(false); // 新增計算狀態
  
  useEffect(() => {
    // 检查 localStorage 是否存在 uid
    const sessionData = sessionStorage.getItem('currentUser');
    if (sessionData) {
      const userData = JSON.parse(sessionData);
      const uid = userData.uid;
      setUid(uid)
      console.log(uid); // 输出 uid 的值
    } else {
      console.log("currentUser data not found in Session Storage.");
    }
  }, []);
  const handleGetData = async() => {
    try{

      setCalculating(true); // 設置計算中狀態
      const userRef = firebase.firestore().collection('userinfo').doc(uid);
      const doc = await userRef.get();
      const postResponse = await axios.post("http://localhost:5000/calculate_stock",{
        score: doc.data().score
      });
      setResultData(postResponse.data);
      setCalculating(false); // 設置計算完成狀態
    }catch(error){
      console.error('Error get stock:', error);
      setCalculating(false); // 設置計算完成狀態
    }

  };
  return (
    <AnimationRevealPage>
      <Header />
      <StockCard
        textLeft={
          resultData ? (
            <div>
              <StockChart data={resultData} />
            </div>
          ):<div>
            <PrimaryButton onClick={handleGetData} disabled={calculating}>獲取資料</PrimaryButton>
          </div>
        }
        textRight={
          resultData ? (
            <div style={{ maxHeight: "360px", overflowY: "auto", overflowX: "auto" }}>
              <BackTest data={resultData} />
            </div>
          ):
          <p>{calculating ? '計算中...' : '尚未計算或無計算結果。'}</p>
        }
      />
    </AnimationRevealPage>
  );
};
