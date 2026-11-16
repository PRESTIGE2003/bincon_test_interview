<?php

namespace App\Http\Controllers;

use App\Models\Lga;
use App\Models\Party;
use App\Models\State;
use App\Models\Ward;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PollingUnitResultController extends Controller
{
    public function create()
    {
        return Inertia::render('polling-form', [
            'states' => State::orderBy('state_name')->get(['state_id', 'state_name']),
            'lgas' => Lga::orderBy('lga_name')->get(['lga_id', 'lga_name', 'state_id']),
            'parties' => Party::orderBy('partyname')->get(['partyid', 'partyname']),
        ]);
    }

    public function wards(Request $request)
    {
        return Ward::where('lga_id', $request->integer('lga_id'))->orderBy('ward_name')->get(['ward_id', 'ward_name']);
    }

    public function store(Request $request)
    {
        $v = $request->validate([
            'state_id' => ['required', 'integer', 'exists:states,state_id'],
            'lga_id' => ['required', 'integer', Rule::exists('lga', 'lga_id')->where('state_id', $request->input('state_id'))],
            'ward_id' => ['required', 'integer', Rule::exists('ward', 'ward_id')->where('lga_id', $request->input('lga_id'))],
            'polling_unit_id' => ['required', 'integer', 'min:1', Rule::unique('polling_unit', 'polling_unit_id')->where('ward_id', $request->input('ward_id'))],
            'polling_unit_number' => ['required', 'string', 'max:50'],
            'polling_unit_name' => ['required', 'string', 'max:255'],
            'lat' => ['nullable', 'numeric', 'between:-1500,1500'],
            'long' => ['nullable', 'numeric', 'between:-1800,1800'],
            'results' => ['required', 'array'],
            'results.*' => ['required', 'integer', 'min:0', 'max:100000'],
        ]);

        $partyIds = Party::pluck('partyid')->all();
        $submitted = array_keys($v['results']);

        if (array_diff($partyIds, $submitted) || array_diff($submitted, $partyIds)) {
            return back()->withErrors(['results' => 'Please provide a valid score for every registered party.']);
        }

        $now = now();
        $user = $request->user()->name ?? 'guest';
        $ip = $request->ip();

        DB::transaction(function () use ($v, $now, $user, $ip) {
            $uniqueid = DB::table('polling_unit')->insertGetId([
                'polling_unit_id' => $v['polling_unit_id'],
                'ward_id' => $v['ward_id'],
                'lga_id' => $v['lga_id'],
                'polling_unit_number' => $v['polling_unit_number'],
                'polling_unit_name' => $v['polling_unit_name'],
                'lat' => $v['lat'] ?? null,
                'long' => $v['long'] ?? null,
                'entered_by_user' => $user ?? 'guest',
                'date_entered' => $now,
                'user_ip_address' => $ip,
            ], 'uniqueid');

//            DB::table('announced_pu_results')->insert(
//                collect($v['results'])->map(fn ($score, $party) => [
//                    'polling_unit_uniqueid' => (string) $uniqueid,
//                    'party_abbreviation' => $party,
//                    'party_score' => $score,
//                    'entered_by_user' => $user,
//                    'date_entered' => $now,
//                    'user_ip_address' => $ip,
//                ])->values()->all()
//            );
        });

        return redirect()->route('bicon.index', [
            'state' => $v['state_id'],
            'lga' => $v['lga_id'],
            'ward' => $v['ward_id'],
            'unit' => $v['polling_unit_id'],
        ])->with('success', 'Polling unit and results saved.');
    }
}
