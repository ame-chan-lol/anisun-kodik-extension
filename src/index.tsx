import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Skeleton from "./Skeleton/Skeleton";
import KodikPlayer from "./KodikPlayer/KodikPlayer";
import { id as pluginId } from "../manifest.json";
import "./globals.css";

declare global {
  // extend `window` to communicate with plugins
  interface Window {
    "__TSUKI__": {
      // won't change
      "fixed": {
        "appName"  : string;
        "appRootId": string;
        "baseUrl"  : string;
      };
      // window message event will be fired on change
      "dynamic": {
        // have user enabled smooth transitions or no
        "smooth" : boolean;
        // user color scheme
        "theme"  : "light" | "dark";
        // anime title (needed for those plugins that can't use MAL ID)
        "title"  : string;
        // anime MAL ID
        "idMal"  : number;
        // current anime episode
        "episode": number;
      };
    };
  }
}
    

const queryClient = new QueryClient();

function App() {
    const [idMal, setIdMal] = useState<number | undefined>(undefined);

    useEffect(() => {
        console.log("%cKodik player extension initialized", "background-color: #111;font-size: 28px;color:white;");

        const handleWindowUpdates = (event: any) => {
            if (event.data !== "tsuki_updated_window") {
                return;
            }

            setIdMal(window.__TSUKI__.dynamic.idMal);
        };

        window.addEventListener("message", handleWindowUpdates);

        return () => window.removeEventListener("message", handleWindowUpdates);
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

window.addEventListener("message", (event) => {
    const key = event.data;

    if (key !== `tsuki_player_${pluginId}`) {
        return;
    }

    if (document.getElementById("extensions-root-id") !== null) {
        const relativeRoot = createRoot(document.getElementById("extensions-root-id"));
    
        relativeRoot.render(<App />);
        setTimeout(() => {
            relativeRoot.unmount();
        }, 5000);
    }
})