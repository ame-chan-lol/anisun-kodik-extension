import React, { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Client } from "kodikwrapper";
import Skeleton from "../Skeleton/Skeleton";

const KodikPublicApiKey = "9067ca16853b00ad78c7f4fc02a1c33f";

export default function KodikPlayer({
    idMal,
}: {
    idMal: number;
}) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
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
                shikimori_id: idMal,
            });

            if (result.results.length === 0) {
                return null;
            }
        
            return result.results[0];
        },
    });

    useEffect(() => {
        console.log("kodik: before event listening");
        if (!iframeRef.current) {
            return;
        }

        if (isPending || error || !data?.link) {
            return;
        }

        console.log("kodik: listening for episode changes");
        iframeRef.current.contentWindow.postMessage({
            key: "kodik_player_api",
            value: {
                method : "change_episode",
                episode: window.__TSUKI__.dynamic.episode,
            },
        }, "*");

        const handleAppUpdate = (event: any) => {
            if (event.data !== "tsuki_updated_window") {
                return;
            }

            iframeRef.current.contentWindow.postMessage({
                key: "kodik_player_api",
                value: {
                    method : "change_episode",
                    episode: window.__TSUKI__.dynamic.episode,
                },
            }, "*");
            console.log("kodik: changed episode to", window.__TSUKI__.dynamic.episode);
        };

        window.addEventListener("message", handleAppUpdate);

        return () => window.removeEventListener("message", handleAppUpdate);
    }, []);

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
                ref={iframeRef}
                id="kodik-player"
                className="aspect-video w-full border-none rounded-none"
                src={data.link}
                allow="autoplay *; fullscreen *"
            />
        </>
    );
}