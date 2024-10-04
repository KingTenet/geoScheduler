import Link from "next/link";
import { getSession } from "@auth0/nextjs-auth0";
import { Button } from "@mui/material";

import SignupPage from "./SignupPage";

export default async function HomePage() {
    const session = await getSession();

    const userSignedIn = Boolean(session?.accessToken);

    if (!userSignedIn) {
        return <SignupPage />;
    }

    return (
        <>
            <Link href="/places/create" passHref>
                <Button variant="contained" color="primary">
                    Add New Place
                </Button>
            </Link>

            <Link href="/geoSchedule/" passHref>
                <Button variant="contained" color="primary">
                    Geo schedules
                </Button>
            </Link>
        </>
    );
}
