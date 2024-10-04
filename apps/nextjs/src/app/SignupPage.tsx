"use client";

import React from "react";
import { Button } from "@mui/material";

import "../styles/globals.css";

import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();

    return (
        <>
            <div className="stage">
                <div className="actor"></div>
                <div className="container">
                    <Button onClick={() => router.push("/api/auth/login")}>
                        Sign up
                    </Button>
                </div>
            </div>
        </>
    );
}
