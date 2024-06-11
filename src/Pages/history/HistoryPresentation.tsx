import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tab,
  TabIndicator,
  TabList,
  VStack,
  Tabs,
  Center,
} from "@chakra-ui/react";

interface HistoryPresentationProps {
  onBack: () => void;
  memberNames: string[];
  partyName: string;
  receipts: string[] | undefined;
  selectedTag: string;
  filteredReceipts: any[];
  hasSelectedTag: boolean;
  tags: string[];
  currencies: any[];
  exchange: any;
  selectedCurrency: string;
  handleTagClick: (arg0: string) => void;
  handleCurrencyClick: (arg0: string) => void;
  getCategoryReceipts: (category: string) => any[];
  getReceiptsByCurrency: () => { [key: string]: any[] };
  totalCostsByCurrency: { [key: string]: number };
  onStart: () => void;
  copyToClipboard: () => void;
}

const neonStyle = {
  fontFamily: "neon",
  textShadow:
    "0 0 5px #BECDFF, 0 0 10px #6E89FF, 0 0 15px #BECDFF, 0 0 20px #6E89FF, 0 0 25px #BECDFF, 0 0 30px #6E89FF, 0 0 35px #BECDFF",
  animation: "neon 1s ease infinite",
  MozAnimation: "neon 1s ease infinite",
  WebkitAnimation: "neon 1s ease infinite",
};

