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
const HistoryPresentation = (props: HistoryPresentationProps) => (
  <div>
    {props?.receipts!.length === 0 ? (
      <div>
          <Box width="100vw" height="100vh">
            <Flex
              direction="column"
              align="center"
              justify="center"
              height="100%"
              width="100%"
              bg="gray.100"
            >
              <Box mb="4">
                <Heading fontSize="25">등록된 영수증이 없습니다.</Heading>
              </Box>
              <Button
                as="span"
                textAlign="center"
                width="auto"
                height="auto"
                padding="10px 20px"
                colorScheme="blue"
                onClick={() => props.onStart()}
              >
                <b style={{ fontSize: 20 }}>처음으로 가기</b>
              </Button>
            </Flex>
          </Box>
      </div>
    ) : (
      <Box width="100vw" height="100vh" margin="10px" padding="20px">
        <VStack spacing={3} align="stretch">
          <div>
            <Flex justifyContent="space-between">
              <Heading fontSize="30">
                {props.partyName || "기다려주세요..."}🎉
              </Heading>
            </Flex>
          </div>
          <div>
            <Flex justifyContent="space-between">
              {props?.receipts!.length === 0 ? (
                <Heading fontSize="30">0원</Heading>
              ) : props.selectedCurrency === "전체" ? (
                <Heading fontSize="25">전체 통화</Heading>
              ) : (
                <Heading fontSize="25">
                  {(
                    Math.round(
                      props.totalCostsByCurrency[props.selectedCurrency] * 10000
                    ) / 10000
                  ).toLocaleString() || 0}{" "}
                  ({props.selectedCurrency})
                </Heading>
              )}
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
                      if (props.selectedCurrency !== "전체") {
                        props.handleCurrencyClick("전체");
                      }
                    }}
                  >
                    전체
                  </Tab>
                  {props.currencies.map((currency) => (
                    <Tab
                      key={currency.currencyId}
                      _selected={{ color: "white", bg: "blue.500" }}
                      onClick={() => {
                        if (props.selectedCurrency !== currency.currencyId) {
                          props.handleCurrencyClick(currency.currencyId);
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
          {props?.receipts!.length === 0 ? (
            <div>
              <Box
                textAlign="center"
                p={4}
                borderWidth={1}
                borderRadius="lg"
                mb={2}
              >
                <p>등록된 소비가 없어요.</p>
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
                    {Object.keys(props.exchange).length > 0 &&
                      (props.selectedCurrency === "전체"
                        ? props.memberNames.map(
                            (memberName: string, index: number) =>
                              Object.keys(props.exchange).some(
                                (currency: string) =>
                                  props.exchange[currency] &&
                                  props.exchange[currency][memberName]
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
                                      <Button
                                        as="span"
                                        flex="1"
                                        textAlign="left"
                                      >
                                        <p style={{ fontSize: 20 }}>
                                          <b>{memberName}</b>님의 뿜빠이 결과
                                        </p>
                                      </Button>
                                    </AccordionButton>
                                  </h2>
                                  <AccordionPanel bg="#EDF2F7">
                                    {Object.keys(props.exchange).map(
                                      (currencyInner: string) =>
                                        props.exchange[currencyInner][
                                          memberName
                                        ] &&
                                        Object.keys(
                                          props.exchange[currencyInner][
                                            memberName
                                          ]
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
                                                  {(
                                                    Math.round(
                                                      props.exchange[
                                                        currencyInner
                                                      ][memberName][receiver] *
                                                        10000
                                                    ) / 10000
                                                  ).toLocaleString()}
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
                        : Object.keys(
                            props.exchange[props.selectedCurrency] || {}
                          ).map((sender: string, senderIndex: number) => (
                            <AccordionItem
                              key={`${props.selectedCurrency}-${senderIndex}`}
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
                                  props.exchange[props.selectedCurrency][
                                    sender
                                  ] || {}
                                ).map(
                                  (receiver: string, receiverIndex: number) => (
                                    <Container
                                      key={`${props.selectedCurrency}-${sender}-${receiverIndex}`}
                                      as="span"
                                      flex="1"
                                      textAlign="center"
                                    >
                                      <p style={{ fontSize: 15 }}>
                                        <b>{receiver}</b>님에게{" "}
                                        <b>
                                          {(
                                            Math.round(
                                              props.exchange[
                                                props.selectedCurrency
                                              ][sender][receiver] * 10000
                                            ) / 10000
                                          ).toLocaleString()}
                                        </b>
                                        ({props.selectedCurrency}) 주세요
                                      </p>
                                    </Container>
                                  )
                                )}
                              </AccordionPanel>
                            </AccordionItem>
                          )))}
                  </Accordion>
                </Box>
              </div>
              <div>
                <Menu>
                  <MenuButton as={Button}>
                    {props.selectedTag || "전체"}
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      value=""
                      onClick={() => props.handleTagClick("전체")}
                    >
                      전체
                    </MenuItem>
                    {props.tags.map((tag, index) => (
                      <MenuItem
                        key={index}
                        value={tag}
                        onClick={() => props.handleTagClick(tag)}
                      >
                        {tag}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </div>
              <div>
                <div>
                  {props.filteredReceipts.length === 0 ? (
                    <Box
                      textAlign="center"
                      p={4}
                      borderWidth={1}
                      borderRadius="lg"
                      mb={2}
                    >
                      <b>{props.selectedTag}(으)로 등록된 소비가 없어요.</b>
                    </Box>
                  ) : (
                    props.filteredReceipts
                      .sort((a, b) => {
                        const dateA: Date = new Date(a.createdAt);
                        const dateB: Date = new Date(b.createdAt);
                        return dateB.getTime() - dateA.getTime();
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
                            <b style={{ fontSize: 25 }}>
                              {receipt.receiptName}
                            </b>
                            <b style={{ fontSize: 20, color: "#3C3C8C" }}>
                              {receipt.useCurrency}{" "}
                              {(
                                Math.round(receipt.cost * 10000) / 10000
                              ).toLocaleString()}
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
            <Flex>
            <Button
              as="span"
              flex="1"
              textAlign="center"
              width="20vh"
              height="8vh"
              onClick={() => props.copyToClipboard()}
            >
              <b style={{ fontSize: 20, color: "#3C3C8C" }}>링크 복사하기</b>
            </Button>
            </Flex>
          </div>
          <div>
            <Flex>
            <Button
              as="span"
              flex="1"
              textAlign="center"
              width="20vh"
              height="8vh"
              onClick={() => props.onStart()}
            >
              <b style={{ fontSize: 20, color: "#3C3C8C" }}>처음으로 가기</b>
            </Button>
            </Flex>            
          </div>
        </VStack>
      </Box>
    )}
  </div>
);

export default HistoryPresentation;
