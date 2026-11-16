export default function LoadingSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <div className="h-12 rounded-lg bg-gray-200" />
            {[1, 2].map((n) => (
                <div
                    key={n}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                >
                    <div className="h-12 bg-gray-300" />
                    <div className="space-y-3 p-6">
                        <div className="h-4 w-3/4 rounded bg-gray-200" />
                        <div className="h-4 w-full rounded bg-gray-200" />
                        <div className="h-4 w-5/6 rounded bg-gray-200" />
                    </div>
                </div>
            ))}
        </div>
    );
}
