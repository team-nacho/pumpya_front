import { Button, Progress, Spinner, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

interface BlinkingTextProps {
    children: React.ReactNode; // children prop의 타입을 명시
  }

const blinkAnimation = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const BlinkingText = ({ children } : BlinkingTextProps) => (
    <Text
      fontSize="xl"
      fontWeight="bold"
      animation={`${blinkAnimation} 1s linear infinite`}
    >
      {children}
    </Text>
  );

const LoadingPresentation = () => {
  return (
    <div>
      <br></br>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      <BlinkingText>Loading...</BlinkingText>
    </div>
  );
};

export default LoadingPresentation;
