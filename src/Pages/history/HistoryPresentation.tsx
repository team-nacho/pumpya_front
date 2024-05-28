import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Container,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

interface HistoryPresentationProps {
  onBack: () => void;
  memberNames: string[];
  partyName: string;
  partyTotal: number;
  receipts: string[] | undefined;
  selectedTag: string;
  filteredReceipts: any[];
  hasSelectedTag: boolean;
  categories: string[];
  handleTagClick: (arg0: string) => void;
  getCategoryReceipts: (category: string) => any[];
}
const HistoryPresentation = (props: HistoryPresentationProps) => (
  <div>
    <div>
      <Button onClick={props.onBack}>뒤로가기</Button>
    </div>
    <div>
      <Heading fontSize="30">{props.partyName}🎉</Heading>
    </div>
    <div>
      <Heading fontSize="50">{props.partyTotal.toLocaleString()}원</Heading>
    </div>
    {props.receipts && props.receipts.length === 0 ? (
      <div>
        <Box textAlign="center" p={4} borderWidth={1} borderRadius="lg" mb={2}>
          <p>아직 등록된 소비가 없어요.</p>
          <b>소비를 등록해보세요</b>
        </Box>
      </div>
    ) : (
      <div>
        <div>
          {props.memberNames.map((name, index) => (
            <Accordion allowMultiple>
              <AccordionItem key={index} style={{ margin: "10px 0" }}>
                <h2>
                  <AccordionButton
                    as="span"
                    flex="1"
                    textAlign="left"
                    style={{ backgroundColor: "#EDF2F7" }}
                  >
                    <Button as="span" flex="1" textAlign="left">
                      <p style={{ fontSize: 20 }}>{name}님의 뿜빠이 결과</p>
                    </Button>
                  </AccordionButton>
                </h2>
                <AccordionPanel bg="#EDF2F7">
                  <Container as="span" flex="1" textAlign="left">
                    <p style={{ fontSize: 15 }}>{name}님에게 얼마를 주세요</p>
                  </Container>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
        <div>
          <Menu>
            <MenuButton as={Button}>{props.selectedTag || "전체"}</MenuButton>
            <MenuList>
              <MenuItem value="" onClick={() => props.handleTagClick("전체")}>
                전체
              </MenuItem>
              <MenuItem
                value="음식"
                onClick={() => props.handleTagClick("음식")}
              >
                음식
              </MenuItem>
              <MenuItem
                value="보관"
                onClick={() => props.handleTagClick("보관")}
              >
                보관
              </MenuItem>
              <MenuItem
                value="교통"
                onClick={() => props.handleTagClick("교통")}
              >
                교통
              </MenuItem>
              <MenuItem
                value="입장료"
                onClick={() => props.handleTagClick("입장료")}
              >
                입장료
              </MenuItem>
              <MenuItem
                value="숙박"
                onClick={() => props.handleTagClick("숙박")}
              >
                숙박
              </MenuItem>
              <MenuItem
                value="엔터"
                onClick={() => props.handleTagClick("엔터")}
              >
                엔터
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
        <div>
          <br></br>
        </div>
        <div>
          {props.selectedTag === "전체" ? (
            props.filteredReceipts.map((receipt, index) => (
              <Box key={index} p={4} borderWidth={1} borderRadius="lg" mb={2}>
                <p>
                  {receipt.createDate
                    ? new Date(receipt.createDate).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  {receipt.useCurrency?.currencyId} {receipt.cost}
                </p>
                <b style={{ fontSize: 25 }}>{receipt.name}</b>
                <p>{receipt.tag?.name}</p>
              </Box>
            ))
          ) : props.hasSelectedTag ? (
            props.filteredReceipts.map((receipt, index) => (
              <Box key={index} p={4} borderWidth={1} borderRadius="lg" mb={2}>
                <p>
                  {receipt.createDate
                    ? new Date(receipt.createDate).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  {receipt.useCurrency?.currencyId} {receipt.cost}
                </p>
                <b style={{ fontSize: 20 }}>{receipt.name}</b>
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
                <p>{props.selectedTag}(으)로 등록된 소비가 없어요</p>
                <b>소비를 등록해보세요</b>
              </Box>
            </div>
          )}
        </div>
        <div>
          <Box textAlign="left" p={4} borderWidth={1} borderRadius="lg" mb={2}>
            <Tabs position="relative" variant="unstyled">
              <TabList>
                {props.categories.map((category, index) => (
                  <Tab key={index}>{category}</Tab>
                ))}
              </TabList>
              <TabIndicator
                mt="-1.5px"
                height="2px"
                bg="blue.500"
                borderRadius="1px"
              />
              <TabPanels>
                {props.categories.map((category, index) => (
                  <TabPanel key={index}>
                    {props.getCategoryReceipts(category).length > 0 ? (
                      props
                        .getCategoryReceipts(category)
                        .map((receipt, idx) => (
                          <Box
                            key={idx}
                            p={4}
                            borderWidth={1}
                            borderRadius="lg"
                            mb={2}
                          >
                            <p>
                              {receipt.createDate
                                ? new Date(
                                    receipt.createDate
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>
                            <p>
                              {receipt.useCurrency?.currencyId} {receipt.cost}
                            </p>
                            <b style={{ fontSize: 20 }}>{receipt.name}</b>
                            <p>{receipt.tag?.name}</p>
                          </Box>
                        ))
                    ) : (
                      <p>해당 카테고리에 등록된 영수증이 없습니다.</p>
                    )}
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Box>
        </div>
      </div>
    )}

    <div>
      <img
        src="https://cdn.news.cauon.net/news/photo/202203/36524_26498_1343.png"
        alt="Jennie"
      />
    </div>
  </div>
);

const LoadingPresentation = () => {
  <div>
    <Button
      isLoading
      loadingText="Loading"
      colorScheme="teal"
      variant="outline"
      spinnerPlacement="start"
    ></Button>
  </div>;
};

export default HistoryPresentation;
