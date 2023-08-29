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

const CardWrapper = styled.div`
  ${tw`border rounded-lg shadow-md p-8 mt-4 mx-4 transition-transform duration-300 hover:scale-105`}
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // 添加陰影
`;
const Container = tw.div`relative  p-24`;const TwoColumn = tw.div`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-20 md:py-24 items-center`;
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
const Select = tw.select`
  w-full bg-white rounded-lg border-2 focus:outline-none focus:border-primary-500 text-base transition duration-300 px-5 py-3
`;
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
  onButtonSubmit 
}) => {
  const db = firebase.firestore();
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({});
  const handleInputChange = (event, field) => {
    const { value } = event.target;
    const chinesePattern = /^[^0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*$/;
    const positiveIntegerPattern = /^\d*$/;
    // 如果欄位是姓名，使用正則表達式檢查是否只包含中文字
    if (field === "name") {
      if (chinesePattern.test(value) || value === "") {
        setFormData((prevData) => ({
          ...prevData,
          [field]: value
        }));
      }
    } else if (field === "proffesion") { // 新增處理職業的分支
      setFormData((prevData) => ({
        ...prevData,
        [field]: value
      }));
    }
    else if(positiveIntegerPattern.test(value) || value === ""){
      // 對於其他欄位，直接更新表單資料
      setFormData((prevData) => ({
        ...prevData,
        [field]: value
      }));
    }
  };  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userRef = db.collection('userinfo').doc(user.multiFactor.user.uid);
      const doc = await userRef.get();
      let level = "";
      if (formData.proffesion === "op1") {
        level = "高級";
      } else if (formData.proffesion === "op2"){
        level = "高級";
      }else if (formData.proffesion === "op3" && Number(formData.current_salary) > 3000000){
        level = "高級";
      }else if (formData.proffesion === "op4" && Number(formData.current_salary) > 3000000){
        level = "高級";
      }else if (formData.proffesion === "op4" && Number(formData.current_salary) > 2000000){
        level = "中級";
      }else if (formData.proffesion === "op4" && Number(formData.current_salary) > 1000000){
        level = "初級";
      }else if (formData.proffesion === "op5" && Number(formData.current_salary) > 3000000){
        level = "高級";
      }else if (formData.proffesion === "op5" && Number(formData.current_salary) > 2000000){
        level = "中級";
      }else if (formData.proffesion === "op5" && Number(formData.current_salary) > 1000000){
        level = "初級";}
        sessionStorage.setItem('currentLevel', JSON.stringify(level));
      if (doc.exists) {
        await userRef.update({
          timestamp: new Date(),
          email: user.multiFactor.user.email,
          name: formData.name,
          age: formData.age,
          proffesion: formData.proffesion,
          level: level,
          basic_info: {
            current_salary: formData.current_salary,
            living_expense: formData.living_expense,
            savings: formData.savings
          } 
        }
        )
        console.log('Document updated successfully!');
      }else{
        await userRef.set({
          timestamp: new Date(),
          email: user.multiFactor.user.email,
          name: formData.name,
          proffesion: formData.proffesion,
          age: formData.age,
          level: level,
          basic_info: {
            current_salary: formData.current_salary,
            living_expense: formData.living_expense,
            savings: formData.savings
          } 
        })
        console.log('Document created successfully!');
      }
      if (onButtonSubmit) {
        onButtonSubmit(); // 資料提交成功後，切換卡片
      }
    } catch (error) {
      console.error('Error saving data to Firestore:', error);
    }
  };
  return (
    <Container>
      <CardWrapper>
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
                  placeholder="姓名"
                  value={formData.name}
                  onChange={(event) => handleInputChange(event, "name")}
                />
                <Input
                  placeholder="年齡"
                  value={formData.age}
                  onChange={(event) => handleInputChange(event, "age")}
                />
                <Select
                  value={formData.proffesion || ""}
                  onChange={(event) => {
                    const selectedValue = event.target.value;
                    console.log("Selected value:", selectedValue);
                    handleInputChange(event, "proffesion")
                  }}
                  className="w-full bg-white rounded-lg border-2 focus:outline-none focus:border-primary-500 text-base transition duration-300 px-5 py-3"
                >
                  <option value="" disabled>請選擇職業</option>
                  <option value="op1">政府機關九職等、軍事單位校級、公私立學校正、副教授以及金融機構正 副主管級以上人員</option>
                  <option value="op2">醫師、律師、會計師、建築師</option>
                  <option value="op3">本國股票上市、上櫃企業負責人 及經理</option>
                  <option value="op4">中小企業負責人，農、林、漁、牧事業主及其他自由業者</option>
                  <option value="op5">一般職員</option>
                </Select>
                <Input
                  placeholder="年收入(元)"
                  value={formData.current_salary}
                  onChange={(event) => handleInputChange(event, "current_salary")}
                />
                <Input
                  placeholder="年生活費(元)"
                  value={formData.living_expense}
                  onChange={(event) => handleInputChange(event, "living_expense")}
                />
                <Input
                  placeholder="目前存款(元)"
                  value={formData.savings}
                  onChange={(event) => handleInputChange(event, "savings")}
                />
              {/* 可以繼續增加輸入框 */}
              <PrimaryButton buttonRounded={buttonRounded} as="button" type="submit" onClick={handleSubmit}>
                {primaryButtonText}
              </PrimaryButton>
            </Form>
          </TextContent>
        </TextColumn>
      </TwoColumn>
      </CardWrapper>
    </Container>
  );
};
