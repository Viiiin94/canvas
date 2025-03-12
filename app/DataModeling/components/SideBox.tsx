"use client";

import React from "react";

interface SideBoxProps {
  onAddSection: () => void;
}

const SideBox = ({ onAddSection }: SideBoxProps) => {
  return (
    <aside className="fixed right-10 top-16 bg-white p-4 rounded-lg shadow-md z-10 flex flex-col gap-3">
      <h3 className="text-lg font-semibold mb-2">도구 상자</h3>
      <button
        onClick={onAddSection}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
      >
        드래그 섹션 추가
      </button>
    </aside>
  );
};

export default SideBox;
