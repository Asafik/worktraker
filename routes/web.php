<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

Route::get('/projects', function () {
    return Inertia::render('Projects');
})->name('projects');

Route::get('/tasks', function () {
    return Inertia::render('Tasks');
})->name('tasks');

Route::get('/notes', function () {
    return Inertia::render('Notes');
})->name('notes');

Route::get('/calendar', function () {
    return Inertia::render('Calendar');
})->name('calendar');

Route::get('/archive', function () {
    return Inertia::render('Archive');
})->name('archive');

Route::get('/portfolio', function () {
    return Inertia::render('Portfolio');
})->name('portfolio');

Route::get('/settings', function () {
    return Inertia::render('Settings');
})->name('settings');

