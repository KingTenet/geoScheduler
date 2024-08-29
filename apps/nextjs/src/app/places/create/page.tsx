"use client";

import dynamic from "next/dynamic";

const CreatePlace = dynamic(() => import("../../_components/CreatePlace"), {
    ssr: false,
});

export default function HomePage() {
    return (
        <>
            <CreatePlace />
        </>
    );
}
