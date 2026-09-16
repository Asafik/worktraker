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
        Schema::create('archives', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('project_name')->nullable();
            $table->string('category')->default('Project'); // Project, Backup, Other
            $table->string('file_name');
            $table->string('file_type')->nullable(); // ZIP, PDF, etc.
            $table->string('size')->nullable(); // e.g. '24 MB'
            $table->unsignedBigInteger('size_bytes')->default(0);
            $table->string('google_drive_file_id')->nullable();
            $table->string('google_drive_view_link')->nullable();
            $table->string('google_drive_download_link')->nullable();
            $table->text('description')->nullable();
            $table->text('notes')->nullable();
            $table->json('tags')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('archives');
    }
};
