<?php

namespace App\Http\Controllers;

use App\Models\CashTransaction;
use App\Models\Member;
use App\Models\WorkProgram;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function summary(Request $request): JsonResponse
    {
        $monthStart = Carbon::now()->startOfMonth()->toDateString();
        $monthEnd = Carbon::now()->endOfMonth()->toDateString();

        $income = CashTransaction::query()
            ->where('type', 'income')
            ->whereBetween('transaction_date', [$monthStart, $monthEnd])
            ->sum('amount');

        $expense = CashTransaction::query()
            ->where('type', 'expense')
            ->whereBetween('transaction_date', [$monthStart, $monthEnd])
            ->sum('amount');

        $prokerStatus = WorkProgram::query()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $memberByDivision = Member::query()
            ->with('division:id,name')
            ->where('is_active', true)
            ->get()
            ->groupBy(fn (Member $member) => $member->division?->name ?? 'Tanpa Divisi')
            ->map(fn ($members) => $members->count());

        return response()->json([
            'cash_chart' => [
                'income' => (float) $income,
                'expense' => (float) $expense,
                'balance' => (float) ($income - $expense),
            ],
            'program_status' => [
                'planned' => (int) ($prokerStatus['planned'] ?? 0),
                'ongoing' => (int) ($prokerStatus['ongoing'] ?? 0),
                'completed' => (int) ($prokerStatus['completed'] ?? 0),
            ],
            'member_info' => [
                'total_active' => Member::query()->where('is_active', true)->count(),
                'by_division' => $memberByDivision,
            ],
        ]);
    }
}