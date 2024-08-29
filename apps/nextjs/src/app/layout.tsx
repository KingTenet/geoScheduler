import type { Metadata } from "next";
import Link from "next/link";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";

import { TRPCReactProvider } from "~/trpc/react";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export const metadata: Metadata = {
    title: "GeoScheduler",
    description: "Manage your geo-based schedules",
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
            <body>
                <TRPCReactProvider>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{ flexGrow: 1 }}
                            >
                                GeoScheduler
                            </Typography>
                            <Link href="/" passHref>
                                <Button color="inherit">Home</Button>
                            </Link>
                            <Link href="/places" passHref>
                                <Button color="inherit">Places</Button>
                            </Link>
                            <Link href="/geoSchedule" passHref>
                                <Button color="inherit">Schedules</Button>
                            </Link>
                        </Toolbar>
                    </AppBar>
                    <main>{children}</main>
                </TRPCReactProvider>
            </body>
        </html>
    );
}
