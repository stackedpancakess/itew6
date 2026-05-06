<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DeploymentResource;
use App\Models\Deployment;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DeploymentController extends Controller
{
    public function index(): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $deployments = Deployment::with(['student', 'professor', 'subject'])->orderBy('id', 'desc')->get();

        return DeploymentResource::collection($deployments);
    }

    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'integer', 'exists:students,id'],
            'professor_id' => ['required', 'integer', 'exists:employees,id'],
            'subject_id' => ['required', 'integer', 'exists:subjects,id'],
            'semester' => ['required', 'string'],
            'academic_year' => ['required', 'string'],
            'status' => ['required', 'in:active,completed'],
        ]);

        $deployment = Deployment::create($validated);

        return response()->json(new DeploymentResource($deployment->load(['student', 'professor', 'subject'])), Response::HTTP_CREATED);
    }

    public function show(Deployment $deployment): \Illuminate\Http\JsonResponse
    {
        return response()->json(new DeploymentResource($deployment->load(['student', 'professor', 'subject'])));
    }

    public function update(Request $request, Deployment $deployment): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'student_id' => ['sometimes', 'integer', 'exists:students,id'],
            'professor_id' => ['sometimes', 'integer', 'exists:employees,id'],
            'subject_id' => ['sometimes', 'integer', 'exists:subjects,id'],
            'semester' => ['sometimes', 'string'],
            'academic_year' => ['sometimes', 'string'],
            'status' => ['sometimes', 'in:active,completed'],
        ]);

        $deployment->update($validated);

        return response()->json(new DeploymentResource($deployment->load(['student', 'professor', 'subject'])));
    }

    public function destroy(Deployment $deployment): \Illuminate\Http\JsonResponse
    {
        $deployment->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
