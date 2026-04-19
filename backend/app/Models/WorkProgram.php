<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class WorkProgram extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'division_id',
        'person_in_charge_id',
        'status',
        'planned_date',
        'completed_at',
        'estimated_budget',
    ];

    protected $casts = [
        'planned_date' => 'date',
        'completed_at' => 'datetime',
        'estimated_budget' => 'float',
    ];

    public function division(): BelongsTo
    {
        return $this->belongsTo(Division::class);
    }

    public function personInCharge(): BelongsTo
    {
        return $this->belongsTo(User::class, 'person_in_charge_id');
    }

    public function report(): HasOne
    {
        return $this->hasOne(WorkProgramReport::class);
    }
}