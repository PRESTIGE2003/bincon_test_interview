import { useEffect, useMemo, useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import Field from "./components/feild.jsx";

const input =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400";

export default function PollingForm({ states = [], lgas = [], parties = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        state_id: "",
        lga_id: "",
        ward_id: "",
        polling_unit_id: "",
        polling_unit_number: "",
        polling_unit_name: "",
        lat: "",
        long: "",
        results: Object.fromEntries(parties.map((p) => [p.partyid, "0"])),
    });

    const [wards, setWards] = useState([]);
    const [loadingWards, setLoadingWards] = useState(false);

    const set = (property) => (e) => setData(property, e.target.value);

    // Pick functions set new values to the data property
    const pickState = (e) =>
        setData((prev) => ({
            ...prev,
            state_id: e.target.value,
            lga_id: "",
            ward_id: "",
        }));

    const pickLga = (e) =>
        setData((prev) => ({
            ...prev,
            lga_id: e.target.value,
            ward_id: "",
        }));

    // Computes what LGA's are displayed base on state change
    const stateLgas = useMemo(
        () => lgas.filter((l) => String(l.state_id) === String(data.state_id)),
        [lgas, data.state_id],
    );

    // Computes what Wards are displayed base on LGA change
    useEffect(() => {
        setWards([]);

        if (!data.lga_id) {
            return;
        }

        const ctrl = new AbortController();

        setLoadingWards(true);

        fetch(`${route("bicon.locations.wards")}?lga_id=${data.lga_id}`, {
            headers: { Accept: "application/json" },
            signal: ctrl.signal,
        })
            .then((res) => res.json())
            .then(setWards)
            .catch(() => {})
            .finally(() => setLoadingWards(false));

        return () => ctrl.abort();
    }, [data.lga_id]);

    // Live vote tally
    const total = Object.values(data.results).reduce(
        (sum, v) => sum + Number(v || 0),
        0,
    );

    const submit = (e) => {
        e.preventDefault();
        post(route("bicon.store.polling"));
    };

    return (
        <>
            <Head title="New Polling Unit" />

            <div className="min-h-screen bg-gray-50 p-6 text-gray-800">
                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                New Polling Unit
                            </h1>
                            <p className="text-sm text-gray-500">
                                Create a polling unit and record the score for
                                every registered party
                            </p>
                        </div>

                        <Link
                            href={route("bicon.index")}
                            className="w-fit rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                        >
                            &larr; Back to polling units
                        </Link>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-8">
                        <section>
                            <div className="mb-4 flex items-center justify-between border-b-2 border-emerald-500 pb-2">
                                <h2 className="text-2xl font-bold text-emerald-600">
                                    Polling Unit Information
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                <Field label="State" error={errors.state_id}>
                                    <select
                                        required
                                        value={data.state_id}
                                        onChange={pickState}
                                        className={input}
                                    >
                                        <option value="">Select state</option>
                                        {states.map((s) => (
                                            <option
                                                key={s.state_id}
                                                value={s.state_id}
                                            >
                                                {s.state_name}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                <Field label="LGA" error={errors.lga_id}>
                                    <select
                                        required
                                        value={data.lga_id}
                                        disabled={!data.state_id}
                                        onChange={pickLga}
                                        className={input}
                                    >
                                        <option value="">
                                            {data.state_id
                                                ? "Select LGA"
                                                : "Select a state first"}
                                        </option>
                                        {stateLgas.map((l) => (
                                            <option
                                                key={l.lga_id}
                                                value={l.lga_id}
                                            >
                                                {l.lga_name}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                <Field label="Ward" error={errors.ward_id}>
                                    <select
                                        required
                                        value={data.ward_id}
                                        disabled={!data.lga_id || loadingWards}
                                        onChange={set("ward_id")}
                                        className={input}
                                    >
                                        <option value="">
                                            {loadingWards
                                                ? "Loading wards..."
                                                : data.lga_id
                                                  ? "Select ward"
                                                  : "Select an LGA first"}
                                        </option>
                                        {wards.map((w) => (
                                            <option
                                                key={w.ward_id}
                                                value={w.ward_id}
                                            >
                                                {w.ward_name}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                <Field
                                    label="Polling Unit ID"
                                    error={errors.polling_unit_id}
                                >
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        value={data.polling_unit_id}
                                        onChange={set("polling_unit_id")}
                                        placeholder="e.g. 8"
                                        className={input}
                                    />
                                </Field>

                                <Field
                                    label="Polling Unit Number"
                                    error={errors.polling_unit_number}
                                >
                                    <input
                                        required
                                        value={data.polling_unit_number}
                                        onChange={set("polling_unit_number")}
                                        placeholder="e.g. DT1708006"
                                        className={input}
                                    />
                                </Field>

                                <Field
                                    label="Polling Unit Name"
                                    error={errors.polling_unit_name}
                                    className="sm:col-span-1 lg:col-span-3"
                                >
                                    <input
                                        required
                                        value={data.polling_unit_name}
                                        onChange={set("polling_unit_name")}
                                        placeholder="Enter polling unit name"
                                        className={input}
                                    />
                                </Field>

                                <Field label="Latitude" error={errors.lat}>
                                    <input
                                        value={data.lat}
                                        onChange={set("lat")}
                                        placeholder="Optional"
                                        className={input}
                                    />
                                </Field>

                                <Field label="Longitude" error={errors.long}>
                                    <input
                                        value={data.long}
                                        onChange={set("long")}
                                        placeholder="Optional"
                                        className={input}
                                    />
                                </Field>
                            </div>
                        </section>

                        {/* Party section */}
                        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
                            <span>
                                <strong>{parties.length}</strong> registered
                                parties
                            </span>

                            <span>
                                Total votes{" "}
                                <strong>{total.toLocaleString()}</strong>
                            </span>
                        </div>

                        <section>
                            <div className="mb-4 flex items-center justify-between border-b-2 border-emerald-500 pb-2">
                                <h2 className="text-2xl font-bold text-emerald-600">
                                    Party Scores
                                </h2>
                                <span className="rounded-full bg-emerald-800 px-3 py-0.5 text-xs font-medium text-white">
                                    {parties.length} parties
                                </span>
                            </div>
                            {parties.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
                                    <p className="text-gray-500">
                                        No parties found.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    {parties.map((party) => (
                                        <label
                                            key={party.partyid}
                                            className="flex flex-col justify-center rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-emerald-500 hover:border-emerald-300"
                                        >
                                            <span className="font-mono text-xs font-semibold text-gray-400">
                                                {party.partyid}
                                            </span>
                                            <span className="truncate text-xs text-emerald-700">
                                                {party.partyname}
                                            </span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="1"
                                                required
                                                inputMode="numeric"
                                                value={
                                                    data.results[party.partyid]
                                                }
                                                onChange={(e) =>
                                                    setData("results", {
                                                        ...data.results,
                                                        [party.partyid]:
                                                            e.target.value,
                                                    })
                                                }
                                                className={`${input} mt-2 text-right font-semibold tabular-nums`}
                                            />
                                            {errors[
                                                `results.${party.partyid}`
                                            ] && (
                                                <span className="mt-1 text-xs text-red-600">
                                                    {
                                                        errors[
                                                            `results.${party.partyid}`
                                                        ]
                                                    }
                                                </span>
                                            )}
                                        </label>
                                    ))}
                                </div>
                            )}
                            {errors.results && (
                                <p className="mt-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {errors.results}
                                </p>
                            )}
                        </section>

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-gray-400">
                                The polling unit and all party results are saved
                                together. Enter 0 where no votes were recorded.
                            </p>

                            <button
                                type="submit"
                                disabled={processing || parties.length === 0}
                                className="cursor-pointer rounded-lg bg-emerald-700 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-800 disabled:opacity-50"
                            >
                                {processing
                                    ? "Saving..."
                                    : "Create Polling Unit & Save Results"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
