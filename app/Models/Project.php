<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'description',
        'category',
        'company_name',
        'ownership_type',
        'role',
        'project_type',
        'team_size',
        'team_members',
        'status',
        'tech_stack',
        'images',
        'github_repo_id',
        'github_repo_name',
        'github_repo_url',
        'hide_github_link',
        'live_url',
        'start_date',
        'due_date',
        'is_portfolio',
        'is_featured',
        'portfolio_order',
        'portfolio_cover',
    ];

    protected $casts = [
        'team_size'         => 'integer',
        'team_members'      => 'array',
        'tech_stack'        => 'array',
        'images'            => 'array',
        'hide_github_link'  => 'boolean',
        'start_date'        => 'date:Y-m-d',
        'due_date'          => 'date:Y-m-d',
        'is_portfolio'      => 'boolean',
        'is_featured'       => 'boolean',
        'portfolio_order'   => 'integer',
    ];

    protected $appends = [
        'cover_image_url',
    ];

    /**
     * Automatically get the primary thumbnail cover: custom cover or first image from project images.
     */
    public function getCoverImageUrlAttribute(): string
    {
        if (!empty($this->portfolio_cover)) {
            return $this->portfolio_cover;
        }

        if (!empty($this->images) && is_array($this->images) && count($this->images) > 0 && !empty($this->images[0])) {
            return $this->images[0];
        }

        // Gambar default bebas (proj1 - proj4) jika belum ada foto di proyek
        $defaultImages = [
            '/images/proj1.png',
            '/images/proj2.png',
            '/images/proj3.png',
            '/images/proj4.png',
        ];

        return $defaultImages[abs($this->id ?? 1) % count($defaultImages)];
    }

    /**
     * Get the user who owns this project.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the tasks associated with this project.
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Get the notes associated with this project.
     */
    public function notes(): HasMany
    {
        return $this->hasMany(Note::class);
    }
}
