import Link from "next/link";
import { Button } from "@mui/material";

export default async function HomePage() {
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
