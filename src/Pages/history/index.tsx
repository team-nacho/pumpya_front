import {
  Button,
  Menu,
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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyMembers, dummyParties, dummyReceipts, dummyTags } from "./dummy";
import { Receipt } from "../../Interfaces/interfaces";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("전체");
  const hasSelectedTag = dummyReceipts.some(
    (receipt) => receipt.tag?.name === selectedTag
  );

  const onBack = () => {
    navigate("/");
  };

  useEffect(() => {
    // "전체" 태그가 선택되었을 때 모든 영수증을 표시
    if (selectedTag === "전체") {
      setFilteredReceipts(dummyReceipts);
    } else {
      // 선택된 태그에 맞는 영수증을 필터링하여 표시
      const filteredReciepts = dummyReceipts.filter(
        (receipt) => receipt.tag?.name === selectedTag
      );
      setFilteredReceipts(filteredReciepts);
    }
  }, [selectedTag]);

  const memberNames = dummyMembers.map((member) => member.name);

  const partyName = dummyParties.map((party) => party.name);

  const partyTotal = dummyParties.reduce(
    (acc, party) => acc + party.totalCost,
    0
  );

  const handleTagClick = (tag: string) => {
    const filteredReciepts = dummyReceipts.filter(
      (receipt) => receipt.tag?.name === tag
    );
    setFilteredReceipts(filteredReciepts);
    if (selectedTag === tag) {
      setSelectedTag("전체");
    } else {
      setSelectedTag(tag); // 선택된 태그 업데이트
    }
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
        <Heading fontSize="large">{partyTotal.toLocaleString()}원</Heading>
      </div>
      <div>
        {memberNames.map((name, index) => (
          <Accordion allowMultiple>
            <AccordionItem key={index} style={{ margin: "10px 0" }}>
              <h2>
                <AccordionButton style={{ backgroundColor: "#EDF2F7" }}>
                  <Button as="span" flex="1" textAlign="left">
                    {name}님의 뿜빠이 결과
                  </Button>
                </AccordionButton>
              </h2>
              <AccordionPanel bg="#EDF2F7">
                <p>누구에게 얼마를 주세요.</p>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
      <div>
        <Menu>
          <MenuButton as={Button}>{selectedTag || "전체"}</MenuButton>
          <MenuList>
            <MenuItem value="" onClick={() => handleTagClick("전체")}>
              전체
            </MenuItem>
            <MenuItem value="음식" onClick={() => handleTagClick("음식")}>
              음식
            </MenuItem>
            <MenuItem value="보관" onClick={() => handleTagClick("보관")}>
              보관
            </MenuItem>
            <MenuItem value="교통" onClick={() => handleTagClick("교통")}>
              교통
            </MenuItem>
            <MenuItem value="입장료" onClick={() => handleTagClick("입장료")}>
              입장료
            </MenuItem>
            <MenuItem value="숙박" onClick={() => handleTagClick("숙박")}>
              숙박
            </MenuItem>
            <MenuItem value="엔터" onClick={() => handleTagClick("엔터")}>
              엔터
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
      <div>
        {selectedTag === "전체" ? (
          dummyReceipts.map((receipt, index) => (
            <Box key={index} p={4} borderWidth={1} borderRadius="lg" mb={2}>
              <p>
                {receipt.createDate
                  ? new Date(receipt.createDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                {receipt.useCurrency?.currencyId} {receipt.cost}
              </p>
              <Heading>{receipt.name}</Heading>
              <p>{receipt.tag?.name}</p>
            </Box>
          ))
        ) : hasSelectedTag ? (
          filteredReceipts.map((receipt, index) => (
            <Box key={index} p={4} borderWidth={1} borderRadius="lg" mb={2}>
              <p>
                {receipt.createDate
                  ? new Date(receipt.createDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                {receipt.useCurrency?.currencyId} {receipt.cost}
              </p>
              <Heading>{receipt.name}</Heading>
              <p>{receipt.tag?.name}</p>
            </Box>
          ))
        ) : (
          <div>
            <Box
              textAlign="center"
              p={4}
              borderWidth={1}
              borderRadius="lg"
              mb={2}
            >
              <p>{selectedTag}(으)로 등록된 소비가 없어요</p>
              <b>소비를 등록해보세요</b>
            </Box>
          </div>
        )}
        <div>
          <img
            src="https://cdn.news.cauon.net/news/photo/202203/36524_26498_1343.png"
            alt="Jennie"
          />
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
