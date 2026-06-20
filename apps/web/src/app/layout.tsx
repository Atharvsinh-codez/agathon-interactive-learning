import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./styles.css";
import "./redesign.css";

const stripExtensionHydrationAttrs = `
(() => {
  const shouldRemove = (name) =>
    name === "bis_skin_checked" ||
    name === "bis_register" ||
    name.startsWith("__processed_");

  const clean = (root) => {
    if (!root || !root.querySelectorAll) return;
    const nodes = root.querySelectorAll("*");
    for (const node of nodes) {
      for (const attr of Array.from(node.attributes || [])) {
        if (shouldRemove(attr.name)) node.removeAttribute(attr.name);
      }
    }
  };

  clean(document);
  requestAnimationFrame(() => clean(document));
})();
`;

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
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Script id="strip-extension-hydration-attrs" strategy="beforeInteractive">
          {stripExtensionHydrationAttrs}
        </Script>
        {children}
      </body>
    </html>
  );
}
