@php
    $certificates = $portfolio['certificates'];
@endphp
<section class="section" id="certificates" aria-labelledby="certificates-title">
    <div class="container">
        <div class="section-head reveal">
            <div>
                <p class="eyebrow"><span class="eyebrow__line" aria-hidden="true"></span>{{ $certificates['eyebrow'] }}</p>
                <h2 class="section-title" id="certificates-title">
                    {{ $certificates['heading'] }}
                    <span class="gradient-text">{{ $certificates['heading_accent'] }}</span>
                </h2>
            </div>
            <p class="section-head__aside">{{ $certificates['intro'] }}</p>
        </div>

        <div class="certificates__grid">
            @foreach ($certificates['items'] as $certificate)
                <article class="certificate-card reveal">
                    <button
                        class="certificate-card__media"
                        type="button"
                        data-lightbox-trigger
                        data-full="{{ $certificate['image_url'] }}"
                        data-caption="{{ $certificate['title'] }} — {{ $certificate['issuer'] }} ({{ $certificate['date'] }})"
                        aria-label="Preview {{ $certificate['title'] }} certificate"
                    >
                        <img
                            src="{{ $certificate['image_url'] }}"
                            alt="{{ $certificate['image_alt'] }}"
                            width="1200"
                            height="900"
                            loading="lazy"
                        >
                        <span class="certificate-card__overlay">
                            <span class="certificate-card__preview">
                                <x-icon name="eye" :size="18" />
                                Preview
                            </span>
                        </span>
                        <span class="certificate-card__status {{ $certificate['status'] === 'Earned' ? 'certificate-card__status--earned' : '' }}">
                            {{ $certificate['status'] }}
                        </span>
                    </button>

                    <div class="certificate-card__body">
                        <div class="certificate-card__meta">
                            <span class="certificate-card__issuer">{{ $certificate['issuer'] }}</span>
                            <time class="certificate-card__date" datetime="{{ $certificate['date_iso'] }}">{{ $certificate['date'] }}</time>
                        </div>
                        <h3>{{ $certificate['title'] }}</h3>
                    </div>
                </article>
            @endforeach
        </div>
    </div>
</section>
