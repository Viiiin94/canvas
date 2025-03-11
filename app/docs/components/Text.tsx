"use client";

import React, { useState, useImperativeHandle, forwardRef } from "react";
import { MdOutlineDragIndicator, MdMoreVert } from "react-icons/md";

import { BlockType, TextHandle } from "@/app/type";
import { useBlockContent } from "@/app/docs/hooks/useBlockContent";
import { useBlockType } from "@/app/docs/hooks/useBlockType";
import { useBlockKeyboard } from "@/app/docs/hooks/useBlockKeyboard";
import { BLOCK_STYLES } from "@/app/docs/constants/styles";
import TextStyle from "./TextStyle";

interface TextProps {
  id: string;
  type: BlockType;
  initialContent?: string;
  onEnter: (id: string) => void;
  onBackspace: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
  onArrowUp: (id: string) => void;
  onArrowDown: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
  isDragging: boolean;
  isDraggedOver: boolean;
  dragPosition: "before" | "after" | null;
  onChangeType: (id: string, type: BlockType, content: string) => void;
}

const Text = forwardRef<TextHandle, TextProps>(
  (
    {
      id,
      type,
      initialContent = "",
      onEnter,
      onBackspace,
      onUpdate,
      onArrowUp,
      onArrowDown,
      onDragStart,
      onDragOver,
      onDrop,
      isDragging,
      isDraggedOver,
      dragPosition,
      onChangeType,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isOpenStyleMenu, setIsOpenStyleMenu] = useState(false);

    const { textRef, handleInput, setContent } = useBlockContent({
      initialContent,
      onUpdate,
      id,
    });

    const { handleMarkdownShortcut } = useBlockType({
      content: textRef.current?.textContent || "",
      onChangeType,
      id,
      setContent,
    });

    const { handleKeyDown } = useBlockKeyboard({
      id,
      type,
      onEnter,
      onBackspace,
      onArrowUp,
      onArrowDown,
      onChangeType,
      content: textRef.current?.textContent || "",
      handleMarkdownShortcut,
    });

    useImperativeHandle(ref, () => ({
      focus: () => {
        textRef.current?.focus();
        const range = document.createRange();
        const selection = window.getSelection();
        if (textRef.current && selection) {
          range.selectNodeContents(textRef.current);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      },
    }));

    const handleStyleChange = (style: "bold" | "italic" | "underline") => {
      if (!textRef.current) return;

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const selectedText = range.toString();

      const toggleStyle = (element: HTMLElement, style: string) => {
        const styleClasses = {
          bold: "font-bold",
          italic: "italic",
          underline: "underline",
        };
        const className = styleClasses[style as keyof typeof styleClasses];

        if (element.classList.contains(className)) {
          element.classList.remove(className);
        } else {
          element.classList.add(className);
        }
      };

      if (selectedText) {
        const span = document.createElement("span");
        toggleStyle(span, style);
        try {
          range.surroundContents(span);
        } catch (_) {
          const existSpan = range.commonAncestorContainer.parentElement;
          if (existSpan?.tagName === "SPAN") {
            toggleStyle(existSpan, style);
          }
        }
      } else {
        toggleStyle(textRef.current, style);
      }

      onUpdate(id, textRef.current.innerHTML);
    };

    const handleStyleMenu = () => {
      setIsOpenStyleMenu(!isOpenStyleMenu);
    };

    return (
      <>
        <div
          className={`group relative min-h-[1.5em] flex flex-col items-start gap-2 transition-all duration-200 
          ${isDragging ? "opacity-100" : "opacity-100"}
          ${isDraggedOver ? "z-10" : "z-0"}
          ${dragPosition === "before" && "border-blue-500"}`}
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, id)}
        >
          <div
            className="absolute left-0 top-1.5 -ml-5 opacity-0 group-hover:opacity-100 transition-opacity"
            draggable
            onDragStart={(e) => {
              e.stopPropagation();
              onDragStart(e, id);
            }}
          >
            <MdOutlineDragIndicator size={20} className="cursor-pointer" />
          </div>

          <div
            ref={textRef}
            contentEditable
            suppressContentEditableWarning
            className={`outline-none w-full min-h-[1.5em] px-2 py-1 rounded transition-all duration-200
            ${isFocused ? "bg-blue-50" : "hover:bg-gray-50"}
            ${isDraggedOver ? "ring-2 ring-blue-200" : ""}
            ${BLOCK_STYLES[type]}`}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => e.preventDefault()}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
          />

          <div className="absolute right-0 top-0.5 -mr-7 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <button
              className="p-1 hover:bg-gray-100 cursor-pointer"
              onClick={handleStyleMenu}
            >
              <MdMoreVert size={20} />
            </button>
          </div>
        </div>
        {isOpenStyleMenu && (
          <TextStyle
            isOpen={isOpenStyleMenu}
            handleStyleMenu={handleStyleMenu}
            onStyleChange={handleStyleChange}
          />
        )}
      </>
    );
  }
);

Text.displayName = "Text";

export default Text;
