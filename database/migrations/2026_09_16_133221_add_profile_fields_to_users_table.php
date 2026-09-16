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
            $table->string('role')->nullable()->default('Full Stack Developer');
            $table->string('location')->nullable()->default('Indonesia');
            $table->text('bio')->nullable();
            $table->string('website')->nullable();
            $table->string('avatar')->nullable()->default('/images/avatar1.png');
            $table->text('about_short')->nullable();
            $table->text('signature')->nullable();
            $table->json('socials')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role',
                'location',
                'bio',
                'website',
                'avatar',
                'about_short',
                'signature',
                'socials',
            ]);
        });
    }
};
