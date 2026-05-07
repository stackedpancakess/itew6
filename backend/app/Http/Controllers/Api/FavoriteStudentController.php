<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FavoriteStudent;
use Illuminate\Http\Request;

class FavoriteStudentController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'user_id' => 'nullable|integer|exists:users,id',
        ]);

        $favorites = FavoriteStudent::with('student')
            ->where('user_id', $request->input('user_id'))
            ->get();

        return response()->json([
            'data' => $favorites,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|integer|exists:students,id',
            'user_id' => 'nullable|integer|exists:users,id',
        ]);

        $existing = FavoriteStudent::where('student_id', $validated['student_id'])
            ->where('user_id', $validated['user_id'] ?? null)
            ->first();

        if ($existing) {
            return response()->json(['data' => $existing]);
        }

        $favorite = FavoriteStudent::create($validated);

        return response()->json(['data' => $favorite], 201);
    }

    public function destroy(Request $request, int $studentId)
    {
        $request->validate([
            'user_id' => 'nullable|integer|exists:users,id',
        ]);

        FavoriteStudent::where('student_id', $studentId)
            ->where('user_id', $request->input('user_id'))
            ->delete();

        return response()->json(null, 204);
    }
}
