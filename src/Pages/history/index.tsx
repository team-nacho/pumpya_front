import {
  Button,
  Container,
  Menu,
  Select,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useEffect, useState, ReactNode } from "react";
import { CreatePartyRequest } from "../../Interfaces/request";
import { CreatePartyResponse } from "../../Interfaces/response";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { partyApi } from "../../Apis/apis";
import { AxiosResponse, HttpStatusCode } from "axios";
import { dummyMembers, dummyParties, dummyReceipts, dummyTags } from "./dummy";
import { Receipt } from "../../Interfaces/interfaces";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const hasSelectedTag = dummyReceipts.some(
    (receipt) => receipt.tag?.name === selectedTag
  );

  const onBack = () => {
    navigate("/");
  };

  console.log("Members:", dummyMembers);
  console.log("Parties:", dummyParties);
  console.log("Reciepts:", dummyReceipts);
  console.log("Tags:", dummyTags);

  const memberNames = dummyMembers.map((member) => member.name);

  const partyName = dummyParties.map((party) => party.name);

  console.log(partyName);

  const handleTagClick = (tag: string) => {
    const filteredReciepts = dummyReceipts.filter(
      (receipt) => receipt.tag?.name === tag
    );
    setFilteredReceipts(filteredReciepts);
    setSelectedTag(tag); // 선택된 태그 업데이트
  };

  const handleShowAll = () => {
    setFilteredReceipts(dummyReceipts); // 모든 Receipt 표시
    setSelectedTag(""); // 선택된 태그 초기화
  };

  return (
    <div>
      <div>
        <Button onClick={onBack}>뒤로가기</Button>
      </div>
      <div>
        <Heading fontSize="xl">{partyName}🎉</Heading>
      </div>
      <div>
        {memberNames.map((name, index) => (
          <Accordion allowMultiple>
            <AccordionItem key={index} style={{ margin: "10px 0" }}>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    {name}님의 뿜빠이 결과
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                누구에게 얼마를 주세요.
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
      <div>
        <Select
          placeholder="전체"
          onChange={(e) => {
            const value = e.target.value;
            if (value === "") {
              handleShowAll();
            } else {
              handleTagClick(value);
            }
          }}
        >
          <option value="음식">음식</option>
          <option value="보관">보관</option>
          <option value="교통">교통</option>
          <option value="입장료">입장료</option>
          <option value="숙박">숙박</option>
          <option value="엔터">엔터</option>
        </Select>
      </div>
      <div>
        <div>
          <ul>
            {selectedTag
              ? filteredReceipts.map((receipt, index) => (
                  <Container key={index}>
                    <div>{receipt.name}</div>
                    <div>
                      {receipt.createDate?.toLocaleDateString()}{" "}
                      {receipt.tag?.name}
                    </div>
                  </Container>
                ))
              : dummyReceipts.map((receipt, index) => (
                  <Container key={index}>
                    <div>{receipt.name}</div>
                    <div>
                      {receipt.createDate?.toLocaleDateString()}{" "}
                      {receipt.tag?.name}
                    </div>
                  </Container>
                ))}

            {!selectedTag && dummyReceipts.length === 0 && (
              <div>
                <p>{selectedTag}.</p>
                <b>추가해보세요</b>
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
