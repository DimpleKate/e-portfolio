@php
    $meta = $portfolio['meta'];
    $person = $portfolio['person'];
    $socials = $portfolio['socials'];
    $cssVersion = file_exists(public_path('assets/css/style.css')) ? filemtime(public_path('assets/css/style.css')) : time();
    $jsVersion = file_exists(public_path('assets/js/main.js')) ? filemtime(public_path('assets/js/main.js')) : time();
    $gsapVersion = file_exists(public_path('assets/js/vendor/gsap.min.js')) ? filemtime(public_path('assets/js/vendor/gsap.min.js')) : time();
    $faviconVersion = file_exists(public_path('favicon.jpg')) ? filemtime(public_path('favicon.jpg')) : time();
@endphp
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ $meta['title'] }}</title>
    <meta name="description" content="{{ $meta['description'] }}">
    <meta name="keywords" content="{{ implode(', ', $meta['keywords']) }}">
    <meta name="author" content="{{ $person['name'] }}">
    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="{{ $meta['theme_color'] }}">
    <link rel="canonical" href="{{ url()->current() }}">

    <meta property="og:type" content="website">
    <meta property="og:site_name" content="{{ $person['name'] }}">
    <meta property="og:title" content="{{ $meta['title'] }}">
    <meta property="og:description" content="{{ $meta['description'] }}">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:image" content="{{ $meta['og_image_url'] }}">
    <meta property="og:image:alt" content="{{ $person['photo_alt'] }}">
    <meta property="og:locale" content="en_US">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $meta['title'] }}">
    <meta name="twitter:description" content="{{ $meta['description'] }}">
    <meta name="twitter:image" content="{{ $meta['og_image_url'] }}">

    <link rel="icon" href="{{ asset('favicon.jpg') }}?v={{ $faviconVersion }}" sizes="any" type="image/jpeg">
    <link rel="apple-touch-icon" href="{{ asset('favicon.jpg') }}?v={{ $faviconVersion }}">
    <link rel="manifest" href="{{ asset('site.webmanifest') }}?v={{ $faviconVersion }}">

    <link rel="preload" href="{{ asset('assets/manrope-latin.woff2') }}" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}?v={{ $cssVersion }}">

    <script>
        document.documentElement.classList.add('js');
    </script>

    <script type="application/ld+json">
        {!! json_encode([
            '@context' => 'https://schema.org',
            '@type' => 'Person',
            'name' => $person['name'],
            'jobTitle' => $person['title'],
            'description' => $meta['description'],
            'email' => 'mailto:'.$person['email'],
            'telephone' => $person['phone'],
            'url' => url('/'),
            'image' => $meta['og_image_url'],
            'address' => [
                '@type' => 'PostalAddress',
                'addressLocality' => 'Bangued',
                'addressRegion' => 'Abra',
                'addressCountry' => 'PH',
            ],
            'alumniOf' => [
                '@type' => 'CollegeOrUniversity',
                'name' => 'Data Center College of the Philippines',
            ],
            'sameAs' => collect($socials)
                ->pluck('url')
                ->filter(fn (string $url): bool => str_starts_with($url, 'http'))
                ->values()
                ->all(),
            'knowsAbout' => [
                'Web development',
                'Laravel',
                'PHP',
                'JavaScript',
                'UI design',
                'MySQL',
            ],
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) !!}
    </script>
</head>
<body>
    <a class="skip-link" href="#main-content">Skip to content</a>

    <div class="intro-loader" id="introLoader" aria-hidden="true">
        <div class="intro-loader__content">
            <div class="intro-loader__monogram" aria-label="DB">
                <span class="intro-loader__letter">D</span>
                <span class="intro-loader__letter">B</span>
            </div>
            <span class="intro-loader__line" aria-hidden="true"></span>
            <p class="intro-loader__tag">Portfolio</p>
        </div>
    </div>

    <div class="site-background" aria-hidden="true">
        <div class="site-background__grid"></div>
        <div class="site-background__glow site-background__glow--one"></div>
        <div class="site-background__glow site-background__glow--two"></div>
        <canvas class="site-background__stars" id="starfield" aria-hidden="true"></canvas>
        <div class="site-background__noise"></div>
    </div>

    <div class="scroll-progress" aria-hidden="true">
        <span class="scroll-progress__bar" id="scrollProgress"></span>
    </div>

    @include('partials.navbar')

    <main id="main-content">
        @yield('content')
    </main>

    @include('partials.footer')

    <button class="back-to-top" id="backToTop" type="button" aria-label="Back to top">
        <x-icon name="arrow-up" :size="18" />
    </button>

    <div class="lightbox" id="lightbox" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Certificate preview">
        <div class="lightbox__backdrop" data-lightbox-close></div>
        <div class="lightbox__dialog">
            <button class="lightbox__close" type="button" data-lightbox-close aria-label="Close preview">
                <x-icon name="close" :size="20" />
            </button>
            <div class="lightbox__media">
                <img id="lightboxImage" src="" alt="">
            </div>
            <div class="lightbox__footer">
                <p id="lightboxCaption"></p>
            </div>
        </div>
    </div>

    <script src="{{ asset('assets/js/vendor/gsap.min.js') }}?v={{ $gsapVersion }}" defer></script>
    <script src="{{ asset('assets/js/vendor/ScrollTrigger.min.js') }}?v={{ $gsapVersion }}" defer></script>
    <script src="{{ asset('assets/js/main.js') }}?v={{ $jsVersion }}" defer></script>
</body>
</html>
