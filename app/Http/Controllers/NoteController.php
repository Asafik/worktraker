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
        $model = config('services.gemini.model', 'gemini-2.5-flash');

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
2. Perbaiki semua salah ketik (typo) dan tata bahasa agar rapi, jelas, dan profesional.
3. Jabarkan singkatan yang lazim (contoh: 'bkin' -> 'Membuat', 'ftur' -> 'fitur', 'pke' -> 'menggunakan', 'jwt' -> 'JWT', 'bg' -> 'bug', 'tmbah' -> 'menambahkan', 'tgl' -> 'tanggal', 'kmrn' -> 'kemarin', 'sblm' -> 'sebelum', 'lgin' -> 'login', 'db' -> 'database', dll).
4. Susun hasilnya menjadi daftar poin-poin bernomor dengan format persis seperti ini:
   - Setiap nomor harus memiliki **Judul Modul / Fitur / Fase** yang dicetak TEBAL (bold).
   - Di bawah judul tebal, sertakan penjelasan singkat atau poin rincian (*) perubahannya.
   - Contoh format:
     1. **Pra-Landbank Fase 1**
        Tambahkan proses verifikasi/validasi oleh Kepala Legal dan Owner.

     2. **Perubahan Form Fase 1**
        * Hapus field Jenis Konstruksi Jalan.
        * Ubah Luas Lahan menjadi Luas Lahan di Sertifikat.
        * Tambahkan field Luas Lahan di Lapangan.
5. Jika judul saat ini masih kosong atau kurang deskriptif, buatkan usulan judul singkat yang profesional (maksimal 6 kata).
6. PENTING: Jangan tambahkan kata pembuka atau penutup (seperti 'Tentu, ini hasilnya', 'Semoga bermanfaat', dll). Langsung keluarkan teks catatan yang sudah bersih dan rapi.

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
            'use_ai'     => ['nullable', 'boolean'],
            'items'      => ['required', 'array', 'min:1'],
            'items.*.title'       => ['required', 'string', 'max:255'],
            'items.*.description' => ['nullable', 'string'],
        ]);

        $userId = Auth::id() ?? User::first()?->id;
        $projectId = $validated['project_id'] ?? null;
        $useAi = (bool) ($validated['use_ai'] ?? false);
        $items = $validated['items'];

        $apiKey = config('services.gemini.key');
        $model = config('services.gemini.model', 'gemini-2.5-flash');

        // Optional AI standard description cleanup if user checked the option
        if ($useAi && !empty($apiKey)) {
            $promptItems = [];
            foreach ($items as $idx => $item) {
                $desc = !empty($item['description']) ? $item['description'] : 'Implementasi perubahan';
                $promptItems[] = "Item {$idx}: Judul: {$item['title']} | Rincian: {$desc}";
            }
            $allText = implode("\n", $promptItems);

            $aiPrompt = "Kamu bertugas membuat deskripsi task yang standar, ringkas, dan to-the-point untuk developer software (maksimal 2-3 kalimat atau 2-3 poin ringkas per item, jangan panjang-panjang, jangan bertele-tele).
Item tugas:
{$allText}

Keluarkan format JSON array saja tanpa teks lain:
[
  {\"index\": 0, \"clean_description\": \"Deskripsi standar ringkas\"}
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

        $createdCount = 0;
        foreach ($items as $item) {
            Task::create([
                'user_id'     => $userId,
                'project_id'  => $projectId,
                'title'       => $item['title'],
                'description' => $item['description'] ?? null,
                'type'        => 'revision',
                'priority'    => 'Medium',
                'status'      => 'todo',
            ]);
            $createdCount++;
        }

        return back()->with('message', "{$createdCount} tugas revisi berhasil dikirim ke Tasks!");
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
