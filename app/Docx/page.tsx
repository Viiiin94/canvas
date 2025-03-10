"use client";

import { useState, createRef } from "react";
import Text, { TextHandle } from "./_components/Text";

interface Block {
  id: string;
  type: "text";
  content: string;
  ref: React.RefObject<TextHandle | null>;
}

export default function Home() {
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: "1",
      type: "text",
      content: "",
      ref: createRef<TextHandle | null>(),
    },
  ]);

  const handleEvent = {
    enter: (id: string) => {
      setBlocks((prev) => {
        const index = prev.findIndex((block) => block.id === id);
        if (index === -1) return prev;

        const newBlock: Block = {
          id: Date.now().toString(),
          type: "text",
          content: "",
          ref: createRef<TextHandle | null>(),
        };

        const newBlocks = [
          ...prev.slice(0, index + 1),
          newBlock,
          ...prev.slice(index + 1),
        ];

        // setTimeout을 사용하여 다음 렌더링 사이클에서 포커스 설정
        setTimeout(() => {
          newBlock.ref.current?.focus();
        }, 0);

        return newBlocks;
      });
    },
    backspace: (id: string) => {
      setBlocks((prev) => {
        const index = prev.findIndex((block) => block.id === id);
        if (index <= 0) return prev;

        const newBlocks = prev.filter((_, i) => i !== index);

        // 이전 블록으로 포커스 이동
        setTimeout(() => {
          newBlocks[index - 1].ref.current?.focus();
        }, 0);

        return newBlocks;
      });
    },
    update: (id: string, content: string) => {
      setBlocks((prev) =>
        prev.map((block) => (block.id === id ? { ...block, content } : block))
      );
    },
    arrowUp: (id: string) => {
      const index = blocks.findIndex((block) => block.id === id);
      if (index > 0) {
        blocks[index - 1].ref.current?.focus();
      }
    },
    arrowDown: (id: string) => {
      const index = blocks.findIndex((block) => block.id === id);
      if (index < blocks.length - 1) {
        blocks[index + 1].ref.current?.focus();
      }
    },
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 p-4">
      <main className="p-4 bg-gray-100 rounded-lg shadow-sm">
        <article
          className="w-[210mm] h-[297mm] mx-auto bg-white
                            shadow-lg p-[20mm] box-border overflow-y-auto
                            print:shadow-none print:p-0"
        >
          <div className="space-y-1">
            {blocks.map((block) => (
              <Text
                key={block.id}
                ref={block.ref}
                id={block.id}
                initialContent={block.content}
                onEnter={handleEvent.enter}
                onBackspace={handleEvent.backspace}
                onUpdate={handleEvent.update}
                onArrowUp={handleEvent.arrowUp}
                onArrowDown={handleEvent.arrowDown}
              />
            ))}
          </div>
        </article>
      </main>
    </div>
  );
}
