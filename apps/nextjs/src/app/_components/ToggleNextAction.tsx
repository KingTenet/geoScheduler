import React from "react";
import { Button } from "@mui/material";

export const ToggleNextActionButton = ({
    label,
    showButton,
    showChildren,
    children,
}: {
    showButton: Boolean;
    showChildren: (clicked: Boolean) => Boolean;
    label: string;
    children: React.ReactNode;
}) => {
    const [clicked, updateClicked] = React.useState(false);

    if (showChildren(clicked)) {
        return <>{children}</>;
    }

    if (!showButton) {
        return <></>;
    }

    return (
        <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => updateClicked(true)}
            sx={{ mt: 2 }}
        >
            {label}
        </Button>
    );
};
