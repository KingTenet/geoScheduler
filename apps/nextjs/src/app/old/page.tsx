import Link from "next/link";

import { LatestPost } from "~/app/_components/geoScheduler";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
    const hello = await api.post.hello({ text: "from tRPC" });

    void api.post.getLatest.prefetch();

    return (
        <HydrateClient>
            <main>
                <div>
                    <div>
                        <p>
                            {hello ? hello.greeting : "Loading tRPC query..."}
                        </p>
                    </div>

                    <LatestPost />
                </div>
            </main>
        </HydrateClient>
    );
}
