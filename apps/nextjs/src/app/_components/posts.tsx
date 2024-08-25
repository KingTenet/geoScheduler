"use client";

import type { RouterOutputs } from "@GeoScheduler/api";
import { cn } from "@GeoScheduler/ui";
import { Button } from "@GeoScheduler/ui/button";
import { toast } from "@GeoScheduler/ui/toast";

import { api } from "~/trpc/react";

export function PostList() {
    const [posts] = api.geoSchedules.all.useSuspenseQuery();

    if (posts.length === 0) {
        return (
            <div className="relative flex w-full flex-col gap-4">
                <PostCardSkeleton pulse={false} />
                <PostCardSkeleton pulse={false} />
                <PostCardSkeleton pulse={false} />

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
                    <p className="text-2xl font-bold text-white">
                        No posts yet
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col gap-4">
            {posts.map((p) => {
                return <PostCard key={p.id} post={p} />;
            })}
        </div>
    );
}

export function PostCard(props: {
    post: RouterOutputs["geoSchedules"]["byId"];
}) {
    const utils = api.useUtils();
    const deletePost = api.geoSchedules.delete.useMutation({
        onSuccess: async () => {
            await utils.geoSchedules.invalidate();
        },
        onError: (err) => {
            toast.error(
                err.data?.code === "UNAUTHORIZED"
                    ? "You must be logged in to delete a post"
                    : "Failed to delete post",
            );
        },
    });

    return (
        <div className="flex flex-row rounded-lg bg-muted p-4">
            <div className="flex-grow">
                <h2 className="text-2xl font-bold text-primary">
                    {props.post.id}
                </h2>
                <p className="mt-2 text-sm">{props.post.id}</p>
            </div>
            <div>
                <Button
                    variant="ghost"
                    className="cursor-pointer text-sm font-bold uppercase text-primary hover:bg-transparent hover:text-white"
                    onClick={() => deletePost.mutate(props.post.id)}
                >
                    Delete
                </Button>
            </div>
        </div>
    );
}

export function PostCardSkeleton(props: { pulse?: boolean }) {
    const { pulse = true } = props;
    return (
        <div className="flex flex-row rounded-lg bg-muted p-4">
            <div className="flex-grow">
                <h2
                    className={cn(
                        "w-1/4 rounded bg-primary text-2xl font-bold",
                        pulse && "animate-pulse",
                    )}
                >
                    &nbsp;
                </h2>
                <p
                    className={cn(
                        "mt-2 w-1/3 rounded bg-current text-sm",
                        pulse && "animate-pulse",
                    )}
                >
                    &nbsp;
                </p>
            </div>
        </div>
    );
}
