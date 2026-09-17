import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import CustomSelect from '@/Components/CustomSelect';
import Toggle from '@/Components/Toggle';
import {
    Home,
    Camera,
    MapPin,
    Mail,
    Globe,
    ExternalLink,
    UploadCloud,
    Info,
    CheckCircle2,
    Lock,
    Shield,
    Palette,
    Layers,
    Sliders,
    Laptop,
    Smartphone,
    Trash2,
    Save,
    Check,
    Key,
    Bell,
    Globe2,
    ChevronRight,
    RefreshCw,
    Settings as SettingsIcon,
    Rocket,
    HelpCircle,
    Link2,
    Puzzle,
    X,
    Sun,
    Moon,
    Monitor,
    Sparkles,
    Type,
    LayoutDashboard,
} from 'lucide-react';

// Brand SVGs matching screenshot
const GithubIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
);

const LinkedinIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
);

const InstagramIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

const FacebookIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const XIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const GoogleCalendarIcon = ({ className = 'w-7 h-7' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="17" rx="3" fill="#4285F4" />
        <rect x="3" y="4" width="18" height="5.5" fill="#1A73E8" rx="2" />
        <circle cx="7" cy="6.8" r="1" fill="white" />
        <circle cx="17" cy="6.8" r="1" fill="white" />
        <text x="12" y="17" fill="white" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">31</text>
    </svg>
);



export default function SettingsPage({ userProfile, integrationsStatus, flash }) {
    // Active tabs: Profile, Account & Security, Appearance, Integrations, Preferences
    const [activeTab, setActiveTab] = useState('Profile');
    const [savedToast, setSavedToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('Pengaturan berhasil disimpan!');
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const avatarInputRef = useRef(null);

    const triggerSave = (msg = 'Pengaturan berhasil disimpan!') => {
        setToastMessage(msg);
        setSavedToast(true);
        setTimeout(() => setSavedToast(false), 2500);
    };

    // ==========================================
    // 1. PROFILE STATE (Loaded from SQLite)
    // ==========================================
    const [profile, setProfile] = useState(() => ({
        fullName: userProfile?.fullName || 'Asafik',
        email: userProfile?.email || 'asafik.dev@gmail.com',
        role: userProfile?.role || 'Full Stack Developer',
        location: userProfile?.location || 'Indonesia',
        bio: userProfile?.bio || '',
        website: userProfile?.website || '',
        avatar: userProfile?.avatar || '/images/avatar1.png',
        aboutShort: userProfile?.aboutShort || '',
        signature: userProfile?.signature || '',
        socials: {
            github: userProfile?.socials?.github || '',
            linkedin: userProfile?.socials?.linkedin || '',
            website: userProfile?.socials?.website || '',
            x: userProfile?.socials?.x || '',
            instagram: userProfile?.socials?.instagram || '',
            facebook: userProfile?.socials?.facebook || '',
        },
    }));

    useEffect(() => {
        if (userProfile) {
            setProfile({
                fullName: userProfile.fullName || '',
                email: userProfile.email || '',
                role: userProfile.role || '',
                location: userProfile.location || '',
                bio: userProfile.bio || '',
                website: userProfile.website || '',
                avatar: userProfile.avatar || '/images/avatar1.png',
                aboutShort: userProfile.aboutShort || '',
                signature: userProfile.signature || '',
                socials: {
                    github: userProfile.socials?.github || '',
                    linkedin: userProfile.socials?.linkedin || '',
                    website: userProfile.socials?.website || '',
                    x: userProfile.socials?.x || '',
                    instagram: userProfile.socials?.instagram || '',
                    facebook: userProfile.socials?.facebook || '',
                },
            });
        }
    }, [userProfile]);

    const handleSaveProfile = (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        router.post('/settings/profile', profile, {
            preserveScroll: true,
            onSuccess: () => {
                setSaving(false);
                triggerSave('Profil berhasil disimpan ke database SQLite!');
            },
            onError: () => {
                setSaving(false);
                triggerSave('Terjadi kesalahan saat menyimpan profil.');
            },
        });
    };

    const handleAvatarSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        setUploadingAvatar(true);
        router.post('/settings/profile/avatar', formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setUploadingAvatar(false);
                triggerSave('Foto profil berhasil diperbarui!');
            },
            onError: () => {
                setUploadingAvatar(false);
                triggerSave('Gagal mengunggah foto. Pastikan format gambar valid (maks 2MB).');
            },
        });
    };

    // ==========================================
    // 2. INTEGRATIONS STATE
    // ==========================================
    const [integrations, setIntegrations] = useState(() => ({
        github: {
            connected: integrationsStatus?.github?.connected ?? true,
            account: integrationsStatus?.github?.account || 'asafik',
            accountType: integrationsStatus?.github?.accountType || 'Personal Account',
            avatar: integrationsStatus?.github?.avatar || '/images/avatar1.png',
            url: integrationsStatus?.github?.url || 'https://github.com/asafik',
            lastSynced: integrationsStatus?.github?.lastSynced || '16 Sep 2025, 10:24',
            syncing: false,
        },
        googleDrive: {
            connected: integrationsStatus?.googleDrive?.connected ?? true,
            account: integrationsStatus?.googleDrive?.account || 'ronismk7@gmail.com',
            accountType: integrationsStatus?.googleDrive?.accountType || 'Personal Account (Google Drive)',
            folderConfigured: integrationsStatus?.googleDrive?.folderConfigured ?? false,
            folderId: integrationsStatus?.googleDrive?.folderId || '',
            url: integrationsStatus?.googleDrive?.url || 'https://drive.google.com',
            lastSynced: integrationsStatus?.googleDrive?.lastSynced || '16 Sep 2025, 21:05',
            syncing: false,
        },
        googleCalendar: {
            connected: integrationsStatus?.googleCalendar?.connected ?? true,
            account: integrationsStatus?.googleCalendar?.account || 'ronismk7@gmail.com',
            accountType: integrationsStatus?.googleCalendar?.accountType || 'Personal Account (Google Calendar)',
            calendarId: integrationsStatus?.googleCalendar?.calendarId || 'primary',
            url: integrationsStatus?.googleCalendar?.url || 'https://calendar.google.com',
            lastSynced: integrationsStatus?.googleCalendar?.lastSynced || '17 Sep 2026, 10:50',
            syncing: false,
        },
    }));

    useEffect(() => {
        if (integrationsStatus) {
            setIntegrations({
                github: {
                    connected: integrationsStatus?.github?.connected ?? true,
                    account: integrationsStatus?.github?.account || 'asafik',
                    accountType: integrationsStatus?.github?.accountType || 'Personal Account',
                    avatar: integrationsStatus?.github?.avatar || '/images/avatar1.png',
                    url: integrationsStatus?.github?.url || 'https://github.com/asafik',
                    lastSynced: integrationsStatus?.github?.lastSynced || '16 Sep 2025, 10:24',
                    syncing: false,
                },
                googleDrive: {
                    connected: integrationsStatus?.googleDrive?.connected ?? true,
                    account: integrationsStatus?.googleDrive?.account || 'ronismk7@gmail.com',
                    accountType: integrationsStatus?.googleDrive?.accountType || 'Personal Account (Google Drive)',
                    folderConfigured: integrationsStatus?.googleDrive?.folderConfigured ?? false,
                    folderId: integrationsStatus?.googleDrive?.folderId || '',
                    url: integrationsStatus?.googleDrive?.url || 'https://drive.google.com',
                    lastSynced: integrationsStatus?.googleDrive?.lastSynced || '16 Sep 2025, 21:05',
                    syncing: false,
                },
                googleCalendar: {
                    connected: integrationsStatus?.googleCalendar?.connected ?? true,
                    account: integrationsStatus?.googleCalendar?.account || 'ronismk7@gmail.com',
                    accountType: integrationsStatus?.googleCalendar?.accountType || 'Personal Account (Google Calendar)',
                    calendarId: integrationsStatus?.googleCalendar?.calendarId || 'primary',
                    url: integrationsStatus?.googleCalendar?.url || 'https://calendar.google.com',
                    lastSynced: integrationsStatus?.googleCalendar?.lastSynced || '17 Sep 2026, 10:50',
                    syncing: false,
                },
            });
        }
    }, [integrationsStatus]);

    const [modalManage, setModalManage] = useState(null); // 'github' | 'googleDrive'

    const handleSync = (key, name) => {
        setIntegrations((prev) => ({
            ...prev,
            [key]: { ...prev[key], syncing: true },
        }));

        setTimeout(() => {
            const now = new Date();
            const formatted = `${now.getDate()} Sep ${now.getFullYear()}, ${String(
                now.getHours()
            ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

            setIntegrations((prev) => ({
                ...prev,
                [key]: { ...prev[key], syncing: false, lastSynced: formatted },
            }));

            triggerSave(`${name} berhasil disinkronkan!`);
        }, 1000);
    };

    // ==========================================
    // 3. ACCOUNT & SECURITY STATE
    // ==========================================
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

    // ==========================================
    // 4. APPEARANCE STATE
    // ==========================================
    const [themeMode, setThemeMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'dark';
        }
        return 'dark';
    });
    const [accentColor, setAccentColor] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('worktrack_accent') || 'blue';
        }
        return 'blue';
    });
    const [fontFamily, setFontFamily] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('worktrack_font') || 'Inter';
        }
        return 'Inter';
    });
    const [density, setDensity] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('worktrack_density') || 'comfortable';
        }
        return 'comfortable';
    });
    const [showMotivation, setShowMotivation] = useState(() => {
        if (typeof window !== 'undefined') {
            const val = localStorage.getItem('worktrack_show_motivation');
            return val !== null ? val === 'true' : true;
        }
        return true;
    });
    const [smoothAnimations, setSmoothAnimations] = useState(() => {
        if (typeof window !== 'undefined') {
            const val = localStorage.getItem('worktrack_smooth_anim');
            return val !== null ? val === 'true' : true;
        }
        return true;
    });
    const [badgeGlow, setBadgeGlow] = useState(() => {
        if (typeof window !== 'undefined') {
            const val = localStorage.getItem('worktrack_badge_glow');
            return val !== null ? val === 'true' : true;
        }
        return true;
    });

    // ==========================================
    // 5. PREFERENCES STATE
    // ==========================================
    const [preferences, setPreferences] = useState({
        language: 'id',
        timezone: 'Asia/Jakarta',
        dateFormat: 'DD/MM/YYYY',
        emailNotif: true,
        taskReminders: true,
        browserNotif: false,
    });

    return (
        <>
            <Head title="Settings - WorkTrack" />

            {/* Notification Toast */}
            {savedToast && (
                <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-600/30 animate-in fade-in slide-in-from-top-3 duration-200">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{toastMessage}</span>
                </div>
            )}

            <div className="space-y-6">
                {/* Top Breadcrumb & Page Header */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <Link href="/" className="hover:text-blue-500 transition-colors flex items-center">
                            <Home className="w-3.5 h-3.5" />
                        </Link>
                        <span>&gt;</span>
                        <button
                            onClick={() => setActiveTab('Profile')}
                            className="hover:text-blue-500 transition-colors"
                        >
                            Settings
                        </button>
                        {activeTab !== 'Profile' && (
                            <>
                                <span>&gt;</span>
                                <span className="text-slate-800 dark:text-slate-200 font-semibold">
                                    {activeTab}
                                </span>
                            </>
                        )}
                    </div>

                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            Settings
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            Manage your account, preferences, and integrations.
                        </p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-6 border-b border-slate-200/90 dark:border-[#1e346e] text-xs sm:text-sm font-semibold overflow-x-auto">
                    {[
                        'Profile',
                        'Account & Security',
                        'Appearance',
                        'Integrations',
                        'Preferences',
                    ].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 border-b-2 transition-all whitespace-nowrap ${
                                activeTab === tab
                                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* ================================================================ */}
                {/* TAB 1: PROFILE */}
                {/* ================================================================ */}
                {activeTab === 'Profile' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        {/* COLUMN 1: Profile Information */}
                        <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 sm:p-6 shadow-xs space-y-5">
                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                    Profile Information
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    This information will be used in your profile and portfolio.
                                </p>
                            </div>

                            {/* Hidden file input for avatar upload */}
                            <input
                                type="file"
                                ref={avatarInputRef}
                                onChange={handleAvatarSelect}
                                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                                className="hidden"
                            />

                            {/* Avatar & Display Role */}
                            <div className="flex items-center gap-4 pt-1">
                                <div className="relative">
                                    <img
                                        src={profile.avatar}
                                        alt={profile.fullName}
                                        className="w-20 h-20 sm:w-22 sm:h-22 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => avatarInputRef.current?.click()}
                                        disabled={uploadingAvatar}
                                        title="Change Photo"
                                        className="absolute bottom-0 right-0 w-7 h-7 bg-[#2563eb] hover:bg-blue-600 disabled:opacity-60 text-white rounded-full border-2 border-white dark:border-[#0e1d47] flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                                    >
                                        {uploadingAvatar ? (
                                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                            <Camera className="w-3.5 h-3.5" />
                                        )}
                                    </button>
                                </div>

                                <div className="space-y-0.5">
                                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                        {profile.fullName}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                                        {profile.role}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs text-slate-400 pt-0.5">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                        <span>{profile.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Form Fields */}
                            <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.fullName}
                                        onChange={(e) =>
                                            setProfile({ ...profile, fullName: e.target.value })
                                        }
                                        className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) =>
                                            setProfile({ ...profile, email: e.target.value })
                                        }
                                        className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Role / Job Title
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.role}
                                        onChange={(e) =>
                                            setProfile({ ...profile, role: e.target.value })
                                        }
                                        className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.location}
                                        onChange={(e) =>
                                            setProfile({ ...profile, location: e.target.value })
                                        }
                                        className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Bio
                                    </label>
                                    <textarea
                                        rows={3}
                                        maxLength={300}
                                        value={profile.bio}
                                        onChange={(e) =>
                                            setProfile({ ...profile, bio: e.target.value })
                                        }
                                        className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md p-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                                    />
                                    <div className="text-right text-[11px] text-slate-400 mt-0.5 font-medium">
                                        {profile.bio.length}/300
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Website
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.website}
                                        onChange={(e) =>
                                            setProfile({ ...profile, website: e.target.value })
                                        }
                                        className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-5 py-2 bg-[#2563eb] hover:bg-blue-600 disabled:opacity-60 text-white rounded-md text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                                    >
                                        {saving ? (
                                            <>
                                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <span>Save Changes</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* COLUMN 2: Social Links & Profile Preview */}
                        <div className="space-y-6">
                            {/* Card: Social Links */}
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 sm:p-6 shadow-xs space-y-4">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                        Social Links
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        These links will be shown on your portfolio.
                                    </p>
                                </div>

                                <div className="space-y-3 pt-1">
                                    {/* GitHub */}
                                    <div className="relative flex items-center">
                                        <div className="absolute left-3 text-slate-500 dark:text-slate-400">
                                            <GithubIcon className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            value={profile.socials.github}
                                            onChange={(e) =>
                                                setProfile({
                                                    ...profile,
                                                    socials: {
                                                        ...profile.socials,
                                                        github: e.target.value,
                                                    },
                                                })
                                            }
                                            placeholder="https://github.com/username"
                                            className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                        />
                                        {profile.socials.github && (
                                            <a
                                                href={profile.socials.github}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="absolute right-3 text-slate-400 hover:text-blue-500"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                    </div>

                                    {/* LinkedIn */}
                                    <div className="relative flex items-center">
                                        <div className="absolute left-3 text-blue-600 dark:text-blue-400">
                                            <LinkedinIcon className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            value={profile.socials.linkedin}
                                            onChange={(e) =>
                                                setProfile({
                                                    ...profile,
                                                    socials: {
                                                        ...profile.socials,
                                                        linkedin: e.target.value,
                                                    },
                                                })
                                            }
                                            placeholder="https://linkedin.com/in/username"
                                            className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                        />
                                        {profile.socials.linkedin && (
                                            <a
                                                href={profile.socials.linkedin}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="absolute right-3 text-slate-400 hover:text-blue-500"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                    </div>

                                    {/* Website */}
                                    <div className="relative flex items-center">
                                        <div className="absolute left-3 text-teal-600 dark:text-teal-400">
                                            <Globe className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            value={profile.socials.website}
                                            onChange={(e) =>
                                                setProfile({
                                                    ...profile,
                                                    socials: {
                                                        ...profile.socials,
                                                        website: e.target.value,
                                                    },
                                                })
                                            }
                                            placeholder="https://yourwebsite.dev"
                                            className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                        />
                                        {profile.socials.website && (
                                            <a
                                                href={profile.socials.website}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="absolute right-3 text-slate-400 hover:text-blue-500"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                    </div>

                                    {/* X (Twitter) */}
                                    <div className="relative flex items-center">
                                        <div className="absolute left-3 text-slate-700 dark:text-slate-300">
                                            <XIcon className="w-3.5 h-3.5" />
                                        </div>
                                        <input
                                            type="text"
                                            value={profile.socials.x}
                                            onChange={(e) =>
                                                setProfile({
                                                    ...profile,
                                                    socials: {
                                                        ...profile.socials,
                                                        x: e.target.value,
                                                    },
                                                })
                                            }
                                            placeholder="https://x.com/username"
                                            className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400/80 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    {/* Instagram */}
                                    <div className="relative flex items-center">
                                        <div className="absolute left-3 text-pink-600 dark:text-pink-400">
                                            <InstagramIcon className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            value={profile.socials.instagram}
                                            onChange={(e) =>
                                                setProfile({
                                                    ...profile,
                                                    socials: {
                                                        ...profile.socials,
                                                        instagram: e.target.value,
                                                    },
                                                })
                                            }
                                            placeholder="https://instagram.com/username"
                                            className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400/80 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    {/* Facebook */}
                                    <div className="relative flex items-center">
                                        <div className="absolute left-3 text-blue-600 dark:text-blue-400">
                                            <FacebookIcon className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            value={profile.socials.facebook}
                                            onChange={(e) =>
                                                setProfile({
                                                    ...profile,
                                                    socials: {
                                                        ...profile.socials,
                                                        facebook: e.target.value,
                                                    },
                                                })
                                            }
                                            placeholder="https://facebook.com/username"
                                            className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400/80 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <button
                                            type="button"
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className="px-4 py-1.5 bg-[#2563eb] hover:bg-blue-600 disabled:opacity-60 text-white rounded-md text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                                        >
                                            {saving ? (
                                                <>
                                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                                    <span>Saving...</span>
                                                </>
                                            ) : (
                                                <span>Save Links</span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Card: Profile Preview */}
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 sm:p-6 shadow-xs space-y-4">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                        Profile Preview
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        This is how your profile appears on the portfolio.
                                    </p>
                                </div>

                                <div className="bg-[#f8fafc] dark:bg-[#0c183b] rounded-lg border border-slate-200/70 dark:border-slate-800 p-4 space-y-3.5">
                                    <div className="flex items-center gap-3.5">
                                        <img
                                            src={profile.avatar}
                                            alt={profile.fullName}
                                            className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500/30"
                                        />
                                        <div>
                                            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                                                {profile.fullName}
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                {profile.role}
                                            </p>
                                            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                                                <MapPin className="w-3 h-3 text-slate-400" />
                                                <span>{profile.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {profile.bio}
                                    </p>

                                    {/* Social Icon Pills */}
                                    <div className="flex items-center gap-2 pt-1 text-slate-500 dark:text-slate-400">
                                        <span className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                            <GithubIcon className="w-3.5 h-3.5" />
                                        </span>
                                        <span className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                            <LinkedinIcon className="w-3.5 h-3.5" />
                                        </span>
                                        <span className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                            <Globe className="w-3.5 h-3.5" />
                                        </span>
                                        <span className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                            <XIcon className="w-3 h-3" />
                                        </span>
                                        <span className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                            <InstagramIcon className="w-3.5 h-3.5" />
                                        </span>
                                        <span className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                            <FacebookIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                        </span>
                                    </div>

                                    {/* View Public Portfolio Button */}
                                    <button
                                        type="button"
                                        onClick={() => window.open('http://127.0.0.1:8000', '_blank')}
                                        className="w-full flex items-center justify-center gap-1.5 py-2 bg-white dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] text-slate-700 dark:text-slate-200 rounded-md text-xs font-semibold hover:bg-slate-50 dark:hover:bg-[#182c66] transition-colors shadow-2xs"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                                        <span>View Public Portfolio</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* COLUMN 3: Profile Picture, About Short, Signature, Tips */}
                        <div className="space-y-6">
                            {/* Card: Profile Picture */}
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 sm:p-6 shadow-xs space-y-4">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                        Profile Picture
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Upload a new profile picture. Recommended size 400x400px.
                                    </p>
                                </div>

                                <div
                                    onClick={() => avatarInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-200 dark:border-[#243e80] rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer bg-slate-50/50 dark:bg-[#0c183b]/50 group"
                                >
                                    <UploadCloud className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform mx-auto stroke-[1.8]" />
                                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-2">
                                        {uploadingAvatar ? 'Mengunggah foto...' : 'Drag and drop an image here'}
                                    </p>
                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline">
                                        or click to browse
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-2">
                                        JPG, PNG or WEBP. Max size 2MB.
                                    </p>
                                </div>
                            </div>

                            {/* Card: About Me (Short) */}
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 sm:p-6 shadow-xs space-y-3">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                        About Me (Short)
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        A short introduction for your portfolio homepage.
                                    </p>
                                </div>

                                <div>
                                    <textarea
                                        rows={3}
                                        maxLength={200}
                                        value={profile.aboutShort}
                                        onChange={(e) =>
                                            setProfile({ ...profile, aboutShort: e.target.value })
                                        }
                                        className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md p-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                                    />
                                    <div className="text-right text-[11px] text-slate-400 mt-0.5 font-medium">
                                        {profile.aboutShort.length}/200
                                    </div>
                                </div>
                            </div>

                            {/* Card: Signature */}
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 sm:p-6 shadow-xs space-y-3">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                        Signature
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        This will be used for emails or exported documents.
                                    </p>
                                </div>

                                <div>
                                    <textarea
                                        rows={2}
                                        maxLength={100}
                                        value={profile.signature}
                                        onChange={(e) =>
                                            setProfile({ ...profile, signature: e.target.value })
                                        }
                                        className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md p-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                                    />
                                    <div className="text-right text-[11px] text-slate-400 mt-0.5 font-medium">
                                        {profile.signature.length}/100
                                    </div>
                                </div>

                                <div className="flex justify-end pt-1">
                                    <button
                                        type="button"
                                        onClick={handleSaveProfile}
                                        disabled={saving}
                                        className="px-4 py-1.5 bg-[#2563eb] hover:bg-blue-600 disabled:opacity-60 text-white rounded-md text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                                    >
                                        {saving ? (
                                            <>
                                                <RefreshCw className="w-3 h-3 animate-spin" />
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <span>Save Changes</span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Card: Tips Alert */}
                            <div className="bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/60 rounded-lg p-4 flex items-start gap-3 shadow-2xs">
                                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                                    <Info className="w-3 h-3 stroke-[2.5]" />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="font-bold text-xs sm:text-sm text-blue-900 dark:text-blue-200">
                                        Tips
                                    </h4>
                                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                        Keep your profile information up to date so your portfolio always looks professional.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ================================================================ */}
                {/* TAB 2: ACCOUNT & SECURITY */}
                {/* ================================================================ */}
                {activeTab === 'Account & Security' && (
                    <div className="max-w-3xl space-y-6">
                        {/* Change Password Card */}
                        <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-6 shadow-xs space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                                <div className="w-9 h-9 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                    <Key className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                        Ubah Kata Sandi
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Pastikan akun Anda menggunakan kata sandi yang panjang dan acak agar tetap aman.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); triggerSave(); }} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Kata Sandi Saat Ini
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Kata Sandi Baru
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Konfirmasi Kata Sandi Baru
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-[#2563eb] hover:bg-blue-600 text-white rounded-md text-xs sm:text-sm font-semibold shadow-sm transition-all"
                                    >
                                        Perbarui Kata Sandi
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Two-Factor Authentication Card */}
                        <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-6 shadow-xs flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                        Autentikasi Dua Faktor (2FA)
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Tambahkan lapisan keamanan ekstra ke akun Anda menggunakan aplikasi autentikator.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setTwoFactorEnabled(!twoFactorEnabled);
                                    triggerSave();
                                }}
                                className={`w-10 h-6 rounded-full transition-colors relative focus:outline-none ${
                                    twoFactorEnabled ? 'bg-[#2563eb]' : 'bg-slate-300 dark:bg-slate-700'
                                }`}
                            >
                                <span
                                    className={`block w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                                        twoFactorEnabled ? 'translate-x-5' : 'translate-x-0.5'
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Active Sessions */}
                        <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-6 shadow-xs space-y-4">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                                Sesi Aktif
                            </h3>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#0c183b]/60 border border-slate-200/70 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <Laptop className="w-5 h-5 text-blue-500" />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                                                    Windows PC • Chrome Browser
                                                </h4>
                                                <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                                                    Perangkat Ini
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                Surabaya, Indonesia • Aktif Sekarang
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#0c183b]/60 border border-slate-200/70 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <Smartphone className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                                                iPhone 14 Pro • Safari
                                            </h4>
                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                Surabaya, Indonesia • 2 hari yang lalu
                                            </p>
                                        </div>
                                    </div>
                                    <button className="text-xs text-rose-500 hover:underline">
                                        Keluar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ================================================================ */}
                {/* TAB 3: APPEARANCE (Rich 2-Column with Interactive Live Preview) */}
                {/* ================================================================ */}
                {activeTab === 'Appearance' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left Column: Settings Controls (7 cols) */}
                        <div className="lg:col-span-7 space-y-5">
                            {/* Card 1: Theme Mode */}
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 sm:p-6 shadow-xs space-y-4">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Sun className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                                        <span>Tema Tampilan (Theme Mode)</span>
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Sesuaikan tema antarmuka WorkTrack agar nyaman saat bekerja siang atau malam.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {[
                                        {
                                            key: 'light',
                                            title: 'Light Mode',
                                            desc: 'Tampilan bersih & terang',
                                            icon: Sun,
                                            iconColor: 'text-amber-500',
                                        },
                                        {
                                            key: 'dark',
                                            title: 'Dark Mode',
                                            desc: 'Tema gelap Deep Navy',
                                            icon: Moon,
                                            iconColor: 'text-blue-400',
                                        },
                                        {
                                            key: 'system',
                                            title: 'Ikuti Sistem',
                                            desc: 'Sinkron otomatis OS',
                                            icon: Monitor,
                                            iconColor: 'text-slate-400',
                                        },
                                    ].map((t) => {
                                        const IconComponent = t.icon;
                                        const isSelected = themeMode === t.key;
                                        return (
                                            <button
                                                key={t.key}
                                                type="button"
                                                onClick={() => {
                                                    setThemeMode(t.key);
                                                    const root = document.documentElement;
                                                    if (t.key === 'dark') {
                                                        root.classList.add('dark');
                                                        localStorage.setItem('theme', 'dark');
                                                    } else if (t.key === 'light') {
                                                        root.classList.remove('dark');
                                                        localStorage.setItem('theme', 'light');
                                                    } else {
                                                        const isSysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                                                        if (isSysDark) root.classList.add('dark');
                                                        else root.classList.remove('dark');
                                                        localStorage.removeItem('theme');
                                                    }
                                                    triggerSave('Tema tampilan berhasil diperbarui!');
                                                }}
                                                className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all ${
                                                    isSelected
                                                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-600/30 shadow-xs'
                                                        : 'border-slate-200 dark:border-[#243e80] hover:border-slate-300 dark:hover:border-[#385cb0] bg-[#f8fafc] dark:bg-[#122352]/40'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <IconComponent className={`w-4 h-4 ${t.iconColor}`} />
                                                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                                                            {t.title}
                                                        </h4>
                                                    </div>
                                                    {isSelected && (
                                                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
                                                    {t.desc}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Card 2: Accent Colors */}
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 sm:p-6 shadow-xs space-y-4">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Palette className="w-4 h-4 text-blue-500" />
                                        <span>Warna Aksen Dashboard</span>
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Warna primer untuk tombol aktif, badge status, dan sorotan antarmuka.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2.5">
                                    {[
                                        { key: 'blue', name: 'WorkTrack Blue', color: 'bg-[#2563eb]', border: 'border-[#2563eb]' },
                                        { key: 'emerald', name: 'Emerald', color: 'bg-emerald-600', border: 'border-emerald-600' },
                                        { key: 'purple', name: 'Royal Purple', color: 'bg-purple-600', border: 'border-purple-600' },
                                        { key: 'amber', name: 'Amber Gold', color: 'bg-amber-600', border: 'border-amber-600' },
                                        { key: 'rose', name: 'Crimson Rose', color: 'bg-rose-600', border: 'border-rose-600' },
                                    ].map((c) => {
                                        const isSelected = accentColor === c.key;
                                        return (
                                            <button
                                                key={c.key}
                                                type="button"
                                                onClick={() => {
                                                    setAccentColor(c.key);
                                                    localStorage.setItem('worktrack_accent', c.key);
                                                    triggerSave(`Warna aksen diubah ke ${c.name}!`);
                                                }}
                                                className={`flex items-center gap-2 px-3.5 py-2 rounded-md border text-xs font-semibold transition-all cursor-pointer ${
                                                    isSelected
                                                        ? 'border-blue-600 dark:border-blue-500 bg-blue-50/60 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                                                        : 'border-slate-200 dark:border-[#243e80] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#122352]'
                                                }`}
                                            >
                                                <span className={`w-3.5 h-3.5 rounded-full ${c.color} shadow-xs`} />
                                                <span>{c.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Card 3: Typography & Layout Density */}
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 sm:p-6 shadow-xs space-y-4">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Type className="w-4 h-4 text-purple-500" />
                                        <span>Tipografi & Kepadatan Tata Letak</span>
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Sesuaikan jenis huruf dan kerapatan padding antarmuka.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                            Font Antarmuka
                                        </label>
                                        <CustomSelect
                                            value={fontFamily}
                                            onChange={(val) => {
                                                setFontFamily(val);
                                                localStorage.setItem('worktrack_font', val);
                                                triggerSave(`Font diubah ke ${val}`);
                                            }}
                                            options={[
                                                { value: 'Inter', label: 'Inter (Default - Modern Clean)' },
                                                { value: 'Poppins', label: 'Poppins (Friendly & Rounded)' },
                                                { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans (Tech Sleek)' },
                                            ]}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                            Kepadatan Tampilan (Density)
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { key: 'comfortable', label: 'Comfortable', desc: 'Nyaman & luas' },
                                                { key: 'compact', label: 'Compact', desc: 'Ramping & hemat baris' },
                                            ].map((d) => (
                                                <button
                                                    key={d.key}
                                                    type="button"
                                                    onClick={() => {
                                                        setDensity(d.key);
                                                        localStorage.setItem('worktrack_density', d.key);
                                                        triggerSave(`Kepadatan diubah ke ${d.label}`);
                                                    }}
                                                    className={`px-3 py-2 rounded-md border text-center transition-all cursor-pointer ${
                                                        density === d.key
                                                            ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 font-bold shadow-xs'
                                                            : 'border-slate-200 dark:border-[#243e80] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#122352]'
                                                    }`}
                                                >
                                                    <span className="text-xs block">{d.label}</span>
                                                    <span className="text-[10px] text-slate-400 block mt-0.5">{d.desc}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 4: Sidebar Preferences & Visual Effects (Toggle) */}
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 sm:p-6 shadow-xs space-y-4">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Sliders className="w-4 h-4 text-emerald-500" />
                                        <span>Preferensi Sidebar & Efek Visual</span>
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Kustomisasi elemen tambahan di sidebar dan efek transisi.
                                    </p>
                                </div>

                                <div className="divide-y divide-slate-100 dark:divide-slate-800/80 space-y-1">
                                    <div className="flex items-center justify-between py-3">
                                        <div className="pr-4">
                                            <h5 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                                                Tampilkan Motivasi Harian di Sidebar
                                            </h5>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                Menampilkan kutipan inspirasi dan ilustrasi gunung di bagian paling bawah sidebar.
                                            </p>
                                        </div>
                                        <Toggle
                                            checked={showMotivation}
                                            onChange={(checked) => {
                                                setShowMotivation(checked);
                                                localStorage.setItem('worktrack_show_motivation', String(checked));
                                                window.dispatchEvent(new Event('worktrack_motivation_toggle'));
                                                triggerSave(checked ? 'Motivasi sidebar diaktifkan' : 'Motivasi sidebar disembunyikan');
                                            }}
                                            ariaLabel="Tampilkan motivasi di sidebar"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between py-3">
                                        <div className="pr-4">
                                            <h5 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                                                Animasi & Efek Transisi Halus
                                            </h5>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                Animasi lembut saat navigasi antar menu dan perubahan status kartu.
                                            </p>
                                        </div>
                                        <Toggle
                                            checked={smoothAnimations}
                                            onChange={(checked) => {
                                                setSmoothAnimations(checked);
                                                localStorage.setItem('worktrack_smooth_anim', String(checked));
                                                triggerSave(checked ? 'Animasi halus aktif' : 'Animasi disederhanakan');
                                            }}
                                            ariaLabel="Animasi dan efek transisi"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between py-3">
                                        <div className="pr-4">
                                            <h5 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                                                Aksen Glow pada Status & Badge
                                            </h5>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                Beri efek pendar cahaya lembut pada badge status aktif dan sorotan utama.
                                            </p>
                                        </div>
                                        <Toggle
                                            checked={badgeGlow}
                                            onChange={(checked) => {
                                                setBadgeGlow(checked);
                                                localStorage.setItem('worktrack_badge_glow', String(checked));
                                                triggerSave(checked ? 'Efek glow aktif' : 'Efek glow nonaktif');
                                            }}
                                            ariaLabel="Efek glow status"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Live Interactive Preview (5 cols) */}
                        <div className="lg:col-span-5 sticky top-5 space-y-3">
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-4 sm:p-5 shadow-xs">
                                {/* Preview Header */}
                                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400/90 inline-block" />
                                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/90 inline-block" />
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/90 inline-block" />
                                        <span className="text-[11px] font-mono text-slate-400 ml-2">worktrack.app</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span>Live Preview</span>
                                    </div>
                                </div>

                                {/* Mini UI Mockup Container */}
                                <div className="pt-4">
                                    <div
                                        className={`rounded-lg border border-slate-200 dark:border-slate-700/60 overflow-hidden shadow-sm flex h-[340px] text-[10px] ${
                                            themeMode === 'light'
                                                ? 'bg-[#f4f7fc] text-slate-800'
                                                : 'bg-[#070c1e] text-slate-100'
                                        }`}
                                    >
                                        {/* Mini Sidebar (Always Deep Navy #0b1739) */}
                                        <div className="w-24 bg-[#0b1739] text-white flex flex-col justify-between p-2 flex-shrink-0 border-r border-[#1b2b5a]/60 select-none">
                                            <div className="space-y-2">
                                                {/* Mini Brand */}
                                                <div className="flex items-center gap-1.5 pb-2 border-b border-[#1b2b5a]/60">
                                                    <img
                                                        src="/images/logo.png"
                                                        alt="Logo"
                                                        className="w-4 h-4 rounded object-contain"
                                                    />
                                                    <span className="font-bold text-[9px] tracking-tight text-white truncate">
                                                        WorkTrack
                                                    </span>
                                                </div>

                                                {/* Mini Nav Items */}
                                                <div className="space-y-1">
                                                    <div
                                                        className={`px-2 py-1 rounded font-semibold text-[9px] flex items-center gap-1 shadow-xs ${
                                                            accentColor === 'emerald'
                                                                ? 'bg-emerald-600 text-white'
                                                                : accentColor === 'purple'
                                                                ? 'bg-purple-600 text-white'
                                                                : accentColor === 'amber'
                                                                ? 'bg-amber-600 text-white'
                                                                : accentColor === 'rose'
                                                                ? 'bg-rose-600 text-white'
                                                                : 'bg-[#3b52d4] text-white'
                                                        }`}
                                                    >
                                                        <LayoutDashboard className="w-2.5 h-2.5" />
                                                        <span>Dashboard</span>
                                                    </div>
                                                    <div className="px-2 py-1 rounded text-[9px] text-[#8a99b5] flex items-center gap-1">
                                                        <Layers className="w-2.5 h-2.5" />
                                                        <span>Projects</span>
                                                    </div>
                                                    <div className="px-2 py-1 rounded text-[9px] text-[#8a99b5] flex items-center gap-1">
                                                        <Check className="w-2.5 h-2.5" />
                                                        <span>Tasks</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mini Motivation Area in Preview */}
                                            {showMotivation && (
                                                <div className="w-full relative overflow-hidden rounded bg-[#0b1739] border border-[#1b2b5a]/40 pt-1">
                                                    <p className="text-[7px] text-slate-200 px-1 font-medium leading-tight">
                                                        "A little progress..."
                                                    </p>
                                                    <img
                                                        src="/images/sidebar_boy_night.png"
                                                        alt="boy"
                                                        className="w-full h-10 object-cover object-bottom block mt-0.5"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Mini Content Area */}
                                        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                                            {/* Mini Navbar */}
                                            <div
                                                className={`h-7 px-2 flex items-center justify-between border-b ${
                                                    themeMode === 'light'
                                                        ? 'bg-white border-slate-200'
                                                        : 'bg-[#0b1739] border-[#1b2b5a]'
                                                }`}
                                            >
                                                <div
                                                    className={`w-24 h-3.5 rounded px-1.5 flex items-center text-[7px] ${
                                                        themeMode === 'light'
                                                            ? 'bg-slate-100 text-slate-400'
                                                            : 'bg-[#10204d] text-slate-400'
                                                    }`}
                                                >
                                                    Search...
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="w-3.5 h-3.5 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-[7px]">
                                                        A
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Mini Body */}
                                            <div className="p-2 space-y-2 overflow-y-auto">
                                                {/* Mini Stat Cards */}
                                                <div className="grid grid-cols-2 gap-1.5">
                                                    <div
                                                        className={`p-1.5 rounded border ${
                                                            themeMode === 'light'
                                                                ? 'bg-white border-slate-200/80 shadow-2xs'
                                                                : 'bg-[#0e1d47] border-[#1e346e]'
                                                        }`}
                                                    >
                                                        <span className="text-[8px] text-slate-400 block">Total Proyek</span>
                                                        <span className="text-xs font-bold block mt-0.5">8 Aktif</span>
                                                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full mt-1 overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${
                                                                    accentColor === 'emerald'
                                                                        ? 'bg-emerald-600'
                                                                        : accentColor === 'purple'
                                                                        ? 'bg-purple-600'
                                                                        : accentColor === 'amber'
                                                                        ? 'bg-amber-600'
                                                                        : accentColor === 'rose'
                                                                        ? 'bg-rose-600'
                                                                        : 'bg-[#2563eb]'
                                                                }`}
                                                                style={{ width: '75%' }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div
                                                        className={`p-1.5 rounded border ${
                                                            themeMode === 'light'
                                                                ? 'bg-white border-slate-200/80 shadow-2xs'
                                                                : 'bg-[#0e1d47] border-[#1e346e]'
                                                        }`}
                                                    >
                                                        <span className="text-[8px] text-slate-400 block">Selesai</span>
                                                        <span className="text-xs font-bold block mt-0.5">94%</span>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <span
                                                                className={`px-1 py-0.2 rounded text-[7px] font-bold ${
                                                                    accentColor === 'emerald'
                                                                        ? 'bg-emerald-500/20 text-emerald-400'
                                                                        : accentColor === 'purple'
                                                                        ? 'bg-purple-500/20 text-purple-400'
                                                                        : accentColor === 'amber'
                                                                        ? 'bg-amber-500/20 text-amber-400'
                                                                        : accentColor === 'rose'
                                                                        ? 'bg-rose-500/20 text-rose-400'
                                                                        : 'bg-blue-500/20 text-blue-400'
                                                                }`}
                                                            >
                                                                Tepat Waktu
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Mini Project Row */}
                                                <div
                                                    className={`p-2 rounded border flex items-center justify-between ${
                                                        themeMode === 'light'
                                                            ? 'bg-white border-slate-200/80'
                                                            : 'bg-[#0e1d47] border-[#1e346e]'
                                                    }`}
                                                >
                                                    <div className="space-y-0.5">
                                                        <div className="flex items-center gap-1">
                                                            <span
                                                                className={`w-1.5 h-1.5 rounded-full ${
                                                                    accentColor === 'emerald'
                                                                        ? 'bg-emerald-500'
                                                                        : accentColor === 'purple'
                                                                        ? 'bg-purple-500'
                                                                        : accentColor === 'amber'
                                                                        ? 'bg-amber-500'
                                                                        : accentColor === 'rose'
                                                                        ? 'bg-rose-500'
                                                                        : 'bg-blue-500'
                                                                }`}
                                                            />
                                                            <span className="font-bold text-[8px] truncate">
                                                                WorkTrack Redesign
                                                            </span>
                                                        </div>
                                                        <span className="text-[7px] text-slate-400 block pl-2.5">
                                                            Deadline: 20 Sep 2026
                                                        </span>
                                                    </div>
                                                    <span
                                                        className={`px-1.5 py-0.5 rounded text-[7px] font-bold ${
                                                            accentColor === 'emerald'
                                                                ? 'bg-emerald-600 text-white'
                                                                : accentColor === 'purple'
                                                                ? 'bg-purple-600 text-white'
                                                                : accentColor === 'amber'
                                                                ? 'bg-amber-600 text-white'
                                                                : accentColor === 'rose'
                                                                ? 'bg-rose-600 text-white'
                                                                : 'bg-[#2563eb] text-white'
                                                        }`}
                                                    >
                                                        In Progress
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-[11px] text-slate-400 text-center mt-3">
                                    Pratinjau antarmuka di atas merespons secara langsung pilihan tema, warna aksen, dan kustomisasi Anda.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ================================================================ */}
                {/* TAB 4: INTEGRATIONS (Matches Screenshot 1:1) */}
                {/* ================================================================ */}
                {activeTab === 'Integrations' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left Column (8 cols): 4 Integration Cards */}
                        <div className="lg:col-span-8 space-y-4">
                            <div>
                                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                    Integrations
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Connect with your favorite tools to streamline your workflow.
                                </p>
                            </div>

                            {/* 1. GitHub Card */}
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 sm:p-6 shadow-xs space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    {/* Icon & Title */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center p-2.5 shadow-xs shrink-0">
                                            <GithubIcon className="w-7 h-7" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                                GitHub
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                                                Connect your GitHub account to sync repositories, commits, and contributions to your projects.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Badges & Actions */}
                                    <div className="flex items-center gap-2 self-start">
                                        {integrations.github.connected ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/60">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                <span>Connected</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                                <span>Not Connected</span>
                                            </span>
                                        )}

                                        {integrations.github.connected ? (
                                            <form method="POST" action="/auth/github/disconnect" className="inline">
                                                <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.content} />
                                                <button
                                                    type="submit"
                                                    className="px-3 py-1 rounded-md border border-red-200 dark:border-red-900/60 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors shadow-2xs flex items-center gap-1.5"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                    <span>Disconnect</span>
                                                </button>
                                            </form>
                                        ) : (
                                            <a
                                                href="/auth/github"
                                                className="px-3 py-1 rounded-md border border-slate-200 dark:border-[#243e80] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors shadow-2xs flex items-center gap-1.5"
                                            >
                                                <GithubIcon className="w-3.5 h-3.5" />
                                                <span>Connect GitHub</span>
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Feature list & Connected user info */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1 items-center">
                                    <div className="md:col-span-8 space-y-1.5">
                                        {[
                                            'Import repositories to your projects',
                                            'Sync commit history and activity',
                                            'Auto-update project timeline',
                                            'Show GitHub stats on your portfolio',
                                        ].map((feat, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                                                <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" />
                                                <span>{feat}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="md:col-span-4 flex flex-col items-start md:items-end justify-center space-y-1">
                                        {integrations.github.connected ? (
                                            <>
                                                <div className="flex items-center gap-2.5">
                                                    <img
                                                        src={integrations.github.avatar}
                                                        alt={integrations.github.account}
                                                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                                                    />
                                                    <div className="text-left">
                                                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                                                            @{integrations.github.account}
                                                        </h4>
                                                        <p className="text-[10px] text-slate-400">
                                                            {integrations.github.accountType}
                                                        </p>
                                                    </div>
                                                </div>
                                                <a
                                                    href={integrations.github.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium pt-1"
                                                >
                                                    <span>View on GitHub</span>
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </>
                                        ) : (
                                            <p className="text-xs text-slate-400 italic">No account connected</p>
                                        )}
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                                    <span className="text-xs text-slate-400">
                                        {integrations.github.connected
                                            ? `Connected: @${integrations.github.account}`
                                            : 'Not connected — click Connect GitHub to authorize'}
                                    </span>
                                    {integrations.github.connected && (
                                        <button
                                            onClick={() => handleSync('github', 'GitHub')}
                                            disabled={integrations.github.syncing}
                                            className="px-3 py-1 rounded-md border border-slate-200 dark:border-[#243e80] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors flex items-center gap-1.5 shadow-2xs disabled:opacity-60"
                                        >
                                            <RefreshCw
                                                className={`w-3.5 h-3.5 text-blue-500 ${
                                                    integrations.github.syncing ? 'animate-spin' : ''
                                                }`}
                                            />
                                            <span>Sync Now</span>
                                        </button>
                                    )}
                                </div>
                            </div>


                            {/* 2. Google Drive Card */}
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 sm:p-6 shadow-xs space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    {/* Icon & Title */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#0c183b] border border-slate-200/80 dark:border-slate-800 flex items-center justify-center p-2.5 shadow-2xs shrink-0">
                                            <img src="/images/svg/google_drive.svg" alt="Google Drive" className="w-7 h-7 object-contain" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                                Google Drive
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                                                Connect Google Drive to store your project files, documents, and archives.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Badges & Actions */}
                                    <div className="flex items-center gap-2 self-start">
                                        {integrations.googleDrive.connected ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/60">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                <span>Connected</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/60">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                <span>Not Connected</span>
                                            </span>
                                        )}
                                        <button
                                            onClick={() => setModalManage('googleDrive')}
                                            className="px-3 py-1 rounded-md border border-slate-200 dark:border-[#243e80] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors shadow-2xs flex items-center gap-1.5"
                                        >
                                            <SettingsIcon className="w-3.5 h-3.5 text-slate-500" />
                                            <span>Manage</span>
                                        </button>
                                    </div>
                                </div>


                                {/* Feature list & Connected user info */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1 items-center">
                                    <div className="md:col-span-8 space-y-1.5">
                                        {[
                                            'Store project files and documentation',
                                            'Keep your archive files in the cloud',
                                            'Access files from anywhere',
                                            'Save hosting storage',
                                        ].map((feat, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                                                <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" />
                                                <span>{feat}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="md:col-span-4 flex flex-col items-start md:items-end justify-center space-y-1">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-full bg-white dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] flex items-center justify-center shadow-2xs">
                                                <img src="/images/svg/google.svg" alt="Google" className="w-4 h-4" />
                                            </div>
                                            <div className="text-left">
                                                <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-[150px]">
                                                    {integrations.googleDrive.account}
                                                </h4>
                                                <p className="text-[10px] text-slate-400">
                                                    {integrations.googleDrive.accountType}
                                                </p>
                                            </div>
                                        </div>
                                        <a
                                            href={integrations.googleDrive.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium pt-1"
                                        >
                                            <span>Open Drive</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>

                                {/* Card Footer: Last Synced & Sync Now Button */}
                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                                    <span className="text-xs text-slate-400">
                                        Last synced: {integrations.googleDrive.lastSynced}
                                    </span>
                                    <button
                                        onClick={() => handleSync('googleDrive', 'Google Drive')}
                                        disabled={integrations.googleDrive.syncing}
                                        className="px-3 py-1 rounded-md border border-slate-200 dark:border-[#243e80] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors flex items-center gap-1.5 shadow-2xs disabled:opacity-60"
                                    >
                                        <RefreshCw
                                            className={`w-3.5 h-3.5 text-blue-500 ${
                                                integrations.googleDrive.syncing ? 'animate-spin' : ''
                                            }`}
                                        />
                                        <span>Sync Now</span>
                                    </button>
                                </div>
                            </div>

                            {/* Integration Item 3: Google Calendar */}
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 shadow-xs space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-11 h-11 rounded-lg bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100/80 dark:border-blue-900/50 flex items-center justify-center shrink-0 shadow-2xs">
                                            <GoogleCalendarIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                    Google Calendar
                                                </h3>
                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100/70 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                                                    Mobile Sync
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                Sinkronisasi deadline proyek, sprint, dan notifikasi jadwal langsung ke Google Calendar di HP.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        {integrations.googleCalendar?.connected ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/60">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                <span>Connected</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/60">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                <span>Not Connected</span>
                                            </span>
                                        )}
                                        <button
                                            onClick={() => setModalManage('googleCalendar')}
                                            className="px-3 py-1 rounded-md border border-slate-200 dark:border-[#243e80] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors shadow-2xs flex items-center gap-1.5"
                                        >
                                            <SettingsIcon className="w-3.5 h-3.5 text-slate-500" />
                                            <span>Manage</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Feature list & Connected user info */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1 items-center">
                                    <div className="md:col-span-8 space-y-1.5">
                                        {[
                                            'Sync project start dates & deadlines to Google Calendar',
                                            'Automatic alarm and reminder notifications on your phone',
                                            'Background sync via cron job schedule',
                                            'Two-way sprint and task timeline monitoring',
                                        ].map((feat, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                                                <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" />
                                                <span>{feat}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="md:col-span-4 flex flex-col items-start md:items-end justify-center space-y-1">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-full bg-white dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] flex items-center justify-center shadow-2xs">
                                                <GoogleCalendarIcon className="w-4 h-4" />
                                            </div>
                                            <div className="text-left">
                                                <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-[150px]">
                                                    {integrations.googleCalendar?.account}
                                                </h4>
                                                <p className="text-[10px] text-slate-400">
                                                    ID: {integrations.googleCalendar?.calendarId || 'primary'}
                                                </p>
                                            </div>
                                        </div>
                                        <a
                                            href={integrations.googleCalendar?.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium pt-1"
                                        >
                                            <span>Open Calendar</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>

                                {/* Card Footer: Last Synced & Sync Now Button */}
                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                                    <span className="text-xs text-slate-400">
                                        Last synced: {integrations.googleCalendar?.lastSynced}
                                    </span>
                                    <button
                                        onClick={() => handleSync('googleCalendar', 'Google Calendar')}
                                        disabled={integrations.googleCalendar?.syncing}
                                        className="px-3 py-1 rounded-md border border-slate-200 dark:border-[#243e80] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors flex items-center gap-1.5 shadow-2xs disabled:opacity-60"
                                    >
                                        <RefreshCw
                                            className={`w-3.5 h-3.5 text-blue-500 ${
                                                integrations.googleCalendar?.syncing ? 'animate-spin' : ''
                                            }`}
                                        />
                                        <span>Sync Now</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column (4 cols): About Integrations, Recommended Setup, Need Help */}
                        <div className="lg:col-span-4 space-y-5">
                            {/* Card 1: About Integrations */}
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 shadow-xs space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                        <Puzzle className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                        About Integrations
                                    </h3>
                                </div>

                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Integrations help you connect WorkTrack with other tools you use, making it easier to manage your projects and showcase your work.
                                </p>

                                {/* Your Data is Safe Alert */}
                                <div className="bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/60 rounded-lg p-3.5 flex items-start gap-2.5">
                                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                                        <Info className="w-3 h-3 stroke-[2.5]" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="font-bold text-xs text-blue-900 dark:text-blue-200">
                                            Your data is safe
                                        </h4>
                                        <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
                                            We only access the data you authorize. You can disconnect anytime.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Recommended Setup */}
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 shadow-xs space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                                        <Rocket className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                            Recommended Setup
                                        </h3>
                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            Get the most out of WorkTrack with these integrations.
                                        </p>
                                    </div>
                                </div>

                                {/* Step List */}
                                <div className="space-y-3 pt-1">
                                    {[
                                        {
                                            step: 1,
                                            title: 'Connect GitHub',
                                            desc: 'Sync your repositories and commits.',
                                        },
                                        {
                                            step: 2,
                                            title: 'Connect Google Drive',
                                            desc: 'Store your project files and archives.',
                                        },
                                        {
                                            step: 3,
                                            title: 'Auto Cloud Sync',
                                            desc: 'Keep code repositories and project cloud files updated.',
                                        },
                                        {
                                            step: 4,
                                            title: 'Start building!',
                                            desc: 'Your workflow is now connected and streamlined.',
                                        },
                                    ].map((s) => (
                                        <div key={s.step} className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                                {s.step}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                                                    {s.title}
                                                </h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                    {s.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Card 3: Need Help? */}
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 shadow-xs space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                        <HelpCircle className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                        Need Help?
                                    </h3>
                                </div>

                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    If you encounter any issues with integrations, check out our documentation or contact support.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                                    <button
                                        onClick={() => window.open('https://docs.github.com', '_blank')}
                                        className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 bg-white dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] text-slate-700 dark:text-slate-200 rounded-md text-xs font-semibold hover:bg-slate-50 dark:hover:bg-[#182c66] transition-colors shadow-2xs"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                                        <span>View Documentation</span>
                                    </button>

                                    <button
                                        onClick={() => window.location.href = 'mailto:support@worktrack.dev'}
                                        className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 bg-white dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] text-slate-700 dark:text-slate-200 rounded-md text-xs font-semibold hover:bg-slate-50 dark:hover:bg-[#182c66] transition-colors shadow-2xs"
                                    >
                                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                                        <span>Contact Support</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ================================================================ */}
                {/* TAB 5: PREFERENCES */}
                {/* ================================================================ */}
                {activeTab === 'Preferences' && (
                    <div className="max-w-3xl space-y-6">
                        <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-6 shadow-xs space-y-5">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                                Preferensi Sistem & Notifikasi
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Bahasa Aplikasi
                                    </label>
                                    <CustomSelect
                                        value={preferences.language}
                                        onChange={(val) => {
                                            setPreferences({ ...preferences, language: val });
                                        }}
                                        options={[
                                            { value: 'id', label: 'Bahasa Indonesia' },
                                            { value: 'en', label: 'English (US)' },
                                        ]}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Zona Waktu
                                    </label>
                                    <CustomSelect
                                        value={preferences.timezone}
                                        onChange={(val) => {
                                            setPreferences({ ...preferences, timezone: val });
                                        }}
                                        options={[
                                            { value: 'Asia/Jakarta', label: 'Asia/Jakarta (WIB, GMT+7)' },
                                            { value: 'Asia/Makassar', label: 'Asia/Makassar (WITA, GMT+8)' },
                                            { value: 'Asia/Jayapura', label: 'Asia/Jayapura (WIT, GMT+9)' },
                                        ]}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Notifikasi
                                </h4>

                                {[
                                    {
                                        key: 'emailNotif',
                                        title: 'Pemberitahuan Email',
                                        desc: 'Kirim ringkasan mingguan proyek dan progres tugas ke email Anda.',
                                    },
                                    {
                                        key: 'taskReminders',
                                        title: 'Pengingat Deadline Tugas',
                                        desc: 'Ingatkan 24 jam sebelum tenggat waktu tugas berakhir.',
                                    },
                                ].map((n) => (
                                    <div
                                        key={n.key}
                                        className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800/40 last:border-b-0"
                                    >
                                        <div className="pr-4">
                                            <h5 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                                                {n.title}
                                            </h5>
                                            <p className="text-xs text-slate-400 mt-0.5">{n.desc}</p>
                                        </div>
                                        <Toggle
                                            checked={!!preferences[n.key]}
                                            onChange={(checked) => {
                                                setPreferences({
                                                    ...preferences,
                                                    [n.key]: checked,
                                                });
                                                triggerSave();
                                            }}
                                            ariaLabel={n.title}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end pt-3">
                                <button
                                    onClick={() => triggerSave('Preferensi berhasil disimpan!')}
                                    className="px-4 py-2 bg-[#2563eb] text-white rounded-md text-xs sm:text-sm font-semibold shadow-sm hover:bg-blue-600 transition-colors"
                                >
                                    Simpan Preferensi
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ================================================================ */}
            {/* MODAL: MANAGE INTEGRATION */}
            {/* ================================================================ */}
            {modalManage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Kelola Integrasi {modalManage === 'github' ? 'GitHub' : modalManage === 'googleDrive' ? 'Google Drive' : 'Google Calendar'}
                            </h3>
                            <button
                                onClick={() => setModalManage(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                            <p>
                                Akun terhubung: <strong className="text-slate-900 dark:text-white">{integrations[modalManage]?.account}</strong>
                            </p>
                            {modalManage === 'googleCalendar' && (
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Calendar Target: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{integrations.googleCalendar?.calendarId || 'primary'}</span>
                                </p>
                            )}
                            <p className="text-xs text-slate-400">
                                {modalManage === 'googleCalendar' 
                                    ? 'Sinkronisasi otomatis menyinkronkan tenggat waktu (deadline), sprint, dan milestone proyek ke kalender Google Anda.'
                                    : 'Sinkronisasi otomatis berjalan setiap 6 jam untuk memperbarui data repositori dan file cadangan.'}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={() => {
                                    setIntegrations((prev) => ({
                                        ...prev,
                                        [modalManage]: { ...prev[modalManage], connected: false },
                                    }));
                                    setModalManage(null);
                                    triggerSave('Integrasi berhasil diputus.');
                                }}
                                className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:underline"
                            >
                                Putuskan Koneksi
                            </button>
                            <button
                                onClick={() => setModalManage(null)}
                                className="px-4 py-1.5 bg-[#2563eb] text-white rounded-md text-xs font-semibold"
                            >
                                Selesai
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}

SettingsPage.layout = (page) => <DashboardLayout activePage="Settings">{page}</DashboardLayout>;
