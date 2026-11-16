import { Link } from "@inertiajs/react";
import PaginationButton from "./pagination-button.jsx";

export default function PollingUnitsList({ data }) {
    if (!data) return null;

    const pollingUnits = data.pollingUnits || {};
    const pagination = data.pagination || {};
    const stateNames = Object.keys(pollingUnits);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
                <span>
                    Showing <strong>{pagination.from ?? 0}</strong> to{" "}
                    <strong>{pagination.to ?? 0}</strong> of{" "}
                    <strong>{pagination.total ?? 0}</strong> polling units
                </span>
                <span>
                    Page <strong>{pagination.current_page ?? 1}</strong> of{" "}
                    <strong>{pagination.last_page ?? 1}</strong>
                </span>
            </div>

            {stateNames.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
                    <p className="text-gray-500">
                        No polling units found for this selection.
                    </p>
                </div>
            ) : (
                stateNames.map((stateName) => {
                    const units = pollingUnits[stateName];

                    return (
                        <section key={stateName}>
                            <div className="mb-4 flex items-center justify-between border-b-2 border-emerald-500 pb-2">
                                <h2 className="text-2xl font-bold text-emerald-600">
                                    {stateName}
                                </h2>
                                <span className="rounded-full bg-emerald-800 px-3 py-0.5 text-xs font-medium text-white">
                                    {units.length} units on this page
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                {units.map((unit, idx) => (
                                    <div
                                        key={unit.uniqueid || unit.id || idx}
                                        className="flex flex-col justify-center rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
                                    >
                                        <Link
                                            href={route("bicon.show.polling", {
                                                state: unit.state_id,
                                                lga: unit.lga_id,
                                                ward: unit.ward_id,
                                                unit: unit.polling_unit_id,
                                            })}
                                            className="flex flex-col"
                                        >
                                            <span className="font-mono text-xs font-semibold text-gray-400">
                                                {unit.polling_unit_number ||
                                                    "N/A"}
                                            </span>
                                            <span className="truncate text-sm font-medium text-gray-900 hover:text-emerald-700">
                                                {unit.polling_unit_name ||
                                                    "Unnamed Unit"}
                                            </span>
                                        </Link>

                                        <Link
                                            href={route("bicon.show.lga", {
                                                state: unit.state_id,
                                                lga: unit.lga_id,
                                            })}
                                            className="mt-1 w-fit truncate text-xs text-emerald-700 hover:underline"
                                        >
                                            {unit.lga_name || "Unknown LGA"}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                })
            )}

            {pagination.last_page > 1 && (
                <div className="flex items-center justify-between pt-2">
                    <PaginationButton
                        href={pagination.prev_page_url}
                        disabled={!pagination.prev_page_url}
                    >
                        &larr; Previous
                    </PaginationButton>
                    <span className="text-sm text-gray-600">
                        Page {pagination.current_page} of {pagination.last_page}
                    </span>
                    <PaginationButton
                        href={pagination.next_page_url}
                        disabled={!pagination.next_page_url}
                    >
                        Next &rarr;
                    </PaginationButton>
                </div>
            )}
        </div>
    );
}
