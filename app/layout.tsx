import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Custom Constant Magic Square Solver",
  description: `We let you solve a variation of the magic square. The challenge is to make the sum of each row and column equal to the constant picked by you. The constant can be different for each case (row and column)`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
