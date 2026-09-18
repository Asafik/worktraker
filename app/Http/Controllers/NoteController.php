<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class NoteController extends Controller
{
    /**
     * Display a listing of notes.
     */
    public function index(Request $request): Response
    {
        $userId = Auth::id() ?? User::first()?->id;

        $query = Note::with([
            'project:id,name,slug,github_repo_name,github_repo_url,category,status,company_name',
            'tasks:id,note_id,title,status',
        ])
        ->where(function ($q) use ($userId) {
            $q->where('user_id', $userId)->orWhereNull('user_id');
        });

        // Search query
        if ($request->filled('search')) {
            $search = strtolower($request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(title) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(content) LIKE ?', ["%{$search}%"])
                  ->orWhereHas('project', function ($pq) use ($search) {
                      $pq->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"]);
                  });
            });
        }

        // Filter by Category
        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Filter by Project
        if ($request->filled('project_id') && $request->project_id !== 'all') {
            $query->where('project_id', $request->project_id);
        }

        $notes = $query->latest('updated_at')->get();

        // Auto-reconcile [Masuk Tasks] tags in note content if tasks have been deleted from Tasks page
        $activeTaskTitles = Task::where(function ($q) use ($userId) {
            $q->where('user_id', $userId)->orWhereNull('user_id');
        })->pluck('title')->map(fn ($t) => strtolower(trim(preg_replace('/\[Masuk Tasks\]|\(Masuk Tasks\)/i', '', $t))))->toArray();

        foreach ($notes as $note) {
            if (!empty($note->content) && (stripos($note->content, '[Masuk Tasks]') !== false || stripos($note->content, '(Masuk Tasks)') !== false)) {
                $content = $note->content;
                $pattern = '/(?:\*\*([^*]+)\*\*|([^\n\r*]+?))\s*(?:\[Masuk Tasks\]|\(Masuk Tasks\))/i';
                $reconciled = preg_replace_callback($pattern, function ($matches) use ($activeTaskTitles, $note) {
                    $rawTitle = trim(!empty($matches[1]) ? $matches[1] : $matches[2]);
                    $cleanTitle = strtolower(trim(preg_replace('/^\d+\.\s*/', '', $rawTitle)));

                    $taskExists = in_array($cleanTitle, $activeTaskTitles) ||
                        $note->tasks->contains(function ($t) use ($cleanTitle) {
                            $tClean = strtolower(trim(preg_replace('/\[Masuk Tasks\]|\(Masuk Tasks\)/i', '', $t->title)));
                            return $tClean === $cleanTitle;
                        });

                    if ($taskExists) {
                        return $matches[0];
                    } else {
                        // Task was deleted from Tasks page, so remove the tag
                        return !empty($matches[1]) ? "**{$matches[1]}**" : $matches[2];
                    }
                }, $content);

                if ($reconciled !== $content) {
                    $note->update(['content' => $reconciled]);
                    $note->content = $reconciled;
                }
            }
        }

        // Projects for selector dropdown
        $projects = Project::where(function ($q) use ($userId) {
            $q->where('user_id', $userId)->orWhereNull('user_id');
        })
        ->select('id', 'name', 'slug', 'github_repo_name')
        ->orderBy('name')
        ->get();

        // Stats summary
        $allNotesQuery = Note::where(function ($q) use ($userId) {
            $q->where('user_id', $userId)->orWhereNull('user_id');
        });

        $stats = [
            'total'     => (clone $allNotesQuery)->count(),
            'revisions' => (clone $allNotesQuery)->where('category', 'Revision')->count(),
            'ideas'     => (clone $allNotesQuery)->where('category', 'Idea')->count(),
            'meetings'  => (clone $allNotesQuery)->where('category', 'Meeting')->count(),
        ];

        return Inertia::render('Notes/Index', [
            'notes'    => $notes,
            'projects' => $projects,
            'stats'    => $stats,
            'filters'  => [
                'search'     => $request->input('search', ''),
                'category'   => $request->input('category', 'all'),
                'project_id' => $request->input('project_id', 'all'),
            ],
            'flash'    => [
                'message' => session('message'),
            ],
        ]);
    }

    /**
     * Store a newly created note.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title'      => ['required', 'string', 'max:255'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'category'   => ['required', 'string', 'in:Revision,Idea,Meeting,Technical,General'],
            'content'    => ['nullable', 'string'],
        ]);

        $userId = Auth::id() ?? User::first()?->id;

        Note::create([
            'user_id'    => $userId,
            'project_id' => $validated['project_id'] ?: null,
            'title'      => $validated['title'],
            'category'   => $validated['category'],
            'content'    => $validated['content'] ?? '',
        ]);

        return back()->with('message', 'Catatan berhasil dibuat!');
    }

    /**
     * Update an existing note.
     */
    public function update(Request $request, Note $note): RedirectResponse
    {
        $validated = $request->validate([
            'title'      => ['required', 'string', 'max:255'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'category'   => ['required', 'string', 'in:Revision,Idea,Meeting,Technical,General'],
            'content'    => ['nullable', 'string'],
        ]);

        $note->update([
            'project_id' => $validated['project_id'] ?: null,
            'title'      => $validated['title'],
            'category'   => $validated['category'],
            'content'    => $validated['content'] ?? '',
        ]);

        return back()->with('message', 'Catatan berhasil diperbarui!');
    }

    /**
     * Refine and analyze note content using Google Gemini AI.
     */
    public function aiRefine(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:10000'],
            'title'   => ['nullable', 'string', 'max:255'],
        ]);

        $apiKey = config('services.gemini.key');
        $model = config('services.gemini.model', 'gemini-3.7-flash');

        if (empty($apiKey)) {
            return response()->json([
                'success' => false,
                'message' => 'GEMINI_API_KEY belum dikonfigurasi di file .env',
            ], 422);
        }

        $rawTitle = $validated['title'] ?? '';
        $rawContent = $validated['content'];

        $prompt = "Kamu adalah asisten developer profesional yang bertugas merapikan catatan revisi proyek dan pekerjaan teknis software. Catatan ini ditulis cepat oleh programmer atau klien, sehingga seringkali terdapat banyak typo, kata-kata disingkat (bahasa Indonesia sehari-hari atau istilah teknis coding), atau format yang berantakan.

