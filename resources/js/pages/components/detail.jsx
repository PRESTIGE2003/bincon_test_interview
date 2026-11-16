export default function Detail({ label, value }) {
    return (
        <div className="flex flex-col justify-center rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <span className="font-mono text-xs font-semibold text-gray-400">
                {label}
            </span>
            <span className="truncate text-sm font-medium text-gray-900">
                {value ?? "N/A"}
            </span>
        </div>
    );
}
