import type { Metadata, Viewport } from "next";
import { Theme, ThemePanel } from "@radix-ui/themes";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { cn } from "@GeoScheduler/ui";

import { TRPCReactProvider } from "~/trpc/react";

import "@radix-ui/themes/styles.css";

// import { env } from "~/env";

export const metadata: Metadata = {
    title: "Create T3 Turbo",
    description: "Simple monorepo with shared backend for web & mobile apps",
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn(
                    "min-h-screen bg-background font-sans text-foreground antialiased",
                    GeistSans.variable,
                    GeistMono.variable,
                )}
            >
                <Theme>
                    <ThemePanel />
                    <TRPCReactProvider>{props.children}</TRPCReactProvider>
                </Theme>
            </body>
        </html>
    );
}
