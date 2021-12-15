import { Icon, IconButton, VStack } from "@chakra-ui/react";
import { elemtentsAtom } from "./Canvas";
import { Square } from "react-feather";
import { useRecoilState, useSetRecoilState } from "recoil";

export const Toolbar = () => {
  const setElemetns = useSetRecoilState(elemtentsAtom);

  return (
    <VStack
      position="absolute"
      top="20px"
      left="20px"
      backgroundColor="white"
      padding={2}
      boxShadow="md"
      borderRadius="md"
      spacing={2}
    >
      <IconButton
        onClick={() => {
          setElemetns((elements: any) => [...elements, elements.length]);
        }}
        aria-label="Add rectangle"
        icon={<Icon style={{ width: 24, height: 24 }} as={Square} />}
      />
    </VStack>
  );
};
