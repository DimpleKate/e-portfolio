<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactTest extends TestCase
{
    public function test_valid_contact_message_is_delivered(): void
    {
        Mail::shouldReceive('raw')
            ->once()
            ->withArgs(static function (string $body): bool {
                return str_contains($body, 'Test Visitor')
                    && str_contains($body, 'visitor@example.com')
                    && str_contains($body, 'I would like to discuss a project.');
            });

        $response = $this->from('/')->post('/contact', [
            'name' => 'Test Visitor',
            'email' => 'visitor@example.com',
            'subject' => 'Project inquiry',
            'message' => 'I would like to discuss a project.',
        ]);

        $response->assertRedirect('/');
        $response->assertSessionHas('contact_success');
        $response->assertSessionHasNoErrors();
    }

    public function test_invalid_contact_message_returns_validation_errors(): void
    {
        Mail::shouldReceive('raw')->never();

        $response = $this->from('/')->post('/contact', [
            'name' => 'A',
            'email' => 'not-an-email',
            'message' => 'short',
        ]);

        $response->assertRedirect('/');
        $response->assertSessionHasErrors(['name', 'email', 'message']);
    }

    public function test_honeypot_submissions_are_rejected(): void
    {
        Mail::shouldReceive('raw')->never();

        $response = $this->from('/')->post('/contact', [
            'name' => 'Spam Bot',
            'email' => 'bot@example.com',
            'message' => 'This message should never be delivered.',
            'website' => 'https://spam.example.com',
        ]);

        $response->assertRedirect('/');
        $response->assertSessionHasErrors('website');
    }

    public function test_contact_messages_are_rate_limited(): void
    {
        Mail::shouldReceive('raw')->times(3);

        $payload = [
            'name' => 'Test Visitor',
            'email' => 'visitor@example.com',
            'message' => 'A legitimate message for the portfolio owner.',
        ];

        for ($attempt = 0; $attempt < 3; $attempt++) {
            $this->from('/')->post('/contact', $payload)->assertSessionHas('contact_success');
        }

        $this->from('/')
            ->post('/contact', $payload)
            ->assertSessionHasErrors('message');
    }
}
