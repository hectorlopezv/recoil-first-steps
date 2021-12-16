import { Icon, IconButton, VStack } from "@chakra-ui/react";
import { elemtentsAtom } from "./Canvas";
import { Square, Image } from "react-feather";
import {
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { elementState, defaultElement } from "./components/Rectangle/Rectangle";
import { getRandomImage } from "./util";

export const Toolbar = () => {
  const elements = useRecoilValue(elemtentsAtom);
  const newId = elements.length;

  const insertElement = useRecoilCallback(
    ({ set }) =>
      (type: "rectangle" | "image") => {
        //add to array
        set(elemtentsAtom, (e) => [...e, newId]);
        // add new data to rectangle

        if (type === "image") {
          set(elementState(newId), {
            ...defaultElement,
            image: getRandomImage(),
          });
        }
      }
  );
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
          insertElement("image");
        }}
        aria-label="Add image"
        icon={<Icon style={{ width: 24, height: 24 }} as={Image} />}
      />
      <IconButton
        onClick={() => {
          insertElement("rectangle");
        }}
        aria-label="Add rectangle"
        icon={<Icon style={{ width: 24, height: 24 }} as={Square} />}
      />
    </VStack>
  );
};
