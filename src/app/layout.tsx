import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import SessionProvider from "./components/SessionProvider";
import { ReactQueryProvider } from "./components/ReactQueryProvider";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blog",
  description: "Criado com Next 14, Tailwind e Prisma",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <ReactQueryProvider>
            <Navbar/>
            <div className="pt-24">
            {children}
            </div>
          </ReactQueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
