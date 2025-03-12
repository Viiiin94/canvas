import { BlockType, TextStyleType } from "@/app/type";

export const BLOCK_STYLES: Record<BlockType, string> = {
  text: "",
  div: "",
  h1: "text-4xl font-bold",
  h2: "text-3xl font-bold",
  h3: "text-2xl font-bold",
  "text-center": "text-center",
  "text-left": "text-left",
  "text-right": "text-right",
};

export const TEXT_STYLES: Record<TextStyleType, string> = {
  bold: "font-bold",
  italic: "italic",
  underline: "underline",
};
