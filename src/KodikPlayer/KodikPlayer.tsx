import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Client } from "kodikwrapper";
import Skeleton from "../Skeleton/Skeleton";

const KodikPublicApiKey = "9067ca16853b00ad78c7f4fc02a1c33f";

export default function KodikPlayer({
    idMal,
}: {
    idMal: string;
}) {
    const { data, isPending, error } = useQuery({
        queryKey: ['anime', 'kodik', idMal],
        queryFn:  async () => {
            if (!idMal) {
                return null;
            }
        
            const client = new Client({
                token: KodikPublicApiKey,
            });
            const result = await client.search({
                shikimori_id: Number(idMal),
            });

            if (result.results.length === 0) {
                return null;
            }
        
            return result.results[0];
        },
    });

    if (isPending) {
        return (
            <Skeleton
                title="Fetching..."
                description="Fetching data from the Kodik."
            />
        );
    }

    if (error) {
        return (
            <Skeleton
                pulse={false}
                title="Error."
                description="Something unexpected happened."
            />
        );
    }

    if (!data?.link) {
        return (
            <Skeleton
                pulse={false}
                title="Error."
                description="Unable to find any media files for this anime."
            />
        );
    }

    return (
        <>
            <iframe
                className="aspect-video w-full border-none rounded-none"
                src={data.link}
                allow="autoplay *; fullscreen *"
            />
        </>
    );
}