const HistoryPresentation = ({
  onBack,
  memberNames = [],
  partyName,
  receipts = [],
  selectedTag,
  filteredReceipts = [],
  hasSelectedTag,
  tags = [],
  currencies = [],
  selectedCurrency,
  exchange = [],
  handleTagClick,
  handleCurrencyClick,
  totalCostsByCurrency,
  onStart,
  copyToClipboard,
}: HistoryPresentationProps) => (
  <Box width="100vw" height="100vh" margin="20px">
    <VStack spacing={3} align="stretch">
      <div>
        <Button onClick={onBack}>뒤로가기</Button>
      </div>
      <div>
        <Flex justifyContent="space-between">
          <Heading fontSize="30">{partyName || "기다려주세요..."}🎉</Heading>
          <Heading style={neonStyle} fontSize="25" color="#A2E9FF">
            Pumpppaya!
          </Heading>
        </Flex>
      </div>
      <div>
        <Flex justifyContent="space-between">
          {receipts.length === 0 ? (
            <Heading fontSize="30">0원</Heading>
          ) : selectedCurrency === "전체" ? (
            <Heading fontSize="25">전체 통화</Heading>
          ) : (
            <Heading fontSize="25">
              {(
                Math.round(totalCostsByCurrency[selectedCurrency] * 10000) /
                10000
              ).toLocaleString() || 0}{" "}
              ({selectedCurrency})
            </Heading>
          )}
          <b>{memberNames.length}명이 함께하고 있어요!</b>
        </Flex>
      </div>

      <div>
        <Box
          textAlign="center"
          p={4}
          borderWidth={1}
          borderRadius="lg"
          mb={0.5}
        >
          <Tabs position="relative" variant="unstyled">
            <TabList>
              <Tab
                _selected={{ color: "white", bg: "blue.500" }}
                onClick={() => {
                  if (selectedCurrency !== "전체") {
                    handleCurrencyClick("전체");
                  }
                }}
              >
                전체
              </Tab>
              {currencies.map((currency) => (
                <Tab
                  key={currency.currencyId}
                  _selected={{ color: "white", bg: "blue.500" }}
                  onClick={() => {
                    if (selectedCurrency !== currency.currencyId) {
                      handleCurrencyClick(currency.currencyId);
                    }
                  }}
                >
                  {currency.country}({currency.currencyId})
                </Tab>
              ))}
            </TabList>
            <TabIndicator
              mt="-1.5px"
              height="2px"
              bg="blue.500"
              borderRadius="1px"
            />
          </Tabs>
        </Box>
      </div>
      {receipts.length === 0 ? (
        <div>
          <Box
            textAlign="center"
            p={4}
            borderWidth={1}
            borderRadius="lg"
            mb={2}
          >
            <p>아직 등록된 소비가 없어요.</p>
            <b>소비를 등록해보세요</b>
          </Box>
        </div>
      ) : (
        <VStack spacing={3} align="stretch">
          <div>
            <Box
              textAlign="center"
              p={4}
              borderWidth={1}
              borderRadius="lg"
              mb={0.5}
            >
              <Accordion allowMultiple>
                {Object.keys(exchange).length > 0 &&
                  (selectedCurrency === "전체"
                    ? memberNames.map((memberName: string, index: number) =>
                        Object.keys(exchange).some(
                          (currency: string) =>
                            exchange[currency] && exchange[currency][memberName]
                        ) ? (
                          <AccordionItem
                            key={`${memberName}-${index}`}
                            style={{ margin: "10px 0" }}
                          >
                            <h2>
                              <AccordionButton
                                as="span"
                                flex="1"
                                textAlign="left"
                                style={{ backgroundColor: "#EDF2F7" }}
                              >
                                <Button as="span" flex="1" textAlign="left">
                                  <p style={{ fontSize: 20 }}>
                                    <b>{memberName}</b>님의 뿜빠이 결과
                                  </p>
                                </Button>
                              </AccordionButton>
                            </h2>
                            <AccordionPanel bg="#EDF2F7">
                              {Object.keys(exchange).map(
                                (currencyInner: string) =>
                                  exchange[currencyInner][memberName] &&
                                  Object.keys(
                                    exchange[currencyInner][memberName]
                                  ).map(
                                    (
                                      receiver: string,
                                      receiverIndex: number
                                    ) => (
                                      <Container
                                        key={`${currencyInner}-${memberName}-${receiverIndex}`}
                                        as="span"
                                        flex="1"
                                        textAlign="center"
                                      >
                                        <p style={{ fontSize: 15 }}>
                                          <b>{receiver}</b>님에게{" "}
                                          <b>
                                            {Math.round(
                                              exchange[currencyInner][
                                                memberName
                                              ][receiver] * 10000
                                            ) / 10000}
                                          </b>
                                          ({currencyInner}) 주세요
                                        </p>
                                      </Container>
                                    )
                                  )
                              )}
                            </AccordionPanel>
                          </AccordionItem>
                        ) : null
                      )
                    : Object.keys(exchange[selectedCurrency] || {}).map(
                        (sender: string, senderIndex: number) => (
                          <AccordionItem
                            key={`${selectedCurrency}-${senderIndex}`}
                            style={{ margin: "10px 0" }}
                          >
                            <h2>
                              <AccordionButton
                                as="span"
                                flex="1"
                                textAlign="left"
                                style={{ backgroundColor: "#EDF2F7" }}
                              >
                                <Button as="span" flex="1" textAlign="left">
                                  <p style={{ fontSize: 20 }}>
                                    <b>{sender}</b>님의 뿜빠이 결과
                                  </p>
                                </Button>
                              </AccordionButton>
                            </h2>
                            <AccordionPanel bg="#EDF2F7">
                              {Object.keys(
                                exchange[selectedCurrency][sender] || {}
                              ).map(
                                (receiver: string, receiverIndex: number) => (
                                  <Container
                                    key={`${selectedCurrency}-${sender}-${receiverIndex}`}
                                    as="span"
                                    flex="1"
                                    textAlign="center"
                                  >
                                    <p style={{ fontSize: 15 }}>
                                      <b>{receiver}</b>님에게{" "}
                                      <b>
                                        {(
                                          Math.round(
                                            exchange[selectedCurrency][sender][
                                              receiver
                                            ] * 10000
                                          ) / 10000
                                        ).toLocaleString()}
                                      </b>
                                      ({selectedCurrency}) 주세요
                                    </p>
                                  </Container>
                                )
                              )}
                            </AccordionPanel>
                          </AccordionItem>
                        )
                      ))}
              </Accordion>
            </Box>
          </div>
          <div>
            <Menu>
              <MenuButton as={Button}>{selectedTag || "전체"}</MenuButton>
              <MenuList>
                <MenuItem value="" onClick={() => handleTagClick("전체")}>
                  전체
                </MenuItem>
                {tags.map((tag, index) => (
                  <MenuItem
                    key={index}
                    value={tag}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </div>
          <div>
            <div>
              {filteredReceipts.length === 0 ? (
                <Box
                  textAlign="center"
                  p={4}
                  borderWidth={1}
                  borderRadius="lg"
                  mb={2}
                >
                  <p>{selectedTag}(으)로 등록된 소비가 없어요.</p>
                  <b>소비를 등록해보세요</b>
                </Box>
              ) : (
                filteredReceipts
                  .sort((a, b) => {
                    const dateA: Date = new Date(a.createdAt);
                    const dateB: Date = new Date(b.createdAt);
                    return dateA.getTime() - dateB.getTime();
                  })
                  .map((receipt, index) => (
                    <Box
                      key={index}
                      p={4}
                      borderWidth={1}
                      borderRadius="lg"
                      mb={2}
                    >
                      <p>
                        {receipt.createdAt
                          ? new Date(receipt.createdAt).getMonth() + 1
                          : "N/A"}
                        월{" "}
                        {receipt.createdAt
                          ? new Date(receipt.createdAt).getDate()
                          : "N/A"}
                        일
                      </p>
                      <Flex justifyContent="space-between">
                        <b style={{ fontSize: 25 }}>{receipt.receiptName}</b>
                        <b style={{ fontSize: 20, color: "#3C3C8C" }}>
                          {receipt.useCurrency}{" "}
                          {Math.round(receipt.cost * 10000) / 10000}
                        </b>
                      </Flex>
                      <Flex justifyContent="space-between">
                        <p style={{ color: "#8C8CBE" }}>
                          {receipt.createdAt.getHours()}
                          {":"}
                          {receipt.createdAt.getMinutes()} {receipt.useTag}
                        </p>
                        <p style={{ fontSize: 12, color: "#8C8CBE" }}>
                          {receipt.author}
                        </p>
                      </Flex>
                    </Box>
                  ))
              )}
            </div>
          </div>
        </VStack>
      )}
      <div>
        <Button
          as="span"
          flex="1"
          textAlign="center"
          width="100%"
          height="100%"
          onClick={() => copyToClipboard()}
        >
          <b style={{ fontSize: 20, color: "#3C3C8C" }}>링크 복사하기</b>
        </Button>
      </div>
      <div>
        <Button
          as="span"
          flex="1"
          textAlign="center"
          width="100%"
          height="100%"
          onClick={() => onStart()}
        >
          <b style={{ fontSize: 20, color: "#3C3C8C" }}>처음으로 가기</b>
        </Button>
      </div>
    </VStack>
  </Box>
);

export default HistoryPresentation;
