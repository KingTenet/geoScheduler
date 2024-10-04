import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@auth0/nextjs-auth0";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";

import { TRPCReactProvider } from "~/trpc/react";
import Login from "./_components/Login";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export const metadata: Metadata = {
    title: "GeoScheduler",
    description: "Manage your geo-based schedules",
};

function TopBar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
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
                <Login />
            </Toolbar>
        </AppBar>
    );
}

export default async function RootLayout({ children }: RootLayoutProps) {
    const session = await getSession();

    const userSignedIn = Boolean(session?.accessToken);

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
            </head>

            <UserProvider>
                <body>
                    <TRPCReactProvider>
                        {userSignedIn && <TopBar />}
                        <main>{children}</main>
                    </TRPCReactProvider>
                </body>
            </UserProvider>
        </html>
    );
}
