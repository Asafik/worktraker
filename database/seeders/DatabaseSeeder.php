<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'asafik.dev@gmail.com'],
            [
                'name' => 'Asafik',
                'password' => bcrypt('password'),
                'role' => 'Full Stack Developer',
                'location' => 'Indonesia',
                'bio' => 'I build modern web applications and turn ideas into reality. Focused on clean code, simple design, and meaningful impact.',
                'website' => 'https://asafik.dev',
                'avatar' => '/images/avatar1.png',
                'about_short' => 'Web developer with a passion for building useful applications. Always learning and exploring new technologies.',
                'signature' => "Best regards,\nAsafik",
                'socials' => [
                    'github' => 'https://github.com/asafik',
                    'linkedin' => 'https://linkedin.com/in/asafik',
                    'website' => 'https://asafik.dev',
                    'x' => '',
                    'instagram' => '',
                    'facebook' => '',
                ],
            ]
        );
    }
}
