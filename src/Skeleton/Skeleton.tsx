import React from "react";

export default function Skeleton({
    pulse = true,
    title,
    description,
}: {
    pulse?: boolean;
    title: string;
    description: string;
}) {
    return (
        <div id="extensions-app-shell-id" className="bg-white dark:bg-black absolute top-0 right-0 left-0 bottom-0 z-10">
            <div className="flex w-full aspect-video bg-white dark:bg-black">
                <div
                    className={`flex flex-col gap-4 items-center justify-center h-full w-full bg-neutral-200 dark:bg-neutral-800 ${pulse ? "animate-pulse" : ""}`}
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