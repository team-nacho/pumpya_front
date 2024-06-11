import {Swiper, SwiperSlide} from "swiper/react";
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './styles.css';
import { Card, Flex, Text } from "@chakra-ui/react";

interface CardSwiperProps {
  totalCost: Map<string, number>;
}
const CardSwiper = (props: CardSwiperProps) => (
  <Swiper
    spaceBetween={50}
    slidesPerView={1}
    pagination={true} modules={[Pagination]}
  >
      
    {
      Array.from(props.totalCost).map(([key, value], index) => (
        <SwiperSlide key={index}>
          <Card w="full" variant='filled'>
            <Flex p='2' fontSize="md" fontWeight='bold'>{key}</Flex>
            <Text p='2' fontSize="2xl" marginBottom='4' fontWeight='bold' align='left'>
              {value.toLocaleString() || 0} {key}
            </Text>
          </Card>
        </SwiperSlide>
      ))
    }
  </Swiper>
);

export default CardSwiper;