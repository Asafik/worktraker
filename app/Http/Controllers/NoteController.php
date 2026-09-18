<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        $prompt = "Kamu adalah asisten developer profesional yang bertugas merapikan catatan revisi dan pekerjaan teknis. Catatan ini ditulis cepat oleh programmer, sehingga seringkali terdapat banyak typo, kata-kata disingkat (bahasa Indonesia sehari-hari atau slang teknis developer), atau format yang berantakan.

Tugas kamu:
1. Pahami inti maksud dari catatan mentah tersebut.
2. Perbaiki semua salah ketik (typo) dan tata bahasa agar rapi, jelas, dan profesional.
3. Jabarkan singkatan yang lazim dalam komunikasi kerja atau pemrograman (contoh: 'bkin' -> 'Buat/Membuat', 'ftur' -> 'fitur', 'pke' -> 'menggunakan/pakai', 'jwt' -> 'JWT', 'bg'/'benerin bg' -> 'Perbaiki bug', 'tmbah' -> 'tambah/menambahkan', 'tgl' -> 'tanggal', 'kmrn' -> 'kemarin', 'sblm' -> 'sebelum', 'lgin' -> 'login', dll).
4. Susun hasilnya menjadi daftar poin-poin (bullet points/checklist) yang terstruktur, runut, dan langsung bisa dieksekusi.
5. Jika judul saat ini masih kosong atau kurang deskriptif, buatkan usulan judul singkat yang profesional (maksimal 6 kata).
6. PENTING: Jangan tambahkan kata pembuka atau penutup (seperti 'Tentu, ini hasilnya', 'Semoga bermanfaat', dll). Langsung keluarkan teks catatan yang sudah bersih dan rapi.

Format response WAJIB berupa JSON dengan struktur persis seperti ini:
{
  \"title\": \"Judul singkat profesional\",
  \"refined_content\": \"- Poin 1\\n- Poin 2\\n- Poin 3\"
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
     * Delete a note.
     */
    public function destroy(Note $note): RedirectResponse
    {
        $note->delete();

        return back()->with('message', 'Catatan berhasil dihapus.');
    }
}
