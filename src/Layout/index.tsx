import { Flex } from "@chakra-ui/react";

interface MainLayoutProps {
  children: React.ReactNode;
}
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Flex
      justify="center"
      p="20px" 
    >
      {children}
    </Flex>
  );
};

export default MainLayout;
