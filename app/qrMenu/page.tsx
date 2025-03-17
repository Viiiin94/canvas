"use client";

import { useState } from "react";
import QRScanner from "./components/QRScanner";
import MenuList from "./components/MenuList";
import LanguageSelector from "./components/LanguageSelector";

export default function QRMenuPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ko");
  const [isScanned, setIsScanned] = useState(true);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  const handleQRCodeScanned = (id: string) => {
    setRestaurantId(id);
    setIsScanned(true);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {!isScanned ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              QR 메뉴 스캐너
            </h1>
            <QRScanner onScanned={handleQRCodeScanned} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">메뉴판</h2>
              <LanguageSelector
                selected={selectedLanguage}
                onSelect={setSelectedLanguage}
              />
            </div>
            <MenuList
              restaurantId={restaurantId!}
              language={selectedLanguage}
            />
          </div>
        )}
      </div>
    </main>
  );
}
