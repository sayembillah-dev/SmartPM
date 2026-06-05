import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmartPMProvider } from "@/components/providers/smart-pm-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { ChatPanel } from "@/components/chat/chat-panel";
import { AppBootGate } from "@/components/layout/app-boot-gate";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartPM — Agentic Task Management",
  description: "AI-powered sprint board, analytics, and assistant for product managers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <SmartPMProvider>
          <TooltipProvider delay={150}>
            <AppBootGate>
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex flex-col flex-1 min-w-0">{children}</div>
              </div>
              <ChatPanel />
              <Toaster richColors closeButton />
            </AppBootGate>
          </TooltipProvider>
        </SmartPMProvider>
      </body>
    </html>
  );
}
