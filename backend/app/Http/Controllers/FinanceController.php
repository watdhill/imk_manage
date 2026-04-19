<?php

namespace App\Http\Controllers;

use App\Models\CashTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class FinanceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $transactions = CashTransaction::query()
            ->with('workProgram:id,title')
            ->when($request->filled('type'), function ($query) use ($request) {
                $query->where('type', $request->string('type')->toString());
            })
            ->orderByDesc('transaction_date')
            ->orderByDesc('id')
            ->get();

        return response()->json($transactions);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'in:income,expense'],
            'source' => ['required', 'in:general,proker'],
            'description' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'transaction_date' => ['required', 'date'],
            'work_program_id' => ['nullable', 'exists:work_programs,id'],
        ]);

        $transaction = CashTransaction::create([
            ...$validated,
            'created_by' => $request->user()?->id,
        ]);

        return response()->json($transaction, 201);
    }

    public function summary(Request $request): JsonResponse
    {
        $month = $request->string('month')->toString();

        if ($month === '') {
            $startDate = Carbon::now()->startOfMonth()->toDateString();
            $endDate = Carbon::now()->endOfMonth()->toDateString();
        } else {
            $startDate = Carbon::createFromFormat('Y-m', $month)->startOfMonth()->toDateString();
            $endDate = Carbon::createFromFormat('Y-m', $month)->endOfMonth()->toDateString();
        }

        $income = CashTransaction::query()
            ->where('type', 'income')
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->sum('amount');

        $expense = CashTransaction::query()
            ->where('type', 'expense')
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->sum('amount');

        return response()->json([
            'month_range' => [$startDate, $endDate],
            'income' => (float) $income,
            'expense' => (float) $expense,
            'balance' => (float) ($income - $expense),
        ]);
    }
}