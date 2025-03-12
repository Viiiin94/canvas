export type BlockType =
  | "div"
  | "text"
  | "h1"
  | "h2"
  | "h3"
  | "text-center"
  | "text-left"
  | "text-right";

export type TextStyleType = "bold" | "italic" | "underline";

export type TextHandle = {
  focus: () => void;
};

export type Parameter = {
  id: string;
  name: string;
  type: string;
};

export type Table = {
  id: number;
  name: string;
  parameters: number;
};

export type Line = {
  from: number;
  to: number;
};
