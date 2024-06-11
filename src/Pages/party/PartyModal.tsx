import { randomFill } from "crypto";
import { Party } from "../../Interfaces/interfaces";
import { Box, Text, Button, Input } from "@chakra-ui/react";

interface PartyModalProps {
  party: Party | undefined;
  onClickSetCurrentMember: (member: string) => void;
  newMemberName: string;
  setNewMemberName: (newMemberName: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickAddNewMember: () => void;
  randomName: string | undefined;
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
    <Box bg="white" p={6} rounded="md" boxShadow="md" width="400px" margin={4}>
      <Text fontSize="xl" fontWeight="bold" mb={2}>
        누구신가요?
      </Text>
      <Text mb={4}>이름을 선택해주세요!</Text>
      {props.party?.members?.map((member, index) => (
        <Button
          mb={2}
          width="100%"
          key={index}
          onClick={() => props.onClickSetCurrentMember(member)}
        >
          {member}
        </Button>
      ))}
      <Text mb={2}>새로운 파티인가요?</Text>
      <Input
        placeholder={props.randomName}
        mb={4}
        onChange={props.handleInputChange}
      />
      <Button bg="gray.300" width="100%" onClick={props.onClickAddNewMember}>
        새로 참여하기
      </Button>
    </Box>
  </Box>
);

export default PartyModal;
