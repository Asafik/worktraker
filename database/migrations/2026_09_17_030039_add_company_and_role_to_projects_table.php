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
            $table->string('company_name')->nullable()->after('category');
            $table->string('ownership_type')->default('Company')->after('company_name');
            $table->string('role')->nullable()->default('Frontend Developer')->after('ownership_type');
            $table->boolean('hide_github_link')->default(false)->after('github_repo_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['company_name', 'ownership_type', 'role', 'hide_github_link']);
        });
    }
};
