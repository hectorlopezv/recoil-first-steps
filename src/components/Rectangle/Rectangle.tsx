import { FC, Suspense, useRef } from "react";
import { atomFamily, useRecoilState, useRecoilValue } from "recoil";
import { Drag } from "../Drag";
import { RectangleContainer } from "./RectangleContainer";
import { RectangleInner } from "./RectangleInner";
import { Resize } from "../Resize";
import { selectedElemetnAtom } from "../../Canvas";
import { RectangleLoading } from "./RectangleLoading";
export type ElementStyle = {
  position: { top: number; left: number };
  size: { width: number; height: number };
};

export type Element = {
  style: ElementStyle;
  image?: {
    id: number;
    src: string;
  };
};
interface props {
  id: number;
}

export const defaultElement = {
  style: {
    position: {
      top: 0,
      left: 0,
    },
    size: {
      width: 50,
      height: 50,
    },
  },
};

export const elementState = atomFamily<Element, number>({
  key: "element",
  default: defaultElement,
});
export const Rectangle: FC<props> = ({ id }) => {
  const nodeRef = useRef(null);
  const [selectedElement, setSelectedElement] =
    useRecoilState(selectedElemetnAtom);
  const [element, setElement] = useRecoilState(elementState(id));
  return (
    <RectangleContainer
      position={element.style.position}
      size={element.style.size}
      onSelect={() => {
        setSelectedElement(id);
      }}
    >
      <Resize
        selected={id === selectedElement}
        position={element.style.position}
        size={element.style.size}
        onResize={(style) => {
          setElement({
            ...element,
            style,
          });
        }}
      >
        <Drag
          position={element.style.position}
          ref={nodeRef}
          onDrag={(position) => {
            setElement({
              ...element,
              style: {
                ...element.style,
                position,
              },
            });
          }}
        >
          <div>
            <Suspense
              fallback={<RectangleLoading selected={id === selectedElement} />}
            >
              <RectangleInner selected={id === selectedElement} id={id} />
            </Suspense>
          </div>
        </Drag>
      </Resize>
    </RectangleContainer>
  );
};
