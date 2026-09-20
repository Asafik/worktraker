<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    /**
     * Display the portfolio management page with real projects from WorkTrack.
     */
    public function index(): Response
    {
        $projects = Project::orderBy('portfolio_order')
            ->orderByDesc('created_at')
            ->get();

        $user = User::first();
        $userProfile = [
            'fullName' => $user?->name ?? 'Asafik Daroini',
            'headline' => $user?->role ?? 'Full Stack Web Developer',
            'bio' => $user?->bio ?? 'I build modern web applications and turn ideas into reality. Focused on clean architecture, responsive UX, and scalable backend solutions.',
            'location' => $user?->location ?? 'Jawa Timur, Indonesia',
            'email' => $user?->email ?? 'asafik.dev@gmail.com',
            'avatar' => $user?->avatar ?? '/images/avatar1.png',
            'socials' => $user?->socials ?? [
                'github' => 'https://github.com/asafik',
                'linkedin' => 'https://linkedin.com/in/asafik',
                'twitter' => 'https://x.com/asafik',
            ],
        ];

        return Inertia::render('Portfolio/Index', [
            'projects' => $projects,
            'userProfile' => $userProfile,
        ]);
    }

    /**
     * Toggle whether a project is published/displayed in the portfolio.
     */
    public function togglePublish(Project $project): RedirectResponse|JsonResponse
    {
        $project->is_portfolio = !$project->is_portfolio;
        $project->save();

        $statusMsg = $project->is_portfolio 
            ? "Proyek '{$project->name}' sekarang ditampilkan di Portofolio!" 
            : "Proyek '{$project->name}' disembunyikan dari Portofolio.";

        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'is_portfolio' => $project->is_portfolio,
                'message' => $statusMsg,
            ]);
        }

        return back()->with('success', $statusMsg);
    }

    /**
     * Toggle featured status of a project in the portfolio.
     */
    public function toggleFeatured(Project $project): RedirectResponse|JsonResponse
    {
        $project->is_featured = !$project->is_featured;
        $project->save();

        $statusMsg = $project->is_featured 
            ? "Proyek '{$project->name}' ditandai sebagai Unggulan (Featured)!" 
            : "Proyek '{$project->name}' tidak lagi berstatus Unggulan.";

        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'is_featured' => $project->is_featured,
                'message' => $statusMsg,
            ]);
        }

        return back()->with('success', $statusMsg);
    }

    /**
     * Update the display order of projects in the portfolio.
     */
    public function updateOrder(Request $request): JsonResponse|RedirectResponse
    {
        $request->validate([
            'order' => 'required|array',
            'order.*' => 'integer|exists:projects,id',
        ]);

        foreach ($request->input('order') as $index => $id) {
            Project::where('id', $id)->update(['portfolio_order' => $index]);
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Urutan proyek portofolio berhasil disimpan!',
            ]);
        }

        return back()->with('success', 'Urutan proyek portofolio berhasil disimpan!');
    }

    /**
     * Update portfolio cover image or details for a project.
     */
    public function updateCover(Request $request, Project $project): RedirectResponse|JsonResponse
    {
        $request->validate([
            'cover_image' => 'nullable|image|max:5120',
            'cover_url' => 'nullable|string',
        ]);

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('portfolio', 'public');
            $project->portfolio_cover = Storage::url($path);
        } elseif ($request->filled('cover_url')) {
            $project->portfolio_cover = $request->input('cover_url');
        }

        $project->save();

        $msg = "Foto sampul proyek '{$project->name}' berhasil diperbarui!";

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'cover_image_url' => $project->cover_image_url,
                'message' => $msg,
            ]);
        }

        return back()->with('success', $msg);
    }

    /**
     * Update project portfolio details (title, description, urls, cover).
     */
    public function updateProject(Request $request, Project $project): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'name'            => 'nullable|string|max:255',
            'description'     => 'nullable|string',
            'github_repo_url' => 'nullable|url|max:255',
            'live_url'        => 'nullable|url|max:255',
            'is_portfolio'    => 'nullable|boolean',
            'is_featured'     => 'nullable|boolean',
            'portfolio_cover' => 'nullable|string',
            'cover_image'     => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('portfolio', 'public');
            $validated['portfolio_cover'] = Storage::url($path);
        }

        unset($validated['cover_image']);
        $project->update(array_filter($validated, fn($val) => !is_null($val)));

        $msg = "Proyek '{$project->name}' berhasil diperbarui!";

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'project' => $project->fresh(),
                'message' => $msg,
            ]);
        }

        return back()->with('success', $msg);
    }
}
