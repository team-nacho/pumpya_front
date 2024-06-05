import { Party } from "../../Interfaces/interfaces";
import { Box, Text, Button } from "@chakra-ui/react";

interface PartyModalProps {
  party: Party | undefined;
  onClickSetCurrentMember: (member: string) => void;
}

const PartyModal = (props: PartyModalProps) => (
  <Box
    position="fixed"
    top="0"
    left="0"
    width="100%"
    height="100%"
    bg="rgba(0, 0, 0, 0.5)"
    display="flex"
    justifyContent="center"
    alignItems="center"
  >
    <Box bg="white" p={6} rounded="md" boxShadow="md" width="400px">
      <Text fontSize="xl" fontWeight="bold" mb={2}>
        누구신가요?
      </Text>
      <Text mb={4}>이름을 선택해주세요!</Text>
      {props.party?.members.map((member, index) => (
        <Button
          mb={2}
          width="100%"
          key={index}
          onClick={() => props.onClickSetCurrentMember(member)}
        >
          {member}
        </Button>
      ))}
    </Box>
  </Box>
);

export default PartyModal;
