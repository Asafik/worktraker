<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    /**
     * Display a listing of tasks with relations and statistics.
     */
    public function index(Request $request): Response
    {
        $userId = Auth::id() ?? User::first()?->id;

        $query = Task::with([
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
                  ->orWhereRaw('LOWER(description) LIKE ?', ["%{$search}%"])
                  ->orWhereHas('project', function ($pq) use ($search) {
                      $pq->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"])
                         ->orWhereRaw('LOWER(github_repo_name) LIKE ?', ["%{$search}%"]);
                  });
            });
        }

        // Filter by Type (feature, revision, bugfix, general)
        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        // Filter by Status (todo, in_progress, completed)
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by Priority (Low, Medium, High, Urgent)
        if ($request->filled('priority') && $request->priority !== 'all') {
            $query->where('priority', $request->priority);
        }

        // Filter by Project
        if ($request->filled('project_id') && $request->project_id !== 'all') {
            $query->where('project_id', $request->project_id);
        }

        // Sort order
        $sortBy = $request->input('sort', 'latest');
        if ($sortBy === 'due_date') {
            $query->orderByRaw('CASE WHEN due_date IS NULL THEN 1 ELSE 0 END, due_date ASC');
        } elseif ($sortBy === 'priority') {
            $query->orderByRaw("CASE priority WHEN 'Urgent' THEN 1 WHEN 'High' THEN 2 WHEN 'Medium' THEN 3 WHEN 'Low' THEN 4 ELSE 5 END");
        } else {
            $query->latest();
        }

        $tasks = $query->get();

        // Projects for selector dropdown
        $projects = Project::where(function ($q) use ($userId) {
            $q->where('user_id', $userId)->orWhereNull('user_id');
        })
        ->select('id', 'name', 'slug', 'github_repo_name', 'github_repo_url', 'category', 'status', 'company_name')
        ->orderBy('name')
        ->get();

        // Overall stats
        $allTasksQuery = Task::where(function ($q) use ($userId) {
            $q->where('user_id', $userId)->orWhereNull('user_id');
        });

        $stats = [
            'total'       => (clone $allTasksQuery)->count(),
            'revisions'   => (clone $allTasksQuery)->where('type', 'revision')->where('status', '!=', 'completed')->count(),
            'in_progress' => (clone $allTasksQuery)->where('status', 'in_progress')->count(),
            'completed'   => (clone $allTasksQuery)->where('status', 'completed')->count(),
            'urgent'      => (clone $allTasksQuery)->whereIn('priority', ['High', 'Urgent'])->where('status', '!=', 'completed')->count(),
        ];

        return Inertia::render('Tasks/Index', [
            'tasks'    => $tasks,
            'projects' => $projects,
            'stats'    => $stats,
            'filters'  => [
                'search'     => $request->input('search', ''),
                'type'       => $request->input('type', 'all'),
                'status'     => $request->input('status', 'all'),
                'priority'   => $request->input('priority', 'all'),
                'project_id' => $request->input('project_id', 'all'),
                'sort'       => $sortBy,
            ],
            'flash'    => [
                'message' => session('message'),
            ],
        ]);
    }

    /**
     * Store a newly created task.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'project_id'  => ['nullable', 'exists:projects,id'],
            'type'        => ['required', 'string', 'in:feature,revision,bugfix,general'],
            'priority'    => ['required', 'string', 'in:Low,Medium,High,Urgent'],
            'status'      => ['required', 'string', 'in:todo,in_progress,completed'],
            'due_date'    => ['nullable', 'date'],
        ], [
            'title.required' => 'Judul tugas atau revisi wajib diisi.',
            'type.required'  => 'Tipe pekerjaan (Pengerjaan/Revisi/Bug) wajib dipilih.',
        ]);

        $userId = Auth::id() ?? User::first()?->id;

        $task = Task::create([
            'user_id'      => $userId,
            'project_id'   => $validated['project_id'] ?: null,
            'title'        => $validated['title'],
            'description'  => $validated['description'] ?? null,
            'type'         => $validated['type'],
            'priority'     => $validated['priority'],
            'status'       => $validated['status'],
            'due_date'     => $validated['due_date'] ?? null,
            'completed_at' => $validated['status'] === 'completed' ? now() : null,
        ]);

        $typeLabel = match ($task->type) {
            'revision' => 'Revisi',
            'bugfix'   => 'Perbaikan Bug',
            'feature'  => 'Pengerjaan Fitur',
            default    => 'Tugas',
        };

        return back()->with('message', "{$typeLabel} berhasil ditambahkan!");
    }

    /**
     * Update an existing task.
     */
    public function update(Request $request, Task $task): RedirectResponse
    {
        $validated = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'project_id'  => ['nullable', 'exists:projects,id'],
            'type'        => ['required', 'string', 'in:feature,revision,bugfix,general'],
            'priority'    => ['required', 'string', 'in:Low,Medium,High,Urgent'],
            'status'      => ['required', 'string', 'in:todo,in_progress,completed'],
            'due_date'    => ['nullable', 'date'],
        ]);

        $wasCompleted = $task->status === 'completed';
        $nowCompleted = $validated['status'] === 'completed';

        $completedAt = $task->completed_at;
        if (!$wasCompleted && $nowCompleted) {
            $completedAt = now();
        } elseif ($wasCompleted && !$nowCompleted) {
            $completedAt = null;
        }

        $task->update([
            'project_id'   => $validated['project_id'] ?: null,
            'title'        => $validated['title'],
            'description'  => $validated['description'] ?? null,
            'type'         => $validated['type'],
            'priority'     => $validated['priority'],
            'status'       => $validated['status'],
            'due_date'     => $validated['due_date'] ?? null,
            'completed_at' => $completedAt,
        ]);

        return back()->with('message', 'Tugas berhasil diperbarui!');
    }

    /**
     * Quick toggle completion status of a task.
     */
    public function toggle(Task $task): RedirectResponse
    {
        if ($task->status === 'completed') {
            $task->update([
                'status'       => 'todo',
                'completed_at' => null,
            ]);
            $msg = 'Tugas dikembalikan ke antrean (To Do).';
        } else {
            $task->update([
                'status'       => 'completed',
                'completed_at' => now(),
            ]);
            $msg = 'Tugas berhasil diselesaikan!';
        }

        return back()->with('message', $msg);
    }

    /**
     * Delete a task and remove [Masuk Tasks] tag from origin note if applicable.
     */
    public function destroy(Task $task): RedirectResponse
    {
        // Reconcile and remove [Masuk Tasks] tag from Note if this task originated from a note
        $rawTitle = trim(preg_replace('/\[Masuk Tasks\]|\(Masuk Tasks\)/i', '', $task->title));
        if (!empty($rawTitle)) {
            $quoted = preg_quote($rawTitle, '/');
            $notesToClean = collect();

            if ($task->note_id && $task->note) {
                $notesToClean->push($task->note);
            } else {
                // Fallback: search notes that contain this task's title and [Masuk Tasks]
                $notesToClean = Note::where('content', 'LIKE', "%{$rawTitle}%")
                    ->where(function ($q) {
                        $q->where('content', 'LIKE', '%[Masuk Tasks]%')
                          ->orWhere('content', 'LIKE', '%(Masuk Tasks)%');
                    })
                    ->get();
            }

            foreach ($notesToClean as $note) {
                if (!empty($note->content)) {
                    $cleanedContent = preg_replace(
                        "/(?:\*\*" . $quoted . "\*\*|" . $quoted . ")\s*(?:\[Masuk Tasks\]|\(Masuk Tasks\))/i",
                        str_contains($note->content, "**{$rawTitle}**") ? "**{$rawTitle}**" : $rawTitle,
                        $note->content
                    );

                    if ($cleanedContent !== $note->content) {
                        $note->update(['content' => $cleanedContent]);
                    }
                }
            }
        }

        $task->delete();

        return back()->with('message', 'Tugas berhasil dihapus.');
    }
}
