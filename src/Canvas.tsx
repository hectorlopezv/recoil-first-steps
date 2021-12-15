import { Element, Rectangle } from "./components/Rectangle/Rectangle";
import { PageContainer } from "./PageContainer";
import { Toolbar } from "./Toolbar";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { EditProperties } from "./EditProperties";

export const elemtentsAtom = atom<number[]>({
  key: "elements",
  default: [],
});

export const selectedElemetnAtom = atom<null | number>({
  key: "selectedAtom",
  default: null,
});

export type SetElement = (indexToSet: number, newElement: Element) => void;

function Canvas() {
  const elements = useRecoilValue(elemtentsAtom);
  const [selectedElement, setSelectedElement] =
    useRecoilState(selectedElemetnAtom);

  return (
    <PageContainer
      onClick={() => {
        setSelectedElement(null);
      }}
    >
      <Toolbar />
      <EditProperties />
      {elements.map((id) => (
        <Rectangle key={id} id={id} />
      ))}
    </PageContainer>
  );
}

export default Canvas;
