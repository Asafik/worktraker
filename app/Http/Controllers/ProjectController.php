<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Display the Projects index page with real DB projects.
     */
    public function index(): Response
    {
        $user = User::first();
        $isGitHubConnected = !empty($user?->github_token);

        $projects = Project::orderBy('created_at', 'desc')->get()->map(function ($project) {
            return [
                'id'               => $project->id,
                'name'             => $project->name,
                'slug'             => $project->slug,
                'description'      => $project->description,
                'category'         => $project->category,
                'project_type'     => $project->project_type,
                'status'           => $project->status,
                'tech_stack'       => $project->tech_stack ?? [],
                'images'           => $project->images ?? [],
                'github_repo_name' => $project->github_repo_name,
                'github_repo_url'  => $project->github_repo_url,
                'live_url'         => $project->live_url,
                'start_date'       => $project->start_date ? $project->start_date->format('d M Y') : null,
                'due_date'         => $project->due_date ? $project->due_date->format('d M Y') : null,
                'created_at'       => $project->created_at ? $project->created_at->format('d M Y') : null,
            ];
        });

        // Compute counts
        $totalProjects     = $projects->count();
        $activeProjects    = $projects->where('status', 'In Progress')->count();
        $completedProjects = $projects->where('status', 'Completed')->count();
        $onHoldProjects    = $projects->where('status', 'On Hold')->count();

        return Inertia::render('Projects/Index', [
            'projects'          => $projects->values(),
            'stats'             => [
                'total'     => $totalProjects,
                'active'    => $activeProjects,
                'completed' => $completedProjects,
                'on_hold'   => $onHoldProjects,
            ],
            'isGitHubConnected' => $isGitHubConnected,
            'githubUsername'    => $user?->github_username,
        ]);
    }

    /**
     * Show the full page form for creating a new project.
     * Optionally accepts prefill data from GitHub.
     */
    public function create(Request $request): Response
    {
        $user = User::first();

        // Optional prefill from query parameters (e.g. from GitHub import)
        $prefill = [
            'name'             => $request->query('name', ''),
            'description'      => $request->query('description', ''),
            'category'         => $request->query('category', 'Web Development'),
            'project_type'     => $request->query('project_type', 'Solo'),
            'status'           => $request->query('status', 'In Progress'),
            'tech_stack'       => $request->query('tech_stack') ? explode(',', $request->query('tech_stack')) : [],
            'github_repo_id'   => $request->query('github_repo_id', ''),
            'github_repo_name' => $request->query('github_repo_name', ''),
            'github_repo_url'  => $request->query('github_repo_url', ''),
        ];

        return Inertia::render('Projects/Form', [
            'mode'              => 'create',
            'project'           => null,
            'prefill'           => $prefill,
            'isGitHubConnected' => !empty($user?->github_token),
        ]);
    }

    /**
     * Store a newly created project in database.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:255',
            'description'      => 'nullable|string',
            'category'         => 'required|string|max:100',
            'project_type'     => 'required|in:Solo,Team',
            'status'           => 'required|in:Not Started,In Progress,Completed,On Hold',
            'tech_stack'       => 'nullable|array',
            'tech_stack.*'     => 'string|max:50',
            'github_repo_id'   => 'nullable|string|max:100',
            'github_repo_name' => 'nullable|string|max:255',
            'github_repo_url'  => 'nullable|url|max:255',
            'live_url'         => 'nullable|url|max:255',
            'start_date'       => 'nullable|date',
            'due_date'         => 'nullable|date',
            'images'           => 'nullable|array|max:4',
            'images.*'         => 'image|mimes:jpeg,png,jpg,webp,gif|max:5120', // max 5MB per image
        ]);

        $user = User::first();

        // Generate unique slug
        $baseSlug = Str::slug($validated['name']);
        $slug = $baseSlug;
        $counter = 1;
        while (Project::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        // Handle up to 4 image uploads
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                if (count($imagePaths) < 4) {
                    $path = $file->store('projects', 'public');
                    $imagePaths[] = '/storage/' . $path;
                }
            }
        }

        $project = Project::create([
            'user_id'          => $user?->id,
            'name'             => $validated['name'],
            'slug'             => $slug,
            'description'      => $validated['description'] ?? null,
            'category'         => $validated['category'],
            'project_type'     => $validated['project_type'],
            'status'           => $validated['status'],
            'tech_stack'       => $validated['tech_stack'] ?? [],
            'images'           => $imagePaths,
            'github_repo_id'   => $validated['github_repo_id'] ?? null,
            'github_repo_name' => $validated['github_repo_name'] ?? null,
            'github_repo_url'  => $validated['github_repo_url'] ?? null,
            'live_url'         => $validated['live_url'] ?? null,
            'start_date'       => $validated['start_date'] ?? null,
            'due_date'         => $validated['due_date'] ?? null,
        ]);

        return redirect()->route('projects')->with('message', 'Proyek berhasil dibuat! 🎉');
    }

    /**
     * Show the full page form for editing an existing project.
     */
    public function edit(int $id): Response
    {
        $project = Project::findOrFail($id);
        $user = User::first();

        return Inertia::render('Projects/Form', [
            'mode'              => 'edit',
            'project'           => [
                'id'               => $project->id,
                'name'             => $project->name,
                'slug'             => $project->slug,
                'description'      => $project->description,
                'category'         => $project->category,
                'project_type'     => $project->project_type,
                'status'           => $project->status,
                'tech_stack'       => $project->tech_stack ?? [],
                'images'           => $project->images ?? [],
                'github_repo_id'   => $project->github_repo_id,
                'github_repo_name' => $project->github_repo_name,
                'github_repo_url'  => $project->github_repo_url,
                'live_url'         => $project->live_url,
                'start_date'       => $project->start_date ? $project->start_date->format('Y-m-d') : '',
                'due_date'         => $project->due_date ? $project->due_date->format('Y-m-d') : '',
            ],
            'prefill'           => null,
            'isGitHubConnected' => !empty($user?->github_token),
        ]);
    }

    /**
     * Update an existing project in database.
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'name'             => 'required|string|max:255',
            'description'      => 'nullable|string',
            'category'         => 'required|string|max:100',
            'project_type'     => 'required|in:Solo,Team',
            'status'           => 'required|in:Not Started,In Progress,Completed,On Hold',
            'tech_stack'       => 'nullable|array',
            'tech_stack.*'     => 'string|max:50',
            'github_repo_id'   => 'nullable|string|max:100',
            'github_repo_name' => 'nullable|string|max:255',
            'github_repo_url'  => 'nullable|url|max:255',
            'live_url'         => 'nullable|url|max:255',
            'start_date'       => 'nullable|date',
            'due_date'         => 'nullable|date',
            'existing_images'  => 'nullable|array',
            'new_images'       => 'nullable|array|max:4',
            'new_images.*'     => 'image|mimes:jpeg,png,jpg,webp,gif|max:5120',
        ]);

        // Regenerate slug if name changed
        if ($project->name !== $validated['name']) {
            $baseSlug = Str::slug($validated['name']);
            $slug = $baseSlug;
            $counter = 1;
            while (Project::where('slug', $slug)->where('id', '!=', $project->id)->exists()) {
                $slug = "{$baseSlug}-{$counter}";
                $counter++;
            }
            $project->slug = $slug;
        }

        // Handle existing images retained
        $finalImages = $request->input('existing_images', []);

        // Delete images removed during edit from storage
        if (is_array($project->images)) {
            $removedImages = array_diff($project->images, $finalImages);
            foreach ($removedImages as $removedImg) {
                $relPath = str_replace('/storage/', '', $removedImg);
                if (Storage::disk('public')->exists($relPath)) {
                    Storage::disk('public')->delete($relPath);
                }
            }
        }

        // Upload new images up to max 4 total
        if ($request->hasFile('new_images')) {
            foreach ($request->file('new_images') as $file) {
                if (count($finalImages) < 4) {
                    $path = $file->store('projects', 'public');
                    $finalImages[] = '/storage/' . $path;
                }
            }
        }

        $project->update([
            'name'             => $validated['name'],
            'description'      => $validated['description'] ?? null,
            'category'         => $validated['category'],
            'project_type'     => $validated['project_type'],
            'status'           => $validated['status'],
            'tech_stack'       => $validated['tech_stack'] ?? [],
            'images'           => array_values($finalImages),
            'github_repo_id'   => $validated['github_repo_id'] ?? $project->github_repo_id,
            'github_repo_name' => $validated['github_repo_name'] ?? $project->github_repo_name,
            'github_repo_url'  => $validated['github_repo_url'] ?? $project->github_repo_url,
            'live_url'         => $validated['live_url'] ?? null,
            'start_date'       => $validated['start_date'] ?? null,
            'due_date'         => $validated['due_date'] ?? null,
        ]);

        return redirect()->route('projects')->with('message', 'Proyek berhasil diperbarui! ✅');
    }

    /**
     * Delete a project from database and remove its uploaded images.
     */
    public function destroy(int $id): RedirectResponse
    {
        $project = Project::findOrFail($id);

        // Delete images from local storage
        if (is_array($project->images)) {
            foreach ($project->images as $imgPath) {
                $relPath = str_replace('/storage/', '', $imgPath);
                if (Storage::disk('public')->exists($relPath)) {
                    Storage::disk('public')->delete($relPath);
                }
            }
        }

        $project->delete();

        return redirect()->route('projects')->with('message', 'Proyek berhasil dihapus.');
    }

    /**
     * Display the Project Detail page.
     * Fetches real 5 latest commits from GitHub if connected!
     */
    public function show(string $slug): Response
    {
        $project = Project::where('slug', $slug)->first();
        $user = User::first();

        // 5 latest commits from GitHub if repo is linked
        $recentCommits = [];
        if ($project && !empty($project->github_repo_name) && !empty($user?->github_token)) {
            try {
                $response = Http::withToken($user->github_token)
                    ->withHeaders([
                        'Accept'     => 'application/vnd.github+json',
                        'User-Agent' => 'WorkTrack-App',
                    ])
                    ->timeout(10)
                    ->get("https://api.github.com/repos/{$project->github_repo_name}/commits", [
                        'per_page' => 5,
                    ]);

                if ($response->successful()) {
                    $commitsData = $response->json();
                    $recentCommits = array_map(function ($c) {
                        return [
                            'sha'          => substr($c['sha'] ?? '', 0, 7),
                            'full_sha'     => $c['sha'] ?? '',
                            'message'      => $c['commit']['message'] ?? '',
                            'author_name'  => $c['commit']['author']['name'] ?? ($c['author']['login'] ?? 'Developer'),
                            'author_login' => $c['author']['login'] ?? null,
                            'author_avatar'=> $c['author']['avatar_url'] ?? null,
                            'date'         => $c['commit']['author']['date'] ?? null,
                            'html_url'     => $c['html_url'] ?? '',
                        ];
                    }, $commitsData);
                }
            } catch (\Exception $e) {
                Log::warning("Could not fetch commits for {$project->github_repo_name}: " . $e->getMessage());
            }
        }

        return Inertia::render('Projects/Detail', [
            'slug'          => $slug,
            'dbProject'     => $project ? [
                'id'               => $project->id,
                'name'             => $project->name,
                'slug'             => $project->slug,
                'description'      => $project->description,
                'category'         => $project->category,
                'project_type'     => $project->project_type,
                'status'           => $project->status,
                'tech_stack'       => $project->tech_stack ?? [],
                'images'           => $project->images ?? [],
                'github_repo_name' => $project->github_repo_name,
                'github_repo_url'  => $project->github_repo_url,
                'live_url'         => $project->live_url,
                'start_date'       => $project->start_date ? $project->start_date->format('d M Y') : null,
                'due_date'         => $project->due_date ? $project->due_date->format('d M Y') : null,
            ] : null,
            'recentCommits' => $recentCommits,
        ]);
    }

    /**
     * Fetch the list of repositories from connected GitHub account.
     */
    public function getGitHubRepositories(Request $request): JsonResponse
    {
        $user = User::first();

        if (!$user || empty($user->github_token)) {
            return response()->json([
                'success' => false,
                'message' => 'Akun GitHub belum terhubung. Silakan hubungkan GitHub di menu Settings.',
                'repos'   => [],
            ], 401);
        }

        try {
            $response = Http::withToken($user->github_token)
                ->withHeaders([
                    'Accept'     => 'application/vnd.github+json',
                    'User-Agent' => 'WorkTrack-App',
                ])
                ->timeout(15)
                ->get('https://api.github.com/user/repos', [
                    'affiliation' => 'owner,collaborator,organization_member',
                    'sort'        => 'updated',
                    'direction'   => 'desc',
                    'per_page'    => 100,
                ]);

            if ($response->status() === 401) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token GitHub telah kedaluwarsa. Silakan hubungkan ulang di Settings.',
                    'repos'   => [],
                ], 401);
            }

            if (!$response->successful()) {
                Log::error('GitHub API error: ' . $response->body());
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal mengambil data dari GitHub (' . $response->status() . ').',
                    'repos'   => [],
                ], $response->status());
            }

            $rawRepos = $response->json();
            $myUsername = strtolower($user->github_username ?? '');

            $repos = array_map(function ($repo) use ($myUsername) {
                $ownerLogin = $repo['owner']['login'] ?? '';
                $isOwner = strtolower($ownerLogin) === $myUsername;

                return [
                    'id'          => $repo['id'],
                    'name'        => $repo['name'],
                    'full_name'   => $repo['full_name'],
                    'description' => $repo['description'] ?? '',
                    'html_url'    => $repo['html_url'],
                    'is_private'  => (bool) ($repo['private'] ?? false),
                    'language'    => $repo['language'] ?? '',
                    'stars'       => $repo['stargazers_count'] ?? 0,
                    'forks'       => $repo['forks_count'] ?? 0,
                    'updated_at'  => $repo['updated_at'] ?? null,
                    'owner'       => [
                        'login'      => $ownerLogin,
                        'avatar_url' => $repo['owner']['avatar_url'] ?? '',
                        'type'       => $repo['owner']['type'] ?? 'User',
                    ],
                    'is_owner'    => $isOwner,
                    'type'        => $isOwner ? 'Personal' : 'Collab / Team',
                ];
            }, $rawRepos);

            return response()->json([
                'success' => true,
                'total'   => count($repos),
                'repos'   => $repos,
            ]);

        } catch (\Exception $e) {
            Log::error('Exception fetching GitHub repos: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menghubungi GitHub: ' . $e->getMessage(),
                'repos'   => [],
            ], 500);
        }
    }
}
