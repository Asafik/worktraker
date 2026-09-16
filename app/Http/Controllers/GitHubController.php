<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Http;

class GitHubController extends Controller
{
    protected string $clientId;
    protected string $clientSecret;
    protected string $redirectUri;

    public function __construct()
    {
        $this->clientId     = config('services.github.client_id', '');
        $this->clientSecret = config('services.github.client_secret', '');
        $this->redirectUri  = config('services.github.redirect', url('/auth/github/callback'));
    }

    /**
     * Redirect the user to GitHub for authorization.
     */
    public function redirect(): RedirectResponse
    {
        $state = bin2hex(random_bytes(16));
        session(['github_oauth_state' => $state]);

        $params = http_build_query([
            'client_id'    => $this->clientId,
            'redirect_uri' => $this->redirectUri,
            'scope'        => 'user read:user user:email',
            'state'        => $state,
        ]);

        return redirect('https://github.com/login/oauth/authorize?' . $params);
    }

    /**
     * Handle the callback from GitHub.
     */
    public function callback(Request $request): RedirectResponse
    {
        // Check for errors or cancellation
        if ($request->has('error')) {
            return redirect('/settings?tab=Integrations')
                ->with('message', 'GitHub connection was cancelled.');
        }

        // Validate state to prevent CSRF
        if ($request->state !== session('github_oauth_state')) {
            return redirect('/settings?tab=Integrations')
                ->with('message', 'Invalid state. Please try again.');
        }

        try {
            // Exchange code for access token
            $tokenResponse = Http::asForm()->post('https://github.com/login/oauth/access_token', [
                'client_id'     => $this->clientId,
                'client_secret' => $this->clientSecret,
                'code'          => $request->code,
                'redirect_uri'  => $this->redirectUri,
            ])->throw()->body();

            parse_str($tokenResponse, $tokenData);
            $accessToken = $tokenData['access_token'] ?? null;

            if (!$accessToken) {
                return redirect('/settings?tab=Integrations')
                    ->with('message', 'Gagal mendapatkan token dari GitHub. Coba lagi.');
            }

            // Fetch user profile from GitHub API
            $githubUser = Http::withToken($accessToken)
                ->withHeaders(['Accept' => 'application/vnd.github+json'])
                ->get('https://api.github.com/user')
                ->throw()
                ->json();

            $user = User::first();

            if ($user) {
                $user->update([
                    'github_id'       => (string) ($githubUser['id'] ?? ''),
                    'github_username' => $githubUser['login'] ?? '',
                    'github_avatar'   => $githubUser['avatar_url'] ?? '',
                    'github_token'    => $accessToken,
                ]);
            }

            $username = $githubUser['login'] ?? 'unknown';

            return redirect('/settings?tab=Integrations')
                ->with('message', "GitHub berhasil terhubung! Akun @{$username} terkoneksi. ✅");

        } catch (\Exception $e) {
            \Log::error('GitHub OAuth error: ' . $e->getMessage());

            return redirect('/settings?tab=Integrations')
                ->with('message', 'Gagal menghubungkan GitHub: ' . $e->getMessage());
        }
    }

    /**
     * Disconnect GitHub from the user account.
     */
    public function disconnect(): RedirectResponse
    {
        $user = User::first();

        if ($user) {
            $user->update([
                'github_id'       => null,
                'github_username' => null,
                'github_avatar'   => null,
                'github_token'    => null,
            ]);
        }

        return redirect('/settings?tab=Integrations')
            ->with('message', 'GitHub berhasil diputus dari WorkTrack.');
    }
}
