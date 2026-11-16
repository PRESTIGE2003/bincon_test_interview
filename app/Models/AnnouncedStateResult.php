<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnnouncedStateResult extends Model
{
    protected $table = 'announced_state_results';
    protected $primaryKey = 'result_id';

    public $timestamps = false;

    protected $fillable = [
        'state_name',
        'party_abbreviation',
        'party_score',
        'entered_by_user',
        'date_entered',
        'user_ip_address',
    ];

    public function party(): BelongsTo
    {
        return $this->belongsTo(Party::class, 'party_abbreviation', 'partyid');
    }

    public function state(): BelongsTo
    {
        return $this->belongsTo(State::class, 'state_name', 'state_name');
    }
}
