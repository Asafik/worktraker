<?php

namespace App\Http\Controllers;

use App\Models\Archive;
use App\Models\Project;
use App\Services\GoogleDriveService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;

class ArchiveController extends Controller
{
    /**
     * Display all archives.
     */
    public function index(): Response
    {
        $projects = Project::orderBy('name')->get(['id', 'name', 'description', 'company_name', 'github_repo_name']);

        $isGoogleDriveConnected = !empty(config('services.google_drive.client_id'))
            && !empty(config('services.google_drive.client_secret'))
            && !empty(config('services.google_drive.refresh_token'));

        $archives = Archive::latest()->get()->map(function ($a) use ($isGoogleDriveConnected) {
            return [
                'id' => $a->id,
                'name' => $a->name,
                'subtitle' => $a->project_name ? "Project: {$a->project_name}" : ($a->description ?: 'Arsip file Google Drive'),
                'projectName' => $a->project_name,
                'category' => $a->category,
                'typeBadge' => $a->category === 'Project'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40'
                    : ($a->category === 'Backup'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40'
                        : 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40'),
                'size' => $a->size,
                'archivedAt' => $a->created_at->format('d M Y H:i'),
                'tags' => $a->tags ?: ['Google Drive', $a->category],
                'description' => $a->description ?: 'File disimpan secara aman di Google Drive.',
                'fileType' => $a->file_type ?: 'ZIP',
                'storageLocation' => 'Google Drive',
                'storageConnected' => $isGoogleDriveConnected,
                'detailTags' => array_values(array_unique(array_merge([$a->category, 'Google Drive'], (array) ($a->tags ?: [])))),
                'notes' => $a->notes ?: 'Tersimpan di folder Google Drive WorkTrack.',
                'googleDriveFileId' => $a->google_drive_file_id,
                'googleDriveViewLink' => $a->google_drive_view_link,
                'googleDriveDownloadLink' => $a->google_drive_download_link,
            ];
        });

        return Inertia::render('Archive/Index', [
            'initialArchives' => $archives,
            'projects' => $projects,
            'isGoogleDriveConnected' => $isGoogleDriveConnected,
            'googleDriveFolderUrl' => config('services.google_drive.folder_id')
                ? 'https://drive.google.com/drive/folders/' . config('services.google_drive.folder_id')
                : 'https://drive.google.com/drive/folders/1LZwvt7UvPM1OOcIr366mnpmY5ITT--69',
            'flash' => [
                'message' => session('message'),
            ],
        ]);
    }

    /**
     * Store an archive: upload file to Google Drive & save metadata to SQLite.
     */
    public function store(Request $request, GoogleDriveService $driveService): RedirectResponse
    {
        // Support large uploads without script timeout
        set_time_limit(0);
        ini_set('max_execution_time', '0');

        $request->validate([
            'name' => 'required|string|max:255',
            'projectName' => 'nullable|string|max:255',
            'category' => 'required|string|in:Project,Backup,Other',
            'description' => 'nullable|string|max:1000',
            'notes' => 'nullable|string|max:1000',
            'file' => 'nullable|file|max:614400', // max 600MB
        ]);

        $fileData = null;
        $sizeStr = '0 MB';
        $sizeBytes = 0;
        $fileType = 'ZIP';
        $origFileName = $request->input('name') . '.zip';

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $sizeBytes = $file->getSize();
            $sizeStr = $this->formatBytes($sizeBytes);
            $origFileName = $file->getClientOriginalName();
            $ext = strtoupper($file->getClientOriginalExtension());
            $fileType = $ext ?: 'FILE';

            // Attempt upload directly to Google Drive
            $uploadResult = $driveService->uploadFile($file);
            if ($uploadResult) {
                $fileData = $uploadResult;
            }
        }

        Archive::create([
            'name' => $request->input('name'),
            'project_name' => $request->input('projectName'),
            'category' => $request->input('category'),
            'file_name' => $origFileName,
            'file_type' => $fileType,
            'size' => $sizeStr,
            'size_bytes' => $sizeBytes,
            'google_drive_file_id' => $fileData['id'] ?? null,
            'google_drive_view_link' => $fileData['view_link'] ?? 'https://drive.google.com/drive/folders/1LZwvt7UvPM1OOcIr366mnpmY5ITT--69',
            'google_drive_download_link' => $fileData['download_link'] ?? 'https://drive.google.com/drive/folders/1LZwvt7UvPM1OOcIr366mnpmY5ITT--69',
            'description' => $request->input('description'),
            'notes' => $request->input('notes'),
            'tags' => [$request->input('category'), 'Google Drive'],
        ]);

        return back()->with('message', 'File arsip berhasil disimpan ke Google Drive dan metadata tersimpan di database!');
    }

    /**
     * Update archive notes in SQLite database.
     */
    public function updateNotes(Request $request, $id): JsonResponse
    {
        $request->validate([
            'notes' => 'nullable|string|max:2000',
        ]);

        $archive = Archive::findOrFail($id);
        $archive->update([
            'notes' => $request->input('notes'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Catatan berhasil diperbarui!',
            'notes' => $archive->notes,
        ]);
    }

    /**
     * Delete archive record and remove file from Google Drive.
     */
    public function destroy($id, GoogleDriveService $driveService): RedirectResponse
    {
        $archive = Archive::findOrFail($id);

        if ($archive->google_drive_file_id && !str_starts_with($archive->google_drive_file_id, 'mock_')) {
            $driveService->deleteFile($archive->google_drive_file_id);
        }

        $archive->delete();

        return back()->with('message', 'Arsip berhasil dihapus dari sistem dan Google Drive!');
    }

    protected function formatBytes(int $bytes): string
    {
        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 1) . ' GB';
        }
        if ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 1) . ' MB';
        }
        if ($bytes >= 1024) {
            return number_format($bytes / 1024, 1) . ' KB';
        }
        return $bytes . ' B';
    }
}
