<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome/Index', ['initialSection' => 'home']);
})->name('home');

Route::get('/about', function () {
    return Inertia::render('Welcome/Index', ['initialSection' => 'about']);
})->name('about');

Route::get('/experience', function () {
    return Inertia::render('Welcome/Index', ['initialSection' => 'experience']);
})->name('experience');

Route::get('/contact', function () {
    return Inertia::render('Welcome/Index', ['initialSection' => 'contact']);
})->name('contact');

use App\Http\Controllers\AuthController;

Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.attempt');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard/Index');
})->name('dashboard');

use App\Http\Controllers\ProjectController;

Route::get('/projects', [ProjectController::class, 'index'])->name('projects');
Route::get('/projects/create', [ProjectController::class, 'create'])->name('projects.create');
Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
Route::get('/projects/github/repositories', [ProjectController::class, 'getGitHubRepositories'])->name('projects.github.repos');
Route::get('/projects/github/collaborators', [ProjectController::class, 'getGitHubCollaborators'])->name('projects.github.collaborators');
Route::get('/projects/{id}/edit', [ProjectController::class, 'edit'])->name('projects.edit');
Route::post('/projects/{id}', [ProjectController::class, 'update'])->name('projects.update');
Route::delete('/projects/{id}', [ProjectController::class, 'destroy'])->name('projects.destroy');
Route::get('/projects/{slug}', [ProjectController::class, 'show'])->name('projects.show');

use App\Http\Controllers\TaskController;

Route::get('/tasks', [TaskController::class, 'index'])->name('tasks');
Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
Route::post('/tasks/{task}/update', [TaskController::class, 'update'])->name('tasks.update');
Route::post('/tasks/{task}/toggle', [TaskController::class, 'toggle'])->name('tasks.toggle');
Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');

use App\Http\Controllers\NoteController;

Route::get('/notes', [NoteController::class, 'index'])->name('notes');
Route::post('/notes', [NoteController::class, 'store'])->name('notes.store');
Route::post('/notes/{note}/update', [NoteController::class, 'update'])->name('notes.update');
Route::delete('/notes/{note}', [NoteController::class, 'destroy'])->name('notes.destroy');

use App\Http\Controllers\CalendarController;

Route::get('/calendar', [CalendarController::class, 'index'])->name('calendar');
Route::post('/calendar/sync', [CalendarController::class, 'sync'])->name('calendar.sync');

use App\Http\Controllers\ArchiveController;

Route::get('/archive', [ArchiveController::class, 'index'])->name('archive');
Route::post('/archive', [ArchiveController::class, 'store'])->name('archive.store');
Route::delete('/archive/{id}', [ArchiveController::class, 'destroy'])->name('archive.destroy');

Route::get('/portfolio', function () {
    return Inertia::render('Portfolio/Index');
})->name('portfolio');

use App\Http\Controllers\SettingsController;

Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
Route::post('/settings/profile', [SettingsController::class, 'updateProfile'])->name('settings.profile.update');
Route::post('/settings/profile/avatar', [SettingsController::class, 'uploadAvatar'])->name('settings.profile.avatar');

use App\Http\Controllers\GitHubController;

Route::get('/auth/github', [GitHubController::class, 'redirect'])->name('github.redirect');
Route::get('/auth/github/callback', [GitHubController::class, 'callback'])->name('github.callback');
Route::post('/auth/github/disconnect', [GitHubController::class, 'disconnect'])->name('github.disconnect');
