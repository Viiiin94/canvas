import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR 코드 메뉴판",
  description: "한국에도 QR코드 메뉴판이 많이 있을까?",
};

export default function QrMenuLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <section>{children}</section>
    </div>
  );
}
