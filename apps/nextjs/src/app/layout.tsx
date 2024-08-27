import type { Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
// import "~/styles/globals.css";

// import { Inter as FontSans } from "next/font/google";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { cn } from "@GeoScheduler/ui";

// const fontSans = FontSans({
//     subsets: ["latin"],
//     variable: "--font-sans",
// });

export const metadata: Metadata = {
    title: "Create T3 Turbo",
    description: "Simple monorepo with shared backend for web & mobile apps",
};

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
            </head>
            <body
                className={cn(
                    "min-h-screen bg-background font-sans antialiased",
                    // fontSans.variable,
                )}
            >
                <TRPCReactProvider>{children}</TRPCReactProvider>
            </body>
        </html>
    );
}
