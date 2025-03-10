"use client";

import { useState, useRef, MouseEvent, useEffect } from "react";

interface DragSectionProps {
  id: number;
  onRemove: () => void;
}

const DragSection = ({ id, onRemove }: DragSectionProps) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 200, height: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const handleMouseDown = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (target.closest(`.handle-${id}`)) {
      setIsDragging(true);
      const rect = dragRef.current?.getBoundingClientRect();
      if (rect) {
        offsetRef.current = {
          x: e.pageX - (rect.left + window.scrollX),
          y: e.pageY - (rect.top + window.scrollY),
        };
      }
    } else if (target.closest("[data-resize]")) {
      setIsResizing(true);
      const direction =
        target.closest("[data-resize]")?.getAttribute("data-resize") || null;
      setResizeDirection(direction);
      const rect = dragRef.current?.getBoundingClientRect();
      if (rect) {
        resizeStartRef.current = {
          x: e.pageX,
          y: e.pageY,
          width: rect.width,
          height: rect.height,
        };
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.pageX - offsetRef.current.x,
          y: e.pageY - offsetRef.current.y,
        });
      } else if (isResizing) {
        const deltaX = e.pageX - resizeStartRef.current.x;
        const deltaY = e.pageY - resizeStartRef.current.y;

        const minWidth = 100;
        const minHeight = 50;

        switch (resizeDirection) {
          case "e":
            setSize((prev) => ({
              ...prev,
              width: Math.max(resizeStartRef.current.width + deltaX, minWidth),
            }));
            break;
          case "s":
            setSize((prev) => ({
              ...prev,
              height: Math.max(
                resizeStartRef.current.height + deltaY,
                minHeight
              ),
            }));
            break;
          case "se":
            setSize({
              width: Math.max(resizeStartRef.current.width + deltaX, minWidth),
              height: Math.max(
                resizeStartRef.current.height + deltaY,
                minHeight
              ),
            });
            break;
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, resizeDirection]);

  return (
    <div
      ref={dragRef}
      className="absolute bg-white overflow-hidden"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        cursor: isDragging ? "grabbing" : "auto",
      }}
      onMouseDown={handleMouseDown}
    >
      <div className={`handle-${id} w-full h-full border`}>
        <textarea
          className="w-full h-[calc(100%-40px)] resize-none border-none outline-none"
          style={{ overflow: "auto" }}
        />
      </div>
      <div
        className="absolute right-0 top-1/2 w-1 h-6 bg-gray-300 hover:bg-gray-400 cursor-e-resize -translate-y-1/2"
        data-resize="e"
      />
      <div
        className="absolute bottom-0 left-1/2 h-1 w-6 bg-gray-300 hover:bg-gray-400 cursor-s-resize -translate-x-1/2"
        data-resize="s"
      />
      <div
        className="absolute bottom-0 right-0 w-2 h-2 bg-gray-300 hover:bg-gray-400 cursor-se-resize"
        data-resize="se"
      />
    </div>
  );
};

export default DragSection;
