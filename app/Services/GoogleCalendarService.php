<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GoogleCalendarService
{
    protected ?string $icalUrl;

    public function __construct()
    {
        $this->icalUrl = \App\Models\IntegrationSetting::getValue('google_calendar', 'ical_url')
            ?: config('services.google_calendar.ical_url');
    }

    /**
     * Get parsed events from Google Calendar iCal feed.
     *
     * @param bool $forceRefresh
     * @return array
     */
    public function getEvents(bool $forceRefresh = false): array
    {
        if (empty($this->icalUrl)) {
            return [];
        }

        $cacheKey = 'google_calendar_ical_events';

        if ($forceRefresh) {
            Cache::forget($cacheKey);
        }

        return Cache::remember($cacheKey, now()->addMinutes(10), function () {
            return $this->fetchAndParse();
        });
    }

    /**
     * Fetch iCal stream and parse into structured array.
     */
    protected function fetchAndParse(): array
    {
        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'User-Agent' => 'WorkTrack-Calendar-Sync/1.0',
                ])
                ->get($this->icalUrl);

            if (!$response->successful()) {
                Log::warning('Google Calendar iCal fetch failed', [
                    'status' => $response->status(),
                ]);
                return [];
            }

            $rawIcs = $response->body();
            return $this->parseIcs($rawIcs);
        } catch (\Throwable $e) {
            Log::error('Google Calendar iCal exception: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Parse RFC 5545 iCalendar data.
     */
    public function parseIcs(string $rawIcs): array
    {
        // Unfold RFC 5545 lines (continuation lines begin with a space or tab)
        $unfolded = preg_replace("/\r\n[ \t]|\r[ \t]|\n[ \t]/", '', $rawIcs);

        preg_match_all('/BEGIN:VEVENT([\s\S]*?)END:VEVENT/', $unfolded, $matches);

        if (empty($matches[1])) {
            return [];
        }

        $events = [];

        foreach ($matches[1] as $eventBlock) {
            $parsed = $this->parseEventBlock($eventBlock);
            if ($parsed) {
                $events[] = $parsed;
            }
        }

        // Sort events chronologically
        usort($events, function ($a, $b) {
            return strcmp($a['dateTimeStart'] ?? $a['date'], $b['dateTimeStart'] ?? $b['date']);
        });

        return $events;
    }

    /**
     * Parse individual VEVENT block.
     */
    protected function parseEventBlock(string $block): ?array
    {
        // Extract Summary
        preg_match('/^SUMMARY:(.*)$/m', $block, $summaryMatch);
        $rawSummary = trim($summaryMatch[1] ?? '');
        $summary = $this->unescapeIcs($rawSummary);

        if (empty($summary)) {
            $summary = '(Untitled Event)';
        }

        // Extract UID
        preg_match('/^UID:(.*)$/m', $block, $uidMatch);
        $uid = trim($uidMatch[1] ?? md5($block));

        // Extract Description
        preg_match('/^DESCRIPTION:(.*)$/m', $block, $descMatch);
        $description = $this->unescapeIcs(trim($descMatch[1] ?? ''));

        // Extract Location
        preg_match('/^LOCATION:(.*)$/m', $block, $locMatch);
        $location = $this->unescapeIcs(trim($locMatch[1] ?? ''));

        // Extract Status
        preg_match('/^STATUS:(.*)$/m', $block, $statusMatch);
        $status = strtoupper(trim($statusMatch[1] ?? 'CONFIRMED'));
        if ($status === 'CANCELLED') {
            return null;
        }

        // Extract DTSTART
        preg_match('/^DTSTART(?:;([^:]+))?:(.*)$/m', $block, $startMatch);
        $startParams = $startMatch[1] ?? '';
        $startValue = trim($startMatch[2] ?? '');

        // Extract DTEND
        preg_match('/^DTEND(?:;([^:]+))?:(.*)$/m', $block, $endMatch);
        $endParams = $endMatch[1] ?? '';
        $endValue = trim($endMatch[2] ?? '');

        if (empty($startValue)) {
            return null;
        }

        $startDate = $this->parseIcsDateTime($startValue, $startParams);
        $endDate = !empty($endValue) ? $this->parseIcsDateTime($endValue, $endParams) : null;

        if (!$startDate) {
            return null;
        }

        $isAllDay = (str_contains($startParams, 'VALUE=DATE') || strlen($startValue) === 8);

        if ($isAllDay) {
            $timeFormatted = 'All Day';
        } else {
            $timeFormatted = $startDate->format('H:i');
            if ($endDate && $endDate->gt($startDate)) {
                $timeFormatted .= ' - ' . $endDate->format('H:i');
            }
        }

        $isMeeting = (stripos($summary, 'meeting') !== false || stripos($summary, 'meet') !== false || stripos($summary, 'zoom') !== false);
        $isDeadline = (stripos($summary, 'deadline') !== false || stripos($summary, 'due') !== false);

        if ($isMeeting) {
            $dot = 'bg-amber-500';
            $bg = 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/40';
            $type = 'Meeting';
        } elseif ($isDeadline) {
            $dot = 'bg-rose-500';
            $bg = 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/40';
            $type = 'Deadline';
        } else {
            $dot = 'bg-blue-500';
            $bg = 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40';
            $type = 'Google Calendar';
        }

        return [
            'id' => $uid,
            'title' => $summary,
            'fullTitle' => $summary,
            'date' => $startDate->format('Y-m-d'),
            'dateTimeStart' => $startDate->toIso8601String(),
            'dateTimeEnd' => $endDate ? $endDate->toIso8601String() : null,
            'year' => (int) $startDate->format('Y'),
            'month' => (int) $startDate->format('n'),
            'day' => (int) $startDate->format('j'),
            'time' => $timeFormatted,
            'isAllDay' => $isAllDay,
            'location' => $location,
            'description' => $description,
            'dot' => $dot,
            'bg' => $bg,
            'type' => $type,
            'source' => 'google_calendar',
            'isRoutine' => false,
        ];
    }

    /**
     * Parse date/time string from iCalendar into Carbon in Asia/Jakarta.
     */
    protected function parseIcsDateTime(string $value, string $params = ''): ?Carbon
    {
        $tz = 'Asia/Jakarta';

        // All-day date (e.g. 20231215)
        if (preg_match('/^(\d{4})(\d{2})(\d{2})$/', $value, $m)) {
            return Carbon::createFromDate((int)$m[1], (int)$m[2], (int)$m[3], $tz)->startOfDay();
        }

        // UTC timestamp (e.g. 20240221T040000Z)
        if (preg_match('/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/', $value, $m)) {
            $utc = Carbon::create((int)$m[1], (int)$m[2], (int)$m[3], (int)$m[4], (int)$m[5], (int)$m[6], 'UTC');
            return $utc->setTimezone($tz);
        }

        // Local timestamp without Z (e.g. 20220517T073000)
        if (preg_match('/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/', $value, $m)) {
            if (preg_match('/TZID=([^;]+)/', $params, $tzMatch)) {
                $eventTz = $tzMatch[1];
                try {
                    $dt = Carbon::create((int)$m[1], (int)$m[2], (int)$m[3], (int)$m[4], (int)$m[5], (int)$m[6], $eventTz);
                    return $dt->setTimezone($tz);
                } catch (\Throwable $e) {
                    // fallback to default tz
                }
            }
            return Carbon::create((int)$m[1], (int)$m[2], (int)$m[3], (int)$m[4], (int)$m[5], (int)$m[6], $tz);
        }

        return null;
    }

    /**
     * Unescape iCal text.
     */
    protected function unescapeIcs(string $text): string
    {
        $text = str_replace(['\\,', '\\;', '\\\\'], [',', ';', '\\'], $text);
        $text = str_replace(['\\n', '\\N'], "\n", $text);
        return trim($text);
    }
}
