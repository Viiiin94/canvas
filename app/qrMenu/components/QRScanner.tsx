"use client";

import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface QRScannerProps {
  onScanned: (restaurantId: string) => void;
}

export default function QRScanner({ onScanned }: QRScannerProps) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText) => {
        scanner.clear();
        onScanned(decodedText);
      },
      (error) => {
        console.error("QR 스캔 에러:", error);
      }
    );

    return () => {
      scanner.clear();
    };
  }, [onScanned]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        id="qr-reader"
        className="rounded-lg overflow-hidden shadow-lg bg-white"
      />
      <p className="text-center mt-4 text-gray-600">
        QR 코드를 스캐너에 비춰주세요
      </p>
    </div>
  );
}
