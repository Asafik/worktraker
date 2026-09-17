import React, { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
    ChevronLeft,
    UploadCloud,
    X,
    Plus,
    Check,
    AlertCircle,
    Globe,
    Calendar,
    Code2,
    Users,
    User as UserIcon,
    Layers,
    FileText,
    ExternalLink,
    Clock,
    Sparkles,
} from 'lucide-react';

const GithubIcon = ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
);

const CATEGORIES = [
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Backend / API',
    'DevOps / Cloud',
    'Data / AI',
    'Other',
];

const STATUS_OPTIONS = [
    { value: 'Not Started', label: 'Not Started', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
    { value: 'In Progress', label: 'In Progress', color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400' },
    { value: 'On Hold', label: 'On Hold', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-400' },
    { value: 'Completed', label: 'Completed', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-400' },
];

export default function ProjectForm({ mode = 'create', project = null, prefill = {}, isGitHubConnected = false }) {
    const isEdit = mode === 'edit';

    // Form fields
    const [name, setName] = useState(isEdit ? project.name : (prefill.name || ''));
    const [description, setDescription] = useState(isEdit ? (project.description || '') : (prefill.description || ''));
    const [category, setCategory] = useState(isEdit ? project.category : (prefill.category || 'Web Development'));
    const [projectType, setProjectType] = useState(isEdit ? project.project_type : (prefill.project_type || 'Solo'));
    const [status, setStatus] = useState(isEdit ? project.status : (prefill.status || 'In Progress'));
    const [liveUrl, setLiveUrl] = useState(isEdit ? (project.live_url || '') : '');
    const [startDate, setStartDate] = useState(isEdit ? (project.start_date || '') : '');
    const [dueDate, setDueDate] = useState(isEdit ? (project.due_date || '') : '');

    // GitHub Repo info
    const [githubRepoId, setGithubRepoId] = useState(isEdit ? (project.github_repo_id || '') : (prefill.github_repo_id || ''));
    const [githubRepoName, setGithubRepoName] = useState(isEdit ? (project.github_repo_name || '') : (prefill.github_repo_name || ''));
    const [githubRepoUrl, setGithubRepoUrl] = useState(isEdit ? (project.github_repo_url || '') : (prefill.github_repo_url || ''));

    // Tech Stack (Tags)
    const initialTags = isEdit
        ? (project.tech_stack || [])
        : (prefill.tech_stack && prefill.tech_stack.length > 0 ? prefill.tech_stack : []);
    const [techStack, setTechStack] = useState(initialTags);
    const [tagInput, setTagInput] = useState('');

    // Images (Max 4)
    // existingImages: string URLs from database
    const [existingImages, setExistingImages] = useState(isEdit ? (project.images || []) : []);
    // newImageFiles: File objects
    const [newImageFiles, setNewImageFiles] = useState([]);
    // preview URLs for new files
    const [newImagePreviews, setNewImagePreviews] = useState([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    // Tech Stack handler
    const handleAddTag = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            e.preventDefault();
            const trimmed = tagInput.trim();
            if (trimmed && !techStack.includes(trimmed)) {
                setTechStack([...techStack, trimmed]);
                setTagInput('');
            }
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTechStack(techStack.filter((t) => t !== tagToRemove));
    };

    // Images handler
    const totalImagesCount = existingImages.length + newImageFiles.length;

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const availableSlots = 4 - (existingImages.length + newImageFiles.length);
        if (availableSlots <= 0) {
            alert('Maksimal 4 gambar untuk satu proyek.');
            return;
        }

        const allowedFiles = files.slice(0, availableSlots);
        const newPreviews = allowedFiles.map((file) => URL.createObjectURL(file));

        setNewImageFiles((prev) => [...prev, ...allowedFiles]);
        setNewImagePreviews((prev) => [...prev, ...newPreviews]);

        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleRemoveExistingImage = (index) => {
        setExistingImages(existingImages.filter((_, i) => i !== index));
    };

    const handleRemoveNewImage = (index) => {
        // revoke preview url
        URL.revokeObjectURL(newImagePreviews[index]);
        setNewImageFiles(newImageFiles.filter((_, i) => i !== index));
        setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index));
    };

    // Form Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('project_type', projectType);
        formData.append('status', status);
        formData.append('live_url', liveUrl);
        formData.append('start_date', startDate);
        formData.append('due_date', dueDate);

        if (githubRepoId) formData.append('github_repo_id', githubRepoId);
        if (githubRepoName) formData.append('github_repo_name', githubRepoName);
        if (githubRepoUrl) formData.append('github_repo_url', githubRepoUrl);

        // Tech stack
        techStack.forEach((t) => {
            formData.append('tech_stack[]', t);
        });

        if (isEdit) {
            // Existing images to keep
            existingImages.forEach((img) => {
                formData.append('existing_images[]', img);
            });
            // New images
            newImageFiles.forEach((file) => {
                formData.append('new_images[]', file);
            });

            router.post(`/projects/${project.id}`, formData, {
                forceFormData: true,
                onError: (errs) => {
                    setErrors(errs);
                    setIsSubmitting(false);
                },
                onFinish: () => setIsSubmitting(false),
            });
        } else {
            // Create mode
            newImageFiles.forEach((file) => {
                formData.append('images[]', file);
            });

            router.post('/projects', formData, {
                forceFormData: true,
                onError: (errs) => {
                    setErrors(errs);
                    setIsSubmitting(false);
                },
                onFinish: () => setIsSubmitting(false),
            });
        }
    };

    return (
        <>
            <Head title={isEdit ? `Edit ${name} - WorkTrack` : 'Tambah Proyek Baru - WorkTrack'} />

            <div className="max-w-4xl mx-auto space-y-6 pb-12">
                {/* 1. Header & Back Navigation */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
                    <div className="space-y-1">
                        <Link
                            href="/projects"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Kembali ke Daftar Proyek</span>
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                            <span>{isEdit ? 'Edit Proyek' : 'Tambah Proyek Baru'}</span>
                            {githubRepoName && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-900 text-white dark:bg-slate-800 border border-slate-700">
                                    <GithubIcon className="w-3.5 h-3.5" />
                                    <span>GitHub Linked</span>
                                </span>
                            )}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            {isEdit
                                ? 'Perbarui informasi, status, tech stack, dan tangkapan layar proyek Anda.'
                                : 'Lengkapi detail proyek, tech stack, dan unggah hingga 4 tangkapan layar.'}
                        </p>
                    </div>

                    {/* Quick Info / Source Badge */}
                    {githubRepoName && (
                        <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-[#0a1533] border border-blue-100 dark:border-[#1e346e] flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <div className="text-xs">
                                <p className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                                    {githubRepoName}
                                </p>
                                <a
                                    href={githubRepoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-0.5"
                                >
                                    <span>Buka di GitHub</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Section 1: Informasi Utama Proyek */}
                    <div className="bg-white dark:bg-[#0e1d47] rounded-2xl p-5 sm:p-7 border border-slate-200/80 dark:border-[#1e346e] shadow-xs space-y-5">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                            <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                Informasi Dasar Proyek
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Project Name */}
                            <div className="sm:col-span-2 space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                    Nama Proyek <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Contoh: Sistem Informasi Kepegawaian (SIMPEG)"
                                    className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-[#0a1533] border border-slate-200 dark:border-[#1e346e] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-900 dark:text-white"
                                />
                                {errors.name && <p className="text-xs text-rose-500 font-medium">{errors.name}</p>}
                            </div>

                            {/* Category */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                    Kategori Proyek
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-[#0a1533] border border-slate-200 dark:border-[#1e346e] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-900 dark:text-white"
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Project Type (Solo vs Team) */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                    Tipe Pengerjaan
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setProjectType('Solo')}
                                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                                            projectType === 'Solo'
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                                : 'bg-slate-50 dark:bg-[#0a1533] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1e346e] hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <UserIcon className="w-3.5 h-3.5" />
                                        <span>Individu (Solo)</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setProjectType('Team')}
                                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                                            projectType === 'Team'
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                                : 'bg-slate-50 dark:bg-[#0a1533] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1e346e] hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <Users className="w-3.5 h-3.5" />
                                        <span>Kolaborasi Tim</span>
                                    </button>
                                </div>
                            </div>

                            {/* Status Pengerjaan */}
                            <div className="sm:col-span-2 space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                    Status Proyek
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                    {STATUS_OPTIONS.map((opt) => {
                                        const isSelected = status === opt.value;
                                        return (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setStatus(opt.value)}
                                                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                                                    isSelected
                                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                                                        : 'bg-slate-50 dark:bg-[#0a1533] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1e346e] hover:bg-slate-100 dark:hover:bg-slate-800'
                                                }`}
                                            >
                                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                                <span>{opt.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="sm:col-span-2 space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                    Deskripsi Singkat Proyek
                                </label>
                                <textarea
                                    rows="3"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Jelaskan ringkasan proyek, fungsi utama, atau peran Anda dalam pengembangan..."
                                    className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-[#0a1533] border border-slate-200 dark:border-[#1e346e] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-900 dark:text-white"
                                ></textarea>
                            </div>

                            {/* Live Demo URL */}
                            <div className="sm:col-span-2 space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                    URL Demo / Live Web (Opsional)
                                </label>
                                <div className="relative">
                                    <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="url"
                                        value={liveUrl}
                                        onChange={(e) => setLiveUrl(e.target.value)}
                                        placeholder="https://myproject.com atau https://demo.company.id"
                                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-[#0a1533] border border-slate-200 dark:border-[#1e346e] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Start Date & Due Date */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                    Tanggal Mulai (Opsional)
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-[#0a1533] border border-slate-200 dark:border-[#1e346e] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-900 dark:text-white"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                    Target Selesai / Deadline (Opsional)
                                </label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-[#0a1533] border border-slate-200 dark:border-[#1e346e] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Bahasa Pemrograman / Tech Stack */}
                    <div className="bg-white dark:bg-[#0e1d47] rounded-2xl p-5 sm:p-7 border border-slate-200/80 dark:border-[#1e346e] shadow-xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center gap-2">
                                <Code2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                    Tech Stack & Bahasa Pemrograman
                                </h2>
                            </div>
                            <span className="text-xs text-slate-400">
                                {techStack.length} tools / bahasa
                            </span>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Tambahkan bahasa pemrograman, framework, atau tools yang dipakai (contoh: PHP, Laravel, React, Tailwind CSS, MySQL).
                        </p>

                        {/* Tags Display */}
                        <div className="flex flex-wrap gap-2 min-h-[38px] p-2.5 rounded-xl bg-slate-50 dark:bg-[#0a1533] border border-slate-200/80 dark:border-[#1e346e]">
                            {techStack.length === 0 ? (
                                <span className="text-xs text-slate-400 italic py-1 px-1">
                                    Belum ada tech stack ditambahkan. Ketik di bawah lalu tekan Enter.
                                </span>
                            ) : (
                                techStack.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 rounded-lg text-xs font-semibold animate-in fade-in"
                                    >
                                        <span>{tag}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-300"
                                        >
                                            <X className="w-2.5 h-2.5" />
                                        </button>
                                    </span>
                                ))
                            )}
                        </div>

                        {/* Add Tag Input */}
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                placeholder="Ketik nama stack (misal: Laravel, InertiaJS, PostgreSQL) lalu tekan Enter..."
                                className="flex-1 px-4 py-2 text-sm bg-slate-50 dark:bg-[#0a1533] border border-slate-200 dark:border-[#1e346e] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400"
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Tambah Tag</span>
                            </button>
                        </div>
                    </div>

                    {/* Section 3: Unggah Gambar Proyek (Maksimal 4 Slot) */}
                    <div className="bg-white dark:bg-[#0e1d47] rounded-2xl p-5 sm:p-7 border border-slate-200/80 dark:border-[#1e346e] shadow-xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center gap-2">
                                <UploadCloud className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                    Tangkapan Layar Proyek (Maks. 4 Gambar)
                                </h2>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {totalImagesCount} / 4 Terisi
                            </span>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Unggah screenshot tampilan sistem, dashboard, atau modul untuk ditampilkan di galeri proyek.
                            Tersimpan di local storage server aplikasi kita.
                        </p>

                        {/* 4 Image Slots Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {/* 1. Existing Images from DB */}
                            {existingImages.map((url, idx) => (
                                <div
                                    key={`existing-${idx}`}
                                    className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-[#1e346e] bg-slate-100 dark:bg-slate-800 group shadow-xs"
                                >
                                    <img
                                        src={url}
                                        alt={`Project preview ${idx + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveExistingImage(idx)}
                                            className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-transform hover:scale-110"
                                            title="Hapus gambar ini"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-900/70 text-white backdrop-blur-xs">
                                        Gambar {idx + 1}
                                    </span>
                                </div>
                            ))}

                            {/* 2. New Uploaded Images (Previews) */}
                            {newImagePreviews.map((url, idx) => (
                                <div
                                    key={`new-${idx}`}
                                    className="relative aspect-video rounded-xl overflow-hidden border-2 border-blue-500/70 dark:border-blue-400 bg-slate-100 dark:bg-slate-800 group shadow-xs"
                                >
                                    <img
                                        src={url}
                                        alt={`New upload ${idx + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveNewImage(idx)}
                                            className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-transform hover:scale-110"
                                            title="Batal upload"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white backdrop-blur-xs">
                                        Baru {idx + 1}
                                    </span>
                                </div>
                            ))}

                            {/* 3. Empty Upload Slot (if < 4) */}
                            {totalImagesCount < 4 && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-video rounded-xl border-2 border-dashed border-slate-300 dark:border-[#1e346e] hover:border-blue-500 dark:hover:border-blue-400 bg-slate-50/60 dark:bg-[#0a1533]/40 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 group cursor-pointer"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-110 transition-transform">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                    <span className="text-[11px] font-semibold">Upload Gambar</span>
                                    <span className="text-[10px] text-slate-400">PNG, JPG, WEBP</span>
                                </button>
                            )}
                        </div>

                        {/* Hidden File Input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                    </div>

                    {/* Section 4: Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-3">
                        <Link
                            href="/projects"
                            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-[#1e346e] text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Menyimpan Proyek...</span>
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4 stroke-[3]" />
                                    <span>{isEdit ? 'Perbarui Proyek' : 'Simpan Proyek'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

ProjectForm.layout = (page) => <DashboardLayout activePage="Projects">{page}</DashboardLayout>;
