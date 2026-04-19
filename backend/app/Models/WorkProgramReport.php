<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkProgramReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'work_program_id',
        'evaluation',
        'documentation_path',
        'submitted_by',
        'submitted_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    public function workProgram(): BelongsTo
    {
        return $this->belongsTo(WorkProgram::class);
    }

    public function receipts(): HasMany
    {
        return $this->hasMany(WorkProgramReceipt::class, 'work_program_report_id');
    }
}