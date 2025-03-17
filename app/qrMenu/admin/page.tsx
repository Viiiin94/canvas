"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function AdminPage() {
  const [restaurantId, setRestaurantId] = useState("");
  const [showQR, setShowQR] = useState(false);

  const handleGenerateQR = () => {
    if (restaurantId.trim()) {
      setShowQR(true);
    }
  };

  const handleDownload = () => {
    const canvas = document.getElementById("qr-code") as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `qr-menu-${restaurantId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          QR 코드 생성기
        </h1>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="restaurantId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              레스토랑 ID
            </label>
            <input
              type="text"
              id="restaurantId"
              value={restaurantId}
              onChange={(e) => setRestaurantId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="레스토랑 ID를 입력하세요"
            />
          </div>
          <button
            onClick={handleGenerateQR}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            QR 코드 생성
          </button>
          {showQR && (
            <div className="flex flex-col items-center space-y-4 mt-6">
              <div className="p-4 bg-white rounded-lg shadow">
                <QRCodeSVG
                  id="qr-code"
                  value={`${window.location.origin}/qrMenu?id=${restaurantId}`}
                  size={200}
                  level="H"
                />
              </div>
              <button
                onClick={handleDownload}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                QR 코드 다운로드
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
