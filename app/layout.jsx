import localFont from "next/font/local";
import "./globals.css";

const cabinet = localFont({
  src: "./fonts/CabinetGrotesk.woff",
  display: "swap",
  variable: '--font-cabinet',
})

const satoshi = localFont({
  src: "./fonts/SatoshiMedium.woff",
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
        className={`${cabinet.variable} ${satoshi.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
