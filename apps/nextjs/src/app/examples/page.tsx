import Link from "next/link";
import { Button, Flex, Text } from "@radix-ui/themes";

export default function MyApp() {
    return (
        <Flex direction="column" gap="2">
            <Text>Hello from Radix Themes :)</Text>
            <Button>Let's go</Button>

            <nav>
                <Link
                    // className={`link ${pathname === "/" ? "active" : ""}`}
                    href="/examples/geoSchedule"
                >
                    Home
                </Link>

                <Link
                    // className={`link ${pathname === "/about" ? "active" : ""}`}
                    href="/about"
                >
                    About
                </Link>
            </nav>
        </Flex>
    );
}
