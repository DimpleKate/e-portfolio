@php
    $person = $portfolio['person'];
    $hero = $portfolio['hero'];
    $socials = $portfolio['socials'];
    $certificateStat = collect($portfolio['about']['stats'])->firstWhere('label', 'Certificates earned');
@endphp
<section class="hero section" id="home" aria-labelledby="hero-title">
    <div class="container hero__inner">
        <div class="hero__copy">
            <p class="eyebrow reveal">
                <span class="status-dot" aria-hidden="true"></span>
                {{ $hero['eyebrow'] }}
            </p>

            <h1 class="hero__title reveal" id="hero-title">
                {{ $hero['headline'] }}
                <span class="gradient-text">{{ $hero['headline_accent'] }}</span>
            </h1>

            <p class="hero__intro reveal">{{ $hero['intro'] }}</p>

            <div class="hero__actions reveal">
                <a class="button button--primary" href="#projects">
                    {{ $hero['primary_cta'] }}
                    <x-icon name="arrow-right" :size="17" />
                </a>
                <a class="button button--outline" href="{{ $person['cv_url'] }}" download="{{ $person['cv_name'] }}">
                    <x-icon name="download" :size="17" />
                    {{ $hero['secondary_cta'] }}
                </a>
            </div>

            <div class="hero__meta reveal">
                <span class="hero__meta-item">
                    <x-icon name="map-pin" :size="15" />
                    Bangued, Abra
                </span>
                <span class="hero__meta-divider" aria-hidden="true"></span>
                <span class="hero__meta-item hero__meta-item--available">
                    <span class="status-dot status-dot--small" aria-hidden="true"></span>
                    {{ $person['availability'] }}
                </span>
            </div>

            <div class="hero__socials reveal">
                <span class="hero__socials-label">Find me online</span>
                <div class="social-row">
                    @foreach ($socials as $social)
                        <a class="social-link" href="{{ $social['url'] }}" @if (str_starts_with($social['url'], 'http')) target="_blank" rel="noopener noreferrer" @endif aria-label="{{ $social['label'] }}">
                            <x-icon :name="$social['icon']" :size="18" />
                        </a>
                    @endforeach
                </div>
            </div>
        </div>

        <div class="hero__visual reveal">
            <div class="hero__portrait-wrap">
                <div class="hero__orbit hero__orbit--one" aria-hidden="true"></div>
                <div class="hero__orbit hero__orbit--two" aria-hidden="true"></div>

                <div class="hero__portrait">
                    <img
                        src="{{ $person['photo_url'] }}"
                        alt="{{ $person['photo_alt'] }}"
                        width="720"
                        height="880"
                        fetchpriority="high"
                    >
                    <div class="hero__portrait-shine" aria-hidden="true"></div>
                </div>

                <div class="floating-card floating-card--top">
                    <span class="floating-card__icon"><x-icon name="code" :size="18" /></span>
                    <span>
                        <strong>Laravel + PHP</strong>
                        <small>Building for the web</small>
                    </span>
                </div>

                <div class="floating-card floating-card--bottom">
                    <span class="floating-card__icon"><x-icon name="graduation" :size="18" /></span>
                    <span>
                        <strong>BS Information Technology</strong>
                        <small>Data Center College</small>
                    </span>
                </div>

                <div class="floating-card floating-card--side">
                    <span class="floating-card__icon"><x-icon name="sparkle" :size="18" /></span>
                    <span>
                        <strong>{{ $certificateStat['value'] ?? '12' }} Certificates</strong>
                        <small>Earned so far</small>
                    </span>
                </div>

                <div class="hero__badge" aria-hidden="true">
                    <span>Open</span>
                    <span>to work</span>
                </div>
            </div>
        </div>
    </div>

    <a class="scroll-cue" href="#about" aria-label="Scroll to about section">
        <span class="scroll-cue__line" aria-hidden="true"></span>
        <span>Scroll to explore</span>
    </a>
</section>
