<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\WorkProgramController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', function (Request $request) {
        return $request->user();
    });

    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);

    Route::get('/work-programs', [WorkProgramController::class, 'index']);
    Route::get('/inventories', [InventoryController::class, 'index']);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/users', function () {
            return User::query()
                ->select('id', 'name', 'email', 'role', 'created_at')
                ->orderBy('name')
                ->get();
        });
        Route::post('/admin/users', [AuthController::class, 'adminCreateUser']);
    });

    Route::middleware('role:admin,bendahara')->group(function () {
        Route::get('/finance/transactions', [FinanceController::class, 'index']);
        Route::post('/finance/transactions', [FinanceController::class, 'store']);
        Route::get('/finance/summary', [FinanceController::class, 'summary']);
    });

    Route::middleware('role:admin,ketua_divisi')->group(function () {
        Route::get('/members', [MemberController::class, 'index']);
        Route::post('/members', [MemberController::class, 'store']);

        Route::post('/work-programs', [WorkProgramController::class, 'store']);
        Route::patch('/work-programs/{workProgram}/status', [WorkProgramController::class, 'updateStatus']);
        Route::post('/work-programs/{workProgram}/complete', [WorkProgramController::class, 'complete']);

        Route::post('/inventories', [InventoryController::class, 'store']);
        Route::patch('/inventories/{inventory}/condition', [InventoryController::class, 'updateCondition']);
    });
});
