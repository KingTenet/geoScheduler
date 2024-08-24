"use client";

import { Button } from "@GeoScheduler/ui/button";

import { api } from "~/trpc/react";

export function DeleteUser() {
    const utils = api.useUtils();

    const deleteUserMutation = api.user.delete.useMutation({
        onSuccess: async () => {
            await utils.geoSchedules.invalidate();
            await utils.user.invalidate();
        },
    });

    const handleDeleteUser = () => {
        deleteUserMutation.mutate();
    };

    return (
        <>
            <Button onClick={() => handleDeleteUser()}>Delete User</Button>
        </>
    );
}
