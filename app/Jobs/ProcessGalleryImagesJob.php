<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Models\GalleryModel;
use Illuminate\Support\Facades\Storage;

class ProcessGalleryImagesJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public int $galleryId,
        public array $paths
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $gallery = GalleryModel::findOrFail($this->galleryId);

        foreach ($this->paths as $path) {

            $gallery->addMedia(
                storage_path('app/private/' . $path)
            )->toMediaCollection('gallery');

            Storage::delete($path);
        }

        $gallery->update([
            'status' => 'completed'
        ]);
    }
}
