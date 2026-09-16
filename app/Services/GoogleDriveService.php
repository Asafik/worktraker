<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GoogleDriveService
{
    protected ?string $clientId;
    protected ?string $clientSecret;
    protected ?string $refreshToken;
    protected ?string $folderId;

    public function __construct()
    {
        $this->clientId = config('services.google_drive.client_id');
        $this->clientSecret = config('services.google_drive.client_secret');
        $this->refreshToken = config('services.google_drive.refresh_token');
        $this->folderId = config('services.google_drive.folder_id') ?: '1LZwvt7UvPM1OOcIr366mnpmY5ITT--69';
    }

    /**
     * Get a fresh Google OAuth2 access token.
     */
    public function getAccessToken(): ?string
    {
        if (empty($this->clientId) || empty($this->clientSecret) || empty($this->refreshToken)) {
            return null;
        }

        try {
            $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
                'client_id' => $this->clientId,
                'client_secret' => $this->clientSecret,
                'refresh_token' => $this->refreshToken,
                'grant_type' => 'refresh_token',
            ]);

            if ($response->successful()) {
                return $response->json('access_token');
            }

            Log::error('Google Drive Token Refresh Error: ' . $response->body());
        } catch (\Throwable $e) {
            Log::error('Google Drive Token Exception: ' . $e->getMessage());
        }

        return null;
    }

    /**
     * Upload a file directly to the configured Google Drive folder.
     */
    public function uploadFile(\Illuminate\Http\UploadedFile $file, ?string $customFileName = null): ?array
    {
        $accessToken = $this->getAccessToken();
        if (!$accessToken) {
            return null;
        }

        $fileName = $customFileName ?: $file->getClientOriginalName();
        $mimeType = $file->getMimeType() ?: 'application/octet-stream';
        $fileContent = file_get_contents($file->getRealPath());

        try {
            // Multipart upload with metadata (name and parent folder)
            $metadata = [
                'name' => $fileName,
                'parents' => [$this->folderId],
            ];

            $response = Http::withToken($accessToken)
                ->attach('metadata', json_encode($metadata), 'metadata.json', ['Content-Type' => 'application/json; charset=UTF-8'])
                ->attach('file', $fileContent, $fileName, ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink,size');

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'id' => $data['id'] ?? null,
                    'name' => $data['name'] ?? $fileName,
                    'view_link' => $data['webViewLink'] ?? "https://drive.google.com/file/d/{$data['id']}/view",
                    'download_link' => $data['webContentLink'] ?? "https://drive.google.com/uc?id={$data['id']}&export=download",
                    'size' => $data['size'] ?? $file->getSize(),
                ];
            }

            Log::error('Google Drive Upload Error: ' . $response->body());
        } catch (\Throwable $e) {
            Log::error('Google Drive Upload Exception: ' . $e->getMessage());
        }

        return null;
    }

    /**
     * Delete file from Google Drive.
     */
    public function deleteFile(string $fileId): bool
    {
        $accessToken = $this->getAccessToken();
        if (!$accessToken) {
            return false;
        }

        try {
            $response = Http::withToken($accessToken)->delete("https://www.googleapis.com/drive/v3/files/{$fileId}");
            return $response->successful();
        } catch (\Throwable $e) {
            Log::error('Google Drive Delete Exception: ' . $e->getMessage());
            return false;
        }
    }
}
