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

      <main className="w-full max-w-5xl p-8 bg-gray-100 rounded-lg shadow-sm">
        {/* A4 용지 크기: 210mm x 297mm (794px x 1123px) */}
        <article className="w-[210mm] h-[297mm] mx-auto bg-white shadow-lg p-[20mm] box-border overflow-hidden print:shadow-none print:p-0">
          {/* 여기에 A4 용지 내용을 추가하세요 */}
          <header className="mb-8 pb-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold mb-2">A4 용지 크기의 문서</h1>
            <p className="text-gray-600">
              이 문서는 A4 용지 크기로 설정되었습니다 (210mm x 297mm)
            </p>
          </header>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">문서 내용</h2>
            <p className="mb-3">
              이 문서는 Tailwind CSS를 사용하여 A4 용지 크기로 구현되었습니다.
              실제 A4 용지와 동일한 비율로 화면에 표시됩니다.
            </p>
            <p className="mb-3">
              인쇄 시에도 A4 용지 크기로 올바르게 출력됩니다.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">사용 방법</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>이 템플릿을 사용하여 문서를 작성할 수 있습니다.</li>
              <li>필요에 따라 내용을 수정하고 스타일을 변경하세요.</li>
              <li>인쇄 시 여백과 그림자가 자동으로 제거됩니다.</li>
            </ul>
          </section>

          {/* 드래그 가능한 섹션들 */}
          {sections.map((id) => (
            <DragSection key={id} id={id} onRemove={() => removeSection(id)} />
          ))}

          <footer className="mt-auto pt-4 border-t border-gray-200 text-gray-500 text-sm">
            <p>© 2024 A4 문서 템플릿</p>
          </footer>
        </article>
      </main>
    </div>
  );
}
