import type { Metadata } from "next";
import "./globals.css";
import SiteSettingsProvider from "@/components/providers/SiteSettingsProvider";

export const metadata: Metadata = {
  title: "Holy Star Luxury Hotel",
  description: "Hotel management, booking, dining, and guest portal system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <SiteSettingsProvider>{children}</SiteSettingsProvider>
      </body>
    </html>
  );
}
