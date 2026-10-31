@props(['name', 'size' => 20])

@php
    $brandIcons = ['github', 'facebook', 'discord'];
    $isBrand = in_array($name, $brandIcons, true);
@endphp

<svg
    {{ $attributes->merge([
        'width' => $size,
        'height' => $size,
        'viewBox' => '0 0 24 24',
        'fill' => $isBrand ? 'currentColor' : 'none',
        'stroke' => $isBrand ? 'none' : 'currentColor',
        'stroke-width' => $isBrand ? null : '1.8',
        'stroke-linecap' => 'round',
        'stroke-linejoin' => 'round',
        'aria-hidden' => 'true',
    ]) }}
>
    @switch($name)
        @case('github')
            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z"/>
            @break
        @case('facebook')
            <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.95h-1.52c-1.49 0-1.96.93-1.96 1.89v2.27h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z"/>
            @break
        @case('discord')
            <path d="M20.32 4.37A19.79 19.79 0 0 0 15.89 3c-.19.33-.4.77-.55 1.12a18.27 18.27 0 0 0-5.47 0c-.15-.35-.36-.79-.55-1.12a19.74 19.74 0 0 0-4.44 1.37C2.06 8.59 1.3 12.85 1.68 17.05a19.9 19.9 0 0 0 5.46 2.76c.44-.61.84-1.25 1.18-1.93-.65-.24-1.27-.54-1.87-.88.16-.12.31-.24.46-.36 3.61 1.7 7.53 1.7 11.1 0 .15.12.3.24.46.36-.6.34-1.23.64-1.87.88.34.68.73 1.32 1.18 1.93a19.89 19.89 0 0 0 5.46-2.76c.45-4.86-.76-9.08-3.42-12.68ZM8.02 15.33c-1.09 0-1.98-.99-1.98-2.2s.88-2.2 1.98-2.2c1.1 0 2 .99 1.98 2.2 0 1.21-.88 2.2-1.98 2.2Zm7.96 0c-1.09 0-1.98-.99-1.98-2.2s.88-2.2 1.98-2.2c1.1 0 2 .99 1.98 2.2 0 1.21-.88 2.2-1.98 2.2Z"/>
            @break
        @case('mail')
            <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>
            @break
        @case('phone')
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>
            @break
        @case('map-pin')
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/>
            @break
        @case('wifi')
            <path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.55a11 11 0 0 1 14 0"/><path d="M8.5 16.05a6 6 0 0 1 7 0"/><path d="M12 20h.01"/>
            @break
        @case('download')
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>
            @break
        @case('arrow-up-right')
            <path d="M7 17 17 7"/><path d="M7 7h10v10"/>
            @break
        @case('arrow-right')
            <path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>
            @break
        @case('arrow-left')
            <path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>
            @break
        @case('arrow-up')
            <path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>
            @break
        @case('chevron-left')
            <path d="m15 18-6-6 6-6"/>
            @break
        @case('chevron-right')
            <path d="m9 18 6-6-6-6"/>
            @break
        @case('close')
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            @break
        @case('menu')
            <path d="M4 6h16M4 12h16M4 18h16"/>
            @break
        @case('code')
            <path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>
            @break
        @case('server')
            <rect x="2" y="3" width="20" height="7" rx="2"/><rect x="2" y="14" width="20" height="7" rx="2"/><path d="M6 6.5h.01M6 17.5h.01"/>
            @break
        @case('layers')
            <path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>
            @break
        @case('sparkle')
            <path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/>
            @break
        @case('graduation')
            <path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/><path d="M22 10v6"/>
            @break
        @case('certificate')
            <circle cx="12" cy="8" r="6"/><path d="m8.2 12.9-1.2 8.1 5-3 5 3-1.2-8.1"/>
            @break
        @case('briefcase')
            <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            @break
        @case('external')
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/>
            @break
        @case('eye')
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>
            @break
        @case('calendar')
            <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
            @break
        @case('check')
            <path d="m20 6-11 11-5-5"/>
            @break
        @case('send')
            <path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/>
            @break
        @case('menu-alt')
            <path d="M4 5h16M4 12h16M4 19h16"/>
            @break
        @default
            <circle cx="12" cy="12" r="9"/>
    @endswitch
</svg>
