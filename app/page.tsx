import Link from "next/link";

const links = [
  {
    url: "docs",
    name: "문서",
  },
  {
    url: "dataModeling",
    name: "데이터 모델링",
  },
];

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 p-4">
      <main className="w-full max-w-5xl h-20 bg-gray-100 rounded-lg shadow-sm">
        <ul className="flex justify-around items-center w-full h-full">
          {links.map((link, index) => (
            <li key={index}>
              <Link href={link.url}>{link.name}</Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
