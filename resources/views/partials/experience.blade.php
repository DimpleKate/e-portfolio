@php
    $experience = $portfolio['experience'];
@endphp
<section class="section" id="experience" aria-labelledby="experience-title">
    <div class="container">
        <div class="section-head reveal">
            <div>
                <p class="eyebrow"><span class="eyebrow__line" aria-hidden="true"></span>{{ $experience['eyebrow'] }}</p>
                <h2 class="section-title" id="experience-title">
                    {{ $experience['heading'] }}
                    <span class="gradient-text">{{ $experience['heading_accent'] }}</span>
                </h2>
            </div>
            <p class="section-head__aside">{{ $experience['intro'] }}</p>
        </div>

        <div class="experience__grid">
            <div class="timeline">
                @foreach ($experience['items'] as $item)
                    <article class="timeline__item reveal">
                        <div class="timeline__marker" aria-hidden="true">
                            <span class="timeline__dot"></span>
                        </div>
                        <div class="timeline__card">
                            <div class="timeline__top">
                                <span class="timeline__period">{{ $item['period'] }}</span>
                                @if ($item['current'])
                                    <span class="badge badge--accent">Current</span>
                                @endif
                            </div>
                            <h3>{{ $item['role'] }}</h3>
                            <p class="timeline__institution">{{ $item['organization'] }}</p>
                            <p class="timeline__description">{{ $item['description'] }}</p>
                        </div>
                    </article>
                @endforeach
            </div>

            <aside class="snapshot reveal" aria-labelledby="experience-snapshot-title">
                <div class="snapshot__icon"><x-icon name="briefcase" :size="22" /></div>
                <h3 id="experience-snapshot-title">{{ $experience['snapshot_title'] }}</h3>
                <dl class="snapshot__list">
                    @foreach ($experience['snapshot_items'] as $item)
                        <div class="snapshot__row">
                            <dt>{{ $item['label'] }}</dt>
                            <dd>{{ $item['value'] }}</dd>
                        </div>
                    @endforeach
                </dl>
                <a class="text-link" href="#contact">
                    Let's work together
                    <x-icon name="arrow-right" :size="15" />
                </a>
            </aside>
        </div>
    </div>
</section>
