import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "DakardyFashions — Premium Fashion",
    template: "%s | DakardyFashions",
  },
  description: "Discover premium fashion for men, women, and kids at DakardyFashions. Shop the latest trends in clothing, shoes, bags, accessories, and jewelry.",
  keywords: ["fashion", "clothing", "South Africa", "DakardyFashions", "online shopping"],
  openGraph: {
    title: "DakardyFashions — Premium Fashion",
    description: "Discover premium fashion for men, women, and kids.",
    siteName: "DakardyFashions",
    type: "website",
    locale: "en_ZA",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
