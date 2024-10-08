import { db } from "@GeoScheduler/daemonDB";

export default async (): Promise<void> => {
    await db.$disconnect();
};
