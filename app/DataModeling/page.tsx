"use client";

import { useState } from "react";
import SideBox from "./components/SideBox";
import DragSection from "./components/DragSection";
import CreateTableModal from "./components/CreateTableModal";
import type { Table } from "@/app/type";

export default function Home() {
  const [sections, setSections] = useState<Table[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateTable = (tableName: string, parameterCount: number) => {
    setSections((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: tableName,
        parameters: parameterCount,
      },
    ]);
  };

  const removeSection = (id: number) => {
    setSections((prev) => prev.filter((section) => section.id !== id));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 p-4">
      <SideBox onAddSection={() => setIsModalOpen(true)} />

      <main className="w-full h-full p-8 bg-gray-100 rounded-lg shadow-sm">
        <article className="w-[297mm] h-[210mm] mx-auto bg-white shadow-lg p-[20mm] box-border overflow-hidden relative">
          {sections.map((section) => (
            <DragSection
              key={section.id}
              id={section.id}
              initialName={section.name}
              initialParameters={section.parameters}
              onRemove={() => removeSection(section.id)}
            />
          ))}
        </article>
      </main>

      <CreateTableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCreateTable}
      />
    </div>
  );
}
