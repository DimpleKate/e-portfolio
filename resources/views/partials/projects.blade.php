@php
    $projects = $portfolio['projects'];
@endphp
<section class="section section--muted" id="projects" aria-labelledby="projects-title">
    <div class="container">
        <div class="section-head reveal">
            <div>
                <p class="eyebrow"><span class="eyebrow__line" aria-hidden="true"></span>{{ $projects['eyebrow'] }}</p>
                <h2 class="section-title" id="projects-title">
                    {{ $projects['heading'] }}
                    <span class="gradient-text">{{ $projects['heading_accent'] }}</span>
                </h2>
            </div>
            <p class="section-head__aside">{{ $projects['intro'] }}</p>
        </div>

        <div class="projects__grid" id="projectsGrid">
            @foreach ($projects['items'] as $project)
                <article class="project-card reveal" data-project-index="{{ $loop->index }}">
                    <div class="project-card__media">
                        <img
                            src="{{ $project['thumbnail_url'] }}"
                            alt="{{ $project['thumbnail_alt'] }}"
                            width="1200"
                            height="760"
                            loading="lazy"
                        >
                        <button
                            class="project-card__preview"
                            type="button"
                            data-gallery-open="{{ $loop->index }}"
                            aria-label="Open {{ $project['title'] }} screenshot gallery"
                        >
                            <x-icon name="eye" :size="18" />
                            <span>{{ count($project['images']) }} {{ Str::plural('screenshot', count($project['images'])) }}</span>
                        </button>
                    </div>

                    <div class="project-card__body">
                        <div class="project-card__meta">
                            <span>{{ $project['year'] }}</span>
                        </div>
                        <h3>{{ $project['title'] }}</h3>
                        <p>{!! nl2br(e($project['description'])) !!}</p>

                        <div class="tag-list">
                            @foreach ($project['technologies'] as $technology)
                                <span class="tag tag--small">{{ $technology }}</span>
                            @endforeach
                        </div>

                        <div class="project-card__actions">
                            <button class="button button--small button--outline" type="button" data-gallery-open="{{ $loop->index }}">
                                <x-icon name="eye" :size="15" />
                                Gallery
                            </button>

                            @if ($project['live_url'])
                                <a class="button button--small button--ghost" href="{{ $project['live_url'] }}" target="_blank" rel="noopener noreferrer">
                                    Live demo
                                    <x-icon name="external" :size="14" />
                                </a>
                            @endif

                            
                        </div>
                    </div>
                </article>
            @endforeach
        </div>
    </div>

    <div class="gallery-modal" id="galleryModal" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="galleryTitle">
        <div class="gallery-modal__backdrop" data-gallery-close></div>
        <div class="gallery-modal__dialog">
            <div class="gallery-modal__head">
                <div>
                    <p class="gallery-modal__eyebrow">Project gallery</p>
                    <h3 id="galleryTitle"></h3>
                </div>
                <button class="gallery-modal__close" type="button" data-gallery-close aria-label="Close gallery">
                    <x-icon name="close" :size="20" />
                </button>
            </div>

            <div class="gallery-modal__stage">
                <button class="gallery-modal__nav gallery-modal__nav--prev" id="galleryPrev" type="button" aria-label="Previous screenshot">
                    <x-icon name="chevron-left" :size="22" />
                </button>
                <figure class="gallery-modal__figure">
                    <img id="galleryImage" src="" alt="">
                    <figcaption id="galleryCaption"></figcaption>
                </figure>
                <button class="gallery-modal__nav gallery-modal__nav--next" id="galleryNext" type="button" aria-label="Next screenshot">
                    <x-icon name="chevron-right" :size="22" />
                </button>
            </div>

            <div class="gallery-modal__footer">
                <span class="gallery-modal__counter" id="galleryCounter"></span>
                <div class="gallery-modal__dots" id="galleryDots"></div>
                <span class="gallery-modal__hint">Swipe or use arrow keys</span>
            </div>
        </div>
    </div>

    <script type="application/json" id="projectGalleryData">
        {!! json_encode($projects['items'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}
    </script>
</section>
