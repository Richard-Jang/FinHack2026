export function PageSkeleton() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col items-center py-10 w-full animate-pulse">
            <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header Skeleton */}
                <div className="h-10 w-1/3 bg-purple-100 rounded-lg"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                
                {/* Content Skeleton */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-8">
                    <div className="h-32 bg-purple-50 rounded-lg border border-purple-100"></div>
                    <div className="h-32 bg-purple-50 rounded-lg border border-purple-100"></div>
                    <div className="h-32 bg-purple-50 rounded-lg border border-purple-100"></div>
                </div>

                <div className="mt-10 h-64 bg-gray-100 rounded-lg border border-gray-200 w-full"></div>
            </div>
        </div>
    );
}

// Fallback in case route config expects `Component` properly from this specific file.
export function Component() {
    return <PageSkeleton />;
}