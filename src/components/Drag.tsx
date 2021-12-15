import { DraggableCore } from "react-draggable";
import { ElementStyle } from "./Rectangle/Rectangle";
import { forwardRef } from "react";
type DragProps = {
  position: ElementStyle["position"];
  ref: any;
  onDrag: (position: ElementStyle["position"]) => void;
  children: any;
};

export const Drag = forwardRef<any, DragProps>((props, ref) => {
  return (
    <DraggableCore
      nodeRef={ref as any}
      onDrag={(e: any) => {
        props.onDrag({
          left: e.movementX + props.position.left,
          top: e.movementY + props.position.top,
        });
      }}
    >
      <div ref={ref}>{props.children}</div>
    </DraggableCore>
  );
});
