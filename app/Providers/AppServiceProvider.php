<?php

namespace App\Providers;

use App\Repositories\GalleryCategoryRepository;
use App\Repositories\Interfaces\GalleryCategoryRepositoryInterface;
use App\Repositories\GalleryRepository;
use App\Repositories\Interfaces\GalleryRepositoryInterface;
use Illuminate\Support\ServiceProvider;
use App\Repositories\TestimonialRepository;
use App\Repositories\Interfaces\TestimonialRepositoryInterface;
use App\Repositories\TeamMemberRepository;
use App\Repositories\Interfaces\TeamMemberRepositoryInterface;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(GalleryCategoryRepositoryInterface::class, GalleryCategoryRepository::class);
        $this->app->bind(GalleryRepositoryInterface::class, GalleryRepository::class);
        $this->app->bind(TestimonialRepositoryInterface::class, TestimonialRepository::class);
        $this->app->bind(TeamMemberRepositoryInterface::class, TeamMemberRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
