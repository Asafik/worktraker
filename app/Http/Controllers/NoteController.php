<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class NoteController extends Controller
{
    /**
     * Display a listing of notes.
     */
    public function index(Request $request): Response
    {
        $userId = Auth::id() ?? User::first()?->id;

        $query = Note::with([
            'project:id,name,slug,github_repo_name,github_repo_url,category,status,company_name',
        ])
        ->where(function ($q) use ($userId) {
            $q->where('user_id', $userId)->orWhereNull('user_id');
        });

        // Search query
        if ($request->filled('search')) {
            $search = strtolower($request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(title) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(content) LIKE ?', ["%{$search}%"])
                  ->orWhereHas('project', function ($pq) use ($search) {
                      $pq->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"]);
                  });
            });
        }

        // Filter by Category
        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Filter by Project
        if ($request->filled('project_id') && $request->project_id !== 'all') {
            $query->where('project_id', $request->project_id);
        }

        $notes = $query->latest('updated_at')->get();

        // Projects for selector dropdown
        $projects = Project::where(function ($q) use ($userId) {
            $q->where('user_id', $userId)->orWhereNull('user_id');
        })
        ->select('id', 'name', 'slug', 'github_repo_name')
        ->orderBy('name')
        ->get();

        // Stats summary
        $allNotesQuery = Note::where(function ($q) use ($userId) {
            $q->where('user_id', $userId)->orWhereNull('user_id');
        });

        $stats = [
            'total'     => (clone $allNotesQuery)->count(),
            'revisions' => (clone $allNotesQuery)->where('category', 'Revision')->count(),
            'ideas'     => (clone $allNotesQuery)->where('category', 'Idea')->count(),
            'meetings'  => (clone $allNotesQuery)->where('category', 'Meeting')->count(),
        ];

        return Inertia::render('Notes/Index', [
            'notes'    => $notes,
            'projects' => $projects,
            'stats'    => $stats,
            'filters'  => [
                'search'     => $request->input('search', ''),
                'category'   => $request->input('category', 'all'),
                'project_id' => $request->input('project_id', 'all'),
            ],
            'flash'    => [
                'message' => session('message'),
            ],
        ]);
    }

    /**
     * Store a newly created note.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title'      => ['required', 'string', 'max:255'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'category'   => ['required', 'string', 'in:Revision,Idea,Meeting,Technical,General'],
            'content'    => ['nullable', 'string'],
        ]);

        $userId = Auth::id() ?? User::first()?->id;

        Note::create([
            'user_id'    => $userId,
            'project_id' => $validated['project_id'] ?: null,
            'title'      => $validated['title'],
            'category'   => $validated['category'],
            'content'    => $validated['content'] ?? '',
        ]);

        return back()->with('message', 'Catatan berhasil dibuat!');
    }

    /**
     * Update an existing note.
     */
    public function update(Request $request, Note $note): RedirectResponse
    {
        $validated = $request->validate([
            'title'      => ['required', 'string', 'max:255'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'category'   => ['required', 'string', 'in:Revision,Idea,Meeting,Technical,General'],
            'content'    => ['nullable', 'string'],
        ]);

        $note->update([
            'project_id' => $validated['project_id'] ?: null,
            'title'      => $validated['title'],
            'category'   => $validated['category'],
            'content'    => $validated['content'] ?? '',
        ]);

        return back()->with('message', 'Catatan berhasil diperbarui!');
    }

    /**
     * Delete a note.
     */
    public function destroy(Note $note): RedirectResponse
    {
        $note->delete();

        return back()->with('message', 'Catatan berhasil dihapus.');
    }
}
