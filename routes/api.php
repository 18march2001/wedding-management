<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\GalleryCategoryController;
use App\Http\Controllers\API\GalleryController;

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    // Protected routes go here
    Route::post('/logout', [AuthController::class,'logout']);

    //Gallery categories
    Route::apiResource('gallery-categories', GalleryCategoryController::class);
    //Galleries
    Route::apiResource('galleries', GalleryController::class);
});