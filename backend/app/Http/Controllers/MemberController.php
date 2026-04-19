<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $members = Member::query()
            ->with(['division:id,name', 'user:id,name,email,role'])
            ->when($request->filled('division_id'), function ($query) use ($request) {
                $query->where('division_id', $request->integer('division_id'));
            })
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search')->toString();
                $query->where(function ($innerQuery) use ($search) {
                    $innerQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('nim', 'like', "%{$search}%")
                        ->orWhere('major', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->get();

        return response()->json($members);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'nim' => ['required', 'string', 'max:30', 'unique:members,nim'],
            'major' => ['required', 'string', 'max:255'],
            'batch_year' => ['required', 'integer', 'between:2000,2100'],
            'division_id' => ['nullable', 'exists:divisions,id'],
            'user_id' => ['nullable', 'exists:users,id'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $member = Member::create($validated);

        return response()->json($member->load(['division:id,name', 'user:id,name,email,role']), 201);
    }
}