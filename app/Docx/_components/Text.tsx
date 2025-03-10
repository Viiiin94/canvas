"use client";

import React, {
  useState,
  useRef,
  KeyboardEvent,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";

interface TextProps {
  id: string;
  initialContent?: string;
  onEnter: (id: string) => void;
  onBackspace: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
  onArrowUp: (id: string) => void;
  onArrowDown: (id: string) => void;
}

export interface TextHandle {
  focus: () => void;
}

const Text = forwardRef<TextHandle, TextProps>(
  (
    {
      id,
      initialContent = "",
      onEnter,
      onBackspace,
      onUpdate,
      onArrowUp,
      onArrowDown,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const textRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef(initialContent);

    useEffect(() => {
      if (textRef.current && contentRef.current === "") {
        textRef.current.textContent = initialContent;
        contentRef.current = initialContent;
      }
    }, [initialContent]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        textRef.current?.focus();
        // 커서를 텍스트 끝으로 이동
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

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onEnter(id);
      }

      if (e.key === "Backspace" && textRef.current?.textContent === "") {
        e.preventDefault();
        onBackspace(id);
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        onArrowUp(id);
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        onArrowDown(id);
      }
    };

    const handleInput = () => {
      const newContent = textRef.current?.textContent || "";
      if (newContent !== contentRef.current) {
        contentRef.current = newContent;
        onUpdate(id, newContent);
      }
    };

    return (
      <div className="group relative min-h-[1.5em] flex items-start gap-2">
        <div className="absolute left-0 top-1.5 -ml-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-2 h-2 rounded-sm bg-gray-300 cursor-move" />
        </div>

        <div
          ref={textRef}
          contentEditable
          suppressContentEditableWarning
          className={`outline-none w-full min-h-[1.5em] px-2 py-1 rounded ${
            isFocused ? "bg-blue-50" : "hover:bg-gray-50"
          }`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
        />

        <div className="absolute right-0 top-1 -mr-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <button className="p-1 hover:bg-gray-100 rounded">
            <span className="text-xs text-gray-500">+</span>
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <span className="text-xs text-gray-500">⋮</span>
          </button>
        </div>
      </div>
    );
  }
);

Text.displayName = "Text";

export default Text;
