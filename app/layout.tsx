import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
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
          localization={ptBR}
          appearance={{
            variables: {
              colorPrimary: "#00d4a0",
              colorBackground: "#111827",
              colorInputBackground: "#1a2235",
              colorInputText: "#f0f4ff",
              colorText: "#f0f4ff",
              colorTextSecondary: "#d4daf0",
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
              // Manage Account — cobertura completa
              userProfilePage:                    { color: "#f0f4ff" },
              profileSectionTitle:                { color: "#f0f4ff" },
              profileSectionTitleText:            { color: "#f0f4ff" },
              profileSectionContent:              { color: "#f0f4ff" },
              profileSectionPrimaryButton:        { color: "#f0f4ff" },
              profileSectionSecondaryButton:      { color: "#c4cde0" },
              profileSectionItem:                 { color: "#f0f4ff" },
              profileSectionItemText:             { color: "#f0f4ff" },
              profileSectionItemLabel:            { color: "#f0f4ff" },
              accordion:                          { color: "#f0f4ff" },
              accordionTriggerButton:             { color: "#f0f4ff", background: "transparent" },
              accordionContent:                   { color: "#f0f4ff" },
              navbarButton:                       { color: "#c4cde0" },
              navbarButtonIcon:                   { color: "#c4cde0" },
              navbarButtonText:                   { color: "#c4cde0" },
              navbarButtonActive:                 { color: "#f0f4ff" },
              breadcrumbs:                        { color: "#f0f4ff" },
              breadcrumbsItem:                    { color: "#f0f4ff" },
              breadcrumbsItemDivider:             { color: "#8896b3" },
              formHeaderTitle:                    { color: "#f0f4ff" },
              formHeaderSubtitle:                 { color: "#c4cde0" },
              profilePageTitle:                   { color: "#f0f4ff" },
              profilePageDescription:             { color: "#d4daf0" },
              profileSectionSubtitle:             { color: "#d4daf0" },
              profileSectionSubtitleText:         { color: "#d4daf0" },
              formFieldHintText:                  { color: "#8896b3" },
              formFieldSuccessText:               { color: "#00d4a0" },
              menuList:                           { background: "#1a2235" },
              menuItem:                           { color: "#f0f4ff" },
              menuItemText:                       { color: "#f0f4ff" },
              menuItemButton:                     { color: "#f0f4ff" },
              activeDeviceListItem:               { color: "#f0f4ff", borderColor: "rgba(255,255,255,0.1)" },
              activeDeviceListItemText:           { color: "#f0f4ff" },
              activeDeviceListItemTitle:          { color: "#f0f4ff" },
              activeDeviceListItemIdentifier:     { color: "#c4cde0" },
              userPreviewTextContainer:           { color: "#f0f4ff" },
              userPreviewMainIdentifier:          { color: "#f0f4ff" },
              userPreviewSecondaryIdentifier:     { color: "#c4cde0" },
              userButtonPopoverCard:              { background: "#111827", border: "1px solid rgba(255,255,255,0.12)" },
              userButtonPopoverActionButton:      { color: "#f0f4ff" },
              userButtonPopoverActionButtonText:  { color: "#f0f4ff" },
              userButtonPopoverActionButtonIcon:  { color: "#f0f4ff" },
              userButtonPopoverFooter:            { color: "#f0f4ff", borderColor: "rgba(255,255,255,0.08)" },
            },
          }}
        >
          <Providers>{children}</Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
