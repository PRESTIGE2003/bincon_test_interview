export default function Field({ label, error, className = "", children }) {
    return (
        <label
            className={`flex flex-col rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-emerald-500 ${className}`}
        >
            <span className="mb-1 font-mono text-xs font-semibold text-gray-400">
                {label}
            </span>
            {children}
            {error && (
                <span className="mt-1 text-xs text-red-600">{error}</span>
            )}
        </label>
    );
}
