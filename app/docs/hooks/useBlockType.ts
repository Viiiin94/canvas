import { KeyboardEvent } from "react";
import { BlockType } from "@/app/type";

interface UseBlockTypeProps {
  content: string;
  onChangeType: (id: string, type: BlockType, content: string) => void;
  id: string;
  setContent: (content: string) => void;
}

export const useBlockType = ({
  content,
  onChangeType,
  id,
  setContent,
}: UseBlockTypeProps) => {
  const handleMarkdownShortcut = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== " ") return false;

    const shortcuts: Record<string, BlockType> = {
      "#": "h1",
      "##": "h2",
      "###": "h3",
    };

    const newType = shortcuts[content];
    if (newType) {
      e.preventDefault();
      setContent("");
      onChangeType(id, newType, "");
      return true;
    }

    return false;
  };

  return {
    handleMarkdownShortcut,
  };
};
