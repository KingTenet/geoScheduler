"use client";

import { redirect } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "@mui/material";

export default function Login() {
    const { user, error, isLoading } = useUser();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    if (user) {
        return (
            <>
                <a href="/api/auth/logout">
                    <Button color="inherit">Logout</Button>
                </a>
            </>
        );
    }

    return <a href="/api/auth/login">Login</a>;
}
