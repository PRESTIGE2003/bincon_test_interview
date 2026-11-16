<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AgentName extends Model
{
    protected $table = 'agentname';
    protected $primaryKey = 'name_id';

    public $timestamps = false;

    protected $fillable = [
        'firstname',
        'lastname',
        'email',
        'phone',
        'pollingunit_uniqueid',
    ];

    public function pollingUnit(): BelongsTo
    {
        return $this->belongsTo(PollingUnit::class, 'pollingunit_uniqueid', 'uniqueid');
    }
}
