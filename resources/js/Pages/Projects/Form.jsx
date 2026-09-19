import React, { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import CustomSelect from '@/Components/CustomSelect';
import Checkbox from '@/Components/Checkbox';
import {
    ChevronLeft,
    UploadCloud,
    X,
    Plus,
    Minus,
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
    Trash2,
    Building2,
    Briefcase,
    Lock,
    Shield,
    RefreshCw,
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

const ROLE_PRESETS = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Mobile Developer',
    'UI/UX Designer',
    'DevOps / Cloud Engineer',
    'QA Engineer / Tester',
    'Project Manager / Tech Lead',
    'Data Engineer / AI Specialist',
    'Lainnya (Kustom)',
];

const STATUS_OPTIONS = [
    { value: 'Not Started', label: 'Not Started' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'On Hold', label: 'On Hold' },
    { value: 'Completed', label: 'Completed' },
];

const STATUS_STYLES = {
    'Not Started': {
        active: 'bg-slate-600 dark:bg-slate-700 text-white border-slate-600 dark:border-slate-700 shadow-sm ring-2 ring-slate-500/20',
        inactive: 'bg-slate-50 dark:bg-[#0a1533] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1e346e] hover:bg-slate-100 dark:hover:bg-slate-800',
        dot: 'bg-slate-400',
    },
    'In Progress': {
        active: 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 ring-2 ring-blue-500/20',
        inactive: 'bg-slate-50 dark:bg-[#0a1533] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1e346e] hover:bg-blue-50/50 dark:hover:bg-[#132354] hover:text-blue-600 dark:hover:text-blue-400',
        dot: 'bg-blue-500',
    },
    'On Hold': {
        active: 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-500/25 ring-2 ring-amber-500/20',
        inactive: 'bg-slate-50 dark:bg-[#0a1533] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1e346e] hover:bg-amber-50/50 dark:hover:bg-[#132354] hover:text-amber-600 dark:hover:text-amber-400',
        dot: 'bg-amber-500',
    },
    'Completed': {
        active: 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/25 ring-2 ring-emerald-500/20',
        inactive: 'bg-slate-50 dark:bg-[#0a1533] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1e346e] hover:bg-emerald-50/50 dark:hover:bg-[#132354] hover:text-emerald-600 dark:hover:text-emerald-400',
        dot: 'bg-emerald-500',
    },
};

export default function ProjectForm({ mode = 'create', project = null, prefill = {}, isGitHubConnected = false }) {
    const isEdit = mode === 'edit';

    // Form fields
    const [name, setName] = useState(isEdit ? project.name : (prefill.name || ''));
    const [companyName, setCompanyName] = useState(isEdit ? (project.company_name || '') : (prefill.company_name || ''));
    const [ownershipType, setOwnershipType] = useState(isEdit ? (project.ownership_type || 'Company') : (prefill.ownership_type || 'Company'));

    // Role state with CustomSelect presets
    const initialRole = isEdit ? (project.role || 'Frontend Developer') : (prefill.role || 'Frontend Developer');
    const isInitialPreset = ROLE_PRESETS.filter(p => p !== 'Lainnya (Kustom)').includes(initialRole);
    const [selectedRolePreset, setSelectedRolePreset] = useState(isInitialPreset ? initialRole : 'Lainnya (Kustom)');
    const [role, setRole] = useState(initialRole);
    const [isCustomRole, setIsCustomRole] = useState(!isInitialPreset);

    const handleRolePresetChange = (val) => {
        setSelectedRolePreset(val);
        if (val === 'Lainnya (Kustom)') {
            setIsCustomRole(true);
        } else {
            setIsCustomRole(false);
            setRole(val);
        }
    };

    const [description, setDescription] = useState(isEdit ? (project.description || '') : (prefill.description || ''));
    const [category, setCategory] = useState(isEdit ? project.category : (prefill.category || 'Web Development'));
    const [projectType, setProjectType] = useState(isEdit ? project.project_type : (prefill.project_type || 'Solo'));

    // Team & GitHub Collaborators
    const [teamSize, setTeamSize] = useState(
        isEdit ? (project.team_size || 1) : (prefill.team_size || 1)
    );
    const [teamMembers, setTeamMembers] = useState(
        isEdit ? (project.team_members || []) : (prefill.team_members || [])
    );
    const [isCheckingCollab, setIsCheckingCollab] = useState(false);
    const [collabError, setCollabError] = useState(null);
    const [collabChecked, setCollabChecked] = useState(false);

    const [status, setStatus] = useState(isEdit ? project.status : (prefill.status || 'In Progress'));
    const [liveUrl, setLiveUrl] = useState(isEdit ? (project.live_url || '') : (prefill.live_url || ''));
    const [startDate, setStartDate] = useState(isEdit ? (project.start_date || '') : (prefill.start_date || ''));
    const [dueDate, setDueDate] = useState(isEdit ? (project.due_date || '') : (prefill.due_date || ''));
    const [hideGithubLink, setHideGithubLink] = useState(isEdit ? Boolean(project.hide_github_link) : Boolean(prefill.hide_github_link));

    // GitHub Repo info
    const [githubRepoId, setGithubRepoId] = useState(isEdit ? (project.github_repo_id || '') : (prefill.github_repo_id || ''));
    const [githubRepoName, setGithubRepoName] = useState(isEdit ? (project.github_repo_name || '') : (prefill.github_repo_name || ''));
    const [githubRepoUrl, setGithubRepoUrl] = useState(isEdit ? (project.github_repo_url || '') : (prefill.github_repo_url || ''));

    // Fetch collaborators from GitHub
    const fetchCollaborators = async (repoName = githubRepoName) => {
        if (!repoName) return;
        setIsCheckingCollab(true);
        setCollabError(null);
        try {
            const res = await fetch(`/projects/github/collaborators?repo=${encodeURIComponent(repoName)}`);
            const data = await res.json();
            if (data.success && Array.isArray(data.members)) {
                setTeamMembers(data.members);
                setCollabChecked(true);
                if (data.members.length > 0) {
                    setTeamSize(data.members.length);
                }
            } else {
                setCollabError(data.message || 'Tidak dapat mendeteksi kolaborator.');
            }
        } catch (err) {
            setCollabError('Terjadi kesalahan saat memeriksa kolaborator GitHub.');
        } finally {
            setIsCheckingCollab(false);
        }
    };

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
    const [isDeleting, setIsDeleting] = useState(false);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    const handleDeleteProject = () => {
        if (!project) return;
        if (confirm(`Apakah Anda yakin ingin menghapus proyek "${name}"? Gambar screenshot dan data terkait akan dihapus secara permanen.`)) {
            setIsDeleting(true);
            router.delete(`/projects/${project.id}`, {
                onFinish: () => setIsDeleting(false),
            });
        }
    };

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
        formData.append('company_name', companyName);
        formData.append('ownership_type', ownershipType);
        formData.append('role', role);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('project_type', projectType);
        formData.append('team_size', projectType === 'Team' ? teamSize : 1);
        if (projectType === 'Team' && teamMembers.length > 0) {
            formData.append('team_members', JSON.stringify(teamMembers));
        }
        formData.append('status', status);
        formData.append('live_url', liveUrl);
        formData.append('start_date', startDate);
        formData.append('due_date', dueDate);
        formData.append('hide_github_link', hideGithubLink ? '1' : '0');

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

            <div className="w-full space-y-6 pb-12">
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

                    {/* Quick Actions & Source Badge */}
                    <div className="flex items-center gap-3 self-start sm:self-auto">
                        {isEdit && (
                            <button
                                type="button"
                                onClick={handleDeleteProject}
                                disabled={isDeleting}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/60 transition-colors cursor-pointer"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>{isDeleting ? 'Menghapus...' : 'Hapus Proyek'}</span>
                            </button>
                        )}

                        {githubRepoName && (
                            <div className="p-2.5 sm:p-3 rounded-lg bg-blue-50/60 dark:bg-[#0a1533] border border-blue-100 dark:border-[#1e346e] flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <div className="text-xs">
                                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px] sm:max-w-[220px]">
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
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Section 1: Informasi Utama Proyek */}
                    <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-5 sm:p-7 border border-slate-200/80 dark:border-[#1e346e] shadow-xs space-y-5">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                            <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                Informasi Dasar Proyek
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {/* Project Name */}
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                    Nama Proyek <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Contoh: Sistem Informasi Kepegawaian (SIMPEG)"
                                    className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-[#0a1533] border border-slate-200 dark:border-[#1e346e] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-900 dark:text-white font-medium"
                                />
                                {errors.name && <p className="text-xs text-rose-500 font-medium">{errors.name}</p>}
                            </div>

                            {/* Asal / Kepemilikan Proyek */}
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                    Asal / Kepemilikan Proyek
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOwnershipType('Company');
                                            if (!companyName || companyName === 'Personal Project') setCompanyName('PT ');
                                        }}
                                        className={`py-2.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                                            ownershipType === 'Company'
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                                : 'bg-slate-50 dark:bg-[#0a1533] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1e346e] hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <Building2 className="w-3.5 h-3.5 shrink-0" />
                                        <span>Kantor / PT</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOwnershipType('Client');
                                            if (companyName === 'Personal Project') setCompanyName('');
                                        }}
                                        className={`py-2.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                                            ownershipType === 'Client'
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                                : 'bg-slate-50 dark:bg-[#0a1533] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1e346e] hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <Briefcase className="w-3.5 h-3.5 shrink-0" />
                                        <span>Klien / Jasa</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOwnershipType('Personal');
                                            setCompanyName('Personal Project');
                                        }}
                                        className={`py-2.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                                            ownershipType === 'Personal'
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                                : 'bg-slate-50 dark:bg-[#0a1533] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1e346e] hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                                        <span>Pribadi</span>
                                    </button>
                                </div>
                            </div>

                            {/* Nama PT / Instansi / Klien */}
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center justify-between">
                                    <span>{ownershipType === 'Company' ? 'Nama Perusahaan / PT' : (ownershipType === 'Client' ? 'Nama Klien / Instansi' : 'Nama Pemilik Proyek')}</span>
                                    <span className="text-[11px] text-slate-400 font-normal lowercase">misal: PT Codelabs Poliwangi</span>
                                </label>
                                <div className="relative">
                                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                        type="text"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        placeholder={ownershipType === 'Company' ? 'Contoh: PT Telkom Indonesia' : 'Contoh: Klien UMKM / Proyek Pribadi'}
                                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-[#0a1533] border border-slate-200 dark:border-[#1e346e] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Peran / Role Anda */}
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center justify-between">
                                    <span>Peran / Role Anda di Proyek Ini</span>
                                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">Pilih dari dropdown</span>
                                </label>
                                <CustomSelect
                                    value={selectedRolePreset}
                                    onChange={handleRolePresetChange}
                                    options={ROLE_PRESETS}
                                    placeholder="Pilih Peran / Role Anda"
                                />
                                {isCustomRole && (
                                    <div className="relative mt-2">
                                        <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        <input
                                            type="text"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            placeholder="Tuliskan nama peran/role Anda..."
                                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-[#0a1533] border border-blue-300 dark:border-blue-600 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 text-slate-900 dark:text-white font-medium"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Category */}
                            <div className="md:col-span-1 space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                    Kategori Proyek
                                </label>
                                <CustomSelect
                                    value={category}
                                    onChange={setCategory}
                                    options={CATEGORIES}
                                    placeholder="Pilih Kategori"
                                />
                            </div>

                            {/* Project Type (Solo vs Team) */}
                            <div className="md:col-span-1 space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                    Tipe Pengerjaan
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setProjectType('Solo')}
                                        className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                                            projectType === 'Solo'
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                                : 'bg-slate-50 dark:bg-[#0a1533] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1e346e] hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <UserIcon className="w-3.5 h-3.5" />
                                        <span>Solo</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setProjectType('Team');
                                            if (githubRepoName && teamMembers.length === 0 && !collabChecked) {
                                                fetchCollaborators(githubRepoName);
                                            }
                                        }}
                                        className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                                            projectType === 'Team'
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                                : 'bg-slate-50 dark:bg-[#0a1533] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1e346e] hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <Users className="w-3.5 h-3.5" />
                                        <span>Team</span>
                                    </button>
                                </div>
                            </div>

                            {/* Team Details Panel (Only shown when Team is selected) */}
                            {projectType === 'Team' && (
                                <div className="md:col-span-2 lg:col-span-4 p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-[#0a1533] border border-slate-200/80 dark:border-[#1e346e] space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                                                Konfigurasi Tim Pengerjaan
                                            </span>
                                        </div>

                                        {/* Counter controls */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                Total Orang:
                                            </span>
                                            <div className="flex items-center rounded-lg border border-slate-200 dark:border-[#1e346e] bg-white dark:bg-[#0e1d47] overflow-hidden">
                                                <button
                                                    type="button"
                                                    onClick={() => setTeamSize(Math.max(1, teamSize - 1))}
                                                    disabled={teamSize <= 1}
                                                    className="px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="100"
                                                    value={teamSize}
                                                    onChange={(e) => setTeamSize(Math.max(1, parseInt(e.target.value) || 1))}
                                                    className="w-12 text-center text-xs font-bold text-slate-900 dark:text-white bg-transparent border-none focus:outline-hidden focus:ring-0 p-0"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setTeamSize(teamSize + 1)}
                                                    className="px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* GitHub Collaborator Sync Info */}
                                    {githubRepoName ? (
                                        <div className="space-y-3">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                                                    <GithubIcon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                                                    <span>
                                                        Repo GitHub: <strong className="text-blue-600 dark:text-blue-400 font-semibold">{githubRepoName}</strong>
                                                    </span>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => fetchCollaborators(githubRepoName)}
                                                    disabled={isCheckingCollab}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-900/50 transition-colors cursor-pointer"
                                                >
                                                    <RefreshCw className={`w-3.5 h-3.5 ${isCheckingCollab ? 'animate-spin' : ''}`} />
                                                    <span>{isCheckingCollab ? 'Memeriksa Kolaborator...' : 'Cek Kolaborator GitHub'}</span>
                                                </button>
                                            </div>

                                            {collabError && (
                                                <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                                    <span>{collabError}</span>
                                                </div>
                                            )}

                                            {/* Detected Collaborators List */}
                                            {teamMembers.length > 0 && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                            Kolaborator & Kontributor Terdeteksi ({teamMembers.length})
                                                        </span>
                                                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                                                            Otomatis disinkronkan dari GitHub
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                                        {teamMembers.map((member, idx) => (
                                                            <div
                                                                key={member.login || idx}
                                                                className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#0e1d47] border border-slate-200 dark:border-[#1e346e] shadow-xs"
                                                            >
                                                                <div className="flex items-center gap-2 min-w-0">
                                                                    {member.avatar_url ? (
                                                                        <img
                                                                            src={member.avatar_url}
                                                                            alt={member.login}
                                                                            className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                                                                            <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                                                                        </div>
                                                                    )}
                                                                    <div className="min-w-0">
                                                                        <a
                                                                            href={member.html_url || `https://github.com/${member.login}`}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="text-xs font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate block"
                                                                        >
                                                                            @{member.login}
                                                                        </a>
                                                                        <span className="text-[10px] text-slate-400 block truncate">
                                                                            {member.contributions ? `${member.contributions} kontribusi` : (member.role || 'Kolaborator')}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const updated = teamMembers.filter((_, i) => i !== idx);
                                                                        setTeamMembers(updated);
                                                                        setTeamSize(Math.max(1, updated.length));
                                                                    }}
                                                                    className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors"
                                                                    title="Hapus dari daftar tim proyek"
                                                                >
                                                                    <X className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-[#0e1d47] border border-blue-100 dark:border-[#1e346e] text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                                            <Users className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-slate-800 dark:text-slate-200">
                                                    Proyek Tim (Tanpa Repositori GitHub Terhubung)
                                                </p>
                                                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                                                    Anda dapat mengatur jumlah orang yang mengerjakan proyek ini dengan kontrol di kanan atas.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Status Pengerjaan */}
                            <div className="md:col-span-2 lg:col-span-4 space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                    Status Proyek
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {STATUS_OPTIONS.map((opt) => {
                                        const isSelected = status === opt.value;
                                        const style = STATUS_STYLES[opt.value] || STATUS_STYLES['In Progress'];
                                        return (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setStatus(opt.value)}
                                                className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                                                    isSelected ? style.active : style.inactive
                                                }`}
                                            >
                                                {isSelected ? (
                                                    <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />
                                                ) : (
                                                    <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
                                                )}
                                                <span>{opt.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2 lg:col-span-4 space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                    Deskripsi Singkat Proyek
                                </label>
                                <textarea
                                    rows="3"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Jelaskan ringkasan proyek, fungsi utama, atau peran Anda dalam pengembangan..."
                                    className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-[#0a1533] border border-slate-200 dark:border-[#1e346e] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-900 dark:text-white"
                                ></textarea>
                            </div>

                            {/* Live Demo URL */}
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                    URL Demo / Live Web (Opsional)
                                </label>
                                <div className="relative">
                                    <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                        type="url"
                                        value={liveUrl}
                                        onChange={(e) => setLiveUrl(e.target.value)}
                                        placeholder="https://myproject.com atau https://demo.company.id"
                                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-[#0a1533] border border-slate-200 dark:border-[#1e346e] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Start Date & Due Date */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center justify-between">
                                    <span>Tanggal Mulai (Opsional)</span>
                                    {githubRepoName && startDate && (
                                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold normal-case flex items-center gap-1">
                                            <GithubIcon className="w-3 h-3" />
                                            <span>Auto-fill dari tanggal repo GitHub</span>
                                        </span>
                                    )}
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-[#0a1533] border border-slate-200 dark:border-[#1e346e] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-900 dark:text-white"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                    Completion Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-[#0a1533] border border-slate-200 dark:border-[#1e346e] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-900 dark:text-white"
                                />
                            </div>

                            {/* Privasi GitHub Repo (Untuk Repo Private / Milik PT) */}
                            <div className="md:col-span-2 lg:col-span-4 p-4 rounded-xl bg-slate-50 dark:bg-[#0a1533] border border-slate-200/80 dark:border-[#1e346e] hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                                <Checkbox
                                    checked={hideGithubLink}
                                    onChange={setHideGithubLink}
                                    id="hide_github_link"
                                >
                                    <div className="space-y-1">
                                        <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                            <Lock className="w-3.5 h-3.5 text-amber-500" />
                                            <span>Sembunyikan Tautan GitHub Publik (Repository Private / Milik PT)</span>
                                        </span>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                                            Timeline 5 commit terakhir tetap ditampilkan di halaman detail sebagai bukti pengerjaan Anda, namun tautan klik langsung ke GitHub dimatikan agar kode repositori perusahaan tetap aman.
                                        </p>
                                    </div>
                                </Checkbox>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Bahasa Pemrograman / Tech Stack */}
                    <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-5 sm:p-7 border border-slate-200/80 dark:border-[#1e346e] shadow-xs space-y-4">
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
                        <div className="flex flex-wrap gap-2 min-h-[38px] p-2.5 rounded-lg bg-slate-50 dark:bg-[#0a1533] border border-slate-200/80 dark:border-[#1e346e]">
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
                                className="flex-1 px-4 py-2 text-sm bg-slate-50 dark:bg-[#0a1533] border border-slate-200 dark:border-[#1e346e] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400"
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Tambah Tag</span>
                            </button>
                        </div>
                    </div>

                    {/* Section 3: Unggah Gambar Proyek (Maksimal 4 Slot) */}
                    <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-5 sm:p-7 border border-slate-200/80 dark:border-[#1e346e] shadow-xs space-y-4">
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
                                    className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-[#1e346e] bg-slate-100 dark:bg-slate-800 group shadow-xs"
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
                                    className="relative aspect-video rounded-lg overflow-hidden border-2 border-blue-500/70 dark:border-blue-400 bg-slate-100 dark:bg-slate-800 group shadow-xs"
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
                                    className="aspect-video rounded-lg border-2 border-dashed border-slate-300 dark:border-[#1e346e] hover:border-blue-500 dark:hover:border-blue-400 bg-slate-50/60 dark:bg-[#0a1533]/40 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 group cursor-pointer"
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-200/80 dark:border-slate-800">
                        {isEdit ? (
                            <button
                                type="button"
                                onClick={handleDeleteProject}
                                disabled={isDeleting}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-sm font-semibold transition-colors cursor-pointer"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>{isDeleting ? 'Menghapus...' : 'Hapus Proyek Ini'}</span>
                            </button>
                        ) : (
                            <div />
                        )}

                        <div className="flex items-center gap-3 self-end sm:self-auto">
                            <Link
                                href="/projects"
                                className="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-[#1e346e] text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold shadow-md shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all cursor-pointer"
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
                    </div>
                </form>
            </div>
        </>
    );
}

ProjectForm.layout = (page) => <DashboardLayout activePage="Projects">{page}</DashboardLayout>;
