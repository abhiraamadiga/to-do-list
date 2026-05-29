import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import Sidebar from "../components/Sidebar";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Bulletin Board - Student DashboardSlip",
  description: "Indian school-corridor skeuomorphic notice softboard portal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${jakarta.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body className="min-h-full flex flex-col font-jakarta bg-[#0d0f0f] text-on-background overflow-hidden">
        {/* Full-screen wrapper - padding set to p-0 to completely eliminate outer black gaps */}
        <div className="bg-[#0d0f0f] min-h-screen w-full flex flex-col p-0">
          {/* Main Board Skeuomorphic Frame: rounded-none for flush edge-to-edge window fitting */}
          <div className="wood-frame felt-board flex-1 w-full flex flex-col md:flex-row relative rounded-none min-h-screen">
            
            <Sidebar />

            {/* Children routes represent specific views, rendering inside the frame */}
            {children}

          </div>
        </div>
      </body>
    </html>
  );
}
