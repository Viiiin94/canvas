import { KeyboardEvent } from "react";
import { BlockType } from "@/app/type";

interface UseBlockKeyboardProps {
  id: string;
  type: BlockType;
  onEnter: (id: string) => void;
  onBackspace: (id: string) => void;
  onArrowUp: (id: string) => void;
  onArrowDown: (id: string) => void;
  onChangeType: (id: string, type: BlockType, content: string) => void;
  content: string;
  handleMarkdownShortcut: (e: KeyboardEvent<HTMLDivElement>) => boolean;
}

export const useBlockKeyboard = ({
  id,
  type,
  onEnter,
  onBackspace,
  onArrowUp,
  onArrowDown,
  onChangeType,
  content,
  handleMarkdownShortcut,
}: UseBlockKeyboardProps) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onEnter(id);
      return;
    }

    if (e.key === "Backspace" && content === "") {
      e.preventDefault();
      if (type !== "text") {
        onChangeType(id, "text", "");
      } else {
        onBackspace(id);
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      onArrowUp(id);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      onArrowDown(id);
      return;
    }

    handleMarkdownShortcut(e);
  };

  return {
    handleKeyDown,
  };
};
