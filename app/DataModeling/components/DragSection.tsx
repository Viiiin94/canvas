"use client";

import { useState, useRef, MouseEvent, useEffect } from "react";
import { Parameter } from "@/app/type";

interface DragSectionProps {
  id: number;
  initialName: string;
  initialParameters: number;
  onRemove: () => void;
}

const DragSection = ({
  id,
  initialName,
  initialParameters,
  onRemove,
}: DragSectionProps) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [size, setSize] = useState({
    width: 250,
    height: Math.max(150, initialParameters * 30 + 80),
  });
  const [isDragging, setIsDragging] = useState(false);
  const [tableName, setTableName] = useState(initialName);
  const [parameters, setParameters] = useState<Parameter[]>(
    Array.from({ length: initialParameters }, (_, i) => ({
      id: `param-${i}`,
      name: `parameter`,
      type: "string",
    }))
  );
  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const handleTableNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTableName(e.target.value);
  };

  const handleParameterChange = (
    id: string,
    field: "name" | "type",
    value: string
  ) => {
    setParameters((prev) =>
      prev.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      )
    );
  };

  const handleRemoveParameter = (id: string) => {
    setParameters((prev) => prev.filter((param) => param.id !== id));
    setSize((prev) => ({
      ...prev,
      height: Math.max(150, (parameters.length - 1) * 30 + 80),
    }));
  };

  const addParameter = () => {
    const newParam = {
      id: `param-${Date.now()}`,
      name: `파라미터${parameters.length + 1}`,
      type: "string",
    };
    setParameters((prev) => [...prev, newParam]);
    setSize((prev) => ({
      ...prev,
      height: Math.max(150, (parameters.length + 1) * 30 + 80),
    }));
  };

  const handleMouseDown = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (target.closest(`.handle-${id}`)) {
      setIsDragging(true);
      const rect = dragRef.current?.getBoundingClientRect();
      if (rect) {
        offsetRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (isDragging) {
        const rect = dragRef.current?.parentElement?.getBoundingClientRect();
        if (rect) {
          const newX = e.clientX - rect.left - offsetRef.current.x;
          const newY = e.clientY - rect.top - offsetRef.current.y;

          const maxX = rect.width - (dragRef.current?.offsetWidth || 0);
          const maxY = rect.height - (dragRef.current?.offsetHeight || 0);

          setPosition({
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY)),
          });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={dragRef}
      className="absolute bg-white overflow-hidden"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        cursor: isDragging ? "grabbing" : "auto",
      }}
      onMouseDown={handleMouseDown}
    >
      <div className={`handle-${id} w-full h-full flex flex-col border`}>
        {/* Header - Reduced height */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 py-1.5 px-3 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center flex-1">
            <input
              value={tableName}
              onChange={handleTableNameChange}
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
                    <input
                      type="text"
                      value={param.type}
                      onChange={(e) =>
                        handleParameterChange(param.id, "type", e.target.value)
                      }
                      className="w-full text-sm border-0 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-1 py-0.5"
                    />
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
    </div>
  );
};

export default DragSection;
