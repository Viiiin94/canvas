"use client";

import { useState, useEffect } from "react";
import { MenuItem } from "@/app/type";
import { dummyData } from "../utils/menu";
import Image from "next/image";

interface MenuListProps {
  restaurantId: string;
  language: string;
}

export default function MenuList({ restaurantId, language }: MenuListProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // TODO: API 연동

    setMenuItems(dummyData);
    const uniqueCategories = [
      "all",
      ...new Set(dummyData.map(item => item.category)),
    ];
    setCategories(uniqueCategories);
    setIsLoading(false);
  }, [restaurantId]);

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name[language]
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  const renderSpicyLevel = (level: number) => {
    return Array(level)
      .fill(0)
      .map((_, i) => (
        <span key={i} className="text-red-500">
          🌶️
        </span>
      ));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 검색 바 */}
      <div className="sticky top-0 bg-gray-50 pt-4 pb-2 z-10">
        <input
          type="text"
          placeholder="메뉴 검색..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 카테고리 선택 */}
      <div className="sticky top-16 bg-gray-50 z-10">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category === "all" ? "전체" : category}
            </button>
          ))}
        </div>
      </div>

      {/* 메뉴 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48 sm:h-56">
              <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src=""
                  alt={item.name[language]}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              {item.isPopular && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                  인기
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{item.name[language]}</h3>
                <span className="text-lg font-bold">
                  {item.price.toLocaleString()} ₩
                </span>
              </div>
              <p className="text-gray-600 mt-1 text-sm">
                {item.description[language]}
              </p>
              <div className="mt-3 space-y-2">
                {item.spicyLevel && (
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-gray-600">맵기:</span>
                    {renderSpicyLevel(item.spicyLevel)}
                  </div>
                )}
                {item.preparationTime && (
                  <div className="text-sm text-gray-600">
                    조리시간: {item.preparationTime}분
                  </div>
                )}
                {item.allergens && item.allergens[language]?.length > 0 && (
                  <div className="text-sm text-red-500">
                    {language === "ko" && "알레르기: "}
                    {language === "en" && "Allergens: "}
                    {language === "ja" && "アレルギー: "}
                    {language === "zh" && "过敏原: "}
                    {item.allergens[language].join(", ")}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
