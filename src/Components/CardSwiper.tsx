import {Swiper, SwiperSlide} from "swiper/react";
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './styles.css';
import { Currency } from "../Interfaces/interfaces";
import { Card, Flex, Text } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

interface CardSwiperProps {
  currencyList: Currency[];
  totalCost: number;
  useCurrency: Currency;
  onClickChangeCurrency: (index: number) => void;
  setTotalCost: (totalCost: number) => void;
  calculateTotalCost: (currecnyId: string) => number;
}
const CardSwiper = (props: CardSwiperProps) => {

  const onSlideChange = (swiper: any) => {
    console.log(props.currencyList[swiper.activeIndex]);
    props.setTotalCost(
      props.calculateTotalCost(props.currencyList[swiper.activeIndex].currencyId)
    );
  };
  useEffect(() => {
    props.setTotalCost(
      props.calculateTotalCost(props.currencyList[0].currencyId)
    );
  }, []);
  return (
    <Swiper
      onSlideChangeTransitionEnd={onSlideChange} // 슬라이드 변경 시 이벤트 핸들러
      spaceBetween={50}
      slidesPerView={1}
      pagination={true} modules={[Pagination]}
    >
      {props.currencyList.map((currency, index) => (
        <SwiperSlide key={index}>
          <Card w="full" variant='filled'>
            <Flex p='2' fontSize="md" fontWeight='bold'>{currency.country}</Flex>
            <Text p='2' fontSize="2xl" marginBottom='4' fontWeight='bold' align='left'>
              {props.totalCost.toLocaleString() || 0}
            </Text>
          </Card>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default CardSwiper;