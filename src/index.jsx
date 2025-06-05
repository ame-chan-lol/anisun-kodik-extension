import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Client } from "kodikwrapper";
import "./globals.css";

const KodikPublicApiKey = "9067ca16853b00ad78c7f4fc02a1c33f";
const queryClient = new QueryClient();

function Skeleton({
    pulse = true,
    title,
    description,
}) {
    return (
        <div id="extensions-app-shell-id" className="bg-white dark:bg-black absolute top-0 right-0 left-0 bottom-0 z-10">
            <div className="flex w-full aspect-video bg-white dark:bg-black">
                <div
                    className={`flex flex-col gap-4 items-center justify-center h-full w-full bg-neutral-200 dark:bg-neutral-900 ${pulse ? "animate-pulse" : ""}`}
                >
                    <p className="leading-none text-xl sm:text-4xl font-semibold">
                        {title}
                    </p>
                    <p className="leading-none opacity-60 text-sm sm:text-lg">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}

function App() {
    const [idMal, setIdMal] = useState();

    useEffect(() => {
        console.log("%cKodik player extension initialized", "background-color: #111;font-size: 28px;color:white;");

        if (location === undefined) {
            return;
        }

        const pathnames = location.pathname.split("/");
        const animeId = pathnames[pathnames.length - 1];

        setIdMal(animeId);
    }, []);

    if (!idMal) {
        return (
            <Skeleton
                title="Loading..."
                description="Getting current anime ID."
            />
        );
    }

    return (
        <div id="extensions-app-shell-id" className="bg-white dark:bg-black absolute top-0 right-0 left-0 bottom-0 z-10">
            <QueryClientProvider client={queryClient}>
                <KodikPlayer idMal={idMal} />
            </QueryClientProvider>
        </div>
    );
}

function KodikPlayer({
    idMal,
}) {
    const { data, isPending, error } = useQuery({
        queryKey: ['anime', 'kodik', idMal],
        queryFn:  async () => {
            if (!idMal) {
                return;
            }
        
            const client = new Client({
                token: KodikPublicApiKey,
            });
            const result = await client.search({
                shikimori_id: idMal,
            });

            console.log(result);
        
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

    if (error || !data?.link) {
        return (
            <Skeleton
                pulse={false}
                title="Error."
                description="Something unexpected happened."
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

const relativeRoot = createRoot(document.getElementById("extensions-root-id"));

relativeRoot.render(<App />);
