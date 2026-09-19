<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dynamic Dashboard page aggregating Projects, Tasks, and Notes.
     */
    public function index(Request $request): Response
    {
        $user = Auth::user() ?? User::first();
        $userId = $user?->id;

        // --- 1. Top Metrics & Statistics ---
        $totalProjects = Project::count();
        $projectsInProgress = Project::where('status', 'In Progress')->count();
        $projectsCompleted = Project::where('status', 'Completed')->count();
        $projectsThisMonth = Project::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        $totalTasks = Task::count();
        $tasksCompleted = Task::where('status', 'completed')->count();
        $tasksInProgress = Task::where('status', 'in_progress')->count();
        $tasksTodo = Task::whereIn('status', ['todo', 'pending'])->count();
        $tasksCompletionRate = $totalTasks > 0 ? (int) round(($tasksCompleted / $totalTasks) * 100) : 0;
        $tasksThisMonth = Task::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        $totalNotes = Note::count();
        $notesThisMonth = Note::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        // Estimated hours worked based on completed & in-progress tasks
        $estimatedHours = ($tasksCompleted * 3) + ($tasksInProgress * 2) + ($projectsCompleted * 10);

        // --- 2. Productivity Chart (Last 7 Days) ---
        $chartDays = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $dayLabel = $date->format('D'); // Mon, Tue, etc.
            $dateFormatted = $date->format('d M Y');

            // Count tasks completed on this day or created on this day
            $tasksOnDate = Task::whereDate('completed_at', $date)
                ->orWhere(function ($q) use ($date) {
                    $q->whereDate('created_at', $date)
                      ->where('status', 'completed');
                })
                ->count();

            $chartDays[] = [
                'day'       => $dayLabel,
                'date'      => $dateFormatted,
                'val'       => $tasksOnDate,
                'is_today'  => $i === 0,
            ];
        }

        // --- 3. Task Status Distribution ---
        $taskDistribution = [
            'total'       => $totalTasks,
            'completed'   => $tasksCompleted,
            'in_progress' => $tasksInProgress,
            'todo'        => $tasksTodo,
        ];

        // --- 4. Recent Projects (Latest 4) ---
        $recentProjects = Project::select([
                'id',
                'name',
                'slug',
                'category',
                'role',
                'status',
                'company_name',
                'ownership_type',
                'images',
                'github_repo_name',
                'due_date',
                'start_date',
                'created_at',
            ])
            ->latest()
            ->take(4)
            ->get()
            ->map(function ($project) {
                return [
                    'id'               => $project->id,
                    'name'             => $project->name,
                    'slug'             => $project->slug ?? (string) $project->id,
                    'category'         => $project->category ?? 'General',
                    'role'             => $project->role ?? 'Developer',
                    'status'           => $project->status ?? 'In Progress',
                    'company_name'     => $project->company_name,
                    'ownership_type'   => $project->ownership_type ?? 'Company',
                    'images'           => $project->images ?? [],
                    'github_repo_name' => $project->github_repo_name,
                    'due_date'         => $project->due_date ? Carbon::parse($project->due_date)->format('d M Y') : null,
                    'start_date'       => $project->start_date ? Carbon::parse($project->start_date)->format('d M Y') : null,
                    'created_at'       => $project->created_at ? $project->created_at->format('d M Y') : 'Recently',
                ];
            });

        // --- 5. Upcoming / Active Tasks (Latest 5) ---
        $upcomingTasks = Task::with('project:id,name,slug')
            ->orderByRaw("CASE WHEN status = 'completed' THEN 1 ELSE 0 END, created_at DESC")
            ->take(5)
            ->get()
            ->map(function ($task) {
                return [
                    'id'           => $task->id,
                    'title'        => $task->title,
                    'status'       => $task->status,
                    'priority'     => ucfirst($task->priority ?? 'Medium'),
                    'type'         => $task->type ?? 'general',
                    'project_name' => $task->project?->name,
                    'project_slug' => $task->project?->slug ?? (string) $task->project?->id,
                    'due_date'     => $task->due_date ? Carbon::parse($task->due_date)->format('d M') : ($task->created_at ? $task->created_at->format('d M') : 'Today'),
                    'done'         => $task->status === 'completed',
                ];
            });

        // --- 6. Recent Notes (Latest 4) ---
        $recentNotes = Note::with('project:id,name,slug')
            ->latest()
            ->take(4)
            ->get()
            ->map(function ($note) {
                // Strip markdown formatting for a clean excerpt
                $cleanContent = trim(preg_replace('/[#*`_>\[\]\(\)\-]/', ' ', $note->content ?? ''));
                $cleanContent = preg_replace('/\s+/', ' ', $cleanContent);

                return [
                    'id'           => $note->id,
                    'title'        => $note->title,
                    'category'     => $note->category ?? 'General',
                    'excerpt'      => Str::limit($cleanContent, 55, '...'),
                    'project_name' => $note->project?->name,
                    'project_slug' => $note->project?->slug ?? (string) $note->project?->id,
                    'date'         => $note->created_at ? $note->created_at->format('d M') : 'Today',
                ];
            });

        // --- 7. Greeting & Date Context ---
        $currentHour = (int) now()->format('H');
        if ($currentHour < 12) {
            $greetingTime = 'Good morning';
        } elseif ($currentHour < 17) {
            $greetingTime = 'Good afternoon';
        } else {
            $greetingTime = 'Good evening';
        }

        $greeting = [
            'time'       => $greetingTime,
            'name'       => $user?->name ?? 'Developer',
            'date'       => now()->format('l, d F Y'),
            'quote'      => 'A little progress each day adds up to big results.',
            'quote_from' => 'WorkTrack',
        ];

        return Inertia::render('Dashboard/Index', [
            'greeting'         => $greeting,
            'stats'            => [
                'total_projects'        => $totalProjects,
                'projects_in_progress'  => $projectsInProgress,
                'projects_completed'    => $projectsCompleted,
                'projects_this_month'   => $projectsThisMonth,
                'total_tasks'           => $totalTasks,
                'tasks_completed'       => $tasksCompleted,
                'tasks_in_progress'     => $tasksInProgress,
                'tasks_todo'            => $tasksTodo,
                'tasks_completion_rate' => $tasksCompletionRate,
                'tasks_this_month'      => $tasksThisMonth,
                'total_notes'           => $totalNotes,
                'notes_this_month'      => $notesThisMonth,
                'hours_worked'          => $estimatedHours,
            ],
            'chart_days'        => $chartDays,
            'task_distribution' => $taskDistribution,
            'recent_projects'   => $recentProjects,
            'upcoming_tasks'    => $upcomingTasks,
            'recent_notes'      => $recentNotes,
        ]);
    }

    /**
     * Asynchronously fetch latest GitHub commit dates for projects with caching.
     */
    public function getLatestCommitDates(Request $request): JsonResponse
    {
        $user = Auth::user() ?? User::first();
        $token = $user?->github_token;
        $projectIds = $request->input('project_ids', []);

        if (empty($projectIds)) {
            return response()->json([]);
        }

        $projects = Project::whereIn('id', $projectIds)
            ->whereNotNull('github_repo_name')
            ->get(['id', 'github_repo_name']);

        if (!$token) {
            return response()->json([]);
        }

        $responses = Http::pool(function ($pool) use ($projects, $token) {
            return $projects->map(function ($project) use ($pool, $token) {
                return $pool->as((string) $project->id)
                    ->withToken($token)
                    ->withHeaders(['User-Agent' => 'WorkTrack-App'])
                    ->timeout(6)
                    ->get("https://api.github.com/repos/{$project->github_repo_name}/commits", [
                        'per_page' => 1,
                    ]);
            });
        });

        $results = [];
        foreach ($projects as $project) {
            $key = (string) $project->id;
            if (isset($responses[$key]) && $responses[$key]->successful()) {
                $commits = $responses[$key]->json();
                if (!empty($commits[0]['commit']['author']['date'])) {
                    $results[$project->id] = Carbon::parse($commits[0]['commit']['author']['date'])->format('d M Y');
                }
            }
        }

        return response()->json($results);
    }
}
