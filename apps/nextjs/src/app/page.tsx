"use server";

import { Suspense } from "react";

import { api, HydrateClient } from "~/trpc/server";
import { DeleteUser } from "./_components/DeleteUser";
import { CreateGeoSchedule } from "./_components/GeoSchedule";
import { PostCardSkeleton, PostList } from "./_components/posts";

export default async function HomePage() {
    // You can await this here if you don't want to show Suspense fallback below
    void api.post2.all.prefetch();
    await Promise.resolve();

    return (
        <HydrateClient>
            <main className="container h-screen py-16">
                <div className="flex flex-col items-center justify-center gap-4">
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
                        Create <span className="text-primary">T3</span> Turbo
                    </h1>

                    <DeleteUser />
                    <CreateGeoSchedule />
                    <div className="w-full max-w-2xl overflow-y-scroll">
                        <Suspense
                            fallback={
                                <div className="flex w-full flex-col gap-4">
                                    <PostCardSkeleton />
                                    <PostCardSkeleton />
                                    <PostCardSkeleton />
                                </div>
                            }
                        >
                            <PostList />
                        </Suspense>
                    </div>
                </div>
            </main>
        </HydrateClient>
    );
}
