"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import type { Parameter } from "@/app/type";

interface DragSectionProps {
  id: number;
  initialName: string;
  initialParameters: number | Parameter[];
  onRemove: () => void;
  startConnection?: () => void;
  isConnecting?: boolean;
  isActiveConnection?: boolean;
  onPositionChange?: () => void;
}

const DragSection = ({
  id,
  initialName,
  initialParameters,
  onRemove,
  startConnection,
  isConnecting = false,
  isActiveConnection = false,
  onPositionChange,
}: DragSectionProps) => {
  const [position, setPosition] = useState(() => {
    // id를 작은 숫자로 변환하여 사용 (0부터 시작하는 인덱스처럼)
    const smallerId = typeof id === "number" ? id % 10 : 0;
    return {
      x: 100 + (smallerId % 3) * 350,
      y: 100 + Math.floor(smallerId / 3) * 250,
    };
  });
  const [size, setSize] = useState({ width: 300, height: 250 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState("");
  const [tableName, setTableName] = useState(initialName);

  // Generate initial parameters if a number was provided
  const generateInitialParams = () => {
    if (typeof initialParameters === "number") {
      console.log(`Generating ${initialParameters} parameters for table ${id}`); // 디버깅용 로그 추가
      return Array.from({ length: initialParameters }, (_, i) => ({
        id: `p${id}-${i}`,
        name: i === 0 ? "id" : `field${i}`,
        type: i === 0 ? "number" : "string",
      }));
    }
    return initialParameters as Parameter[];
  };

  const [parameters, setParameters] = useState<Parameter[]>(
    generateInitialParams
  );

  const dragRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-resize]")) {
      // Handle resize
      const direction = (e.target as HTMLElement).getAttribute("data-resize");
      if (direction) {
        setIsResizing(true);
        setResizeDirection(direction);
        startPos.current = { x: e.clientX, y: e.clientY };
        startSize.current = { ...size };
      }
    } else {
      // Handle drag
      setIsDragging(true);
      startPos.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    }
  };

  // Handle mouse move for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newPosition = {
          x: e.clientX - startPos.current.x,
          y: e.clientY - startPos.current.y,
        };

        setPosition(newPosition);
      } else if (isResizing) {
        const dx = e.clientX - startPos.current.x;
        const dy = e.clientY - startPos.current.y;

        if (resizeDirection === "e" || resizeDirection === "se") {
          setSize((prev) => ({
            ...prev,
            width: Math.max(200, startSize.current.width + dx),
          }));
        }

        if (resizeDirection === "s" || resizeDirection === "se") {
          setSize((prev) => ({
            ...prev,
            height: Math.max(150, startSize.current.height + dy),
          }));
        }
      }
    };

    const handleMouseUp = () => {
      if (isDragging || isResizing) {
        // 드래그나 리사이즈가 끝났을 때 부모에게 알림
        if (onPositionChange) {
          setTimeout(onPositionChange, 0);
        }
      }

      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, resizeDirection, onPositionChange]);

  // 컴포넌트가 마운트된 후 부모에게 알림
  useEffect(() => {
    if (onPositionChange) {
      // DOM이 업데이트된 후 위치 변경 알림
      const timer = setTimeout(onPositionChange, 100);
      return () => clearTimeout(timer);
    }
  }, [onPositionChange]);

  // Handle parameter changes
  const handleParameterChange = (id: string, field: string, value: string) => {
    setParameters(
      parameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      )
    );
  };

  // Handle parameter removal
  const handleRemoveParameter = (id: string) => {
    setParameters(parameters.filter((param) => param.id !== id));
  };

  // Add new parameter
  const addParameter = () => {
    setParameters([
      ...parameters,
      { id: `p${id}-${Date.now()}`, name: "", type: "string" },
    ]);
  };

  return (
    <div
      ref={dragRef}
      id={`table-${id}`}
      className="absolute rounded-lg shadow-lg border border-gray-200 overflow-hidden bg-white"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        cursor: isDragging ? "grabbing" : "auto",
        zIndex: 10,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 py-1.5 px-3 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center flex-1">
            <input
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              className="font-medium text-gray-700 bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-400 focus:ring-opacity-50 px-1 py-0.5 rounded text-sm"
              placeholder="Table name"
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={addParameter}
              className="text-blue-500 hover:text-blue-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              title="파라미터 추가"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">파라미터 추가</span>
            </button>
            {startConnection && (
              <button
                onClick={startConnection}
                className={`p-1 rounded-full transition-colors ${
                  isActiveConnection
                    ? "bg-blue-100 text-blue-600"
                    : isConnecting
                    ? "bg-blue-50 text-blue-500 hover:bg-blue-100"
                    : "text-gray-400 hover:text-blue-500 hover:bg-gray-100"
                }`}
                title="테이블 연결"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
            <button
              onClick={onRemove}
              className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-100"
              title="삭제"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">삭제</span>
            </button>
          </div>
        </div>

        {/* Parameters as a table */}
        <div className="flex-1 overflow-y-auto bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500">
                <th className="text-left py-1.5 px-3 font-medium border-b border-gray-200">
                  필드명
                </th>
                <th className="text-left py-1.5 px-3 font-medium border-b border-gray-200 w-24">
                  타입
                </th>
                <th className="py-1.5 px-1 border-b border-gray-200 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {parameters.map((param) => (
                <tr key={param.id} className="group hover:bg-gray-50">
                  <td className="py-1 px-2">
                    <input
                      value={param.name}
                      onChange={(e) =>
                        handleParameterChange(param.id, "name", e.target.value)
                      }
                      className="w-full text-sm border-0 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-1 py-0.5"
                      placeholder="Field name"
                    />
                  </td>
                  <td className="py-1 px-2">
                    <select
                      value={param.type}
                      onChange={(e) =>
                        handleParameterChange(param.id, "type", e.target.value)
                      }
                      className="w-full text-xs border-0 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-1 py-0.5 appearance-none cursor-pointer"
                    >
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean</option>
                      <option value="date">Date</option>
                    </select>
                  </td>
                  <td className="py-1 px-1 text-center">
                    <button
                      onClick={() => handleRemoveParameter(param.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 p-0.5 rounded-full hover:bg-gray-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {parameters.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-4 text-sm text-gray-400"
                  >
                    파라미터가 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className="absolute right-0 top-1/2 w-1 h-8 bg-gray-200 hover:bg-blue-400 cursor-e-resize -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity duration-200"
        data-resize="e"
      />
      <div
        className="absolute bottom-0 left-1/2 h-1 w-8 bg-gray-200 hover:bg-blue-400 cursor-s-resize -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity duration-200"
        data-resize="s"
      />
      <div
        className="absolute bottom-0 right-0 w-3 h-3 rounded-tl-sm bg-gray-200 hover:bg-blue-400 cursor-se-resize opacity-0 hover:opacity-100 transition-opacity duration-200"
        data-resize="se"
      />
    </div>
  );
};

export default DragSection;
