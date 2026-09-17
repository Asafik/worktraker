<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete()->after('id');
            $table->string('name')->after('user_id');
            $table->string('slug')->unique()->after('name');
            $table->text('description')->nullable()->after('slug');
            $table->string('category')->default('Web Development')->after('description');
            $table->string('project_type')->default('Solo')->after('category'); // 'Solo' or 'Team'
            $table->string('status')->default('In Progress')->after('project_type'); // 'Not Started', 'In Progress', 'Completed', 'On Hold'
            $table->json('tech_stack')->nullable()->after('status'); // e.g. ["PHP", "Laravel", "React"]
            $table->json('images')->nullable()->after('tech_stack'); // array of image paths (max 4)
            $table->string('github_repo_id')->nullable()->after('images');
            $table->string('github_repo_name')->nullable()->after('github_repo_id'); // e.g. "Ilhamrsdi/sakip"
            $table->string('github_repo_url')->nullable()->after('github_repo_name');
            $table->string('live_url')->nullable()->after('github_repo_url');
            $table->date('start_date')->nullable()->after('live_url');
            $table->date('due_date')->nullable()->after('start_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn([
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
            ]);
        });
    }
};
