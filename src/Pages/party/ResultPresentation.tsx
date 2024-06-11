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
import ReceiptList from "../../Components/ReceiptList";
import { sortReceiptInDate } from "../../Utils/utils";
import { Receipt } from "../../Interfaces/interfaces";

interface ResultPresentationProps {
  onBack: () => void;
  memberNames: string[];
  partyName: string;
  receipts: Receipt[] | undefined;
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

const ResultPresentation = (props: ResultPresentationProps) => (
  <Box width="100%" height="100vh" margin="20px">
    <VStack spacing={3} align="stretch">
      <div>
        <Button onClick={props.onBack}>뒤로가기</Button>
      </div>
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
            <Flex gap={2} justifyContent="center" alignItems="center">
              <Heading>
                {(
                  Math.round(
                    props.totalCostsByCurrency[props.selectedCurrency] * 10000
                  ) / 10000 || 0
                ).toLocaleString()}{" "}
              </Heading>
              <Heading>{props.selectedCurrency}</Heading>
            </Flex>
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
          overflowX="auto" // 여기에 overflowX를 추가
        >
          <Tabs position="relative" variant="unstyled">
            <TabList minWidth="max-content">
              {" "}
              {/* 여기에 minWidth를 추가 */}
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
                                  <Button as="span" flex="1" textAlign="left">
                                    <p style={{ fontSize: 20 }}>
                                      <b>{memberName}</b>님의 뿜빠이 결과
                                    </p>
                                  </Button>
                                </AccordionButton>
                              </h2>
                              <AccordionPanel bg="#EDF2F7">
                                {Object.keys(props.exchange).map(
                                  (currencyInner: string) =>
                                    props.exchange[currencyInner][memberName] &&
                                    Object.keys(
                                      props.exchange[currencyInner][memberName]
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
                                                  props.exchange[currencyInner][
                                                    memberName
                                                  ][receiver] * 10000
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
                              props.exchange[props.selectedCurrency][sender] ||
                                {}
                            ).map((receiver: string, receiverIndex: number) => (
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
                                        props.exchange[props.selectedCurrency][
                                          sender
                                        ][receiver] * 10000
                                      ) / 10000
                                    ).toLocaleString()}
                                  </b>
                                  ({props.selectedCurrency}) 주세요
                                </p>
                              </Container>
                            ))}
                          </AccordionPanel>
                        </AccordionItem>
                      )))}
              </Accordion>
            </Box>
          </div>
          <div>
            <Menu>
              <MenuButton as={Button}>{props.selectedTag || "전체"}</MenuButton>
              <MenuList>
                <MenuItem value="" onClick={() => props.handleTagClick("전체")}>
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
                <ReceiptList
                  receipts={sortReceiptInDate(props.filteredReceipts)}
                  setReceiptDetail={() => {}}
                  onOpenReceipt={() => {}}
                />
              )}
            </div>
          </div>
        </VStack>
      )}
    </VStack>
  </Box>
);

export default ResultPresentation;
