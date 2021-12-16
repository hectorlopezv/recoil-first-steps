import { Box, Text, VStack } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";
import { selector, useRecoilValue } from "recoil";
import { callApi } from "../api";
import { selectedElemetnAtom } from "../Canvas";
import { elementState } from "./Rectangle/Rectangle";

const imageIdState = selector({
  key: "imageId",
  get: ({ get }) => {
    const id = get(selectedElemetnAtom);
    if (id === undefined || id === null) return;

    return get(elementState(id)).image?.id;
  },
});

const imageInfoState = selector({
  key: "imageInfo",
  get: ({ get }) => {
    const imageId = get(imageIdState); // como el id no cambia esto esta cacheado y no corre denuevo,
    // entonces este selector no corre denuevo!!!!
    if (!imageId) return;
    return callApi("image-details", { queryParams: { seed: imageId } });
  },
});

export const ImageInfo = () => {
  const imageDetails = useRecoilValue(imageInfoState);

  return (
    <VStack spacing={2} alignItems="flex-start" width="100ewe%">
      <Info label="Author" value={imageDetails.author} />
      <Info label="Image URL" value={imageDetails.url} />
    </VStack>
  );
};

export const ImageInfoFallback = () => {
  return (
    <VStack spacing={2} alignItems="flex-start" width="100%">
      <Info label="Author" />
      <Info label="Image URL" />
    </VStack>
  );
};

export const Info = ({ label, value }: { label: string; value?: string }) => {
  return (
    <Box width="175px">
      <Text fontSize="14px" fontWeight="500" mb="2px">
        {label}
      </Text>
      {value === undefined ? (
        <Skeleton width="100%" height="21px" />
      ) : (
        <Text fontSize="14px">{value}</Text>
      )}
    </Box>
  );
};
