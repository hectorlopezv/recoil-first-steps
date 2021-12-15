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

//Selectors families

const editPropertyState = selectorFamily<number, { path: string; id: number }>({
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
export const EditProperties = () => {
  const selectedElementId = useRecoilValue(selectedElemetnAtom);
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
        <Property
          label="Width"
          path="style.size.width"
          id={selectedElementId}
        />
        <Property
          label="Height"
          path="style.size.height"
          id={selectedElementId}
        />
      </Section>
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
  return (
    <div>
      <Text fontSize="14px" fontWeight="500" mb="2px">
        {label}
      </Text>
      <InputGroup size="sm" variant="filled">
        <NumberInput value={value} onChange={(_, value) => setvalue(value)}>
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
