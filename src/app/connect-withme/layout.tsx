import type { Metadata } from "next";
import "@/app/globals.css";
import NavDown from "@/components/connect/nav-down";

export const metadata: Metadata = {
  title: "Connect With Me",
  description: "Connect with me on Social Media",
};

export default function ConnectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavDown/>
      {children}
    </div>
  )
}
