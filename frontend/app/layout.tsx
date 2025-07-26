import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Whitestart System Security Inc - Security Solutions Marketplace",
  description:
    "Professional security and surveillance equipment from trusted vendors. Your one-stop shop for access control, CCTV, and security systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
