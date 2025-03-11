import React, { useRef, useEffect } from "react";

interface TextStyleProps {
  isOpen: boolean;
  handleStyleMenu: () => void;
  onStyleChange: (style: "bold" | "italic" | "underline") => void;
}

const TextStyle = ({
  isOpen,
  handleStyleMenu,
  onStyleChange,
}: TextStyleProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        handleStyleMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={menuRef}
      className="absolute top-0 right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden z-1000"
    >
      <div className="p-2">
        <div className="text-xs font-medium text-gray-500 px-3 py-1">기본</div>
        <div className="space-y-0.5">
          <button
            onClick={() => onStyleChange("bold")}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
            <span>폰트 굵기</span>
          </button>
          <button
            onClick={() => onStyleChange("italic")}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span>폰트 기울임</span>
          </button>
          <button
            onClick={() => onStyleChange("underline")}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            <span>밑 줄</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextStyle;
