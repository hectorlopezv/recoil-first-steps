import {
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Text,
  VStack,
} from "@chakra-ui/react";
import { default as Get } from "lodash/get";
import { default as Set } from "lodash/set";
import {
  selector,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import { selectedElemetnAtom } from "./Canvas";
import { Element, elementState } from "./components/Rectangle/Rectangle";
import { produce } from "immer";
import { ImageInfo } from "./components/ImageInfo";
import { Suspense } from "react";

//Selectors families

export const editPropertyState = selectorFamily<
  any,
  { path: string; id: number }
>({
  key: "editProperty",
  get:
    ({ path, id }) =>
    ({ get }) => {
      const element = get(elementState(id));
      return Get(element, path);
    },
  set:
    ({ path, id }) =>
    ({ set, get }, newValue) => {
      const element = get(elementState(id));
      if (!element) return null;
      const newElement = produce(element, (draft) => {
        Set(draft, path, newValue);
      });
      set(elementState(id), newElement);
    },
});
const editSize = selectorFamily<
  any,
  { dimension: "width" | "height"; id: number }
>({
  key: "editSize",
  get:
    ({ dimension, id }) =>
    ({ get }) => {
      return get(editPropertyState({ path: `style.size.${dimension}`, id }));
    },
  set:
    ({ dimension, id }) =>
    ({ set, get }, newValue) => {
      const hasImage =
        get(editPropertyState({ path: "image", id })) !== undefined;
      if (!hasImage) {
        set(
          editPropertyState({ path: `style.size.${dimension}`, id }),
          newValue
        );
        return;
      }
      const size = editPropertyState({ path: `style.size`, id });

      const dimensions = get(size);

      const aspectRatio = dimensions.width / dimensions.height;

      if (dimension === "width") {
        set(size, {
          width: newValue,
          height: Math.round(newValue / aspectRatio),
        });
      }

      if (dimension === "height") {
        set(size, {
          height: newValue,
          width: Math.round(newValue * aspectRatio),
        });
      }
    },
});
const hasImageState = selector({
  key: "hasImage",
  get: ({ get }) => {
    const id = get(selectedElemetnAtom);
    if (id === null) return;
    const element = get(elementState(id));

    return element.image !== undefined;
  },
});
export const EditProperties = () => {
  const selectedElementId = useRecoilValue(selectedElemetnAtom);
  const hasImage = useRecoilValue(hasImageState);
  if (selectedElementId === null) return null;
  return (
    <Card>
      <Section heading="Position">
        <Property
          label="Top"
          path="style.position.top"
          id={selectedElementId}
        />
        <Property
          label="Left"
          path="style.position.left"
          id={selectedElementId}
        />
      </Section>

      <Section heading="Size">
        <SizeProperty label="Width" dimension="width" id={selectedElementId} />
        <SizeProperty
          label="Height"
          dimension="height"
          id={selectedElementId}
        />
      </Section>
      {hasImage && (
        <Suspense fallback={<div>....Loading</div>}>
          <ImageInfo />
        </Suspense>
      )}
    </Card>
  );
};

const Section: React.FC<{ heading: string }> = ({ heading, children }) => {
  return (
    <VStack spacing={2} align="flex-start">
      <Text fontWeight="500">{heading}</Text>
      {children}
    </VStack>
  );
};

const Property = ({ label, path, id }: any) => {
  const [value, setvalue] = useRecoilState(editPropertyState({ path, id }));
  if (value === null) return null;
  return <PropertyInput label={label} val={value} onChange={setvalue} />;
};
const SizeProperty = ({
  label,
  dimension,
  id,
}: {
  label: string;
  id: number;
  dimension: "width" | "height";
}) => {
  const [value, setvalue] = useRecoilState(editSize({ dimension, id }));
  if (value === null) return null;
  return <PropertyInput label={label} val={value} onChange={setvalue} />;
};

const PropertyInput = ({
  label,
  val,
  onChange,
}: {
  label: string;
  val: number;
  onChange: (value: number) => void;
}) => {
  return (
    <div>
      <Text fontSize="14px" fontWeight="500" mb="2px">
        {label}
      </Text>
      <InputGroup size="sm" variant="filled">
        <NumberInput value={val} onChange={(_, value) => onChange(value)}>
          <NumberInputField borderRadius="md" />
          <InputRightElement
            pointerEvents="none"
            children="px"
            lineHeight="1"
            fontSize="12px"
          />
        </NumberInput>
      </InputGroup>
    </div>
  );
};
const Card: React.FC = ({ children }) => (
  <VStack
    position="absolute"
    top="20px"
    right="20px"
    backgroundColor="white"
    padding={2}
    boxShadow="md"
    borderRadius="md"
    spacing={3}
    align="flex-start"
    onClick={(e) => e.stopPropagation()}
  >
    {children}
  </VStack>
);
