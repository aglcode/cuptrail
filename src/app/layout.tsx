import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";

const nunitoSansHeading = localFont({
  src: "./fonts/nunito-sans.ttf",
  weight: "200 900",
  variable: "--font-nunito-sans",
  display: "swap",
});

const figtree = localFont({
  src: "./fonts/figtree.ttf",
  weight: "300 900",
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Cuptrail",
    template: "%s · Cuptrail",
  },
  description:
    "Discover coffee shops, find your favorite corners, and keep a personal journal of every good brew.",
  applicationName: "Cuptrail",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        figtree.variable,
        nunitoSansHeading.variable,
      )}
    >
      <body className="flex min-h-full flex-col">
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "var(--primary)",
              colorBackground: "var(--surface)",
              colorForeground: "var(--foreground)",
              colorMutedForeground: "var(--muted-foreground)",
              colorInput: "var(--background)",
              colorInputForeground: "var(--foreground)",
              colorDanger: "var(--error)",
              colorSuccess: "var(--success)",
              colorWarning: "var(--warning)",
              colorBorder: "var(--control-border)",
              fontFamily: "var(--font-figtree), sans-serif",
              fontSize: "1rem",
              borderRadius: "var(--radius)",
            },
            elements: {
              card: "cuptrail-auth-card",
              formButtonPrimary: "cuptrail-auth-button",
              formFieldInput: "cuptrail-auth-input",
              socialButtonsBlockButton: "cuptrail-auth-social",
              modalCloseButton: "cuptrail-auth-close",
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
