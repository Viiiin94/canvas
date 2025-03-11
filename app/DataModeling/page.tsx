"use client";

import { useState } from "react";
import SideBox from "./_components/SideBox";
import DragSection from "./_components/DragSection";

export default function Home() {
  const [sections, setSections] = useState<number[]>([]);

  const addSection = () => {
    setSections((prev) => [...prev, Date.now()]);
  };

  const removeSection = (id: number) => {
    setSections((prev) => prev.filter((sectionId) => sectionId !== id));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 p-4">
      <SideBox onAddSection={addSection} />

      <main className="w-full h-full p-8 bg-gray-100 rounded-lg shadow-sm">
        {/* A4 용지 크기: 210mm x 297mm (794px x 1123px) */}
        <article className="w-[297mm] h-[210mm] mx-auto bg-white shadow-lg p-[20mm] box-border overflow-hidden print:shadow-none print:p-0">
          {/* 드래그 가능한 섹션들 */}
          {sections.map((id) => (
            <DragSection key={id} id={id} onRemove={() => removeSection(id)} />
          ))}
        </article>
      </main>
    </div>
  );
}
