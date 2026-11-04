@php
    $person = $portfolio['person'];
    $navigation = $portfolio['navigation'];
@endphp
<header class="site-header" id="siteHeader">
    <nav class="navbar container" aria-label="Primary navigation">
        <a class="brand" href="#home" aria-label="{{ $person['name'] }} — home">
        </a>

        <div class="navbar__links" id="navLinks">
            @foreach ($navigation as $item)
                <a class="nav-link" href="#{{ $item['target'] }}" data-section="{{ $item['target'] }}">{{ $item['label'] }}</a>
            @endforeach
        </div>

        <div class="navbar__actions">
            <button class="menu-toggle" id="menuToggle" type="button" aria-expanded="false" aria-controls="navLinks" aria-label="Open navigation menu">
                <span class="menu-toggle__line"></span>
                <span class="menu-toggle__line"></span>
                <span class="menu-toggle__line"></span>
            </button>
        </div>
    </nav>
</header>
