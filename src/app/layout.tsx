import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteUrl = "https://aoixsy-portfolio.vercel.app";

export const metadata: Metadata = {
  title: "AoiXsy | Software Developer",
  description:
    "Hi, I'm Flexsy Bilbis Triwibowo, a software developer from Indonesia. Explore my projects, skills, and experience in building modern web applications.",
  keywords: [
    "Flexsy Bilbis",
    "Software Developer",
    "Web Developer",
    "Portfolio",
    "Next.js Developer",
    "Indonesia",
  ],
  authors: [{ name: "Flexsy Bilbis Triwibowo" }],
  openGraph: {
    title: "Flexsy Bilbis Triwibowo | Software Developer",
    description:
      "Explore my projects, skills, and portfolio as a software developer from Indonesia.",
    url: siteUrl,
    siteName: "Flexsy Bilbis Triwibowo Portfolio",
    images: [
      {
        url: `${siteUrl}/image.png`,
        width: 1200,
        height: 630,
        alt: "Flexsy Bilbis Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flexsy Bilbis | Software Developer",
    description:
      "My portfolio showcasing projects and skills in web development.",
    images: [`${siteUrl}/image.png`],
    creator: "@Net40569629",
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/Asset 2@4x.png" />
        <Script
          id="ld-json"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Flexsy Bilbis",
              url: siteUrl,
              jobTitle: "Software Developer",
              sameAs: [
                "https://github.com/bhilbis",
                "https://www.linkedin.com/in/flexsy-bilbis-triwibowo/",
              ],
            }),
          }}
        />
      </head>
      <body className={`antialiased ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