Tugas kamu:
1. Pahami inti maksud dari setiap poin revisi/pekerjaan.
2. WAJIB MENGGUNAKAN BAHASA INDONESIA yang baku, profesional, dan to-the-point! DILARANG KERAS menggunakan bahasa Inggris (kecuali istilah teknis lazim seperti JWT, API, bug, database).
3. Perbaiki semua salah ketik (typo) dan tata bahasa agar rapi, jelas, dan profesional.
4. Jabarkan singkatan yang lazim (contoh: 'bkin' -> 'Membuat', 'ftur' -> 'fitur', 'pke' -> 'menggunakan', 'jwt' -> 'JWT', 'bg' -> 'bug', 'tmbah' -> 'menambahkan', 'tgl' -> 'tanggal', 'kmrn' -> 'kemarin', 'sblm' -> 'sebelum', 'lgin' -> 'login', 'db' -> 'database', dll).
5. Susun hasilnya menjadi daftar poin-poin bernomor dengan format persis seperti ini:
   - Setiap nomor harus memiliki **Judul Modul / Fitur / Fase** yang dicetak TEBAL (bold).
   - Di bawah judul tebal, sertakan penjelasan singkat atau poin rincian (*) perubahannya dalam Bahasa Indonesia.
   - Contoh format:
     1. **Pra-Landbank Fase 1**
        Tambahkan proses verifikasi/validasi oleh Kepala Legal dan Owner.

     2. **Perubahan Form Fase 1**
        * Hapus field Jenis Konstruksi Jalan.
        * Ubah Luas Lahan menjadi Luas Lahan di Sertifikat.
        * Tambahkan field Luas Lahan di Lapangan.
6. Jika judul saat ini masih kosong atau kurang deskriptif, buatkan usulan judul singkat yang profesional dalam Bahasa Indonesia (maksimal 6 kata).
7. PENTING: Jangan tambahkan kata pembuka atau penutup (seperti 'Tentu, ini hasilnya', 'Semoga bermanfaat', dll). Langsung keluarkan teks catatan yang sudah bersih dan rapi.

