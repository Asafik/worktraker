<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    /**
     * Display the settings page with current profile data from SQLite.
     */
    public function index(): Response
    {
        $user = User::first();

        if (!$user) {
            $user = User::create([
                'name' => 'Asafik',
                'email' => 'asafik.dev@gmail.com',
                'password' => bcrypt('password'),
                'role' => 'Full Stack Developer',
                'location' => 'Indonesia',
                'bio' => 'I build modern web applications and turn ideas into reality. Focused on clean code, simple design, and meaningful impact.',
                'website' => 'https://asafik.dev',
                'avatar' => '/images/avatar1.png',
                'about_short' => 'Web developer with a passion for building useful applications. Always learning and exploring new technologies.',
                'signature' => "Best regards,\nAsafik",
                'socials' => [
                    'github' => 'https://github.com/asafik',
                    'linkedin' => 'https://linkedin.com/in/asafik',
                    'website' => 'https://asafik.dev',
                    'x' => '',
                    'instagram' => '',
                    'facebook' => '',
                ],
            ]);
        }

        $isGoogleDriveConnected = !empty(config('services.google_drive.client_id'))
            && !empty(config('services.google_drive.client_secret'))
            && !empty(config('services.google_drive.refresh_token'));

        return Inertia::render('Settings/Index', [
            'userProfile' => [
                'id' => $user->id,
                'fullName' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'Full Stack Developer',
                'location' => $user->location ?? 'Indonesia',
                'bio' => $user->bio ?? '',
                'website' => $user->website ?? '',
                'avatar' => $user->avatar ?? '/images/avatar1.png',
                'aboutShort' => $user->about_short ?? '',
                'signature' => $user->signature ?? '',
                'socials' => array_merge([
                    'github' => '',
                    'linkedin' => '',
                    'website' => '',
                    'x' => '',
                    'instagram' => '',
                    'facebook' => '',
                ], (array) ($user->socials ?? [])),
            ],
            'integrationsStatus' => [
                'googleDrive' => [
                    'connected' => $isGoogleDriveConnected,
                    'account' => 'ronismk7@gmail.com',
                    'accountType' => 'Personal Account (Google Drive)',
                    'folderConfigured' => !empty(config('services.google_drive.folder_id')),
                    'folderId' => config('services.google_drive.folder_id') ?? '',
                    'url' => 'https://drive.google.com',
                    'lastSynced' => now()->format('d M Y, H:i'),

                ],
                'github' => [
                    'connected' => true,
                    'account' => 'asafik',
                    'accountType' => 'Personal Account',
                    'avatar' => '/images/avatar1.png',
                    'url' => !empty($user->socials['github']) ? $user->socials['github'] : 'https://github.com/asafik',
                    'lastSynced' => now()->format('d M Y, H:i'),
                ],
            ],
            'flash' => [
                'message' => session('message'),
            ],
        ]);
    }

    /**
     * Update the profile data in SQLite.
     */
    public function updateProfile(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'fullName' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'role' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:1000',
            'website' => 'nullable|string|max:255',
            'aboutShort' => 'nullable|string|max:500',
            'signature' => 'nullable|string|max:255',
            'socials' => 'nullable|array',
            'socials.github' => 'nullable|string|max:255',
            'socials.linkedin' => 'nullable|string|max:255',
            'socials.website' => 'nullable|string|max:255',
            'socials.x' => 'nullable|string|max:255',
            'socials.instagram' => 'nullable|string|max:255',
            'socials.facebook' => 'nullable|string|max:255',
        ]);

        $user = User::first();

        if ($user) {
            $user->update([
                'name' => $validated['fullName'],
                'email' => $validated['email'],
                'role' => $validated['role'] ?? $user->role,
                'location' => $validated['location'] ?? $user->location,
                'bio' => $validated['bio'] ?? '',
                'website' => $validated['website'] ?? '',
                'about_short' => $validated['aboutShort'] ?? '',
                'signature' => $validated['signature'] ?? '',
                'socials' => $validated['socials'] ?? $user->socials,
            ]);
        }

        return back()->with('message', 'Profil berhasil disimpan ke database SQLite!');
    }

    /**
     * Upload and update the profile avatar image.
     */
    public function uploadAvatar(Request $request): RedirectResponse
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,webp,svg|max:2048',
        ]);

        $user = User::first();

        if ($user && $request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $filename = 'avatar_' . time() . '.' . $file->getClientOriginalExtension();
            
            // Store directly in public/images/avatars for immediate web availability
            $destinationPath = public_path('images/avatars');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $file->move($destinationPath, $filename);

            $user->update([
                'avatar' => '/images/avatars/' . $filename,
            ]);
        }

        return back()->with('message', 'Foto profil berhasil diperbarui!');
    }
}
