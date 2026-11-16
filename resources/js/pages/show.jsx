import { Head, Link } from "@inertiajs/react";
import Detail from "./components/detail.jsx";
import { useEffect } from "react";

export default function Show({
    pollingUnit,
    page = "polling",
    state,
    lga,
    total,
}) {
    return page === "polling" ? (
        <PollingData pollingUnit={pollingUnit} />
    ) : (
        <LgaData
            state={state}
            lga={lga}
            pollingUnit={pollingUnit}
            total={total}
        />
    );
}

function PollingData({ pollingUnit }) {
    const results = pollingUnit?.announced_results || [];
    const totalVotes = results.reduce(
        (total, r) => total + Number(r.party_score || 0),
        0,
    );

    return (
        <>
            <Head title="Polling Unit Details" />
            <div className="min-h-screen bg-gray-50 p-6 text-gray-800">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Polling Unit Details
                            </h1>
                            <p className="text-sm text-gray-500">
                                Independent Electoral Journalist · In
                                partnership with Ebere Favour
                            </p>
                        </div>
                        <Link
                            href={route("bicon.index")}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                        >
                            &larr; Back to polling units
                        </Link>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
                            <span>
                                <strong>
                                    {pollingUnit.polling_unit_name ||
                                        "Unnamed Polling Unit"}
                                </strong>{" "}
                                · {pollingUnit.lga_name || "Unknown LGA"}
                            </span>

                            <span>
                                Total votes{" "}
                                <strong>{totalVotes.toLocaleString()}</strong>
                            </span>
                        </div>

                        <section>
                            <div className="mb-4 flex items-center justify-between border-b-2 border-emerald-500 pb-2">
                                <h2 className="text-2xl font-bold text-emerald-600">
                                    Polling Unit
                                </h2>
                                <span className="rounded-full bg-emerald-800 px-3 py-0.5 text-xs font-medium text-white">
                                    {pollingUnit.polling_unit_number || "N/A"}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                <Detail
                                    label="LGA"
                                    value={pollingUnit.lga_name}
                                />
                                <Detail
                                    label="Ward"
                                    value={pollingUnit.ward?.ward_name}
                                />
                            </div>
                        </section>

                        <section>
                            <div className="mb-4 flex items-center justify-between border-b-2 border-emerald-500 pb-2">
                                <h2 className="text-2xl font-bold text-emerald-600">
                                    Announced Results
                                </h2>
                                <span className="rounded-full bg-emerald-800 px-3 py-0.5 text-xs font-medium text-white">
                                    {results.length} result records
                                </span>
                            </div>
                            {results.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
                                    <p className="text-gray-500">
                                        No election results have been recorded
                                        for this polling unit.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    {results.map((result, index) => (
                                        <div
                                            key={result.result_id || index}
                                            className="flex flex-col justify-center rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
                                        >
                                            <span className="font-mono text-xs font-semibold text-gray-400">
                                                #{index + 1}
                                            </span>
                                            <span className="truncate text-sm font-medium text-gray-900">
                                                {result.party_abbreviation ||
                                                    "N/A"}
                                            </span>
                                            <span className="truncate text-xs text-emerald-700">
                                                {Number(
                                                    result.party_score || 0,
                                                ).toLocaleString()}{" "}
                                                votes
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    <div className="font-bold text-3xl pt-10 pl-10">
                        <span>
                            Total votes for{" "}
                            {pollingUnit.polling_unit_name || " "} polling unit
                            <strong className="ml-4">
                                {totalVotes.toLocaleString()}
                            </strong>
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

function LgaData({ state, lga, pollingUnit = [], total = 0 }) {
    const reported = pollingUnit.filter((u) => u.results > 0).length;

    return (
        <>
            <Head title={`${lga.lga_name} Polling Units`} />

            <div className="min-h-screen bg-gray-50 p-6 text-gray-800">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {lga.lga_name}
                            </h1>
                            <p className="text-sm text-gray-500">
                                {state.state_name} · Polling units and announced
                                results
                            </p>
                        </div>
                        <Link
                            href={route("bicon.index")}
                            className="w-fit rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                        >
                            &larr; Back to polling units
                        </Link>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
                            <span>
                                <strong>
                                    {pollingUnit.length.toLocaleString()}
                                </strong>{" "}
                                polling units ·{" "}
                                <strong>{reported.toLocaleString()}</strong>{" "}
                                with results
                            </span>
                            <span>
                                Total votes{" "}
                                <strong>{total.toLocaleString()}</strong>
                            </span>
                        </div>

                        <section>
                            <div className="mb-4 flex items-center justify-between border-b-2 border-emerald-500 pb-2">
                                <h2 className="text-2xl font-bold text-emerald-600">
                                    {lga.lga_name}
                                </h2>
                                <span className="rounded-full bg-emerald-800 px-3 py-0.5 text-xs font-medium text-white">
                                    {pollingUnit.length} units
                                </span>
                            </div>

                            {pollingUnit.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
                                    <p className="text-gray-500">
                                        No polling units found for this LGA.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    {pollingUnit.map((unit, idx) => (
                                        <Link
                                            key={unit.id || idx}
                                            href={route("bicon.show.polling", {
                                                state: state.state_id,
                                                lga: lga.lga_id,
                                                ward: unit.ward_id,
                                                unit: unit.polling_unit_id,
                                            })}
                                            className="flex flex-col justify-center rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
                                        >
                                            <span className="font-mono text-xs font-semibold text-gray-400">
                                                {unit.polling_unit_number ||
                                                    "N/A"}
                                            </span>
                                            <span className="truncate text-sm font-medium text-gray-900">
                                                {unit.polling_unit_name ||
                                                    "Unnamed Unit"}
                                            </span>
                                            <span className="truncate text-xs text-gray-500">
                                                {unit.ward_name ||
                                                    "Unknown ward"}
                                            </span>
                                            <span className="mt-1 text-xs font-semibold tabular-nums text-emerald-700">
                                                {unit.results > 0
                                                    ? `${unit.results.toLocaleString()} votes`
                                                    : "No results yet"}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    <div className="font-bold text-3xl pt-10 pl-10">
                        Total votes <strong>{total.toLocaleString()}</strong>
                    </div>
                </div>
            </div>
        </>
    );
}
