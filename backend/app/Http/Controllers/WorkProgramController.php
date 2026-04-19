<?php

namespace App\Http\Controllers;

use App\Models\CashTransaction;
use App\Models\WorkProgram;
use App\Models\WorkProgramReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WorkProgramController extends Controller
{
    public function index(): JsonResponse
    {
        $workPrograms = WorkProgram::query()
            ->with(['division:id,name', 'personInCharge:id,name,email', 'report.receipts'])
            ->orderByDesc('created_at')
            ->get();

        return response()->json($workPrograms);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'division_id' => ['nullable', 'exists:divisions,id'],
            'person_in_charge_id' => ['nullable', 'exists:users,id'],
            'planned_date' => ['nullable', 'date'],
            'estimated_budget' => ['nullable', 'numeric', 'min:0'],
        ]);

        $workProgram = WorkProgram::create([
            ...$validated,
            'status' => 'planned',
            'estimated_budget' => $validated['estimated_budget'] ?? 0,
        ]);

        return response()->json($workProgram->load(['division:id,name', 'personInCharge:id,name,email']), 201);
    }

    public function updateStatus(Request $request, WorkProgram $workProgram): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:planned,ongoing,completed'],
        ]);

        $workProgram->status = $validated['status'];

        if ($validated['status'] === 'completed') {
            $workProgram->completed_at = now();
        }

        $workProgram->save();

        return response()->json($workProgram);
    }

    public function complete(Request $request, WorkProgram $workProgram): JsonResponse
    {
        $validated = $request->validate([
            'evaluation' => ['required', 'string'],
            'documentation_path' => ['nullable', 'string', 'max:255'],
            'receipts' => ['required', 'array', 'min:1'],
            'receipts.*.title' => ['required', 'string', 'max:255'],
            'receipts.*.amount' => ['required', 'numeric', 'min:0.01'],
            'receipts.*.receipt_path' => ['nullable', 'string', 'max:255'],
        ]);

        $report = DB::transaction(function () use ($request, $validated, $workProgram) {
            $report = WorkProgramReport::updateOrCreate(
                ['work_program_id' => $workProgram->id],
                [
                    'evaluation' => $validated['evaluation'],
                    'documentation_path' => $validated['documentation_path'] ?? null,
                    'submitted_by' => $request->user()?->id,
                    'submitted_at' => now(),
                ]
            );

            $report->receipts()->delete();

            $totalReceiptAmount = 0;

            foreach ($validated['receipts'] as $receipt) {
                $totalReceiptAmount += (float) $receipt['amount'];

                $report->receipts()->create([
                    'title' => $receipt['title'],
                    'amount' => $receipt['amount'],
                    'receipt_path' => $receipt['receipt_path'] ?? null,
                ]);
            }

            $workProgram->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            CashTransaction::create([
                'type' => 'expense',
                'source' => 'proker',
                'description' => 'Pengeluaran proker: '.$workProgram->title,
                'amount' => $totalReceiptAmount,
                'transaction_date' => now()->toDateString(),
                'work_program_id' => $workProgram->id,
                'created_by' => $request->user()?->id,
            ]);

            return $report->load('receipts');
        });

        return response()->json([
            'message' => 'Pelaporan proker berhasil dan kas sudah ter-update.',
            'report' => $report,
        ]);
    }
}