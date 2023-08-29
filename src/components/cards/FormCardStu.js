import {React, useContext, useState} from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { SectionHeading, Subheading as SubheadingBase } from "components/misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import {ReactComponent as SvgDotPattern } from "images/dot-pattern.svg"
import TeamIllustrationSrc from "images/team-illustration-2.svg";
import { UserContext } from "utils/UserContext";
import { useNavigate } from 'react-router-dom';
import firebase from 'utils/firebase';
import 'firebase/compat/firestore';

const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-20 md:py-24 items-center`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:w-6/12 flex-shrink-0 relative`;
const TextColumn = styled(Column)(props => [
  tw`md:w-6/12 mt-16 md:mt-0`,
  props.textOnLeft ? tw`md:mr-12 lg:mr-16 md:order-first` : tw`md:ml-12 lg:ml-16 md:order-last`
]);

const Image = styled.img(props => [
  props.imageRounded && tw`rounded`,
  props.imageBorder && tw`border`,
  props.imageShadow && tw`shadow`,
]);

const DecoratorBlob = styled(SvgDotPattern)(props => [
  tw`w-20 h-20 absolute right-0 bottom-0 transform translate-x-1/2 translate-y-1/2 fill-current text-primary-500 -z-10`,
])

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

const Input = tw.input`w-full bg-white rounded-lg border-2 focus:outline-none focus:border-primary-500 text-base transition duration-300 px-5 py-3`;

const Form = styled.form`
  ${tw`mt-8 md:mt-10 text-center`}
`;

export default ({
  subheading = "Our Expertise",
  heading = (
    <>
      Designed & Developed by <span tw="text-primary-500">Professionals.</span>
    </>
  ),
  primaryButtonText = "Learn More",
  buttonRounded = true,
  imageSrc = TeamIllustrationSrc,
  imageRounded = true,
  imageBorder = false,
  imageShadow = false,
  imageCss = null,
  imageDecoratorBlob = false,
  imageDecoratorBlobCss = null,
  textOnLeft = true,
}) => {
  const db = firebase.firestore();
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  function navigateto(path) {
      navigate(path);
  };
  const handleInputChange = (event, field) => {
    const { value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [field]: value
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userRef = db.collection('userinfo').doc(user.multiFactor.user.uid);
      const doc = await userRef.get();
      if (doc.exists) {
        await userRef.update({
          loans_data: {
            stu: {"rate": formData.stu_rate/100, "time": formData.stu_time, "money": formData.stu_money},
            house: {"rate": formData.house_rate/100, "time": formData.house_time , "money": formData.house_money, "down_payment": (formData.house_down_payment)/10 * formData.house_money},
            car: {"rate": formData.car_rate/100, "time": formData.car_time, "money": formData.car_money, "down_payment": (formData.car_down_payment)/10 * formData.car_money},
        }
        })
        console.log('Document updated successfully!');
      }else{
        await userRef.set({
          loans_data: {
            stu: {"rate": formData.stu_rate/100, "time": formData.stu_time, "money": formData.stu_money},
            house: {"rate": formData.house_rate/100, "time": formData.house_time , "money": formData.house_money, "down_payment": (formData.house_down_payment)/10 * formData.house_money},
            car: {"rate": formData.car_rate/100, "time": formData.car_time, "money": formData.car_money, "down_payment": (formData.car_down_payment)/10 * formData.car_money},
        }
        })
        console.log('Document created successfully!');
      }
      navigateto('/quiz')
    } catch (error) {
      console.error('Error saving data to Firestore:', error);
    }

  };
  return (
    <Container>
      <TwoColumn>
        <ImageColumn>
          <Image css={imageCss} src={imageSrc} imageBorder={imageBorder} imageShadow={imageShadow} imageRounded={imageRounded}/>
          {imageDecoratorBlob && <DecoratorBlob css={imageDecoratorBlobCss} />}
        </ImageColumn>
        <TextColumn textOnLeft={textOnLeft}>
          <TextContent>
            <Subheading>{subheading}</Subheading>
            <Heading>{heading}</Heading>
            {/* <Description>{description}</Description> */}
              <Form onSubmit={handleSubmit}>
                <Input
                  placeholder="學貸金額(元)"
                  value={formData.stu_money}
                  onChange={(event) => handleInputChange(event, "stu_money")}
                />
                <Input
                  placeholder="學貸利率%(平均為1.65%)"
                  value={formData.stu_rate}
                  onChange={(event) => handleInputChange(event, "stu_rate")}
                />
                <Input
                  placeholder="學貸還款年限(年)"
                  value={formData.stu_time}
                  onChange={(event) => handleInputChange(event, "stu_time")}
                />
                <Input
                  placeholder="欲購房屋價格(元)"
                  value={formData.house_money}
                  onChange={(event) => handleInputChange(event, "house_money")}
                />
                <Input
                  placeholder="房屋頭期款成數(平均為2~4成)"
                  value={formData.house_down_payment}
                  onChange={(event) => handleInputChange(event, "house_down_payment")}
                />
                <Input
                  placeholder="房貸利率%(平均為2.07%)"
                  value={formData.house_rate}
                  onChange={(event) => handleInputChange(event, "house_rate")}
                />
                <Input
                  placeholder="房貸還款年限(年)"
                  value={formData.house_time}
                  onChange={(event) => handleInputChange(event, "house_time")}
                />
                <Input
                  placeholder="欲購汽車價格(元)"
                  value={formData.car_money}
                  onChange={(event) => handleInputChange(event, "car_money")}
                />
                <Input
                  placeholder="汽車頭期款成數(平均為1.5~2成)"
                  value={formData.car_down_payment}
                  onChange={(event) => handleInputChange(event, "car_down_payment")}
                />
                <Input
                  placeholder="車貸利率%(平均為2.5~6.5%)"
                  value={formData.car_rate}
                  onChange={(event) => handleInputChange(event, "car_rate")}
                />
                <Input
                  placeholder="車貸還款年限(年)"
                  value={formData.car_time}
                  onChange={(event) => handleInputChange(event, "car_time")}
                />
              {/* 可以繼續增加輸入框 */}
              <PrimaryButton buttonRounded={buttonRounded} as="button" type="submit" onClick={handleSubmit}>
                {primaryButtonText}
              </PrimaryButton>
            </Form>
          </TextContent>
        </TextColumn>
      </TwoColumn>
    </Container>
  );
};
