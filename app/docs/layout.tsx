import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs",
  description: "노션 따라해보기",
};

export default function DocsLayout({
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
