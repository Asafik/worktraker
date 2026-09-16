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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'github_id')) {
                $table->string('github_id')->nullable();
            }
            if (!Schema::hasColumn('users', 'github_username')) {
                $table->string('github_username')->nullable();
            }
            if (!Schema::hasColumn('users', 'github_avatar')) {
                $table->string('github_avatar')->nullable();
            }
            if (!Schema::hasColumn('users', 'github_token')) {
                $table->string('github_token')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumnIfExists('github_id');
            $table->dropColumnIfExists('github_username');
            $table->dropColumnIfExists('github_avatar');
            $table->dropColumnIfExists('github_token');
        });
    }
};
