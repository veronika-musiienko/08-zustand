import type { Metadata } from "next";
import { Roboto } from "next/font/google"; // 1. Змінюємо на Roboto
import "./globals.css";
import Providers from "./providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 2. Налаштовуємо Roboto за суворими вимогами ментора
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Обов'язкова опція weight
  variable: "--font-roboto",    // Змінна для CSS
  display: "swap",              // Обов'язкова опція display
});

export const metadata: Metadata = {
  title: "NoteHub - Your Personal Notes",
  description: "Organize your thoughts with ease in the NoteHub workspace.",
  
  // 3. Додаємо обов'язковий блок openGraph, якого не вистачало
  openGraph: {
    title: "NoteHub - Your Personal Notes",
    description: "Capture and organize your ideas effortlessly.",
    url: "https://your-app-url.vercel.app", // Можеш замінити на свій лінк
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub Preview",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Додаємо змінну шрифту в html та сам клас в body
    <html lang="en" className={roboto.variable}>
      <body className={roboto.className}>
        <Providers>
          {children}
          {/* Додаємо контейнер для тостів тут, щоб він працював скрізь */}
          <ToastContainer position="bottom-right" autoClose={3000} />
        </Providers>
      </body>
    </html>
  );
}