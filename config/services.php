<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Resend, Postmark, AWS, and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'github' => [
        'client_id'     => env('GITHUB_CLIENT_ID'),
        'client_secret' => env('GITHUB_CLIENT_SECRET'),
        'redirect'      => env('GITHUB_REDIRECT_URI', 'http://localhost:8000/auth/github/callback'),
    ],

    'google_drive' => [
        'client_id' => env('GOOGLE_DRIVE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_DRIVE_CLIENT_SECRET'),
        'refresh_token' => env('GOOGLE_DRIVE_REFRESH_TOKEN'),
        'folder_id' => env('GOOGLE_DRIVE_FOLDER_ID'),
    ],

    'google_calendar' => [
        'client_id'     => env('GOOGLE_CALENDAR_CLIENT_ID', env('GOOGLE_DRIVE_CLIENT_ID')),
        'client_secret' => env('GOOGLE_CALENDAR_CLIENT_SECRET', env('GOOGLE_DRIVE_CLIENT_SECRET')),
        'refresh_token' => env('GOOGLE_CALENDAR_REFRESH_TOKEN', env('GOOGLE_DRIVE_REFRESH_TOKEN')),
        'calendar_id'   => env('GOOGLE_CALENDAR_ID', 'primary'),
        'ical_url'      => env('GOOGLE_CALENDAR_ICAL_URL'),
    ],

    'gemini' => [
        'key'   => env('GEMINI_API_KEY'),
        'model' => env('GEMINI_MODEL', 'gemini-3.7-flash'),
    ],

];
