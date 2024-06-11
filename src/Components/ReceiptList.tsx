import { Flex, Text } from "@chakra-ui/react";
import moment from "moment";
import { Receipt } from "../Interfaces/interfaces";


interface ReceiptListProps {
  receipts: Map<string, Receipt[]>;
  setReceiptDetail: (receipt: Receipt) => void | undefined;
  onOpenReceipt: () => void | undefined;
}
const ReceiptList = (props: ReceiptListProps) => (
  <>
  {
    Array.from(props.receipts)
    .map((m: [string, Receipt[]], index: number) => (
      <>
        <Text mb="2" key={index}>
          {moment(m[0]).format('M월 D일')}
        </Text>
      {
        m[1].map((receipt: Receipt, index: number) => (
          <Flex
            flexDirection="column"
            key={index}
            alignItems="flex-start"
            onClick={() => {
              props.setReceiptDetail(receipt);
              props.onOpenReceipt();
            }}
          > 
            <Flex w="100%" justify="space-between" align="center">
              <Text fontSize="lg" as="b">
                {receipt.receiptName}
              </Text>
              <Text fontSize="lg" as="b">
                {receipt.useCurrency} {receipt.cost.toLocaleString()}
              </Text>
            </Flex>
            <Flex w="100%" justifyContent="space-between">
              <Flex gap="2">
                <Text size='sm' color="gray.500">{moment(receipt.createdAt).format('HH:mm')}</Text>
                {receipt.useTag}
              </Flex>
              <Text size='sm' color="gray.500">{receipt.author}</Text>
            </Flex>
          </Flex>
        ))
      }
      </>
    ))
  }
  </>
)

export default ReceiptList;