<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class GalleryModel extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $table = 'galleries';

    protected $fillable = [
        'id',
        'gallery_category_id',
        'title',
        'slug',
        'location',
        'event_date',
    ];

    public function category()
    {
        return $this->belongsTo(GalleryCategoryModel::class, 'gallery_category_id');
    }
}
