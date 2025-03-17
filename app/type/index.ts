//  Docs Type

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

// Data Modeling Type

export type Parameter = {
  id: string;
  name: string;
  type: string;
};

export type Table = {
  id: number;
  name: string;
  parameters: number | Parameter[];
  position?: { x: number; y: number };
  size?: { width: number; height: number };
};

export type Connection = {
  id: string;
  fromTableId: number;
  toTableId: number;
};

export type ConnectionPoint = {
  x: number;
  y: number;
  tableId: number;
};

//QR Menu

export type MenuItem = {
  id: string;
  name: {
    [key: string]: string;
  };
  description: {
    [key: string]: string;
  };
  price: number;
  imageUrl: string;
  category: string;
  allergens?: { [key: string]: string[] };
  isPopular?: boolean;
  spicyLevel?: number;
  preparationTime?: number;
};
