import "./globals.css";
import { fontPrimaryBold } from "@/lib/fonts";
import ReactQueryProvider from "@/custom-components/ReactQueryProvider"


export const metadata = {
  title: "Live Auction",
  description: "live auction of cars",
};

export default function RootLayout({ children }) {
  return (
    <ReactQueryProvider>
      
    <html lang="en">
      <body
        className={`${fontPrimaryBold.className} bg-black`}
      >
        {children}
      </body>
    </html>
    </ReactQueryProvider>
  );
}
