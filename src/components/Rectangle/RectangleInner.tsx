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
export const imageSizeState = selectorFamily({
  key: "imageSize",
  get: (src: string | undefined) => async () => {
    if (src === undefined) return;
    console.log("hello");
    return await getImageDimensions(src);
  },
});
export const RectangleInner = ({
  selected,
  id,
  setmaxDimens,
}: {
  selected: boolean;
  id: number;
  setmaxDimens: (...args: any[]) => void;
}) => {
  const [element, setElement] = useRecoilState(elementState(id));
  const imageSize = useRecoilValue(imageSizeState(element.image?.src));
  const setSize = useSetRecoilState(
    editPropertyState({ path: "style.size", id })
  );
  useLayoutEffect(() => {
    if (!imageSize) return;

    setmaxDimens([imageSize.width, imageSize.height]);
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
