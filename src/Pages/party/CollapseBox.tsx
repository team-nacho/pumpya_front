import { useState } from "react";
import { Box, Text, Collapse, Button } from "@chakra-ui/react";

interface CollapseBoxProps {
  title: string;
  details: string[];
}

const CollapseBox = ({ title, details }: CollapseBoxProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Box>
      <Button onClick={toggleCollapse} p={0}>
        <Box
          display="inline-block"
          bg="gray.100"
          p={4}
          rounded="md"
          border="1px solid gray.100"
          cursor="pointer"
        >
          <Text>{title}</Text>
          <Collapse in={!isCollapsed} animateOpacity>
            <Box mt={2}>
              {details.map((detail, index) => (
                <Text key={index}>{detail}</Text>
              ))}
            </Box>
          </Collapse>
        </Box>
      </Button>
      <Text fontSize="2xl" display="inline-block" ml={4}>
        과 함께
      </Text>
    </Box>
  );
};

export default CollapseBox;
