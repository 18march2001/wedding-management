<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\GalleryCategoryController;
use App\Http\Controllers\API\GalleryController;
use App\Http\Controllers\API\TestimonialController;
use App\Http\Controllers\API\TeamMemberController;
use App\Http\Controllers\API\VideoController;

Route::post('/login', [AuthController::class, 'login']);
Route::apiResource('galleries', GalleryController::class)
    ->only(['index', 'show']);
Route::apiResource('team-members', TeamMemberController::class)
    ->only(['index', 'show']);
Route::middleware('auth:sanctum')->group(function () {
    // Protected routes go here
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    //Gallery categories
    Route::apiResource('gallery-categories', GalleryCategoryController::class);
    //Galleries
    Route::apiResource('galleries', GalleryController::class)->except(['index', 'show']);
    //Testimonials
    Route::apiResource('testimonials', TestimonialController::class);
    //Team Members
    Route::apiResource('team-members', TeamMemberController::class)->only(['store', 'update', 'destroy']);

    Route::post('/galleries/add-images', [GalleryController::class, 'addImages']);
    Route::apiResource('videos', VideoController::class);

    Route::post('/contacts', [ContactController::class, 'update']);
});