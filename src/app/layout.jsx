import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased`}
        style={{ fontFamily: "Arial', sans-serif" }} // Arialni qo'shish
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
