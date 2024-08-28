"use server";

import { Box } from "@mui/material";

export default async function HomePage() {
    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "top",
                    minHeight: "90vh",
                    bgcolor: "background.default",
                }}
            >
                Blah blah blah
            </Box>
        </>
    );
}
