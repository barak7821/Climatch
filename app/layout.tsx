import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { WeatherProvider } from "./utils/WeatherContext";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "Climatch",
  description: "Smart outfit suggestions based on real-time weather",
  icons: {
    icon: "/logo.svg",
  }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${manrope.className}`}>
        <WeatherProvider>
          {children}
        </WeatherProvider>
      </body>
    </html>
  )
}
