<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Inventory::query()->orderBy('item_name')->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'item_name' => ['required', 'string', 'max:255'],
            'quantity' => ['required', 'integer', 'min:1'],
            'condition' => ['required', 'in:baik,rusak,hilang'],
            'location' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ]);

        $inventory = Inventory::create($validated);

        return response()->json($inventory, 201);
    }

    public function updateCondition(Request $request, Inventory $inventory): JsonResponse
    {
        $validated = $request->validate([
            'condition' => ['required', 'in:baik,rusak,hilang'],
            'location' => ['nullable', 'string', 'max:255'],
        ]);

        $inventory->condition = $validated['condition'];

        if (isset($validated['location'])) {
            $inventory->location = $validated['location'];
        }

        $inventory->save();

        return response()->json($inventory);
    }
}