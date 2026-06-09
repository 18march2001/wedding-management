<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\GalleryCategoryController;
use App\Http\Controllers\API\GalleryController;
use App\Http\Controllers\API\TestimonialController;
use App\Http\Controllers\API\TeamMemberController;
use App\Http\Controllers\API\VideoController;
use App\Http\Controllers\API\ContactController;
use App\Http\Controllers\API\WebsiteSettingsController;
use App\Http\Controllers\API\InquiryController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/inquiries', [InquiryController::class, 'store']);
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
    Route::get('/gallery-images/{id}', [GalleryController::class, 'getImagesById']);
    Route::put('/gallery-images/{mediaId}', [GalleryController::class, 'updateImage']);
    Route::delete('/gallery-images/{mediaId}', [GalleryController::class, 'deleteImage']);
    Route::apiResource('videos', VideoController::class);

    Route::get('/contact-settings', [ContactController::class, 'index']);
    Route::post('/contact-settings', [ContactController::class, 'update']);

    Route::prefix('settings')->group(function () {
        Route::get('/website', [WebsiteSettingsController::class, 'index']);
        Route::put('/website', [WebsiteSettingsController::class, 'update']);
        Route::post('/website/slider-images', [WebsiteSettingsController::class, 'uploadSliderImages']);
        Route::delete('/website/slider-images/{mediaId}', [WebsiteSettingsController::class, 'deleteSliderImage']);
    });

    Route::get('/inquiries', [InquiryController::class, 'index']);
    Route::get('/inquiries/{id}', [InquiryController::class, 'show']);
    Route::delete('/inquiries/{id}', [InquiryController::class, 'destroy']);
});