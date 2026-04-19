<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkProgramReceipt extends Model
{
    use HasFactory;

    protected $fillable = [
        'work_program_report_id',
        'title',
        'amount',
        'receipt_path',
    ];

    protected $casts = [
        'amount' => 'float',
    ];

    public function report(): BelongsTo
    {
        return $this->belongsTo(WorkProgramReport::class, 'work_program_report_id');
    }
}