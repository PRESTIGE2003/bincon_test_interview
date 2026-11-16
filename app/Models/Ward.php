<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ward extends Model
{
    protected $table = 'ward';
    protected $primaryKey = 'uniqueid';

    public $timestamps = false;

    protected $fillable = [
        'ward_id',
        'ward_name',
        'lga_id',
        'ward_description',
        'entered_by_user',
        'date_entered',
        'user_ip_address',
    ];

    public function lga(): BelongsTo
    {
        return $this->belongsTo(Lga::class, 'lga_id', 'lga_id');
    }

    public function pollingUnits(): HasMany
    {
        return $this->hasMany(PollingUnit::class, 'ward_id', 'ward_id');
    }
}
