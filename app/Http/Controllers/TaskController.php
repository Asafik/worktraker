<?php

namespace App\Http\Controllers;

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

        // Auto-seed initial project & tasks if database is empty so user can see immediate relationships
        if (Project::count() === 0) {
            Project::create([
                'user_id'          => $userId,
                'name'             => 'WorkTrack App',
                'slug'             => 'worktrack-app',
                'description'      => 'Aplikasi manajemen proyek, kalender, dan produktivitas harian developer.',
                'category'         => 'Web App',
                'company_name'     => 'Personal Workspace',
                'role'             => 'Full Stack Developer',
                'status'           => 'In Progress',
                'tech_stack'       => ['Laravel', 'React', 'TailwindCSS', 'SQLite'],
                'github_repo_name' => 'Asafik/worktraker',
                'github_repo_url'  => 'https://github.com/Asafik/worktraker',
            ]);
        }

        if (Task::count() === 0) {
            $firstProj = Project::first();
            Task::create([
                'user_id'      => $userId,
                'project_id'   => $firstProj?->id,
                'title'        => 'Revisi tata letak kolom tabel pada halaman proyek',
                'description'  => 'Permintaan perbaikan: hapus kolom deskripsi dan due date, tambahkan kolom GitHub repo dan Company.',
                'type'         => 'revision',
                'priority'     => 'High',
                'status'       => 'in_progress',
                'due_date'     => now()->addDays(2)->format('Y-m-d'),
            ]);
            Task::create([
                'user_id'      => $userId,
                'project_id'   => $firstProj?->id,
                'title'        => 'Integrasi login dengan username atau email',
                'description'  => 'Fitur baru autentikasi fleksibel dengan deteksi otomatis username / email.',
                'type'         => 'feature',
                'priority'     => 'Medium',
                'status'       => 'completed',
                'due_date'     => now()->subDay()->format('Y-m-d'),
                'completed_at' => now(),
            ]);
            Task::create([
                'user_id'      => $userId,
                'project_id'   => $firstProj?->id,
                'title'        => 'Fix bug preview perbesar foto profil di pengaturan',
                'description'  => 'Perbaikan popup lightbox agar muncul modal ukuran besar saat foto profil diklik.',
                'type'         => 'bugfix',
                'priority'     => 'Urgent',
                'status'       => 'todo',
                'due_date'     => now()->addDay()->format('Y-m-d'),
            ]);
        }

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
     * Delete a task.
     */
    public function destroy(Task $task): RedirectResponse
    {
        $task->delete();

        return back()->with('message', 'Tugas berhasil dihapus.');
    }
}
