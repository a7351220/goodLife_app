import {React, useState, useContext} from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import tw from "twin.macro";
import styled from "styled-components"; //eslint-disable-line
import { css } from "styled-components/macro"; //eslint-disable-line
import Header from "components/headers/light.js";
import FormCard from "components/cards/FormCard.js";
import FormCardStu from "components/cards/FormCardStu";
const Subheading = tw.span`uppercase tracking-wider text-sm`;
export default () => {
  const [showFirstCard, setShowFirstCard] = useState(true);
  const handleCardSubmit = () => {
    setShowFirstCard(!showFirstCard);
  };

  return (
    <AnimationRevealPage>
      <Header />
      {showFirstCard?(
              <FormCard
              subheading={<Subheading>柴神爺幫你算 !</Subheading>}
              heading="請填寫個人資訊"
              buttonRounded={true}
              primaryButtonText="送出"
              onButtonSubmit={handleCardSubmit}
              imageSrc="https://i.imgur.com/KCwD2Qi.png"
            />):
            (
              <FormCardStu
              subheading={<Subheading>柴神爺幫你算 !</Subheading>}
              heading="請填寫貸款資訊(若無則填0)"
              buttonRounded={true}
              primaryButtonText="送出"
              imageSrc="https://i.imgur.com/KCwD2Qi.png"
            />
            )
      }
    </AnimationRevealPage>
  );
};
