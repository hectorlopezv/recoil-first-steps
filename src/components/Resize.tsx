import { Resizable, ResizeHandle } from "react-resizable";
import { selectorFamily, useRecoilValue } from "recoil";
import { editPropertyState } from "../EditProperties";
import { getImageDimensions } from "../util";
import { Handle } from "./Handle";
import { elementState, ElementStyle } from "./Rectangle/Rectangle";

import { useLayoutEffect, useState } from "react";
const handlePlacements: ResizeHandle[] = [
  "n",
  "s",
  "e",
  "w",
  "ne",
  "nw",
  "se",
  "sw",
];

type ResizeProps = {
  selected: boolean;
  onResize: (style: ElementStyle) => void;
  keepAspectRatio: boolean;
  id: number;
  maxDimens: [number, number] | null;
} & ElementStyle;

export const Resize: React.FC<ResizeProps> = ({
  selected,
  children,
  position,
  size,
  onResize,
  keepAspectRatio = false,
  id,
  maxDimens,
}) => {
  return (
    <Resizable
      lockAspectRatio={keepAspectRatio}
      maxConstraints={maxDimens || [Infinity, Infinity]}
      width={size.width}
      height={size.height}
      onResize={(_, { size: newSize, handle }) => {
        let topDiff = 0;
        if (handle.includes("n")) {
          topDiff = size.height - newSize.height;
        }

        let leftDiff = 0;
        if (handle.includes("w")) {
          leftDiff = size.width - newSize.width;
        }

        onResize({
          size: {
            width: Math.round(newSize.width),
            height: Math.round(newSize.height),
          },
          position: {
            top: position.top + topDiff,
            left: position.left + leftDiff,
          },
        });
      }}
      resizeHandles={handlePlacements}
      handle={(placement) => (
        <div>
          <Handle placement={placement} visible={selected} />
        </div>
      )}
    >
      <div>{children}</div>
    </Resizable>
  );
};
