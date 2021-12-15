import {
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Text,
  VStack,
} from "@chakra-ui/react";
import { selector, useRecoilState } from "recoil";
import { selectedElemetnAtom } from "./Canvas";
import { Element, elementState } from "./components/Rectangle/Rectangle";

const selectedElementProperties = selector<Element | undefined>({
  key: "selectedelementProperties",
  get: ({ get }) => {
    const selectedeElementId = get(selectedElemetnAtom);
    if (selectedeElementId === null) return;
    const elementProperty = get(elementState(selectedeElementId as number));
    return elementProperty;
  },
  set: ({ get, set }, properties) => {
    const selectedElementId = get(selectedElemetnAtom);
    if (selectedElementId === null) return null;
    if (!properties) return;
    set(elementState(selectedElementId), properties);
  },
});
export const EditProperties = () => {
  const [element, setElement] = useRecoilState(selectedElementProperties);
  if (!element) return null;
  const setPosition = (property: "top" | "left", value: number) => {
    setElement({
      ...element,
      style: {
        position: {
          ...element.style.position,
          [property]: value,
        },
        size: {
          ...element.style.size,
        },
      },
    });
  };

  const setSize = (property: "heigth" | "width", value: number) => {
    setElement({
      ...element,
      style: {
        size: {
          ...element.style.size,
          [property]: value,
        },
        position: {
          ...element.style.position,
        },
      },
    });
  };

  return (
    <Card>
      <Section heading="Position">
        <Property
          label="Top"
          value={element.style.position.top}
          onChange={(top) => setPosition("top", top)}
        />
        <Property
          label="Left"
          value={element.style.position.left}
          onChange={(left) => setPosition("left", left)}
        />
      </Section>

      <Section heading="Size">
        <Property
          label="Width"
          value={element.style.size.width}
          onChange={(width) => setSize("width", width)}
        />
        <Property
          label="Heigth"
          value={element.style.size.height}
          onChange={(heigth) => setSize("heigth", heigth)}
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

const Property = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) => {
  return (
    <div>
      <Text fontSize="14px" fontWeight="500" mb="2px">
        {label}
      </Text>
      <InputGroup size="sm" variant="filled">
        <NumberInput value={value} onChange={(_, value) => onChange(value)}>
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
