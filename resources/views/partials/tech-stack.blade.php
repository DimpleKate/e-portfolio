@php
    $techStack = $portfolio['tech_stack'];
    $itemIcons = $techStack['item_icons'];
@endphp
<section class="section section--muted" id="tech-stack" aria-labelledby="tech-stack-title">
    <div class="container">
        <div class="section-head reveal">
            <div>
                <p class="eyebrow"><span class="eyebrow__line" aria-hidden="true"></span>{{ $techStack['eyebrow'] }}</p>
                <h2 class="section-title" id="tech-stack-title">
                    {{ $techStack['heading'] }}
                    <span class="gradient-text">{{ $techStack['heading_accent'] }}</span>
                </h2>
            </div>
            <p class="section-head__aside">{{ $techStack['intro'] }}</p>
        </div>

        <div class="skills__technical">
            @foreach ($techStack['groups'] as $group)
                <article class="skill-card reveal">
                    <div class="skill-card__icon">
                        <img
                            class="skill-card__logo"
                            src="{{ asset('assets/icons/tech/'.$group['logo'].'.svg') }}"
                            alt=""
                            width="24"
                            height="24"
                            loading="lazy"
                        >
                    </div>
                    <h3>{{ $group['title'] }}</h3>
                    <div class="tag-list">
                        @foreach ($group['items'] as $item)
                            @php
                                $itemMeta = $itemIcons[$item] ?? [];
                            @endphp
                            <span class="tag tag--small tag--tech">
                                @if (! empty($itemMeta['logo']))
                                    <img
                                        class="tag__logo"
                                        src="{{ asset('assets/icons/tech/'.$itemMeta['logo'].'.svg') }}"
                                        alt=""
                                        width="14"
                                        height="14"
                                        loading="lazy"
                                    >
                                @elseif (! empty($itemMeta['icon']))
                                    <x-icon :name="$itemMeta['icon']" :size="14" />
                                @endif
                                {{ $item }}
                            </span>
                        @endforeach
                    </div>
                </article>
            @endforeach
        </div>
    </div>
</section>
