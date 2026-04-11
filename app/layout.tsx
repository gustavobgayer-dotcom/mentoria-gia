import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Providers } from "./providers";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Sardinha Finance · AUVP",
  description: "Controle financeiro pessoal",
};

export const viewport = {
  themeColor: "#0a0f1e",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} ${dmMono.variable}`}>
      <body style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#00d4a0",
              colorBackground: "#111827",
              colorInputBackground: "#1a2235",
              colorInputText: "#f0f4ff",
              colorText: "#f0f4ff",
              colorTextSecondary: "#c4cde0",
              colorNeutral: "#f0f4ff",
              borderRadius: "0.5rem",
              fontFamily: "DM Sans, sans-serif",
            },
            elements: {
              card: {
                background: "#111827",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 4px 32px rgba(0,0,0,0.4)",
              },
              formButtonPrimary: {
                background: "#00d4a0",
                color: "#0a0f1e",
                fontWeight: "600",
              },
              formFieldLabel: {
                color: "#c4cde0",
              },
              identityPreviewText: {
                color: "#f0f4ff",
              },
              formFieldInput: {
                background: "#1a2235",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#f0f4ff",
              },
              footerActionLink: {
                color: "#00d4a0",
              },
              headerTitle: {
                color: "#f0f4ff",
              },
              headerSubtitle: {
                color: "#c4cde0",
              },
              dividerText: {
                color: "#8896b3",
              },
              badge: {
                background: "#ffffff",
                color: "#00d4a0",
                fontWeight: "600",
              },
              socialButtonsBlockButton: {
                background: "#1a2235",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#f0f4ff",
              },
              socialButtonsBlockButtonText: {
                color: "#f0f4ff",
                fontWeight: "500",
              },
              footerAction: {
                textAlign: "center",
                justifyContent: "center",
              },
              footer: {
                textAlign: "center",
              },
            },
          }}
        >
          <Providers>{children}</Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
