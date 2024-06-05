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
  VStack,
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
  selectedCurrency: string;
  handleTagClick: (arg0: string) => void;
  handleCurrencyClick: (arg0: string) => void;
  getCategoryReceipts: (category: string) => any[];
  getReceiptsByCurrency: () => { [key: string]: any[] };
}
const HistoryPresentation = (props: HistoryPresentationProps) => (
  <VStack spacing={3} align="stretch">
    <div>
      <br></br>
      <Button onClick={props.onBack}>뒤로가기</Button>
    </div>
    <div>
      <Heading fontSize="30">{props.partyName || "기다려주세요..."}🎉</Heading>
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
      <VStack spacing={3} align="stretch">
        <div>
          {props.memberNames.map((name, index) => (
            <Accordion allowMultiple key={index}>
              <AccordionItem style={{ margin: "10px 0" }}>
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
                </AccordionPanel>*
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
              {props.categories.map((category, index) => (
                <MenuItem
                  key={index}
                  value={category}
                  onClick={() => props.handleTagClick(category)}
                >
                  {category}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </div>
        <div>
          <br />
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
                      <p>등록된 영수증이 없습니다.</p>
                    )}
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Box>
        </div>
      </VStack>
    )}
    <div>
      <img
        src="https://cdn.news.cauon.net/news/photo/202203/36524_26498_1343.png"
        alt="Jennie"
      />
    </div>
  </VStack>
);

export default HistoryPresentation;
