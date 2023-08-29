import {React, useContext, useState} from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { SectionHeading, Subheading as SubheadingBase } from "components/misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import {ReactComponent as SvgDotPattern } from "images/dot-pattern.svg"
import TeamIllustrationSrc from "images/team-illustration-2.svg";
import { UserContext } from "utils/UserContext";
import firebase from 'utils/firebase';
import 'firebase/compat/firestore';

const Container = tw.div`relative p-24`;
const CardWrapper = styled.div`
  ${tw`border rounded-lg shadow-md p-8 mt-4 mx-4 transition-transform duration-300 hover:scale-105`}
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // 添加陰影
`;
const TwoColumn = tw.div`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-20 md:py-24 items-center`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const TextColumn = styled(Column)(props => [
  tw`md:w-6/12 mt-16 md:mt-0`,
  props.textOnLeft ? tw`md:mr-12 lg:mr-16 md:order-first` : tw`md:ml-12 lg:ml-16 md:order-last`
]);

const TextContent = tw.div`lg:py-8 text-center md:text-left`;
const Subheading = tw(SubheadingBase)`text-center md:text-left`;
const Heading = tw(
  SectionHeading
)`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;
// const Description = tw.p`mt-4 text-center md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`;

const PrimaryButton = styled(PrimaryButtonBase)(props => [
  tw`mt-8 md:mt-8 text-sm inline-block mx-auto md:mx-0`,
  props.buttonRounded && tw`rounded-full`
]);

export default ({
  subheading = "柴神爺幫你算",
  heading = "",
  textLeft = "",
  textRight = "",
  primaryButtonText = "",
  buttonOn = false,
  buttonRounded = true,
  imageSrc = TeamIllustrationSrc,
  imageRounded = true,
  imageBorder = false,
  imageShadow = false,
  imageCss = null,
  imageDecoratorBlob = false,
  imageDecoratorBlobCss = null,
  textOnLeft = true,
  onButtonSubmit,
  onButtonClick
}) => {
  return (
    <Container>
      <CardWrapper>
        <Subheading>{subheading}</Subheading>
        <Heading>{heading}</Heading>
        {textLeft}
      </CardWrapper>
      <CardWrapper>
        {textRight}
      </CardWrapper>
    </Container>
  );
};
