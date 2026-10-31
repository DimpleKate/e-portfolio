@php
    $contact = $portfolio['contact'];
    $person = $portfolio['person'];
    $socials = $portfolio['socials'];
@endphp
<section class="section" id="contact" aria-labelledby="contact-title">
    <div class="container">
        <div class="section-head reveal">
            <div>
                <p class="eyebrow"><span class="eyebrow__line" aria-hidden="true"></span>{{ $contact['eyebrow'] }}</p>
                <h2 class="section-title" id="contact-title">
                    {{ $contact['heading'] }}
                    <span class="gradient-text">{{ $contact['heading_accent'] }}</span>
                </h2>
            </div>
            <p class="section-head__aside">{{ $contact['intro'] }}</p>
        </div>

        <div class="contact__grid">
            <div class="contact__info reveal">
                <div class="contact-card">
                    <span class="contact-card__icon"><x-icon name="mail" :size="20" /></span>
                    <div>
                        <span class="contact-card__label">Email</span>
                        <a href="mailto:{{ $person['email'] }}">{{ $person['email'] }}</a>
                    </div>
                </div>

                <div class="contact-card">
                    <span class="contact-card__icon"><x-icon name="phone" :size="20" /></span>
                    <div>
                        <span class="contact-card__label">Phone</span>
                        <a href="tel:{{ $person['phone_href'] }}">{{ $person['phone'] }}</a>
                    </div>
                </div>

                <div class="contact-card">
                    <span class="contact-card__icon"><x-icon name="map-pin" :size="20" /></span>
                    <div>
                        <span class="contact-card__label">Location</span>
                        <span>{{ $person['location'] }}</span>
                    </div>
                </div>

                <div class="contact__socials">
                    <span class="contact-card__label">Elsewhere</span>
                    <div class="social-row">
                        @foreach ($socials as $social)
                            <a class="social-link" href="{{ $social['url'] }}" @if (str_starts_with($social['url'], 'http')) target="_blank" rel="noopener noreferrer" @endif aria-label="{{ $social['label'] }}">
                                <x-icon :name="$social['icon']" :size="18" />
                            </a>
                        @endforeach
                    </div>
                </div>

                <div class="contact__availability">
                    <span class="status-dot" aria-hidden="true"></span>
                    <p>{{ $person['availability'] }}</p>
                </div>
            </div>

            <div class="contact__form-wrap reveal">
                <div class="contact__form-head">
                    <h3>Send a message</h3>
                    <p>{{ $contact['note'] }}</p>
                </div>

                @if (session('contact_success'))
                    <div class="alert alert--success" role="status">
                        <x-icon name="check" :size="18" />
                        <span>{{ session('contact_success') }}</span>
                    </div>
                @endif

                @if ($errors->any())
                    <div class="alert alert--error" role="alert">
                        <x-icon name="close" :size="18" />
                        <span>Please check the highlighted fields and try again.</span>
                    </div>
                @endif

                <form class="contact-form" action="{{ route('contact.store') }}" method="POST">
                    @csrf

                    <div class="form-row">
                        <div class="form-field">
                            <label for="name">Your name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value="{{ old('name') }}"
                                placeholder="Juan Dela Cruz"
                                autocomplete="name"
                                required
                                minlength="2"
                                maxlength="80"
                                @error('name') aria-invalid="true" aria-describedby="name-error" @enderror
                            >
                            @error('name')
                                <span class="form-error" id="name-error">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="form-field">
                            <label for="email">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value="{{ old('email') }}"
                                placeholder="juan@example.com"
                                autocomplete="email"
                                required
                                maxlength="120"
                                @error('email') aria-invalid="true" aria-describedby="email-error" @enderror
                            >
                            @error('email')
                                <span class="form-error" id="email-error">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-field">
                        <label for="subject">Subject <span>(optional)</span></label>
                        <input
                            id="subject"
                            name="subject"
                            type="text"
                            value="{{ old('subject') }}"
                            placeholder="A project, an internship, or just a hello"
                            maxlength="120"
                            @error('subject') aria-invalid="true" aria-describedby="subject-error" @enderror
                        >
                        @error('subject')
                            <span class="form-error" id="subject-error">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="form-field">
                        <label for="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="6"
                            placeholder="Tell me a little about what you have in mind..."
                            required
                            minlength="10"
                            maxlength="4000"
                            @error('message') aria-invalid="true" aria-describedby="message-error" @enderror
                        >{{ old('message') }}</textarea>
                        @error('message')
                            <span class="form-error" id="message-error">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="form-honeypot" aria-hidden="true">
                        <label for="website">Website</label>
                        <input id="website" name="website" type="text" tabindex="-1" autocomplete="off">
                    </div>

                    <button class="button button--primary button--wide" type="submit">
                        <x-icon name="send" :size="17" />
                        Send message
                    </button>

                    <p class="contact-form__note">
                        Prefer email? Write to
                        <a href="mailto:{{ $person['email'] }}">{{ $person['email'] }}</a>.
                    </p>
                </form>
            </div>
        </div>
    </div>
</section>
