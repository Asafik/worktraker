<?php

namespace App\Http\Controllers;

use App\Services\GoogleCalendarService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CalendarController extends Controller
{
    protected GoogleCalendarService $calendarService;

    public function __construct(GoogleCalendarService $calendarService)
    {
        $this->calendarService = $calendarService;
    }

    /**
     * Display the calendar page with real Google Calendar events.
     */
    public function index(): Response
    {
        $events = $this->calendarService->getEvents();
        $isCalendarConnected = !empty(config('services.google_calendar.ical_url'));

        return Inertia::render('Calendar/Index', [
            'googleEvents' => $events,
            'isCalendarConnected' => $isCalendarConnected,
            'calendarEmail' => 'ronismk7@gmail.com',
        ]);
    }

    /**
     * Force refresh/sync calendar events from Google Calendar.
     */
    public function sync(Request $request): JsonResponse|RedirectResponse
    {
        $events = $this->calendarService->getEvents(true);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'events' => $events,
                'message' => 'Calendar successfully synced with Google Calendar.',
            ]);
        }

        return back()->with('success', 'Calendar successfully synced.');
    }
}
