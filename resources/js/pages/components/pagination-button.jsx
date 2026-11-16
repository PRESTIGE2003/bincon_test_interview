import { Link } from "@inertiajs/react";

export default function PaginationButton({ href, disabled, children }) {
    if (disabled || !href) {
        return (
            <span className="cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400">
                {children}
            </span>
        );
    }

    return (
        <Link
            href={href}
            preserveScroll
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
            {children}
        </Link>
    );
}
