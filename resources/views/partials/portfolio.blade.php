@php
    $portfolioSection = $portfolio['portfolio'];
    $portfolioTabs = $portfolioSection['tabs'];
@endphp
<section class="section" id="portfolio" aria-labelledby="portfolio-title">
    <div class="container">
        <div class="section-head reveal">
            <div>
                <p class="eyebrow"><span class="eyebrow__line" aria-hidden="true"></span>{{ $portfolioSection['eyebrow'] }}</p>
                <h2 class="section-title" id="portfolio-title">
                    {{ $portfolioSection['heading'] }}
                    <span class="gradient-text">{{ $portfolioSection['heading_accent'] }}</span>
                </h2>
            </div>
            <p class="section-head__aside">{{ $portfolioSection['intro'] }}</p>
        </div>

        <div class="portfolio-tabs" role="tablist" aria-label="Portfolio sections">
            @foreach ($portfolioTabs as $tab)
                <button
                    class="portfolio-tab{{ $loop->first ? ' is-active' : '' }}"
                    id="tab-{{ $tab['target'] }}"
                    type="button"
                    role="tab"
                    aria-selected="{{ $loop->first ? 'true' : 'false' }}"
                    aria-controls="panel-{{ $tab['target'] }}"
                    tabindex="{{ $loop->first ? '0' : '-1' }}"
                    data-portfolio-tab="{{ $tab['target'] }}"
                >
                    {{ $tab['label'] }}
                </button>
            @endforeach
        </div>

        @foreach ($portfolioTabs as $tab)
            <div
                class="portfolio-panel{{ $loop->first ? ' is-active' : '' }}"
                id="panel-{{ $tab['target'] }}"
                role="tabpanel"
                aria-labelledby="tab-{{ $tab['target'] }}"
                data-portfolio-panel="{{ $tab['target'] }}"
                @if (! $loop->first) hidden @endif
            >
                @include('partials.'.$tab['partial'])
            </div>
        @endforeach
    </div>
</section>
