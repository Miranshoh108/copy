import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({ children }) {
  return (
    <html lang="uz">
      <head>
        <link rel="icon" type="image/png" href="/images/Logo.png" />
        <link rel="apple-touch-icon" href="/images/Logo.png" />
      </head>
      <body
        className={`${montserrat.variable} antialiased`}
        style={{ fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
