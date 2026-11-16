<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lga extends Model
{
    protected $table = 'lga';
    protected $primaryKey = 'uniqueid';

    public $timestamps = false;

    protected $fillable = [
        'lga_id',
        'lga_name',
        'state_id',
        'lga_description',
        'entered_by_user',
        'date_entered',
        'user_ip_address',
    ];

    public function state(): BelongsTo
    {
        return $this->belongsTo(State::class, 'state_id', 'state_id');
    }

    public function wards(): HasMany
    {
        return $this->hasMany(Ward::class, 'lga_id', 'lga_id');
    }

    public function pollingUnits(): HasMany
    {
        return $this->hasMany(PollingUnit::class, 'lga_id', 'lga_id');
    }
}
