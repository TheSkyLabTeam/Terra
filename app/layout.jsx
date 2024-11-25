import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react"
import "./globals.css";

const cabinet = localFont({
  src: "./fonts/CabinetGrotesk.woff",
  display: "swap",
  variable: '--font-cabinet',
})

const sunday = localFont({
  src: "./fonts/SundayMasthead-Regular.woff",
  display: "auto",
  variable: '--font-sunday',
})

const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  display: "swap",
  variable: '--font-satoshi',
})

export const metadata = {
  title: "Earth Connect: Uniting Data and Insight for a Sustainable Future",
  description: "Explore global wildfire data, visualize trends, and gain insights to protect our planet with Earth Connect. Stay informed and make a difference in environmental conservation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${cabinet.variable} ${satoshi.variable} ${sunday.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
