"use client";

import { useState, createRef, useEffect, RefObject, useRef } from "react";
import { useReactToPrint } from "react-to-print";

import Text from "./components/Text";
import { TextHandle, BlockType } from "../type";

interface Block {
  id: string;
  type: BlockType;
  content: string;
  ref: RefObject<TextHandle | null>;
}

export default function Docs() {
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: "1",
      type: "text",
      content: "",
      ref: createRef<TextHandle | null>(),
    },
  ]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState<"before" | "after" | null>(
    null
  );

  const printRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({ contentRef: printRef });

  useEffect(() => {
    blocks[0].ref.current?.focus();
  }, []);

  const handleEvent = {
    enter: (id: string) => {
      setBlocks(prev => {
        const index = prev.findIndex(block => block.id === id);
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

        setTimeout(() => {
          newBlock.ref.current?.focus();
        }, 0);

        return newBlocks;
      });
    },

    backspace: (id: string) => {
      setBlocks(prev => {
        const index = prev.findIndex(block => block.id === id);
        if (index <= 0) return prev;

        const newBlocks = prev.filter((_, i) => i !== index);

        setTimeout(() => {
          newBlocks[index - 1].ref.current?.focus();
        }, 0);

        return newBlocks;
      });
    },

    update: (id: string, content: string) => {
      setBlocks(prev =>
        prev.map(block => (block.id === id ? { ...block, content } : block))
      );
    },

    arrowUp: (id: string) => {
      const index = blocks.findIndex(block => block.id === id);
      if (index > 0) {
        blocks[index - 1].ref.current?.focus();
      }
    },

    arrowDown: (id: string) => {
      const index = blocks.findIndex(block => block.id === id);
      if (index < blocks.length - 1) {
        blocks[index + 1].ref.current?.focus();
      }
    },

    dragStart: (e: React.DragEvent, id: string) => {
      setDraggedId(id);
      e.dataTransfer.setData("text/plain", id);
    },

    dragOver: (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";

      const targetId =
        (e.currentTarget as HTMLElement).getAttribute("data-id") ||
        (e.currentTarget.parentElement as HTMLElement).getAttribute("data-id");

      if (!targetId || targetId === draggedId) {
        setDragOverId(null);
        setDragPosition(null);
        return;
      }

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const mouseY = e.clientY;
      const threshold = rect.top + rect.height / 2;

      setDragOverId(targetId);
      setDragPosition(mouseY < threshold ? "before" : "after");
    },

    drop: (e: React.DragEvent, targetId: string) => {
      e.preventDefault();

      if (!draggedId || draggedId === targetId) {
        setDragOverId(null);
        setDragPosition(null);
        return;
      }

      setBlocks(prev => {
        const items = [...prev];
        const draggedIndex = items.findIndex(item => item.id === draggedId);
        const targetIndex = items.findIndex(item => item.id === targetId);

        let newTargetIndex = targetIndex;
        if (dragPosition === "after") {
          newTargetIndex = targetIndex + 1;
        }

        if (draggedIndex < newTargetIndex) {
          newTargetIndex--;
        }

        const [draggedItem] = items.splice(draggedIndex, 1);
        items.splice(targetIndex, 0, draggedItem);

        setTimeout(() => {
          blocks[draggedIndex].ref.current?.focus();
        }, 0);

        return items;
      });

      setDraggedId(null);
      setDragOverId(null);
      setDragPosition(null);
    },

    changeType: (id: string, newType: BlockType, newContent: string) => {
      setBlocks(prev =>
        prev.map(block =>
          block.id === id
            ? { ...block, type: newType, content: newContent }
            : block
        )
      );
    },
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 p-4">
      <button onClick={() => handlePrint()} className="pointer-cursor">
        프린트
      </button>
      <main className="p-4 bg-gray-100 rounded-lg shadow-sm">
        <article
          ref={printRef}
          className="w-[210mm] h-[297mm] mx-auto bg-white
                    shadow-lg p-[20mm] box-border overflow-y-auto
                    print:shadow-none"
        >
          <div className="space-y-1">
            {blocks.map(block => (
              <div key={block.id} data-id={block.id} className="relative">
                <Text
                  ref={block.ref}
                  id={block.id}
                  type={block.type}
                  initialContent={block.content}
                  onEnter={handleEvent.enter}
                  onBackspace={handleEvent.backspace}
                  onUpdate={handleEvent.update}
                  onArrowUp={handleEvent.arrowUp}
                  onArrowDown={handleEvent.arrowDown}
                  onDragStart={handleEvent.dragStart}
                  onDragOver={handleEvent.dragOver}
                  onDrop={handleEvent.drop}
                  onChangeType={handleEvent.changeType}
                  isDragging={block.id === draggedId}
                  isDraggedOver={block.id === dragOverId}
                  dragPosition={block.id === dragOverId ? dragPosition : null}
                />
              </div>
            ))}
          </div>
        </article>
      </main>
    </div>
  );
}
