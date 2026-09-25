<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\IntegrationSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
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

        // 1. Google Drive Credentials (DB first, fallback to config/env)
        $googleDriveStatus = $this->getGoogleDriveData();

        // 2. Google Calendar Credentials (DB first, fallback to config/env)
        $calCreds = IntegrationSetting::getCredentials('google_calendar');
        $calIcalUrl = $calCreds['ical_url'] ?? config('services.google_calendar.ical_url');
        $isGoogleCalendarConnected = !empty($calIcalUrl);

        // 3. Google Gemini Credentials (DB first, fallback to config/env)
        $geminiCreds = IntegrationSetting::getCredentials('google_gemini');
        $geminiApiKey = $geminiCreds['api_key'] ?? config('services.gemini.key');
        $isGeminiConnected = !empty($geminiApiKey);

        $todayKey = 'gemini_requests_' . date('Y-m-d');
        $tokensKey = 'gemini_tokens_' . date('Y-m-d');
        $geminiUsedToday = (int) Cache::get($todayKey, 0);
        $geminiTokensToday = (int) Cache::get($tokensKey, 0);
        $geminiDailyLimit = 1500;
        $geminiRemaining = max(0, $geminiDailyLimit - $geminiUsedToday);
        $geminiLastRequestAt = Cache::get('gemini_last_request_at');

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
                'googleDrive' => $googleDriveStatus,
                'googleCalendar' => [
                    'connected'   => $isGoogleCalendarConnected,
                    'account'     => 'ronismk7@gmail.com',
                    'accountType' => 'Personal Account (Google Calendar)',
                    'calendarId'  => config('services.google_calendar.calendar_id', 'primary'),
                    'url'         => 'https://calendar.google.com',
                    'lastSynced'  => now()->format('d M Y, H:i'),
                    'credentials' => [
                        'ical_url' => $calIcalUrl ?? '',
                    ],
                ],
                'github' => [
                    'connected'   => !empty($user->github_id),
                    'account'     => $user->github_username ?? '',
                    'accountType' => 'Personal Account',
                    'avatar'      => $user->github_avatar ?? '/images/avatar1.png',
                    'url'         => $user->github_username ? 'https://github.com/' . $user->github_username : '',
                    'lastSynced'  => $user->updated_at?->format('d M Y, H:i') ?? now()->format('d M Y, H:i'),
                ],
                'googleGemini' => [
                    'connected'        => $isGeminiConnected,
                    'account'          => 'Google AI Studio (API Key)',
                    'accountType'      => 'Gemini Free Tier Quota',
                    'model'            => config('services.gemini.model', 'gemini-2.5-flash'),
                    'dailyLimit'       => $geminiDailyLimit,
                    'usedToday'        => $geminiUsedToday,
                    'remainingToday'   => $geminiRemaining,
                    'percentRemaining' => round(($geminiRemaining / $geminiDailyLimit) * 100, 1),
                    'tokensToday'      => $geminiTokensToday,
                    'rpmLimit'         => 15,
                    'tpmLimit'         => '1.000.000',
                    'lastSynced'       => $geminiLastRequestAt ? \Carbon\Carbon::parse($geminiLastRequestAt)->format('d M Y, H:i') : 'Belum ada request',
                    'url'              => 'https://aistudio.google.com',
                    'credentials'      => [
                        'api_key' => $geminiApiKey ?? '',
                    ],
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

    /**
     * Save integration credentials directly into SQLite integration_settings table.
     */
    public function updateIntegration(Request $request, string $service): RedirectResponse
    {
        if ($service === 'google_gemini') {
            $validated = $request->validate([
                'api_key' => 'required|string|max:255',
            ]);

            IntegrationSetting::setCredentials('google_gemini', [
                'api_key' => trim($validated['api_key']),
            ], true);

            return back()->with('message', 'Google Gemini API Key berhasil disimpan ke database!');
        }

        if ($service === 'google_drive') {
            $validated = $request->validate([
                'client_id'     => 'required|string|max:500',
                'client_secret' => 'required|string|max:500',
                'refresh_token' => 'required|string|max:1000',
                'folder_id'     => 'nullable|string|max:255',
                'expires_mode'  => 'nullable|string|in:testing,permanent',
            ]);

            $existing = IntegrationSetting::getCredentials('google_drive');
            $newRefreshToken = trim($validated['refresh_token']);
            $isNewToken = !isset($existing['refresh_token']) || $existing['refresh_token'] !== $newRefreshToken;
            $tokenSavedAt = $isNewToken ? now()->toIso8601String() : ($existing['token_saved_at'] ?? '2026-09-16T23:25:04+07:00');

            IntegrationSetting::setCredentials('google_drive', [
                'client_id'     => trim($validated['client_id']),
                'client_secret' => trim($validated['client_secret']),
                'refresh_token' => $newRefreshToken,
                'folder_id'     => !empty($validated['folder_id']) ? trim($validated['folder_id']) : null,
                'expires_mode'  => $validated['expires_mode'] ?? ($existing['expires_mode'] ?? 'testing'),
                'token_saved_at'=> $tokenSavedAt,
            ], true);

            return back()->with('message', 'Kredensial Google Drive berhasil disimpan ke database!');
        }

        if ($service === 'google_calendar') {
            $validated = $request->validate([
                'ical_url' => 'required|string|url|max:1000',
            ]);

            IntegrationSetting::setCredentials('google_calendar', [
                'ical_url' => trim($validated['ical_url']),
            ], true);

            // Clear events cache so new URL is fetched immediately
            Cache::forget('google_calendar_ical_events');

            return back()->with('message', 'Google Calendar iCal URL berhasil disimpan ke database!');
        }

        return back()->withErrors(['service' => 'Layanan integrasi tidak valid.']);
    }

    /**
     * Disconnect an integration and remove its stored credentials from SQLite.
     */
    public function disconnectIntegration(Request $request, string $service): RedirectResponse
    {
        $setting = IntegrationSetting::where('service', $service)->first();
        if ($setting) {
            $setting->delete();
        }

        if ($service === 'google_calendar') {
            Cache::forget('google_calendar_ical_events');
        }

        return back()->with('message', "Integrasi berhasil diputus.");
    }

    /**
     * Test Google Drive connection without saving credentials.
     */
    public function testDriveConnection(Request $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'client_id'     => 'required|string|max:500',
            'client_secret' => 'required|string|max:500',
            'refresh_token' => 'required|string|max:1000',
        ]);

        try {
            $response = \Illuminate\Support\Facades\Http::timeout(10)->post('https://oauth2.googleapis.com/token', [
                'client_id'     => trim($validated['client_id']),
                'client_secret' => trim($validated['client_secret']),
                'refresh_token' => trim($validated['refresh_token']),
                'grant_type'    => 'refresh_token',
            ]);

            $data = $response->json();

            if ($response->successful() && !empty($data['access_token'])) {
                return response()->json([
                    'success' => true,
                    'message' => 'Koneksi berhasil! Token valid dan aktif.',
                ]);
            }

            $errorDesc = $data['error_description'] ?? $data['error'] ?? 'Token tidak valid atau sudah kedaluwarsa.';
            return response()->json([
                'success' => false,
                'message' => 'Gagal: ' . $errorDesc,
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal terhubung ke server Google. Cek koneksi internet.',
            ], 500);
        }
    }

    /**
     * Dedicated Google Drive settings page.
     */
    public function googleDrive(): Response
    {
        return Inertia::render('Settings/GoogleDrive', [
            'drive' => $this->getGoogleDriveData(),
            'flash' => [
                'message' => session('message'),
            ],
        ]);
    }

    /**
     * Helper to retrieve Google Drive credentials and expiration status.
     */
    private function getGoogleDriveData(): array
    {
        $driveCreds = IntegrationSetting::getCredentials('google_drive');
        $driveClientId = $driveCreds['client_id'] ?? config('services.google_drive.client_id');
        $driveClientSecret = $driveCreds['client_secret'] ?? config('services.google_drive.client_secret');
        $driveRefreshToken = $driveCreds['refresh_token'] ?? config('services.google_drive.refresh_token');
        $driveFolderId = $driveCreds['folder_id'] ?? config('services.google_drive.folder_id');
        $isGoogleDriveConnected = !empty($driveClientId)
            && !empty($driveClientSecret)
            && !empty($driveRefreshToken);

        // Calculate Google Drive refresh token expiration (for testing mode: 7 days)
        $driveExpiresMode = $driveCreds['expires_mode'] ?? 'testing'; // 'testing' or 'permanent'
        $driveTokenSavedAt = $driveCreds['token_saved_at'] ?? '2026-09-16 23:25:04';
        $driveDaysRemaining = null;
        $driveHoursRemaining = null;
        $driveIsExpired = false;
        $driveExpiryDateFormatted = null;
        $driveHumanRemaining = null;

        if ($isGoogleDriveConnected && $driveExpiresMode === 'testing') {
            $savedDate = $driveTokenSavedAt ? \Carbon\Carbon::parse($driveTokenSavedAt) : \Carbon\Carbon::parse('2026-09-16 23:25:04');
            $expiresAt = $savedDate->copy()->addDays(7);
            $now = now();

            if ($now->greaterThanOrEqualTo($expiresAt)) {
                $driveDaysRemaining = 0;
                $driveHoursRemaining = 0;
                $driveIsExpired = true;
                $driveHumanRemaining = 'Sudah Kedaluwarsa';
            } else {
                $totalHours = (int) $now->diffInHours($expiresAt, false);
                $days = (int) floor($totalHours / 24);
                $hours = $totalHours % 24;

                $driveDaysRemaining = $days;
                $driveHoursRemaining = $totalHours;

                if ($days > 0) {
                    $driveHumanRemaining = "Sisa {$days} Hari {$hours} Jam";
                } else {
                    $driveHumanRemaining = "Sisa {$hours} Jam";
                }
            }
            $driveExpiryDateFormatted = $expiresAt->format('d M Y, H:i');
        }

        return [
            'connected' => $isGoogleDriveConnected,
            'account' => 'ronismk7@gmail.com',
            'accountType' => 'Personal Account (Google Drive)',
            'folderConfigured' => !empty($driveFolderId),
            'folderId' => $driveFolderId ?? '',
            'url' => 'https://drive.google.com',
            'lastSynced' => now()->format('d M Y, H:i'),
            'tokenExpiry' => [
                'mode' => $driveExpiresMode,
                'daysRemaining' => $driveDaysRemaining,
                'hoursRemaining' => $driveHoursRemaining,
                'humanRemaining' => $driveHumanRemaining ?? ($driveExpiresMode === 'permanent' ? 'Permanen' : null),
                'isExpired' => $driveIsExpired,
                'expiryDate' => $driveExpiryDateFormatted,
                'savedAt' => $driveTokenSavedAt ? \Carbon\Carbon::parse($driveTokenSavedAt)->format('d M Y, H:i') : '16 Sep 2026, 23:25',
            ],
            'credentials' => [
                'client_id' => $driveClientId ?? '',
                'client_secret' => $driveClientSecret ?? '',
                'refresh_token' => $driveRefreshToken ?? '',
                'folder_id' => $driveFolderId ?? '',
                'expires_mode' => $driveExpiresMode,
                'token_saved_at' => $driveTokenSavedAt ? \Carbon\Carbon::parse($driveTokenSavedAt)->format('Y-m-d\TH:i') : '2026-09-16T23:25',
            ],
        ];
    }
}
