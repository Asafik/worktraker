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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard/Index');
})->name('dashboard');

Route::get('/projects', function () {
    return Inertia::render('Projects/Index');
})->name('projects');

Route::get('/projects/{slug}', function ($slug) {
    return Inertia::render('Projects/Detail', ['slug' => $slug]);
})->name('projects.show');

Route::get('/tasks', function () {
    return Inertia::render('Tasks/Index');
})->name('tasks');

Route::get('/notes', function () {
    return Inertia::render('Notes/Index');
})->name('notes');

Route::get('/calendar', function () {
    return Inertia::render('Calendar/Index');
})->name('calendar');

Route::get('/archive', function () {
    return Inertia::render('Archive/Index');
})->name('archive');

Route::get('/portfolio', function () {
    return Inertia::render('Portfolio/Index');
})->name('portfolio');

Route::get('/settings', function () {
    return Inertia::render('Settings/Index');
})->name('settings');

