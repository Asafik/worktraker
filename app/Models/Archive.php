<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Archive extends Model
{
    protected $fillable = [
        'name',
        'project_name',
        'category',
        'file_name',
        'file_type',
        'size',
        'size_bytes',
        'google_drive_file_id',
        'google_drive_view_link',
        'google_drive_download_link',
        'description',
        'notes',
        'tags',
    ];

    protected $casts = [
        'tags' => 'array',
    ];
}