Format response WAJIB berupa JSON dengan struktur persis seperti ini:
{
  \"title\": \"Judul singkat profesional\",
  \"refined_content\": \"1. **Nama Modul**\\n   Rincian penjelasan...\"
}";

        try {
            $response = Http::timeout(30)->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt . "\n\nJudul saat ini: {$rawTitle}\nCatatan mentah developer:\n{$rawContent}"]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'responseMimeType' => 'application/json',
                ],
            ]);

            if ($response->failed()) {
                $errorData = $response->json();
                $errorMessage = $errorData['error']['message'] ?? 'Gagal menghubungi Google Gemini API.';
                return response()->json([
                    'success' => false,
                    'message' => $errorMessage,
                ], 500);
            }

            $responseData = $response->json();
            $generatedText = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? '';

            // Clean up possible markdown json wraps if any
            $cleaned = trim($generatedText);
            if (str_starts_with($cleaned, '```json')) {
                $cleaned = substr($cleaned, 7);
            } elseif (str_starts_with($cleaned, '```')) {
                $cleaned = substr($cleaned, 3);
            }
            if (str_ends_with($cleaned, '```')) {
                $cleaned = substr($cleaned, 0, -3);
            }
            $cleaned = trim($cleaned);

            // Track usage count and tokens for settings integration monitoring
            $todayKey = 'gemini_requests_' . date('Y-m-d');
            Cache::add($todayKey, 0, now()->endOfDay());
            Cache::increment($todayKey);
            Cache::forever('gemini_last_request_at', now()->toDateTimeString());

            if (isset($responseData['usageMetadata']['totalTokenCount'])) {
                $tokensKey = 'gemini_tokens_' . date('Y-m-d');
                Cache::add($tokensKey, 0, now()->endOfDay());
                Cache::increment($tokensKey, (int) $responseData['usageMetadata']['totalTokenCount']);
            }

            $parsed = json_decode($cleaned, true);

            if (json_last_error() === JSON_ERROR_NONE && isset($parsed['refined_content'])) {
                return response()->json([
                    'success'         => true,
                    'title'           => !empty($parsed['title']) ? $parsed['title'] : $rawTitle,
                    'refined_content' => $parsed['refined_content'],
                ]);
            }

            // Fallback: return raw generated text
            return response()->json([
                'success'         => true,
                'title'           => $rawTitle,
                'refined_content' => $generatedText ?: $rawContent,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kendala saat memproses dengan Gemini AI: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Send selected items from a note directly into the Tasks database.
     */
    public function sendToTasks(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'project_id' => ['nullable', 'exists:projects,id'],
            'note_id'    => ['nullable', 'exists:notes,id'],
            'task_type'  => ['nullable', 'string', 'in:revision,feature,bugfix,general'],
            'priority'   => ['nullable', 'string', 'in:Low,Medium,High,Urgent'],
            'use_ai'     => ['nullable', 'boolean'],
            'items'      => ['required', 'array', 'min:1'],
            'items.*.title'       => ['required', 'string', 'max:255'],
            'items.*.description' => ['nullable', 'string'],
        ]);

        $userId = Auth::id() ?? User::first()?->id;
        $projectId = $validated['project_id'] ?? null;
        $taskType = $validated['task_type'] ?? 'revision';
        $priority = $validated['priority'] ?? 'Medium';
        $useAi = (bool) ($validated['use_ai'] ?? false);
        $items = $validated['items'];

        $apiKey = config('services.gemini.key');
        $model = config('services.gemini.model', 'gemini-3.7-flash');

        // Optional AI standard description cleanup in INDONESIAN if user checked the option
        if ($useAi && !empty($apiKey)) {
            $promptItems = [];
            foreach ($items as $idx => $item) {
                $desc = !empty($item['description']) ? $item['description'] : 'Implementasi perubahan sesuai rincian.';
                $promptItems[] = "Item {$idx}: Judul: {$item['title']} | Rincian: {$desc}";
            }
            $allText = implode("\n", $promptItems);

            $aiPrompt = "Kamu bertugas membuat deskripsi task yang standar, ringkas, dan to-the-point untuk developer software.
ATURAN KETAT:
1. WAJIB GUNAKAN BAHASA INDONESIA yang baku, profesional, dan to-the-point! DILARANG KERAS menggunakan bahasa Inggris (kecuali istilah teknis lazim seperti JWT, API, bug, database).
2. Panjang maksimal: 2-3 kalimat ringkas atau 2-3 poin to-the-point per item. Jangan panjang-panjang, jangan bertele-tele.

Item tugas yang perlu dirapikan:
{$allText}

Keluarkan format JSON array saja tanpa teks lain:
[
  {\"index\": 0, \"clean_description\": \"Deskripsi standar ringkas dalam bahasa Indonesia\"}
]";

            try {
                $response = Http::timeout(25)->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}", [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $aiPrompt]
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'responseMimeType' => 'application/json',
                    ],
                ]);

                if ($response->successful()) {
                    $responseData = $response->json();
                    $text = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? '';
                    $cleaned = trim($text);
                    if (str_starts_with($cleaned, '```json')) $cleaned = substr($cleaned, 7);
                    if (str_starts_with($cleaned, '```')) $cleaned = substr($cleaned, 3);
                    if (str_ends_with($cleaned, '```')) $cleaned = substr($cleaned, 0, -3);
                    $parsed = json_decode(trim($cleaned), true);

                    if (is_array($parsed)) {
                        foreach ($parsed as $resItem) {
                            $idx = $resItem['index'] ?? null;
                            if (isset($items[$idx]) && !empty($resItem['clean_description'])) {
                                $items[$idx]['description'] = $resItem['clean_description'];
                            }
                        }
                    }

                    // Track usage in Cache
                    $todayKey = 'gemini_requests_' . date('Y-m-d');
                    Cache::add($todayKey, 0, now()->endOfDay());
                    Cache::increment($todayKey);
                    Cache::forever('gemini_last_request_at', now()->toDateTimeString());
                }
            } catch (\Exception $e) {
                // If AI fails, gracefully fallback to raw description without breaking
            }
        }

        $note = !empty($validated['note_id'])
            ? Note::where('id', $validated['note_id'])
                ->where(function ($q) use ($userId) {
                    $q->where('user_id', $userId)->orWhereNull('user_id');
                })
                ->first()
            : null;

        $createdCount = 0;
        foreach ($items as $item) {
            Task::create([
                'user_id'     => $userId,
                'project_id'  => $projectId,
                'note_id'     => $note?->id,
                'title'       => $item['title'],
                'description' => $item['description'] ?? null,
                'type'        => $taskType,
                'priority'    => $priority,
                'status'      => 'todo',
            ]);
            $createdCount++;
        }

        // Mark items inside the note content so user knows which points are already in Tasks
        if ($note && !empty($note->content)) {
            $updatedContent = $note->content;
                foreach ($items as $item) {
                    $rawTitle = trim(preg_replace('/\[Masuk Tasks\]|\(Masuk Tasks\)/i', '', $item['title']));
                    if (empty($rawTitle)) continue;

                    $quoted = preg_quote($rawTitle, '/');
                    // Check if already tagged
                    if (!preg_match("/\*\*" . $quoted . "\*\*\s*\[Masuk Tasks\]/i", $updatedContent) &&
                        !preg_match("/" . $quoted . "\s*\[Masuk Tasks\]/i", $updatedContent)) {
                        if (preg_match("/\*\*" . $quoted . "\*\*/i", $updatedContent)) {
                            $updatedContent = preg_replace("/\*\*" . $quoted . "\*\*/i", "**{$rawTitle}** [Masuk Tasks]", $updatedContent, 1);
                        } else {
                            $updatedContent = preg_replace("/" . $quoted . "/i", "{$rawTitle} [Masuk Tasks]", $updatedContent, 1);
                        }
                    }
                }
                $note->update(['content' => $updatedContent]);
            }

        return back()->with('message', "{$createdCount} tugas berhasil dikirim ke Tasks!");
    }

    /**
     * Delete a note.
     */
    public function destroy(Note $note): RedirectResponse
    {
        $note->delete();

        return back()->with('message', 'Catatan berhasil dihapus.');
    }
}
