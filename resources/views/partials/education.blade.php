@php
    $education = $portfolio['education'];
@endphp
<section class="section" id="education" aria-labelledby="education-title">
    <div class="container">
        <div class="section-head reveal">
            <div>
                <p class="eyebrow"><span class="eyebrow__line" aria-hidden="true"></span>{{ $education['eyebrow'] }}</p>
                <h2 class="section-title" id="education-title">
                    {{ $education['heading'] }}
                    <span class="gradient-text">{{ $education['heading_accent'] }}</span>
                </h2>
            </div>
            <p class="section-head__aside">{{ $education['intro'] }}</p>
        </div>

        <div class="education__grid">
            <div class="timeline">
                @foreach ($education['items'] as $item)
                    <article class="timeline__item reveal">
                        <div class="timeline__marker" aria-hidden="true">
                            <span class="timeline__dot"></span>
                        </div>
                        <div class="timeline__card">
                            <div class="timeline__top">
                                <span class="timeline__period">{{ $item['period'] }}</span>
                                @if ($item['current'])
                                    <span class="badge badge--accent">In progress</span>
                                @endif
                            </div>
                            <h3>{{ $item['degree'] }}</h3>
                            <p class="timeline__institution">{{ $item['institution'] }} <span aria-hidden="true">·</span> {{ $item['location'] }}</p>
                            <p class="timeline__description">{{ $item['description'] }}</p>
                        </div>
                    </article>
                @endforeach
            </div>

            <aside class="snapshot reveal" aria-labelledby="snapshot-title">
                <div class="snapshot__icon"><x-icon name="graduation" :size="22" /></div>
                <h3 id="snapshot-title">{{ $education['snapshot_title'] }}</h3>
                <dl class="snapshot__list">
                    @foreach ($education['snapshot_items'] as $item)
                        <div class="snapshot__row">
                            <dt>{{ $item['label'] }}</dt>
                            <dd>{{ $item['value'] }}</dd>
                        </div>
                    @endforeach
                </dl>
                <a class="text-link" href="#contact">
                    Let's talk about my journey
                    <x-icon name="arrow-right" :size="15" />
                </a>
            </aside>
        </div>
    </div>
</section>
