<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'description',
        'category',
        'project_type',
        'status',
        'tech_stack',
        'images',
        'github_repo_id',
        'github_repo_name',
        'github_repo_url',
        'live_url',
        'start_date',
        'due_date',
    ];

    protected $casts = [
        'tech_stack' => 'array',
        'images'     => 'array',
        'start_date' => 'date:Y-m-d',
        'due_date'   => 'date:Y-m-d',
    ];

    /**
     * Get the user who owns this project.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
