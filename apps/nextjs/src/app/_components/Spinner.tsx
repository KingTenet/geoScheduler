import { Box, CircularProgress, Typography } from "@mui/material";

export function Spinner({ label }: { label: string }) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "90vh",
                bgcolor: "background.default",
            }}
        >
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>
                {label}
            </Typography>
        </Box>
    );
}
