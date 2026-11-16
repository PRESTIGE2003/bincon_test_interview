<?php

namespace App\Http\Controllers;

use App\Models\Lga;
use App\Models\Party;
use App\Models\PollingUnit;
use App\Models\State;
use Inertia\Inertia;

class PollingUnitController extends Controller
{
    public function index()
    {
        // Just for future purposes
        // If the database was swaped with a full one with all states lga's & polling units
        // This will query for results and prevent future code break
        $state = request()->query('state', '*');
        $lga = request()->query('lga', '*');
        $ward = request()->query('ward', '*');
        $punit = request()->query('punit', '*');

        return Inertia::render('welcome', [
            'data' => Inertia::defer(function () use ($state) {
                $pollingUnits = PollingUnit::query()
                    ->join('lga', 'polling_unit.lga_id', '=', 'lga.lga_id')
                    ->join('states', 'lga.state_id', '=', 'states.state_id')
                    ->select('polling_unit.*', 'lga.lga_name', 'states.state_name', 'states.state_id')
                    ->when($state !== '*', function ($query) use ($state) {
                        $query->where('states.state_id', $state);
                    })
                    ->orderBy('states.state_name')
                    ->paginate(50)
                    ->withQueryString();

                return [
                    'pollingUnits' => $pollingUnits->getCollection()->groupBy('state_name'),
                    'pagination' => [
                        'total' => $pollingUnits->total(),
                        'current_page' => $pollingUnits->currentPage(),
                        'per_page' => $pollingUnits->perPage(),
                        'last_page' => $pollingUnits->lastPage(),
                        'next_page_url' => $pollingUnits->nextPageUrl(),
                        'prev_page_url' => $pollingUnits->previousPageUrl(),
                        'from' => $pollingUnits->firstItem(),
                        'to' => $pollingUnits->lastItem(),
                    ],
                ];
            }),
        ]);
    }

    public function polling(State $state, $lga, $ward, $unit)
    {
        $data = PollingUnit::query()
            ->join('lga', 'polling_unit.lga_id', '=', 'lga.lga_id')
            ->select('polling_unit.*', 'lga.lga_name')
            ->where('lga.state_id', $state->state_id)
            ->where('polling_unit.lga_id', $lga)
            ->where('polling_unit.ward_id', $ward)
            ->where('polling_unit.polling_unit_id', $unit)
            ->with(['ward', 'announcedResults'])
            ->firstOrFail();

        return Inertia::render('show', [
            'pollingUnit' => $data,
            'page' => 'polling',
        ]);
    }

    public function lga(State $state, $lga)
    {
        $lgaData = Lga::where('lga_id', $lga)->firstOrFail();

        $data = PollingUnit::query()
            ->join('lga', 'polling_unit.lga_id', '=', 'lga.lga_id')
            ->select('polling_unit.*', 'lga.lga_name')
            ->where('lga.state_id', $state->state_id)
            ->where('polling_unit.lga_id', $lga)
            ->with(['ward', 'announcedResults'])
            ->get();

        $results = $data->map(fn ($unit) => [
            'id' => $unit->uniqueid,
            'polling_unit_id' => $unit->polling_unit_id,
            'ward_id' => $unit->ward_id,
            'ward_name' => $unit->ward?->ward_name,
            'polling_unit_number' => $unit->polling_unit_number,
            'polling_unit_name' => $unit->polling_unit_name,
            'results' => (int) $unit->announcedResults->sum('party_score'),
        ])->values();

        $total = $results->sum('results');

        return Inertia::render('show', [
            'page' => 'lga',
            'state' => $state->only('state_id', 'state_name'),
            'lga' => [
                'lga_id' => $lgaData->lga_id,
                'lga_name' => $lgaData->lga_name,
            ],
            'pollingUnit' => $results,
            'total' => (int) $total,
        ]);
    }

    public function pollingForm(Request $request)
    {
        $stateId = $request->integer('state_id');
        $lgaId = $request->integer('lga_id');
        $wardId = $request->integer('ward_id');

        return Inertia::render('polling-form', [
            'states' => State::orderBy('state_name')->get(['state_id', 'state_name']),
            'lgas' => $stateId ? Lga::where('state_id', $stateId)->orderBy('lga_name')->get(['lga_id', 'lga_name']) : [],
            'wards' => $lgaId ? Ward::where('lga_id', $lgaId)->orderBy('ward_name')->get(['ward_id', 'ward_name']) : [],
            'units' => $wardId ? PollingUnit::where('lga_id', $lgaId)->where('ward_id', $wardId)->orderBy('polling_unit_name')->get(['uniqueid', 'polling_unit_name', 'polling_unit_number']) : [],
            'parties' => Party::orderBy('partyid')->get(['partyid', 'partyname']),
        ]);
    }

    public function storePollingForm(Request $request)
    {
        $partyIds = Party::pluck('partyid')->all();

        $validated = $request->validate([
            'state_id' => ['required', 'integer'],
            'unit_id' => ['required', 'exists:polling_unit,uniqueid'],
            'scores' => ['required', 'array'],
            'scores.*' => ['required', 'integer', 'min:0', 'max:100000'],
        ]);

        abort_if(collect($validated['scores'])->keys()->diff($partyIds)->isNotEmpty(), 422, 'Unknown party submitted.');

        $unit = PollingUnit::where('uniqueid', $validated['unit_id'])->firstOrFail();

        DB::transaction(function () use ($validated, $unit, $request) {
            foreach ($validated['scores'] as $party => $score) {
                $unit->announcedResults()->updateOrCreate(
                    ['party_abbreviation' => $party],
                    ['party_score' => $score, 'entered_by_user' => $request->user()?->name ?? 'system', 'date_entered' => now(), 'user_ip_address' => $request->ip()],
                );
            }
        });

        return redirect()->route('bicon.show', ['state' => $validated['state_id'], 'lga' => $unit->lga_id, 'ward' => $unit->ward_id, 'unit' => $unit->polling_unit_id])->with('success', 'Results saved.');
    }

    public function storePolling()
    {
        return Inertia::render('polling-form', []);
    }
}
