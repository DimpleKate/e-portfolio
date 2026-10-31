<?php

namespace App\Http\Controllers;

use Illuminate\Support\Carbon;
use Illuminate\View\View;

class PortfolioController extends Controller
{
    /**
     * Render the single-page portfolio with asset URLs resolved.
     */
    public function index(): View
    {
        $portfolio = config('portfolio');

        $portfolio['person']['photo_url'] = asset($portfolio['person']['photo']);
        $portfolio['person']['cv_url'] = asset($portfolio['person']['cv']);
        $portfolio['meta']['og_image_url'] = asset($portfolio['meta']['og_image']);

        $portfolio['certificates']['items'] = collect($portfolio['certificates']['items'])
            ->map(static function (array $certificate): array {
                $date = Carbon::parse($certificate['date']);

                $certificate['image_url'] = asset($certificate['image']);
                $certificate['date'] = $date->format('F Y');
                $certificate['date_iso'] = $date->format('Y-m');
                $certificate['date_timestamp'] = $date->getTimestamp();

                return $certificate;
            })
            ->sortByDesc('date_timestamp')
            ->values()
            ->all();

        $portfolio['projects']['items'] = array_map(
            static function (array $project): array {
                $project['thumbnail_url'] = asset('assets/images/'.$project['thumbnail']);
                $project['images'] = array_map(
                    static fn (string $image): array => [
                        'src' => asset('assets/images/'.$image),
                        'alt' => $project['title'].' — screenshot',
                        'caption' => $project['title'],
                    ],
                    $project['images']
                );

                return $project;
            },
            $portfolio['projects']['items']
        );

        return view('portfolio', [
            'portfolio' => $portfolio,
        ]);
    }
}
