import "./styles/reset.css";
import "./styles/global.css";
import "./styles/festa.css";

import type { ReactNode } from "react";
import { headers } from "next/headers";
import Script from "next/script";
import { Meta } from "next/dist/lib/metadata/generate/meta";
import localFont from "next/font/local";
import type { Metadata } from "next";
import LostAndFound from "./components/LostAndFound";
import Providers from "./providers/Providers";

const pretendard = localFont({
  src: "./fonts/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "Next App Router Template",
  description: "Next App Router Template",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const h = await headers();
  const url = h.get("x-pathname") || "";
  const isAdmin = url.startsWith("/admin");

  if (isAdmin) {
    return (
      <html lang="ko" className={`${pretendard.variable}`}>
        <body className="font-pretendard">
          <Providers>{children}</Providers>
        </body>
      </html>
    );
  }

  return (
    <html lang="ko" className={`${pretendard.variable}`}>
      <Meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      />
      <body className="font-pretendard">
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          strategy="afterInteractive"
        />
        <LostAndFound />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
