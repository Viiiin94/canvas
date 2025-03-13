"use client";

import React from "react";

interface SideBoxProps {
  onAddSection: () => void;
}

const SideBox = ({ onAddSection }: SideBoxProps) => {
  return (
    <aside className="w-64 bg-white rounded-lg shadow-sm p-4 mr-4 h-[calc(100vh-6rem)] flex flex-col">
      <h2 className="text-lg font-medium text-gray-800 mb-4">
        데이터베이스 모델링
      </h2>
      <div className="flex-1 overflow-y-auto">
        <button
          onClick={() => {
            console.log("Add table button clicked"); // 디버깅용 로그 추가
            onAddSection();
          }}
          className="w-full flex items-center p-2 rounded-md hover:bg-blue-50 text-blue-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          테이블 추가
        </button>
      </div>
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-600 mb-2">도움말</h3>
        <div className="text-xs text-gray-500 space-y-2">
          <p>• 테이블을 드래그하여 위치를 조정할 수 있습니다.</p>
          <p>
            • 테이블 연결 버튼을 클릭하여 테이블 간 관계를 설정할 수 있습니다.
          </p>
          <p>• 테이블 우측 하단을 드래그하여 크기를 조정할 수 있습니다.</p>
        </div>
      </div>
    </aside>
  );
};

export default SideBox;
