<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IntegrationSetting extends Model
{
    protected $fillable = [
        'service',
        'credentials',
        'is_connected',
        'last_synced_at',
    ];

    protected $casts = [
        'credentials' => 'array',
        'is_connected' => 'boolean',
        'last_synced_at' => 'datetime',
    ];

    /**
     * Retrieve all credentials for a service with fallback to config.
     */
    public static function getCredentials(string $service, array $fallback = []): array
    {
        $setting = static::where('service', $service)->first();
        if ($setting && is_array($setting->credentials) && !empty($setting->credentials)) {
            return array_merge($fallback, $setting->credentials);
        }

        return $fallback;
    }

    /**
     * Retrieve a specific credential value with fallback.
     */
    public static function getValue(string $service, string $key, mixed $fallback = null): mixed
    {
        $credentials = static::getCredentials($service);
        if (isset($credentials[$key]) && $credentials[$key] !== '' && $credentials[$key] !== null) {
            return $credentials[$key];
        }

        return $fallback;
    }

    /**
     * Store or update credentials for a given service.
     */
    public static function setCredentials(string $service, array $credentials, ?bool $isConnected = null): self
    {
        $setting = static::firstOrNew(['service' => $service]);

        // Merge existing credentials with new ones
        $mergedCredentials = array_merge((array) ($setting->credentials ?? []), $credentials);
        $setting->credentials = $mergedCredentials;

        if ($isConnected !== null) {
            $setting->is_connected = $isConnected;
        }

        $setting->save();

        return $setting;
    }
}
