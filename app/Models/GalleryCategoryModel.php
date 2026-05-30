<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GalleryCategoryModel extends Model
{
    protected $table = 'gallery_category';

    protected $fillable = [
        'name',
        'description',
        'slug',
    ];
}
