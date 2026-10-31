<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;

class ContactController extends Controller
{
    /**
     * Validate and deliver a portfolio contact message without using a database.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:80'],
            'email' => ['required', 'email:rfc', 'max:120'],
            'subject' => ['nullable', 'string', 'max:120'],
            'message' => ['required', 'string', 'min:10', 'max:4000'],
            'website' => ['prohibited'],
        ], [
            'website.prohibited' => 'Your message could not be sent. Please try again.',
        ]);

        $rateLimitKey = 'portfolio-contact:'.$request->ip();

        if (RateLimiter::tooManyAttempts($rateLimitKey, 3)) {
            $seconds = RateLimiter::availableIn($rateLimitKey);

            return back()
                ->withInput()
                ->withErrors([
                    'message' => "Please wait {$seconds} seconds before sending another message.",
                ]);
        }

        RateLimiter::hit($rateLimitKey, 300);

        $subject = ($validated['subject'] ?? null) ?: 'New message from your portfolio';

        $body = implode("\n", [
            'New portfolio contact message',
            '------------------------------',
            'Name: '.$validated['name'],
            'Email: '.$validated['email'],
            'Subject: '.$subject,
            '',
            $validated['message'],
        ]);

        try {
            Mail::raw($body, static function ($message) use ($validated, $subject): void {
                $message
                    ->to(config('portfolio.person.email'))
                    ->replyTo($validated['email'], $validated['name'])
                    ->subject($subject);
            });
        } catch (\Throwable $exception) {
            Log::error('Portfolio contact form delivery failed.', [
                'message' => $exception->getMessage(),
            ]);

            return back()
                ->withInput()
                ->withErrors([
                    'message' => 'The message could not be delivered right now. Please email me directly instead.',
                ]);
        }

        Log::info('Portfolio contact form submitted.', [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $subject,
        ]);

        return back()->with('contact_success', 'Thank you! Your message has been sent successfully.');
    }
}
