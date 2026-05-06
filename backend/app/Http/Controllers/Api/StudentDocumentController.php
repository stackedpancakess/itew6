<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentDocumentResource;
use App\Models\StudentDocument;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StudentDocumentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = StudentDocument::with('student')->orderBy('created_at', 'desc');

        if ($request->filled('student_id')) {
            $query->where('student_id', $request->input('student_id'));
        }

        $documents = $query->paginate(50);

        return response()->json([
            'data' => StudentDocumentResource::collection($documents->items()),
            'meta' => [
                'current_page' => $documents->currentPage(),
                'last_page' => $documents->lastPage(),
                'per_page' => $documents->perPage(),
                'total' => $documents->total(),
                'from' => $documents->firstItem(),
                'to' => $documents->lastItem(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'document_type' => 'required|in:resume,certificate,webinar,other',
            'document_name' => 'required|string|max:255',
            'attachment' => 'required|file|mimes:pdf,doc,docx,jpeg,jpg,png|max:20480',
        ]);

        $file = $request->file('attachment');
        $storedName = uniqid('document_') . '_' . time() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('student-documents', $storedName, 'public');

        $document = StudentDocument::create([
            'student_id' => $validated['student_id'],
            'document_type' => $validated['document_type'],
            'document_name' => $validated['document_name'],
            'file_path' => $path,
            'original_file_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getClientMimeType(),
        ]);

        return response()->json(new StudentDocumentResource($document->load('student')), 201);
    }

    public function destroy(StudentDocument $studentDocument): JsonResponse
    {
        if ($studentDocument->file_path) {
            Storage::disk('public')->delete($studentDocument->file_path);
        }

        $studentDocument->delete();

        return response()->json(null, 204);
    }
}
