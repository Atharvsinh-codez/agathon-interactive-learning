import type { Metadata, Viewport } from "next";
import "./styles.css";
import "./redesign.css";

export const metadata: Metadata = {
  title: "Agathon — Interactive Learning",
  description: "Agathon: a Brilliant-style interactive learning platform for math and computer science.",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#007BA7",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
