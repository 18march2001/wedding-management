<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactModel extends Model
{
    protected $table = 'contacts';

    protected $fillable = [
        'id',
        'phone_number',
        'whatsapp_number',
        'email',
        'address',
        'business_hours',
        'facebook_url',
        'instagram_url',
    ];
}
