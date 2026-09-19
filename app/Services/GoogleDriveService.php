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
     * Supports both multipart (< 5MB) and Resumable Upload (> 5MB) using streaming.
     */
    public function uploadFile(\Illuminate\Http\UploadedFile $file, ?string $customFileName = null): ?array
    {
        $accessToken = $this->getAccessToken();
        if (!$accessToken) {
            return null;
        }

        $fileName = $customFileName ?: $file->getClientOriginalName();
        $mimeType = $file->getMimeType() ?: 'application/octet-stream';
        $filePath = $file->getRealPath();
        $fileSize = $file->getSize();

        try {
            // For files larger than 5MB, use Google Drive Resumable Upload (streams chunks/file without loading into RAM)
            if ($fileSize > 5 * 1024 * 1024) {
                return $this->resumableUpload($accessToken, $filePath, $fileName, $mimeType, $fileSize);
            }

            // Multipart upload for small files (<= 5MB) using stream handle
            $metadata = [
                'name' => $fileName,
                'parents' => [$this->folderId],
            ];

            $fileHandle = fopen($filePath, 'r');
            if (!$fileHandle) {
                return null;
            }

            $response = Http::withToken($accessToken)
                ->timeout(180)
                ->attach('metadata', json_encode($metadata), 'metadata.json', ['Content-Type' => 'application/json; charset=UTF-8'])
                ->attach('file', $fileHandle, $fileName, ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink,size');

            if (is_resource($fileHandle)) {
                fclose($fileHandle);
            }

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'id' => $data['id'] ?? null,
                    'name' => $data['name'] ?? $fileName,
                    'view_link' => $data['webViewLink'] ?? "https://drive.google.com/file/d/{$data['id']}/view",
                    'download_link' => $data['webContentLink'] ?? "https://drive.google.com/uc?id={$data['id']}&export=download",
                    'size' => $data['size'] ?? $fileSize,
                ];
            }

            Log::error('Google Drive Multipart Upload Error: ' . $response->body());
        } catch (\Throwable $e) {
            Log::error('Google Drive Upload Exception: ' . $e->getMessage());
        }

        return null;
    }

    /**
     * Resumable Upload for large files (50MB - 1GB+) using streams directly to Google Drive.
     */
    protected function resumableUpload(string $accessToken, string $filePath, string $fileName, string $mimeType, int $fileSize): ?array
    {
        try {
            // Step 1: Initiate session
            $metadata = [
                'name' => $fileName,
                'parents' => [$this->folderId],
            ];

            $initResponse = Http::withToken($accessToken)
                ->withHeaders([
                    'X-Upload-Content-Type' => $mimeType,
                    'X-Upload-Content-Length' => (string) $fileSize,
                    'Content-Type' => 'application/json; charset=UTF-8',
                ])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id,name,webViewLink,webContentLink,size', $metadata);

            if (!$initResponse->successful()) {
                Log::error('Google Drive Resumable Init Error: ' . $initResponse->body());
                return null;
            }

            $uploadUrl = $initResponse->header('Location');
            if (!$uploadUrl) {
                Log::error('Google Drive Resumable Init: Missing Location header');
                return null;
            }

            // Step 2: Stream file content to uploadUrl
            $fileHandle = fopen($filePath, 'r');
            if (!$fileHandle) {
                Log::error('Google Drive Resumable: Unable to open file stream: ' . $filePath);
                return null;
            }

            $uploadResponse = Http::withHeaders([
                'Content-Length' => (string) $fileSize,
                'Content-Type' => $mimeType,
            ])
            ->withBody($fileHandle, $mimeType)
            ->timeout(3600) // Up to 1 hour timeout for very large files
            ->put($uploadUrl);

            if (is_resource($fileHandle)) {
                fclose($fileHandle);
            }

            if ($uploadResponse->successful()) {
                $data = $uploadResponse->json();
                return [
                    'id' => $data['id'] ?? null,
                    'name' => $data['name'] ?? $fileName,
                    'view_link' => $data['webViewLink'] ?? "https://drive.google.com/file/d/{$data['id']}/view",
                    'download_link' => $data['webContentLink'] ?? "https://drive.google.com/uc?id={$data['id']}&export=download",
                    'size' => $data['size'] ?? $fileSize,
                ];
            }

            Log::error('Google Drive Resumable Upload Error: ' . $uploadResponse->body());
        } catch (\Throwable $e) {
            Log::error('Google Drive Resumable Exception: ' . $e->getMessage());
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
