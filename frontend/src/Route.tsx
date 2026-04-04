import type { RouteObject } from "react-router-dom";
import { PageSkeleton } from "./pages/PageSkeleton";

export const RootRoute: RouteObject = {
    path: "",
    hydrateFallbackElement: <PageSkeleton />,
    lazy: () => import("./pages/Layout"),
    children: [
        {
            path: "",
            hydrateFallbackElement: <PageSkeleton />,
            lazy: () => import("./pages/Dashboard"),
        },
        {
            path: "profile",
            hydrateFallbackElement: <PageSkeleton />,
            lazy: () => import("./pages/Profile"),
        },
        {
            path: "sign-in",
            hydrateFallbackElement: <PageSkeleton />,
            lazy: () => import("./pages/SignIn"),
        },
        {
            path: "sign-out",
            hydrateFallbackElement: <PageSkeleton />,
            lazy: () => import("./pages/SignOut"),
        },
        {
            path: "*",
            hydrateFallbackElement: <PageSkeleton />,
            lazy: () => import("./pages/NotFound"),
        },
    ]
}