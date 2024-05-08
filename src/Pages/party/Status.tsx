import { useContext, useEffect, useRef, useState } from "react";
import { Heading, Text } from "@chakra-ui/react";

const Status = (partyName: string, memberNum: number, totalAmount: number) => {
  return (
    <div>
      <Heading as="h2" size="xl">
        partyName
      </Heading>
      <Text fontSize="2xl">memberNum명</Text>
      <Text fontSize="lg">이번 여행에서 소비했어요</Text>
      <Heading as="h2" size="2xl">
        totalAmount원
      </Heading>
    </div>
  );
};

export default Status;
