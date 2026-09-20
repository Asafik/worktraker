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
            $table->boolean('is_portfolio')->default(false)->after('due_date');
            $table->boolean('is_featured')->default(false)->after('is_portfolio');
            $table->integer('portfolio_order')->default(0)->after('is_featured');
            $table->string('portfolio_cover')->nullable()->after('portfolio_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['is_portfolio', 'is_featured', 'portfolio_order', 'portfolio_cover']);
        });
    }
};
