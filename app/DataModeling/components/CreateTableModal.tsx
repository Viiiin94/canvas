import { FormEvent, useState } from "react";

interface CreateTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (tableName: string, parameterCount: number) => void;
}

const CreateTableModal = ({
  isOpen,
  onClose,
  onConfirm,
}: CreateTableModalProps) => {
  const [tableName, setTableName] = useState("");
  const [parameterCount, setParameterCount] = useState(1);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onConfirm(tableName, parameterCount);
    setTableName("");
    setParameterCount(1);
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">테이블 생성</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              테이블 이름
            </label>
            <input
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              파라미터 개수
            </label>
            <input
              type="number"
              min="1"
              value={parameterCount}
              onChange={(e) => setParameterCount(parseInt(e.target.value))}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              생성
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTableModal;
