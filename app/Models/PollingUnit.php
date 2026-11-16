<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PollingUnit extends Model
{
    protected $table = 'polling_unit';
    protected $primaryKey = 'uniqueid';

    public $timestamps = false;

    protected $fillable = [
        'polling_unit_id',
        'ward_id',
        'lga_id',
        'uniquewardid',
        'polling_unit_number',
        'polling_unit_name',
        'polling_unit_description',
        'lat',
        'long',
        'entered_by_user',
        'date_entered',
        'user_ip_address',
    ];

    public function lga(): BelongsTo
    {
        return $this->belongsTo(Lga::class, 'lga_id', 'lga_id');
    }

    public function ward(): BelongsTo
    {
        return $this->belongsTo(Ward::class, 'ward_id', 'ward_id');
    }

    public function announcedResults(): HasMany
    {
        return $this->hasMany(AnnouncedPuResult::class, 'polling_unit_uniqueid', 'uniqueid');
    }

    public function agents(): HasMany
    {
        return $this->hasMany(AgentName::class, 'polling_unit_uniqueid', 'polling_unit_id');
    }
}
