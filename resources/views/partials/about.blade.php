@php
    $about = $portfolio['about'];
    $person = $portfolio['person'];
@endphp
<section class="section section--muted" id="about" aria-labelledby="about-title">
    <div class="container">
        <div class="section-head reveal">
            <div>
                <p class="eyebrow"><span class="eyebrow__line" aria-hidden="true"></span>{{ $about['eyebrow'] }}</p>
                <h2 class="section-title" id="about-title">
                    {{ $about['heading'] }}
                    <span class="gradient-text">{{ $about['heading_accent'] }}</span>
                </h2>
            </div>
            <p class="section-head__aside">A little context about who I am, how I work, and what I am working toward.</p>
        </div>

        <div class="about__grid">
            <div class="about__visual reveal">
                <div class="about__image-card">
                    <img
                        src="{{ asset('assets/images/about.jpg') }}"
                        alt="{{ $person['photo_alt'] }}"
                        width="720"
                        height="880"
                        loading="lazy"
                    >
                    <div class="about__image-tag">
                        <span class="about__image-tag-label">Based in</span>
                        <strong>Bangued, Abra</strong>
                    </div>
                </div>

                <div class="about__stats">
                    @foreach ($about['stats'] as $stat)
                        <div class="stat">
                            <strong>{{ $stat['value'] }}</strong>
                            <span>{{ $stat['label'] }}</span>
                        </div>
                    @endforeach
                </div>
            </div>

            <div class="about__content reveal">
                <div class="about__bio">
                    @foreach ($about['paragraphs'] as $paragraph)
                        <p>{{ $paragraph }}</p>
                    @endforeach
                </div>

                <div class="about__objective">
                    <span class="about__objective-icon"><x-icon name="sparkle" :size="18" /></span>
                    <div>
                        <h3>{{ $about['objective_title'] }}</h3>
                        <p>{{ $about['objective'] }}</p>
                    </div>
                </div>

                <div class="about__interests">
                    <h3>{{ $about['interests_title'] }}</h3>
                    <div class="tag-list">
                        @foreach ($about['interests'] as $interest)
                            <span class="tag">{{ $interest }}</span>
                        @endforeach
                    </div>
                </div>

                <div class="about__strengths">
                    @foreach ($about['strengths'] as $strength)
                        <div class="strength">
                            <span class="strength__dot" aria-hidden="true"></span>
                            <div>
                                <h4>{{ $strength['title'] }}</h4>
                                <p>{{ $strength['text'] }}</p>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
</section>
