import { Deferred, Head, Link, router } from "@inertiajs/react";
import PollingUnitsList from "./components/polling-unit-list.jsx";
import LoadingSkeleton from "./components/loading-skeletons.jsx";

export default function Welcome({ data, states = [], selectedState = "*" }) {
    const handleStateFilter = (e) =>
        router.get(
            window.location.pathname,
            { state: e.target.value, page: 1 },
            { preserveState: true, replace: true },
        );

    return (
        <>
            <Head title="Polling Units Directory" />
            <div className="min-h-screen bg-gray-50 p-6 text-gray-800">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="flex items-start justify-between w-full">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Polling Units Directory
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Browse registered polling units grouped by
                                    state
                                </p>
                            </div>

                            <Link
                                href={route("bicon.create.polling")}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                            >
                                create new polling unit data &rarr;
                            </Link>
                        </div>
                        {states.length > 0 && (
                            <select
                                value={selectedState}
                                onChange={handleStateFilter}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none"
                            >
                                <option value="*">All States</option>
                                {states.map((st) => (
                                    <option
                                        key={st.state_id}
                                        value={st.state_id}
                                    >
                                        {st.state_name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <Deferred data="data" fallback={<LoadingSkeleton />}>
                        <PollingUnitsList data={data} />
                    </Deferred>
                </div>
            </div>
        </>
    );
}
