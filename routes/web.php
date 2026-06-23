<?php

use App\Http\Controllers\GalleryCategoryPageController;
use Illuminate\Support\Facades\Route;

Route::get('/php-version', function () {
    return PHP_VERSION;
});

// Category gallery page
Route::get('/gallery/{slug}', [GalleryCategoryPageController::class, 'show'])->name('gallery.category');
