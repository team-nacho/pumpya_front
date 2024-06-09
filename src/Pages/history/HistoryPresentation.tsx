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
}

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
}: HistoryPresentationProps) => (
  <VStack spacing={3} align="stretch">
    <div>
      <br></br>
      <Button onClick={onBack}>뒤로가기</Button>
    </div>
    <div>
      <Heading fontSize="30">{partyName || "기다려주세요..."}🎉</Heading>
    </div>
    <div>
      {receipts.length === 0 ? (
        <Heading fontSize="50">0원</Heading>
      ) : selectedCurrency === "전체" ? (
        <Heading fontSize="50">전체</Heading>
      ) : (
        <Heading fontSize="50">
          {totalCostsByCurrency[selectedCurrency] || 0} ({selectedCurrency})
        </Heading>
      )}
    </div>

    <div>
      <Box textAlign="center" p={4} borderWidth={1} borderRadius="lg" mb={0.5}>
        <Tabs position="relative" variant="unstyled">
          <TabList>
            <Tab onClick={() => handleCurrencyClick("전체")}>전체</Tab>
            {currencies.map((currency) => (
              <Tab
                key={currency.currencyId}
                _selected={{ color: "white", bg: "blue.500" }}
                onClick={() => handleCurrencyClick(currency.currencyId)}
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
        <Box textAlign="center" p={4} borderWidth={1} borderRadius="lg" mb={2}>
          <p>아직 등록된 소비가 없어요.</p>
          <b>소비를 등록해보세요</b>
        </Box>
      </div>
    ) : (
      <VStack spacing={3} align="stretch">
        <div>
        <Accordion allowMultiple>
            {Object.keys(exchange).length > 0 &&
              (selectedCurrency === "전체"
                ? memberNames.map((memberName: string, index: number) =>
                    Object.keys(exchange).some(
                      (currency: string) =>
                        exchange[currency] &&
                        exchange[currency][memberName]
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
                                        {
                                          exchange[currencyInner][memberName][
                                            receiver
                                          ]
                                        }
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
                          ).map((receiver: string, receiverIndex: number) => (
                            <Container
                              key={`${selectedCurrency}-${sender}-${receiverIndex}`}
                              as="span"
                              flex="1"
                              textAlign="center"
                            >
                              <p style={{ fontSize: 15 }}>
                                <b>{receiver}</b>님에게{" "}
                                <b>
                                  {exchange[selectedCurrency][sender][receiver]}
                                </b>
                                ({selectedCurrency}) 주세요
                              </p>
                            </Container>
                          ))}
                        </AccordionPanel>
                      </AccordionItem>
                    )
                  ))}
          </Accordion>
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
                        ? new Date(receipt.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>
                      {receipt.useCurrency} {receipt.cost}
                    </p>
                    <b style={{ fontSize: 25 }}>{receipt.receiptName}</b>
                    <p>{receipt.useTag}</p>
                  </Box>
                ))
            )}
          </div>
        </div>
      </VStack>
    )}
    <div>
      <img
        src="https://media.bunjang.co.kr/product/242680657_1_1699803985_w360.jpg"
        width="100%"
        height="100%"
      />
    </div>
  </VStack>
);

export default HistoryPresentation;
