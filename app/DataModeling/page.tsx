"use client";

import { useState, useRef, useEffect } from "react";
import SideBox from "@/app/dataModeling/components/SideBox";
import DragSection from "@/app/dataModeling/components/DragSection";
import CreateTableModal from "@/app/dataModeling/components/CreateTableModal";
import ConnectionLine from "@/app/dataModeling/components/ConnectionLine";
import type { Table, Connection } from "@/app/type";

interface TableCenter {
  x: number;
  y: number;
  tableId: number;
}

export default function DataModeling() {
  const [tables, setTables] = useState<Table[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectingState, setConnectingState] = useState<{
    isConnecting: boolean;
    fromTableId?: number;
    tempToPosition?: { x: number; y: number };
  }>({
    isConnecting: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableCenters, setTableCenters] = useState<Record<string, TableCenter>>(
    {}
  );
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Ref for the container to calculate relative positions
  const containerRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);

  // Handle mouse move for drawing temporary connection line
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (connectingState.isConnecting) {
        const article = articleRef.current;
        if (article) {
          const rect = article.getBoundingClientRect();
          setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
        }
      }
    };

    if (connectingState.isConnecting) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [connectingState.isConnecting]);

  // Calculate table centers after render or when tables change
  const updateTableCenters = () => {
    const newTableCenters: Record<string, TableCenter> = {};
    const article = articleRef.current;

    if (!article) return;

    tables.forEach((table) => {
      const tableElement = document.getElementById(`table-${table.id}`);
      if (tableElement) {
        const tableRect = tableElement.getBoundingClientRect();
        const articleRect = article.getBoundingClientRect();

        newTableCenters[table.id.toString()] = {
          x: tableRect.left - articleRect.left + tableRect.width / 2,
          y: tableRect.top - articleRect.top + tableRect.height / 2,
          tableId: table.id,
        };
      }
    });

    setTableCenters(newTableCenters);
  };

  // Update centers when tables change
  useEffect(() => {
    // Wait for DOM to update
    const timer = setTimeout(() => {
      updateTableCenters();
    }, 50);

    return () => clearTimeout(timer);
  }, [tables]);

  // Update centers when window is resized
  useEffect(() => {
    const handleResize = () => {
      updateTableCenters();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [tables]);

  // handleCreateTable 함수 수정
  const handleCreateTable = (tableName: string, parameterCount: number) => {
    console.log("Creating table:", tableName, parameterCount);

    // 고유 ID 생성 (타임스탬프 대신 더 작은 숫자 사용)
    const tableCount = tables.length;
    const newId = tableCount + 1;

    const newTable: Table = {
      id: newId,
      name: tableName,
      parameters: parameterCount,
    };

    setTables((prev) => [...prev, newTable]);
  };

  const removeTable = (id: number) => {
    // Remove any connections to this table
    setConnections(
      connections.filter(
        (conn) => conn.fromTableId !== id && conn.toTableId !== id
      )
    );
    setTables((prev) => prev.filter((table) => table.id !== id));
  };

  // Connection handling
  const startConnection = (tableId: number) => () => {
    if (connectingState.isConnecting) {
      // If we're already connecting and clicked on a different table, create the connection
      if (connectingState.fromTableId !== tableId) {
        // Create new connection
        const newConnection: Connection = {
          id: `conn-${Date.now()}`,
          fromTableId: connectingState.fromTableId!,
          toTableId: tableId,
        };

        // Check if this connection already exists
        const connectionExists = connections.some(
          (conn) =>
            (conn.fromTableId === newConnection.fromTableId &&
              conn.toTableId === newConnection.toTableId) ||
            (conn.fromTableId === newConnection.toTableId &&
              conn.toTableId === newConnection.fromTableId)
        );

        if (!connectionExists) {
          setConnections([...connections, newConnection]);
        }

        // Reset connecting state
        setConnectingState({ isConnecting: false });
      } else {
        // If clicked on the same table, cancel the connection
        setConnectingState({ isConnecting: false });
      }
    } else {
      // Start a new connection
      setConnectingState({
        isConnecting: true,
        fromTableId: tableId,
      });
    }
  };

  const removeConnection = (connectionId: string) => {
    setConnections(connections.filter((conn) => conn.id !== connectionId));
  };

  // Toggle connection mode

  // 초기 상태에 테이블 추가 (테스트용) 수정
  useEffect(() => {
    if (tables.length === 0) {
      // 초기 테이블 생성 (테스트용)
      const initialTables: Table[] = [
        {
          id: 1,
          name: "사용자",
          parameters: 3,
        },
        {
          id: 2,
          name: "상품",
          parameters: 4,
        },
      ];
      setTables(initialTables);

      // 초기 연결 생성 (테스트용)
      setTimeout(() => {
        setConnections([
          {
            id: "conn-1",
            fromTableId: 1,
            toTableId: 2,
          },
        ]);
      }, 500);
    }
  }, []);

  // 테이블 위치가 변경될 때마다 중심점 업데이트
  const handleTablePositionChange = () => {
    updateTableCenters();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 p-4">
      <SideBox onAddSection={() => setIsModalOpen(true)} />

      <main
        className="w-full h-full p-8 bg-gray-100 rounded-lg shadow-sm"
        ref={containerRef}
      >
        <article
          ref={articleRef}
          className="w-[297mm] h-[210mm] mx-auto bg-white shadow-lg p-[20mm] box-border overflow-hidden relative"
        >
          {/* SVG layer for connections - lower z-index */}
          <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
            {/* Existing connections */}
            {connections.map((conn) => {
              const fromCenter = tableCenters[conn.fromTableId.toString()];
              const toCenter = tableCenters[conn.toTableId.toString()];

              if (fromCenter && toCenter) {
                return (
                  <ConnectionLine
                    key={conn.id}
                    fromX={fromCenter.x}
                    fromY={fromCenter.y}
                    toX={toCenter.x}
                    toY={toCenter.y}
                    isActive={true}
                    onClick={() => removeConnection(conn.id)}
                  />
                );
              }
              return null;
            })}

            {/* Temporary connection line while creating */}
            {connectingState.isConnecting &&
              connectingState.fromTableId &&
              tableCenters[connectingState.fromTableId.toString()] && (
                <ConnectionLine
                  fromX={tableCenters[connectingState.fromTableId.toString()].x}
                  fromY={tableCenters[connectingState.fromTableId.toString()].y}
                  toX={mousePosition.x}
                  toY={mousePosition.y}
                  isActive={false}
                />
              )}
          </svg>

          {tables.map((table) => (
            <DragSection
              key={table.id}
              id={table.id}
              initialName={table.name}
              initialParameters={table.parameters}
              onRemove={() => removeTable(table.id)}
              startConnection={startConnection(table.id)}
              isConnecting={connectingState.isConnecting}
              isActiveConnection={connectingState.fromTableId === table.id}
              onPositionChange={handleTablePositionChange}
            />
          ))}
        </article>
      </main>

      <CreateTableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCreateTable}
      />

      {/* Connection mode indicator */}
      {connectingState.isConnecting && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg text-sm">
          테이블 연결 중... (취소하려면 같은 테이블을 다시 클릭하세요)
        </div>
      )}
    </div>
  );
}
