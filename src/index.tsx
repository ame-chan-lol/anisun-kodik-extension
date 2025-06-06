import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Client } from "kodikwrapper";
import "./globals.css";
import extensionData from "../extension.json";
import Settings from "./Settings/Settings";
import Skeleton from "./Skeleton/Skeleton";
import KodikPlayer from "./KodikPlayer/KodikPlayer";

const queryClient = new QueryClient();

function App() {
    const [idMal, setIdMal] = useState<string>();

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

function AppWrapper() {
    const currentPathname = location.pathname.split("/").slice(2).join("/");
    
    if (extensionData.pages.includes(currentPathname)) {
        return (
            <Settings />
        );
    }

    return;
}

// if there is no element with `extensions-root-id`, then it's a custom page
if (document.getElementById("extensions-root-id") !== null) {
    const relativeRoot = createRoot(document.getElementById("extensions-root-id"));

    relativeRoot.render(<App />);
}

// if there is no element with `extensions-root-page-id`, then it's an anime player page
if (document.getElementById("extensions-root-page-id") !== null) {
    const relativeRoot = createRoot(document.getElementById("extensions-root-page-id"));
    
    relativeRoot.render(<AppWrapper />);
}