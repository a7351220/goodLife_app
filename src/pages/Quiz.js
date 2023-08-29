import {React, useState, useContext, useEffect} from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import tw from "twin.macro";
import styled from "styled-components"; //eslint-disable-line
import { css } from "styled-components/macro"; //eslint-disable-line
import Header from "components/headers/light.js";
import QuizCard from "components/cards/QuizCard.js";
import { quizData } from "components/data/QuizData";
import { UserContext } from "utils/UserContext";
import firebase from 'utils/firebase';
import 'firebase/compat/firestore';
import { useNavigate } from 'react-router-dom';

const Subheading = tw.span`uppercase tracking-wider text-sm`;
export default () => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState("")
  const db = firebase.firestore();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  function navigateto(path) {
      navigate(path);
  };
  const handleClick = (selectedAnswer) => {
    const points = quizData[questionIndex].answers[selectedAnswer];
    setScore((prevScore) => prevScore + points);
    setQuestionIndex((prevIndex) => prevIndex + 1);
  }; 
  const textStyle = {
    fontWeight: 'bold',
    fontSize: '1.2rem',
  };
  useEffect(() => {
    // 检查 localStorage 是否存在 uid
    const sessionData = sessionStorage.getItem('currentLevel');
    if (sessionData) {
      const currentLevel = JSON.parse(sessionData);
      setLevel(currentLevel)
      console.log(currentLevel); // 输出 uid 的值
    } else {
      console.log("currentUser data not found in Session Storage.");
    }
  }, []);
  const getResultText = (score) => {
    if (score <= 18) {
      return (
        <span style={{ ...textStyle, color: 'blue', textDecoration: 'underline' }}>
          墨守成規
        </span>
      );
    } else if (score <= 28) {
      return (
        <span style={{ ...textStyle, color: 'green', fontStyle: 'italic' }}>
          中庸之道
        </span>
      );
    } else if (score <= 47) {
      return (
        <span style={{ ...textStyle, color: 'red', textTransform: 'uppercase' }}>
          永遠不回頭
        </span>
      );
    } else {
      return <span style={textStyle}>其他</span>;
    }
  };
  function getScoreCategory(score, level) {
    if (score <= 18) {
        return level === "初級" ? "最low" : level === "中級" ? "最mid" : level === "高級" ? "最high" : "";
    } else if (score <= 28) {
        return level === "初級" ? "很low" : level === "中級" ? "中mid" : level === "高級" ? "中high" : "";
    } else if (score <= 47) {
        return level === "初級" ? "小low" : level === "中級" ? "小mid" : level === "高級" ? "小high" : "";
    } else {
        return "";
    }
}
  const handleResult = async() => {
    const userRef = db.collection('userinfo').doc(user.multiFactor.user.uid);
    const doc = await userRef.get();
    const scoreNew = getScoreCategory(score, level);
    try{
      if (doc.exists) {
        await userRef.update({
                score: scoreNew,
              });
        console.log('Document updated successfully!');
      } else {
        await userRef.set({
                score: scoreNew,
              });
        console.log('Document created successfully!');
      }
    }catch(err){
      console.error('Error writing document: ', err);
    }
    navigateto("/table")
  }

  const currentQuestion = quizData[questionIndex];
  return (
    <AnimationRevealPage>
      <Header />
        {questionIndex < quizData.length ? (
          <QuizCard
                subheading={<Subheading>柴神爺幫你算 !</Subheading>}
                heading={String(currentQuestion.question)}
                text={currentQuestion.options.map((option, index) => (
                  <div key={index}>
                    <button
                      type="button"
                      value={index}
                      onClick={() => handleClick(index)}
                    >
                      {option}
                    </button>
                  </div>                 
                ))
                }
                imageSrc="https://memeprod.sgp1.digitaloceanspaces.com/user-wtf/1692035514289.jpg"
          />):
            <QuizCard
              subheading={<Subheading>柴神爺幫你算 !</Subheading>}
              heading="您的投資屬性:"
              text = {getResultText(score)}
              buttonRounded={true}
              buttonOn = {true}
              primaryButtonText = "開始試算!"
              onButtonClick = {handleResult}
              imageSrc={score<=18?"https://memeprod.sgp1.digitaloceanspaces.com/user-wtf/1692762563174.jpg":score<=28?"https://memeprod.sgp1.digitaloceanspaces.com/user-wtf/1692762604312.jpg":score<=47?"https://memeprod.sgp1.digitaloceanspaces.com/user-wtf/1692762003378.jpg":""}
            />}
    </AnimationRevealPage>
    
  );
};
