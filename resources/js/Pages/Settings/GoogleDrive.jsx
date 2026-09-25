import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Clock,
    Wifi,
    RefreshCw,
    ExternalLink,
    Eye,
    EyeOff,
    Copy,
    Check,
    Database,
    Key,
    AlertTriangle,
    Trash2,
} from 'lucide-react';

export default function GoogleDriveSettings({ drive, flash }) {
    const credentials = drive?.credentials || {};
    const tokenExpiry = drive?.tokenExpiry || {};

    const [form, setForm] = useState({
        client_id: credentials.client_id || '',
        client_secret: credentials.client_secret || '',
        refresh_token: credentials.refresh_token || '',
        folder_id: credentials.folder_id || '',
        expires_mode: credentials.expires_mode || 'testing',
    });

    const [showSecret, setShowSecret] = useState(false);
    const [saving, setSaving] = useState(false);
    const [testStatus, setTestStatus] = useState(null); // { loading, success, message }
    const [copiedField, setCopiedField] = useState(null);
    const [toastMessage, setToastMessage] = useState(flash?.message || null);
    const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);

    const handleCopy = (text, fieldName) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleSave = (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        router.post('/settings/integrations/google_drive', form, {
            preserveScroll: true,
            onSuccess: () => {
                setSaving(false);
                setTestStatus(null);
                setToastMessage('Kredensial Google Drive berhasil disimpan ke database!');
                setTimeout(() => setToastMessage(null), 4000);
            },
            onError: () => {
                setSaving(false);
                setToastMessage('Gagal menyimpan kredensial Google Drive.');
                setTimeout(() => setToastMessage(null), 4000);
            },
        });
    };

    const handleTestConnection = async () => {
        if (!form.client_id || !form.client_secret || !form.refresh_token) {
            setTestStatus({
                loading: false,
                success: false,
                message: 'Harap isi Client ID, Client Secret, dan Refresh Token terlebih dahulu.',
            });
            return;
        }

        setTestStatus({
            loading: true,
            success: null,
            message: 'Sedang menghubungi server otorisasi Google...',
        });

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const res = await fetch('/settings/integrations/google-drive/test-connection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    client_id: form.client_id,
                    client_secret: form.client_secret,
                    refresh_token: form.refresh_token,
                }),
            });

            const data = await res.json();
            setTestStatus({
                loading: false,
                success: data.success,
                message: data.message,
            });
        } catch {
            setTestStatus({
                loading: false,
                success: false,
                message: 'Gagal menghubungi server aplikasi. Periksa koneksi internet Anda.',
            });
        }
    };

    const handleDisconnect = () => {
        setDisconnecting(true);
        router.post('/settings/integrations/google_drive/disconnect', {}, {
            preserveScroll: true,
            onSuccess: () => {
                setDisconnecting(false);
                setIsDisconnectModalOpen(false);
                setForm({
                    client_id: '',
                    client_secret: '',
                    refresh_token: '',
                    folder_id: '',
                    expires_mode: 'testing',
                });
                setToastMessage('Koneksi Google Drive berhasil diputuskan.');
                setTimeout(() => setToastMessage(null), 4000);
            },
            onError: () => {
                setDisconnecting(false);
                setIsDisconnectModalOpen(false);
            },
        });
    };

    return (
        <>
            <Head title="Pengaturan Google Drive - WorkTrack" />

            {/* Notification Toast */}
            {toastMessage && (
                <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-semibold shadow-xl shadow-emerald-600/30 animate-in fade-in slide-in-from-top-3 duration-200">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{toastMessage}</span>
                </div>
            )}

            <div className="w-full space-y-6 pb-12">
                {/* Breadcrumb Navigation & Top Action */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <Link href="/" className="hover:text-blue-500 transition-colors">
                            Dashboard
                        </Link>
                        <span>&gt;</span>
                        <Link href="/settings" className="hover:text-blue-500 transition-colors">
                            Settings
                        </Link>
                        <span>&gt;</span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold">
                            Google Drive
                        </span>
                    </div>

                    <Link
                        href="/settings"
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#243e80] bg-white dark:bg-[#0c183b] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors shadow-2xs self-start sm:self-auto"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Kembali ke Settings</span>
                    </Link>
                </div>

                {/* Hero Header Card */}
                <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#0e1d47] border border-slate-200/80 dark:border-[#1e346e] p-6 sm:p-8 shadow-xs">
                    {/* Background Glow Effect */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-start gap-4 sm:gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-[#091333] border border-slate-200/80 dark:border-slate-800 flex items-center justify-center p-3.5 shadow-sm shrink-0">
                                <img
                                    src="/images/svg/google_drive.svg"
                                    alt="Google Drive"
                                    className="w-10 h-10 object-contain"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                        Pengaturan Google Drive
                                    </h1>
                                    {drive?.connected ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/60">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span>Terhubung</span>
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/60">
                                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                                            <span>Belum Terhubung</span>
                                        </span>
                                    )}

                                    {/* Mode Token Badge */}
                                    {drive?.connected && (
                                        tokenExpiry?.mode === 'permanent' ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-[#152758] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#243e80]">
                                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                                <span>Mode Permanen (In Production)</span>
                                            </span>
                                        ) : tokenExpiry?.isExpired ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/60 animate-pulse">
                                                <AlertCircle className="w-3.5 h-3.5" />
                                                <span>Token Kedaluwarsa</span>
                                            </span>
                                        ) : (
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                (tokenExpiry?.daysRemaining ?? 7) <= 2
                                                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60'
                                                    : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60'
                                            }`}>
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{tokenExpiry?.humanRemaining || `Sisa ${tokenExpiry?.daysRemaining} Hari`} (Mode Testing)</span>
                                            </span>
                                        )
                                    )}
                                </div>

                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                                    Konfigurasikan integrasi OAuth 2.0 untuk pencadangan otomatis database, penyimpanan arsip dokumen, serta sinkronisasi berkas projek Anda ke Google Cloud secara aman.
                                </p>
                            </div>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex items-center gap-3 shrink-0 self-start lg:self-center">
                            {drive?.url && (
                                <a
                                    href={drive.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#243e80] bg-white dark:bg-[#0c183b] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors shadow-2xs"
                                >
                                    <span>Buka Google Drive</span>
                                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Metric Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80">
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#091333]/70 border border-slate-100 dark:border-slate-800/70">
                            <span className="text-[11px] text-slate-400 font-medium">Akun Google</span>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate mt-0.5">
                                {drive?.account || 'ronismk7@gmail.com'}
                            </div>
                            <span className="text-[10px] text-slate-400">Personal Storage</span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#091333]/70 border border-slate-100 dark:border-slate-800/70">
                            <span className="text-[11px] text-slate-400 font-medium">Status Masa Aktif</span>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate mt-0.5">
                                {tokenExpiry?.mode === 'permanent'
                                    ? 'Permanen (In Production)'
                                    : tokenExpiry?.isExpired
                                    ? 'Kedaluwarsa'
                                    : tokenExpiry?.humanRemaining || 'Aktif'}
                            </div>
                            <span className="text-[10px] text-slate-400">
                                {tokenExpiry?.expiryDate ? `Exp: ${tokenExpiry.expiryDate}` : 'Tanpa batas kedaluwarsa'}
                            </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#091333]/70 border border-slate-100 dark:border-slate-800/70">
                            <span className="text-[11px] text-slate-400 font-medium">Folder Cadangan</span>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate mt-0.5 font-mono">
                                {drive?.folderId ? `${drive.folderId.substring(0, 16)}...` : 'Root Folder (Default)'}
                            </div>
                            <span className="text-[10px] text-slate-400">
                                {drive?.folderConfigured ? 'Terkonfigurasi Khusus' : 'Disimpan di Root Drive'}
                            </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#091333]/70 border border-slate-100 dark:border-slate-800/70">
                            <span className="text-[11px] text-slate-400 font-medium">Terakhir Disinkronkan</span>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate mt-0.5">
                                {drive?.lastSynced || 'Belum ada sinkronisasi'}
                            </div>
                            <span className="text-[10px] text-slate-400">Tersimpan di SQLite DB</span>
                        </div>
                    </div>
                </div>

                {/* Expiry Warning Alert (If Expired or Expiring Soon) */}
                {drive?.connected && tokenExpiry?.mode === 'testing' && (
                    tokenExpiry?.isExpired ? (
                        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3.5 text-rose-800 dark:text-rose-200">
                            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                            <div className="space-y-1 text-xs">
                                <h4 className="font-bold text-rose-900 dark:text-rose-100 text-sm">
                                    Token Refresh Google Drive Telah Kedaluwarsa
                                </h4>
                                <p className="leading-relaxed">
                                    Masa aktif 7 hari (mode testing) berakhir pada <strong>{tokenExpiry?.expiryDate}</strong>. Cadangan otomatis tidak akan berjalan hingga Anda memperbarui Refresh Token. Ikuti panduan di kolom kanan untuk mengambil token baru dan tempelkan di form bawah.
                                </p>
                            </div>
                        </div>
                    ) : (tokenExpiry?.daysRemaining ?? 7) <= 2 ? (
                        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3.5 text-amber-800 dark:text-amber-200">
                            <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <div className="space-y-1 text-xs">
                                <h4 className="font-bold text-amber-900 dark:text-amber-100 text-sm">
                                    Masa Aktif Token Segera Habis ({tokenExpiry?.humanRemaining})
                                </h4>
                                <p className="leading-relaxed">
                                    Token Anda akan kedaluwarsa pada <strong>{tokenExpiry?.expiryDate}</strong>. Anda dapat memperbarui token sebelum kedaluwarsa agar proses backup berjalan lancar tanpa kendala.
                                </p>
                            </div>
                        </div>
                    ) : null
                )}

                {/* Credentials Form & Test Connection Card (Full Width) */}
                <div className="w-full rounded-2xl bg-white dark:bg-[#0e1d47] border border-slate-200/80 dark:border-[#1e346e] p-6 sm:p-7 shadow-xs">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Key className="w-4 h-4 text-blue-500" />
                                <span>Konfigurasi Kredensial OAuth 2.0</span>
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Kredensial disimpan langsung ke database SQLite (tabel <code className="font-mono text-blue-600 dark:text-blue-400">integration_settings</code>).
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="space-y-5 pt-5">
                        {/* Informational Banner with Quick OAuth Playground Link */}
                        <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-900 dark:text-blue-200">
                            <div className="flex items-start gap-3">
                                <Database className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                    <span className="font-bold">Penyimpanan Dinamis Tanpa Edit .env</span>
                                    <p className="text-[11px] text-blue-700 dark:text-blue-300/80 leading-relaxed">
                                        Bila refresh token habis, Anda cukup copy-paste token baru di sini lalu klik Simpan. Sistem WorkTrack akan langsung menggunakannya.
                                    </p>
                                </div>
                            </div>
                            <a
                                href="https://developers.google.com/oauthplayground"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold transition-colors shrink-0 shadow-2xs self-start sm:self-auto"
                            >
                                <span>OAuth Playground</span>
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>

                        {/* 2-Column Inputs for Client ID & Client Secret */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Client ID */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                                        <span>Client ID</span>
                                        <span className="text-rose-500">*</span>
                                    </label>
                                    {form.client_id && (
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(form.client_id, 'client_id')}
                                            className="text-[11px] text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1 transition-colors cursor-pointer"
                                        >
                                            {copiedField === 'client_id' ? (
                                                <>
                                                    <Check className="w-3 h-3 text-emerald-500" />
                                                    <span className="text-emerald-500">Tersalin!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3 h-3" />
                                                    <span>Salin</span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={form.client_id}
                                    onChange={(e) => setForm({ ...form, client_id: e.target.value })}
                                    placeholder="xxxxxxxxxxxx-xxxxxxxxxxxxxxxx.apps.googleusercontent.com"
                                    className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-200 dark:border-[#243e80] bg-white dark:bg-[#0c183b] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-shadow"
                                    required
                                />
                                <p className="text-[11px] text-slate-400">
                                    Diperoleh dari Google Cloud Console &gt; APIs &amp; Services &gt; Credentials.
                                </p>
                            </div>

                            {/* Client Secret */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                                        <span>Client Secret</span>
                                        <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        {form.client_secret && (
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(form.client_secret, 'client_secret')}
                                                className="text-[11px] text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1 transition-colors cursor-pointer"
                                            >
                                                {copiedField === 'client_secret' ? (
                                                    <>
                                                        <Check className="w-3 h-3 text-emerald-500" />
                                                        <span className="text-emerald-500">Tersalin!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3 h-3" />
                                                        <span>Salin</span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showSecret ? 'text' : 'password'}
                                        value={form.client_secret}
                                        onChange={(e) => setForm({ ...form, client_secret: e.target.value })}
                                        placeholder="GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx"
                                        className="w-full px-3.5 py-2.5 pr-10 text-xs font-mono rounded-xl border border-slate-200 dark:border-[#243e80] bg-white dark:bg-[#0c183b] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-shadow"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowSecret(!showSecret)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer transition-colors"
                                        title={showSecret ? 'Sembunyikan' : 'Tampilkan'}
                                    >
                                        {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-[11px] text-slate-400">
                                    Kunci rahasia OAuth Google Client Secret.
                                </p>
                            </div>
                        </div>

                        {/* Refresh Token */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                                    <span>Refresh Token</span>
                                    <span className="text-rose-500">*</span>
                                </label>
                                {form.refresh_token && (
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(form.refresh_token, 'refresh_token')}
                                        className="text-[11px] text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1 transition-colors cursor-pointer"
                                    >
                                        {copiedField === 'refresh_token' ? (
                                            <>
                                                <Check className="w-3 h-3 text-emerald-500" />
                                                <span className="text-emerald-500">Tersalin!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3 h-3" />
                                                <span>Salin</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                            <textarea
                                rows={3}
                                value={form.refresh_token}
                                onChange={(e) => setForm({ ...form, refresh_token: e.target.value })}
                                placeholder="1//04xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-200 dark:border-[#243e80] bg-white dark:bg-[#0c183b] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-shadow leading-relaxed"
                                required
                            />
                            <p className="text-[11px] text-slate-400">
                                Menempelkan token baru akan otomatis mereset hitung mundur 7 hari dari tanggal hari ini.
                            </p>
                        </div>

                        {/* Mode Masa Aktif Token */}
                        <div className="space-y-2 pt-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                Mode Masa Aktif Token Refresh
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, expires_mode: 'testing' })}
                                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                                        form.expires_mode === 'testing'
                                            ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 ring-1 ring-blue-500 text-blue-800 dark:text-blue-200 shadow-xs'
                                            : 'border-slate-200 dark:border-[#243e80] bg-white dark:bg-[#0c183b] text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 font-bold text-xs">
                                        <Clock className={`w-4 h-4 ${form.expires_mode === 'testing' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                                        <span>Mode Testing (7 Hari)</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                                        Hitung mundur 7 hari otomatis dari waktu token disimpan. Cocok untuk aplikasi berstatus Testing di Google Cloud.
                                    </p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, expires_mode: 'permanent' })}
                                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                                        form.expires_mode === 'permanent'
                                            ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 ring-1 ring-blue-500 text-blue-800 dark:text-blue-200 shadow-xs'
                                            : 'border-slate-200 dark:border-[#243e80] bg-white dark:bg-[#0c183b] text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 font-bold text-xs">
                                        <Check className={`w-4 h-4 ${form.expires_mode === 'permanent' ? 'text-emerald-500' : 'text-slate-400'}`} />
                                        <span>Publish (Permanen)</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                                        Tidak ada batas waktu 7 hari. Pilih ini jika status OAuth Consent Screen di Google Cloud Console sudah "In Production".
                                    </p>
                                </button>
                            </div>
                        </div>

                        {/* Folder ID Cadangan */}
                        <div className="space-y-1.5 pt-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                Folder ID Cadangan (Opsional)
                            </label>
                            <input
                                type="text"
                                value={form.folder_id}
                                onChange={(e) => setForm({ ...form, folder_id: e.target.value })}
                                placeholder="1B2c3D4e5F6g7H8i9J0kL..."
                                className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-200 dark:border-[#243e80] bg-white dark:bg-[#0c183b] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-shadow"
                            />
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                ID folder Google Drive tempat file cadangan disimpan. Buka folder di browser, ambil kode di akhir URL: <span className="font-mono text-slate-500 dark:text-slate-300">drive.google.com/drive/folders/<strong>[ID_FOLDER]</strong></span>. Kosongkan untuk simpan di root Drive.
                            </p>
                        </div>

                        {/* Test Connection Area */}
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#091333]/80 border border-slate-200/80 dark:border-[#1e346e] space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                        <Wifi className="w-3.5 h-3.5 text-blue-500" />
                                        <span>Uji Koneksi Langsung ke Server Google</span>
                                    </h4>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        Pastikan token valid sebelum Anda menyimpan data.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleTestConnection}
                                    disabled={testStatus?.loading}
                                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
                                >
                                    {testStatus?.loading ? (
                                        <>
                                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                            <span>Menguji...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Wifi className="w-3.5 h-3.5" />
                                            <span>Test Koneksi</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Test Result Message */}
                            {testStatus && !testStatus.loading && (
                                <div className={`p-3 rounded-lg text-xs font-medium border flex items-start gap-2.5 animate-in fade-in duration-150 ${
                                    testStatus.success
                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                                        : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                                }`}>
                                    {testStatus.success ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                    ) : (
                                        <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                    )}
                                    <div className="space-y-0.5">
                                        <span className="font-bold">
                                            {testStatus.success ? 'Koneksi Berhasil!' : 'Koneksi Gagal:'}
                                        </span>
                                        <p className="text-[11px] leading-relaxed opacity-95">
                                            {testStatus.message}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Form Footer Action Buttons */}
                        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-5 border-t border-slate-100 dark:border-slate-800">
                            {drive?.connected ? (
                                <button
                                    type="button"
                                    onClick={() => setIsDisconnectModalOpen(true)}
                                    className="px-3.5 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:underline cursor-pointer flex items-center justify-center sm:justify-start gap-1.5 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Putuskan Koneksi</span>
                                </button>
                            ) : (
                                <div />
                            )}

                            <div className="flex items-center gap-2.5">
                                <Link
                                    href="/settings"
                                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl border border-slate-200 dark:border-[#243e80] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors text-center cursor-pointer"
                                >
                                    Batal
                                </Link>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 sm:flex-initial px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {saving ? (
                                        <>
                                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                            <span>Menyimpan...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                            <span>Simpan Kredensial</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Disconnect Confirmation Modal */}
            {isDisconnectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="w-full max-w-md bg-white dark:bg-[#0e1d47] rounded-2xl border border-slate-200 dark:border-[#1e346e] p-6 shadow-2xl space-y-4">
                        <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
                            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Putuskan Koneksi Google Drive?
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Tindakan ini akan menghapus kredensial dari SQLite.
                                </p>
                            </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            Pencadangan otomatis dan integrasi penyimpanan awan akan terhenti sampai Anda menghubungkannya kembali dengan kredensial baru.
                        </p>

                        <div className="flex items-center justify-end gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsDisconnectModalOpen(false)}
                                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#243e80] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleDisconnect}
                                disabled={disconnecting}
                                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                                {disconnecting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                                <span>Ya, Putuskan</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

GoogleDriveSettings.layout = (page) => (
    <DashboardLayout activePage="Settings">
        {page}
    </DashboardLayout>
);
