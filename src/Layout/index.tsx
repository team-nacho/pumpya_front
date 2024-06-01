import { Flex } from "@chakra-ui/react";

interface MainLayoutProps {
  children: React.ReactNode;
}
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Flex
      justify="center" // 가운데 정렬
      minW="320px" // 최대 가로 너비 설정
      m="auto" // 가운데 정렬
      gap="20px" // 자식 컴포넌트들 사이의 간격 설정
    >
      {children}
    </Flex>
  );
};

export default MainLayout;
