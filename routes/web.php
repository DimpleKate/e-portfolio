<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\PortfolioController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PortfolioController::class, 'index'])->name('home');

Route::get('/speedtest/payload', static function () {
    $bytes = 512 * 1024;
    $chunkSize = 64 * 1024;

    return response()->stream(static function () use ($bytes, $chunkSize): void {
        for ($sent = 0; $sent < $bytes; $sent += $chunkSize) {
            echo random_bytes(min($chunkSize, $bytes - $sent));
        }
    }, 200, [
        'Content-Type' => 'application/octet-stream',
        'Content-Length' => (string) $bytes,
        'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma' => 'no-cache',
        'X-Content-Type-Options' => 'nosniff',
    ]);
})->name('speedtest.payload');

Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

Route::get('/sitemap.xml', static function () {
    return response()
        ->view('sitemap')
        ->header('Content-Type', 'application/xml; charset=UTF-8');
})->name('sitemap');

Route::get('/robots.txt', static function () {
    $content = "User-agent: *\nAllow: /\n\nSitemap: ".url('/sitemap.xml')."\n";

    return response($content, 200, ['Content-Type' => 'text/plain; charset=UTF-8']);
})->name('robots');
