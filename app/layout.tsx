import "./globals.css";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/providers/query-provider";

const font = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Opal",
  description: "Share AI powered videos with your friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${font.className} bg-[#171717] text-white antialiased`}
        >
          <QueryProvider>
            <Toaster richColors />

            {children}
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
