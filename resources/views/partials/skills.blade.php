@php
    $skills = $portfolio['skills'];
@endphp
<section class="section section--muted" id="skills" aria-labelledby="skills-title">
    <div class="container">
        <div class="section-head reveal">
            <div>
                <p class="eyebrow"><span class="eyebrow__line" aria-hidden="true"></span>{{ $skills['eyebrow'] }}</p>
                <h2 class="section-title" id="skills-title">
                    {{ $skills['heading'] }}
                    <span class="gradient-text">{{ $skills['heading_accent'] }}</span>
                </h2>
            </div>
            <p class="section-head__aside">{{ $skills['intro'] }}</p>
        </div>

        <div class="skills__grid">
            <div class="skills__technical">
                @foreach ($skills['technical'] as $group)
                    <article class="skill-card reveal">
                        <div class="skill-card__icon"><x-icon :name="$group['icon']" :size="21" /></div>
                        <h3>{{ $group['category'] }}</h3>
                        <div class="tag-list">
                            @foreach ($group['items'] as $item)
                                <span class="tag tag--small">{{ $item }}</span>
                            @endforeach
                        </div>
                    </article>
                @endforeach
            </div>

            <aside class="skills__professional reveal">
                <div class="skills__professional-head">
                    <span class="skills__professional-icon"><x-icon name="sparkle" :size="20" /></span>
                    <div>
                        <h3>{{ $skills['professional_title'] }}</h3>
                        <p>{{ $skills['professional_note'] }}</p>
                    </div>
                </div>

                <div class="skill-bars">
                    @foreach ($skills['professional'] as $skill)
                        <div class="skill-bar">
                            <div class="skill-bar__top">
                                <span>{{ $skill['label'] }}</span>
                                <span>{{ $skill['value'] }}%</span>
                            </div>
                            <div class="skill-bar__track">
                                <span class="skill-bar__fill" style="--skill-value: {{ $skill['value'] }}%"></span>
                            </div>
                        </div>
                    @endforeach
                </div>

                <div class="skills__note">
                    <x-icon name="check" :size="16" />
                    <span>Always learning, always improving.</span>
                </div>
            </aside>
        </div>
    </div>
</section>
