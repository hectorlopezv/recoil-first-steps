import { Box } from "@chakra-ui/react";
import { useEffect, useLayoutEffect } from "react";
import {
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { getBorderColor, getImageDimensions } from "../../util";
import { elementState } from "./Rectangle";
import { editPropertyState } from "../../EditProperties";
const imageSizeState = selectorFamily({
  key: "imageSize",
  get: (src: string | undefined) => async () => {
    if (src === undefined) return;
    return await getImageDimensions(src);
  },
});
export const RectangleInner = ({
  selected,
  id,
}: {
  selected: boolean;
  id: number;
}) => {
  const [element, setElement] = useRecoilState(elementState(id));
  const imageSize = useRecoilValue(imageSizeState(element.image?.src));
  const setSize = useSetRecoilState(
    editPropertyState({ path: "style.size", id })
  );
  useEffect(() => {
    if (!imageSize) return;

    setSize(imageSize);
  }, [imageSize]);
  return (
    <Box
      position="absolute"
      border={`1px solid ${getBorderColor(selected)}`}
      transition="0.1s border-color ease-in-out"
      width="100%"
      height="100%"
      display="flex"
      padding="2px"
    >
      <Box
        flex="1"
        border="3px dashed #101010"
        borderRadius="255px 15px 225px 15px/15px 225px 15px 255px"
        backgroundColor="white"
        backgroundImage={`url(${element.image?.src})`}
      />
    </Box>
  );
};
