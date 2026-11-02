@php
    $person = $portfolio['person'];
    $socials = $portfolio['socials'];
    $navigation = $portfolio['navigation'];
@endphp
<footer class="site-footer">
    <div class="container">
        <div class="footer__top">
            <div class="footer__brand">
                <a class="brand" href="#home" aria-label="{{ $person['name'] }} — home">
                    <span class="brand__mark" aria-hidden="true">{{ $person['initials'] }}</span>
                    <span class="brand__text">
                        <span class="brand__name">{{ $person['first_name'] }}</span>
                        <span class="brand__role">Portfolio</span>
                    </span>
                </a>
                <p>{{ $person['title'] }} building thoughtful, useful digital experiences from Bangued, Abra.</p>
                <div class="footer__socials">
                    @foreach ($socials as $social)
                        <a class="social-link" href="{{ $social['url'] }}" @if (str_starts_with($social['url'], 'http')) target="_blank" rel="noopener noreferrer" @endif aria-label="{{ $social['label'] }}">
                            <x-icon :name="$social['icon']" :size="18" />
                        </a>
                    @endforeach
                </div>
            </div>

            <div class="footer__column">
                <h3>Explore</h3>
                <ul>
                    @foreach ($navigation as $item)
                        <li><a href="#{{ $item['target'] }}">{{ $item['label'] }}</a></li>
                    @endforeach
                </ul>
            </div>

            <div class="footer__column">
                <h3>Get in touch</h3>
                <ul class="footer__contact">
                    <li>
                        <x-icon name="mail" :size="16" />
                        <a href="mailto:{{ $person['email'] }}">{{ $person['email'] }}</a>
                    </li>
                    <li>
                        <x-icon name="phone" :size="16" />
                        <a href="tel:{{ $person['phone_href'] }}">{{ $person['phone'] }}</a>
                    </li>
                    <li>
                        <x-icon name="map-pin" :size="16" />
                        <span>{{ $person['location'] }}</span>
                    </li>
                </ul>
            </div>

            <div class="footer__column footer__column--cta">
                <h3>Have an idea?</h3>
                <p>I am always open to a good conversation about technology, design, or a project worth building.</p>
                <a class="button button--small button--primary" href="#contact">
                    Start a conversation
                    <x-icon name="arrow-right" :size="15" />
                </a>
            </div>
        </div>

        <div class="footer__bottom">
            <p class="footer__copyright">&copy; {{ date('Y') }} {{ $person['name'] }}. All rights reserved.</p>
        </div>
    </div>
</footer>
