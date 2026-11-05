(() => {
    'use strict';

    const body = document.body;
    const header = document.getElementById('siteHeader');
    const progressBar = document.getElementById('scrollProgress');
    const backToTop = document.getElementById('backToTop');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinkItems = Array.from(document.querySelectorAll('.nav-link'));
    const sections = Array.from(document.querySelectorAll('main > section[id]'));
    const revealItems = Array.from(document.querySelectorAll('.reveal'));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lockScroll = () => {
        body.style.overflow = 'hidden';
    };

    const unlockScroll = () => {
        body.style.overflow = '';
    };

    /* ---------------------------------------------------------------------
       Header, progress, and back-to-top
    --------------------------------------------------------------------- */
    let ticking = false;

    const updateScrollUI = () => {
        const scrollTop = window.scrollY;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? Math.min((scrollTop / scrollable) * 100, 100) : 0;

        header?.classList.toggle('is-scrolled', scrollTop > 20);
        backToTop?.classList.toggle('is-visible', scrollTop > 600);

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        ticking = false;
    };

    const requestScrollUpdate = () => {
        if (!ticking) {
            window.requestAnimationFrame(updateScrollUI);
            ticking = true;
        }
    };

    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    window.addEventListener('resize', requestScrollUpdate);
    updateScrollUI();

    backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    /* ---------------------------------------------------------------------
       Mobile navigation
    --------------------------------------------------------------------- */
    const closeMenu = () => {
        if (!navLinks?.classList.contains('is-open')) {
            return;
        }

        navLinks.classList.remove('is-open');
        menuToggle?.setAttribute('aria-expanded', 'false');
        menuToggle?.setAttribute('aria-label', 'Open navigation menu');
        body.classList.remove('menu-open');
    };

    const openMenu = () => {
        navLinks?.classList.add('is-open');
        menuToggle?.setAttribute('aria-expanded', 'true');
        menuToggle?.setAttribute('aria-label', 'Close navigation menu');
        body.classList.add('menu-open');
    };

    menuToggle?.addEventListener('click', () => {
        if (navLinks?.classList.contains('is-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    navLinkItems.forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (event) => {
        if (!navLinks?.classList.contains('is-open')) {
            return;
        }

        if (!navLinks.contains(event.target) && !menuToggle?.contains(event.target)) {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 960) {
            closeMenu();
        }
    });

    /* ---------------------------------------------------------------------
       Portfolio tabs
    --------------------------------------------------------------------- */
    const portfolioTabs = Array.from(document.querySelectorAll('[data-portfolio-tab]'));
    const portfolioPanels = Array.from(document.querySelectorAll('[data-portfolio-panel]'));

    if (portfolioTabs.length && portfolioPanels.length) {
        const revealPanelItems = (panel) => {
            panel.querySelectorAll('.reveal').forEach((item) => item.classList.add('is-visible'));
        };

        const activatePortfolioTab = (target, options = {}) => {
            const activeTab = portfolioTabs.find((tab) => tab.dataset.portfolioTab === target);

            if (!activeTab) {
                return;
            }

            portfolioTabs.forEach((tab) => {
                const isActive = tab === activeTab;
                tab.classList.toggle('is-active', isActive);
                tab.setAttribute('aria-selected', String(isActive));
                tab.tabIndex = isActive ? 0 : -1;
            });

            portfolioPanels.forEach((panel) => {
                const isActive = panel.dataset.portfolioPanel === target;
                panel.classList.toggle('is-active', isActive);
                panel.hidden = !isActive;

                if (isActive) {
                    revealPanelItems(panel);
                }
            });

            if (options.focus) {
                activeTab.focus();
            }

            if (options.scroll) {
                window.requestAnimationFrame(() => {
                    document.getElementById(target)?.scrollIntoView({
                        behavior: reduceMotion ? 'auto' : 'smooth',
                        block: 'start',
                    });
                });
            }
        };

        const syncPortfolioTabFromHash = () => {
            const target = window.location.hash.replace('#', '');

            if (!portfolioPanels.some((panel) => panel.dataset.portfolioPanel === target)) {
                return;
            }

            const activePanel = portfolioPanels.find(
                (panel) => panel.dataset.portfolioPanel === target && !panel.hidden
            );

            activatePortfolioTab(target, { scroll: !activePanel });
        };

        portfolioTabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                activatePortfolioTab(tab.dataset.portfolioTab);
            });

            tab.addEventListener('keydown', (event) => {
                let nextIndex = null;

                if (event.key === 'ArrowRight') {
                    nextIndex = (index + 1) % portfolioTabs.length;
                } else if (event.key === 'ArrowLeft') {
                    nextIndex = (index - 1 + portfolioTabs.length) % portfolioTabs.length;
                } else if (event.key === 'Home') {
                    nextIndex = 0;
                } else if (event.key === 'End') {
                    nextIndex = portfolioTabs.length - 1;
                }

                if (nextIndex === null) {
                    return;
                }

                event.preventDefault();
                activatePortfolioTab(portfolioTabs[nextIndex].dataset.portfolioTab, { focus: true });
            });
        });

        window.addEventListener('hashchange', syncPortfolioTabFromHash);
        syncPortfolioTabFromHash();
    }

    /* ---------------------------------------------------------------------
       Active navigation link
    --------------------------------------------------------------------- */
    if ('IntersectionObserver' in window && sections.length) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    const activeId = entry.target.id;

                    navLinkItems.forEach((link) => {
                        const isActive = link.dataset.section === activeId;
                        link.classList.toggle('is-active', isActive);
                        if (isActive) {
                            link.setAttribute('aria-current', 'true');
                        } else {
                            link.removeAttribute('aria-current');
                        }
                    });
                });
            },
            {
                rootMargin: '-35% 0px -55% 0px',
                threshold: 0,
            }
        );

        sections.forEach((section) => sectionObserver.observe(section));
    }

    /* ---------------------------------------------------------------------
       Reveal on scroll
    --------------------------------------------------------------------- */
    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach((item) => item.classList.add('is-visible'));
    } else {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -40px 0px',
            }
        );

        revealItems.forEach((item) => revealObserver.observe(item));
    }

    /* ---------------------------------------------------------------------
       Parallax
    --------------------------------------------------------------------- */
    const parallaxRoot = document.documentElement;
    const aboutImageCard = document.querySelector('.about__image-card');
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileParallaxQuery = window.matchMedia('(max-width: 760px)');
    const parallaxValues = new Map();
    let parallaxFrame = null;
    let parallaxActive = false;

    const clampParallax = (value, min, max) => Math.min(Math.max(value, min), max);

    const setParallaxValue = (name, value) => {
        const rounded = Math.round(value * 100) / 100;

        if (parallaxValues.get(name) === rounded) {
            return;
        }

        parallaxValues.set(name, rounded);
        parallaxRoot.style.setProperty(`--parallax-${name}`, String(rounded));
    };

    const clearParallaxValues = () => {
        parallaxValues.forEach((value, name) => {
            parallaxRoot.style.removeProperty(`--parallax-${name}`);
        });
        parallaxValues.clear();
    };

    const renderParallax = () => {
        const scrollTop = window.scrollY;
        const viewportHeight = window.innerHeight || 1;
        const mobileFactor = mobileParallaxQuery.matches ? 0.45 : 1;
        const heroTravel = Math.min(scrollTop, viewportHeight * 1.2) * mobileFactor;

        setParallaxValue('bg-grid', clampParallax(scrollTop * 0.035, -50, 50));
        setParallaxValue('glow-one-x', clampParallax(scrollTop * 0.03, -60, 60));
        setParallaxValue('glow-one-y', clampParallax(scrollTop * 0.06, -70, 70));
        setParallaxValue('glow-two-x', clampParallax(scrollTop * -0.025, -50, 50));
        setParallaxValue('glow-two-y', clampParallax(scrollTop * -0.045, -60, 60));
        setParallaxValue('hero', clampParallax(heroTravel * -0.08, -30, 30));
        setParallaxValue('orbit-one-x', clampParallax(heroTravel * 0.02, -18, 18));
        setParallaxValue('orbit-one-y', clampParallax(heroTravel * -0.03, -20, 20));
        setParallaxValue('orbit-two-x', clampParallax(heroTravel * -0.025, -20, 20));
        setParallaxValue('orbit-two-y', clampParallax(heroTravel * 0.02, -16, 16));
        setParallaxValue('float-top-x', clampParallax(heroTravel * -0.035, -20, 20));
        setParallaxValue('float-top-y', clampParallax(heroTravel * -0.055, -26, 26));
        setParallaxValue('float-bottom-x', clampParallax(heroTravel * 0.03, -18, 18));
        setParallaxValue('float-bottom-y', clampParallax(heroTravel * 0.045, -24, 24));
        setParallaxValue('float-side-x', clampParallax(heroTravel * -0.022, -16, 16));
        setParallaxValue('float-side-y', clampParallax(heroTravel * 0.035, -20, 20));

        if (aboutImageCard) {
            const rect = aboutImageCard.getBoundingClientRect();
            const relativePosition = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
            const imageShift = clampParallax(relativePosition * -18, -14, 14) * mobileFactor;

            setParallaxValue('about-y', imageShift);
        }
    };

    const requestParallax = () => {
        if (!parallaxActive || parallaxFrame !== null) {
            return;
        }

        parallaxFrame = window.requestAnimationFrame(() => {
            parallaxFrame = null;

            if (parallaxActive) {
                renderParallax();
            }
        });
    };

    const updateParallaxPreference = () => {
        const shouldRun = !reduceMotionQuery.matches;

        if (shouldRun === parallaxActive) {
            return;
        }

        parallaxActive = shouldRun;

        if (parallaxActive) {
            requestParallax();
        } else {
            clearParallaxValues();
        }
    };

    parallaxActive = !reduceMotionQuery.matches;

    if (parallaxActive) {
        requestParallax();
    }

    window.addEventListener('scroll', requestParallax, { passive: true });
    window.addEventListener('resize', () => {
        updateParallaxPreference();
        requestParallax();
    }, { passive: true });

    reduceMotionQuery.addEventListener?.('change', updateParallaxPreference);
    mobileParallaxQuery.addEventListener?.('change', requestParallax);

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            requestParallax();
        }
    });

    /* ---------------------------------------------------------------------
       Hero 3D tilt and cursor glow
    --------------------------------------------------------------------- */
    const heroSection = document.getElementById('home');
    const heroVisual = document.querySelector('.hero__visual');
    const heroTiltQuery = window.matchMedia('(any-hover: hover) and (any-pointer: fine) and (min-width: 761px)');
    const heroTiltState = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        glowX: 50,
        glowY: 50,
        targetGlowX: 50,
        targetGlowY: 50,
        bgX: 0,
        bgY: 0,
        targetBgX: 0,
        targetBgY: 0,
        frame: null,
    };
    let heroTiltActive = false;

    const applyHeroTilt = () => {
        parallaxRoot.style.setProperty('--hero-tilt-x', heroTiltState.x.toFixed(2));
        parallaxRoot.style.setProperty('--hero-tilt-y', heroTiltState.y.toFixed(2));
        parallaxRoot.style.setProperty('--hero-glow-x', `${heroTiltState.glowX.toFixed(2)}%`);
        parallaxRoot.style.setProperty('--hero-glow-y', `${heroTiltState.glowY.toFixed(2)}%`);
        parallaxRoot.style.setProperty('--bg-pointer-x', heroTiltState.bgX.toFixed(3));
        parallaxRoot.style.setProperty('--bg-pointer-y', heroTiltState.bgY.toFixed(3));
    };

    const animateHeroTilt = () => {
        const easing = 0.14;

        heroTiltState.x += (heroTiltState.targetX - heroTiltState.x) * easing;
        heroTiltState.y += (heroTiltState.targetY - heroTiltState.y) * easing;
        heroTiltState.glowX += (heroTiltState.targetGlowX - heroTiltState.glowX) * easing;
        heroTiltState.glowY += (heroTiltState.targetGlowY - heroTiltState.glowY) * easing;
        heroTiltState.bgX += (heroTiltState.targetBgX - heroTiltState.bgX) * easing;
        heroTiltState.bgY += (heroTiltState.targetBgY - heroTiltState.bgY) * easing;

        const isMoving =
            Math.abs(heroTiltState.targetX - heroTiltState.x) > 0.01 ||
            Math.abs(heroTiltState.targetY - heroTiltState.y) > 0.01 ||
            Math.abs(heroTiltState.targetGlowX - heroTiltState.glowX) > 0.05 ||
            Math.abs(heroTiltState.targetGlowY - heroTiltState.glowY) > 0.05 ||
            Math.abs(heroTiltState.targetBgX - heroTiltState.bgX) > 0.005 ||
            Math.abs(heroTiltState.targetBgY - heroTiltState.bgY) > 0.005;

        applyHeroTilt();

        if (isMoving) {
            heroTiltState.frame = window.requestAnimationFrame(animateHeroTilt);
        } else {
            heroTiltState.x = heroTiltState.targetX;
            heroTiltState.y = heroTiltState.targetY;
            heroTiltState.glowX = heroTiltState.targetGlowX;
            heroTiltState.glowY = heroTiltState.targetGlowY;
            heroTiltState.bgX = heroTiltState.targetBgX;
            heroTiltState.bgY = heroTiltState.targetBgY;
            heroTiltState.frame = null;
            applyHeroTilt();
        }
    };

    const startHeroTilt = () => {
        if (!heroTiltActive || heroTiltState.frame !== null) {
            return;
        }

        heroTiltState.frame = window.requestAnimationFrame(animateHeroTilt);
    };

    const resetHeroTilt = () => {
        heroTiltState.targetX = 0;
        heroTiltState.targetY = 0;
        heroTiltState.targetGlowX = 50;
        heroTiltState.targetGlowY = 50;
        heroTiltState.targetBgX = 0;
        heroTiltState.targetBgY = 0;
        startHeroTilt();
    };

    const handleHeroPointerMove = (event) => {
        if (!heroTiltActive || !heroVisual) {
            return;
        }

        const rect = heroVisual.getBoundingClientRect();

        if (rect.width === 0 || rect.height === 0) {
            return;
        }

        const pointerX = clampParallax((event.clientX - rect.left) / rect.width, 0, 1);
        const pointerY = clampParallax((event.clientY - rect.top) / rect.height, 0, 1);
        const maxTilt = 8.5;

        heroTiltState.targetX = (0.5 - pointerY) * 2 * maxTilt;
        heroTiltState.targetY = (pointerX - 0.5) * 2 * maxTilt;
        heroTiltState.targetGlowX = pointerX * 100;
        heroTiltState.targetGlowY = pointerY * 100;
        heroTiltState.targetBgX = (pointerX - 0.5) * 2;
        heroTiltState.targetBgY = (pointerY - 0.5) * 2;

        startHeroTilt();
    };

    const updateHeroTiltPreference = () => {
        const shouldRun = !reduceMotionQuery.matches && heroTiltQuery.matches;

        if (shouldRun === heroTiltActive) {
            return;
        }

        heroTiltActive = shouldRun;

        if (!heroTiltActive) {
            if (heroTiltState.frame !== null) {
                window.cancelAnimationFrame(heroTiltState.frame);
                heroTiltState.frame = null;
            }

            heroTiltState.x = 0;
            heroTiltState.y = 0;
            heroTiltState.targetX = 0;
            heroTiltState.targetY = 0;
            heroTiltState.glowX = 50;
            heroTiltState.glowY = 50;
            heroTiltState.targetGlowX = 50;
            heroTiltState.targetGlowY = 50;
            heroTiltState.bgX = 0;
            heroTiltState.bgY = 0;
            heroTiltState.targetBgX = 0;
            heroTiltState.targetBgY = 0;
            applyHeroTilt();
        }
    };

    updateHeroTiltPreference();

    heroSection?.addEventListener('pointermove', handleHeroPointerMove, { passive: true });
    heroSection?.addEventListener('pointerleave', resetHeroTilt);
    heroSection?.addEventListener('pointercancel', resetHeroTilt);
    window.addEventListener('blur', resetHeroTilt);

    heroTiltQuery.addEventListener?.('change', updateHeroTiltPreference);
    reduceMotionQuery.addEventListener?.('change', updateHeroTiltPreference);

    /* ---------------------------------------------------------------------
       Draggable hero portrait (movable ID card)
    --------------------------------------------------------------------- */
    const heroPortrait = document.querySelector('.hero__portrait');

    if (heroPortrait) {
        let isDragging = false;
        let pointerId = null;
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;
        const maxDrag = 140;

        const applyDrag = (x, y) => {
            heroPortrait.style.setProperty('--hero-drag-x', `${x}px`);
            heroPortrait.style.setProperty('--hero-drag-y', `${y}px`);
        };

        heroPortrait.addEventListener('pointerdown', (event) => {
            isDragging = true;
            pointerId = event.pointerId;
            heroPortrait.setPointerCapture(pointerId);
            heroPortrait.classList.add('is-dragging');
            startX = event.clientX - currentX;
            startY = event.clientY - currentY;
        });

        heroPortrait.addEventListener('pointermove', (event) => {
            if (!isDragging || event.pointerId !== pointerId) {
                return;
            }

            currentX = Math.max(-maxDrag, Math.min(maxDrag, event.clientX - startX));
            currentY = Math.max(-maxDrag, Math.min(maxDrag, event.clientY - startY));
            applyDrag(currentX, currentY);
        });

        const endDrag = (event) => {
            if (!isDragging || event.pointerId !== pointerId) {
                return;
            }

            isDragging = false;
            heroPortrait.releasePointerCapture(pointerId);
            pointerId = null;
            heroPortrait.classList.remove('is-dragging');

            currentX = 0;
            currentY = 0;

            heroPortrait.style.transition = '';
            applyDrag(0, 0);
        };

        heroPortrait.addEventListener('pointerup', endDrag);
        heroPortrait.addEventListener('pointercancel', endDrag);
        heroPortrait.addEventListener('lostpointercapture', () => {
            if (isDragging) {
                isDragging = false;
                heroPortrait.classList.remove('is-dragging');
                currentX = 0;
                currentY = 0;
                applyDrag(0, 0);
            }
        });

        heroPortrait.addEventListener('mouseenter', () => {
            if (heroPortrait.classList.contains('is-rotating') || heroPortrait.classList.contains('is-dragging')) {
                return;
            }

            heroPortrait.classList.add('is-rotating');
            window.setTimeout(() => {
                // Disable the transform transition so the portrait snaps back to
                // its original angle instantly instead of animating a -360deg spin.
                heroPortrait.style.transition = 'none';
                heroPortrait.classList.remove('is-rotating');
                // Force a reflow so the transition override takes effect before
                // restoring the default transition for drag interactions.
                void heroPortrait.offsetWidth;
                heroPortrait.style.transition = '';
            }, 3000);
        });
    }

    /* ---------------------------------------------------------------------
       Cursor spotlight and subtle card tilt
    --------------------------------------------------------------------- */
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    let glowX = -1000;
    let glowY = -1000;
    let targetGlowX = -1000;
    let targetGlowY = -1000;

    window.addEventListener('mousemove', (event) => {
        targetGlowX = event.clientX;
        targetGlowY = event.clientY;
    }, { passive: true });

    const animateCursorGlow = () => {
        glowX += (targetGlowX - glowX) * 0.12;
        glowY += (targetGlowY - glowY) * 0.12;
        cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
        window.requestAnimationFrame(animateCursorGlow);
    };

    animateCursorGlow();

    /* ---------------------------------------------------------------------
       Flowing smoke canvas trail
    --------------------------------------------------------------------- */
    const smokeCanvas = document.createElement('canvas');
    smokeCanvas.className = 'cosmic-smoke-canvas';
    document.body.appendChild(smokeCanvas);
    const smokeCtx = smokeCanvas.getContext('2d');

    const smokeColorsRgb = [
        [64, 21, 47],
        [201, 163, 182],
        [143, 163, 201],
        [182, 163, 201],
    ];

    const resizeSmokeCanvas = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        smokeCanvas.width = Math.floor(window.innerWidth * ratio);
        smokeCanvas.height = Math.floor(window.innerHeight * ratio);
        smokeCanvas.style.width = `${window.innerWidth}px`;
        smokeCanvas.style.height = `${window.innerHeight}px`;
        smokeCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    resizeSmokeCanvas();
    window.addEventListener('resize', resizeSmokeCanvas);

    const smokeParticles = [];
    let smokePointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let smokeVelocity = { x: 0, y: 0 };
    let lastSmokePointer = { x: smokePointer.x, y: smokePointer.y };
    let lastSmokeEmit = 0;

    const emitSmoke = (x, y, burst = false) => {
        const count = burst ? 8 : 1;

        for (let index = 0; index < count; index += 1) {
            const color = smokeColorsRgb[Math.floor(Math.random() * smokeColorsRgb.length)];
            const angle = burst
                ? (Math.PI * 2 * index) / count + (Math.random() - 0.5) * 0.5
                : Math.atan2(smokeVelocity.y, smokeVelocity.x) + Math.PI + (Math.random() - 0.5) * 1.2;
            const speed = burst ? 0.4 + Math.random() * 1.0 : 0.05 + Math.random() * 0.25;
            const size = burst ? 8 + Math.random() * 10 : 6 + Math.random() * 8;

            smokeParticles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size,
                life: 1,
                decay: burst ? 0.02 + Math.random() * 0.015 : 0.018 + Math.random() * 0.015,
                color,
            });
        }
    };

    window.addEventListener('mousemove', (event) => {
        smokeVelocity.x = event.clientX - lastSmokePointer.x;
        smokeVelocity.y = event.clientY - lastSmokePointer.y;
        lastSmokePointer.x = event.clientX;
        lastSmokePointer.y = event.clientY;
        smokePointer.x = event.clientX;
        smokePointer.y = event.clientY;
    }, { passive: true });

    window.addEventListener('click', (event) => {
        emitSmoke(event.clientX, event.clientY, true);
    });

    const animateSmoke = () => {
        smokeCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        const now = performance.now();

        if (now - lastSmokeEmit > 32) {
            const speed = Math.hypot(smokeVelocity.x, smokeVelocity.y);

            if (speed > 1.2) {
                emitSmoke(smokePointer.x, smokePointer.y, false);
            }

            lastSmokeEmit = now;
        }

        smokeVelocity.x *= 0.82;
        smokeVelocity.y *= 0.82;

        for (let index = smokeParticles.length - 1; index >= 0; index -= 1) {
            const particle = smokeParticles[index];

            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= 0.97;
            particle.vy *= 0.97;
            particle.size *= 1.012;
            particle.life -= particle.decay;

            if (particle.life <= 0) {
                smokeParticles.splice(index, 1);
                continue;
            }

            const alpha = Math.max(0, particle.life) * 0.22;
            const gradient = smokeCtx.createRadialGradient(
                particle.x,
                particle.y,
                0,
                particle.x,
                particle.y,
                particle.size
            );
            const [r, g, b] = particle.color;

            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
            gradient.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, ${alpha * 0.45})`);
            gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

            smokeCtx.globalCompositeOperation = 'lighter';
            smokeCtx.fillStyle = gradient;
            smokeCtx.beginPath();
            smokeCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            smokeCtx.fill();
        }

        smokeCtx.globalCompositeOperation = 'source-over';
        window.requestAnimationFrame(animateSmoke);
    };

    animateSmoke();

    const tiltTargets = document.querySelectorAll('.skill-card, .project-card, .certificate-card, .floating-card');

    tiltTargets.forEach((element) => {
        element.addEventListener('pointermove', (event) => {
            const rect = element.getBoundingClientRect();

            if (!rect.width || !rect.height) {
                return;
            }

            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            element.style.setProperty('--tilt-x', `${(x * 8).toFixed(2)}deg`);
            element.style.setProperty('--tilt-y', `${(-y * 8).toFixed(2)}deg`);
        }, { passive: true });

        element.addEventListener('pointerleave', () => {
            element.style.setProperty('--tilt-x', '0deg');
            element.style.setProperty('--tilt-y', '0deg');
        });
    });

    /* ---------------------------------------------------------------------
       Certificate lightbox
    --------------------------------------------------------------------- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    let lightboxTrigger = null;

    const closeLightbox = () => {
        if (!lightbox?.classList.contains('is-open')) {
            return;
        }

        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        unlockScroll();
        lightboxTrigger?.focus();
    };

    const openLightbox = (trigger) => {
        if (!lightbox || !lightboxImage) {
            return;
        }

        lightboxTrigger = trigger;
        lightboxImage.src = trigger.dataset.full || '';
        lightboxImage.alt = trigger.dataset.caption || 'Certificate preview';
        lightboxCaption.textContent = trigger.dataset.caption || '';

        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        lockScroll();
        lightbox.querySelector('.lightbox__close')?.focus();
    };

    document.querySelectorAll('[data-lightbox-trigger]').forEach((trigger) => {
        trigger.addEventListener('click', () => openLightbox(trigger));
    });

    lightbox?.querySelectorAll('[data-lightbox-close]').forEach((closer) => {
        closer.addEventListener('click', closeLightbox);
    });

    /* ---------------------------------------------------------------------
       Project gallery
    --------------------------------------------------------------------- */
    const galleryModal = document.getElementById('galleryModal');
    const galleryTitle = document.getElementById('galleryTitle');
    const galleryImage = document.getElementById('galleryImage');
    const galleryCaption = document.getElementById('galleryCaption');
    const galleryCounter = document.getElementById('galleryCounter');
    const galleryDots = document.getElementById('galleryDots');
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');
    const galleryDataElement = document.getElementById('projectGalleryData');

    let projects = [];
    let activeProject = null;
    let activeImageIndex = 0;
    let galleryTrigger = null;
    let touchStartX = 0;
    let touchStartY = 0;

    try {
        projects = galleryDataElement ? JSON.parse(galleryDataElement.textContent) : [];
    } catch (error) {
        projects = [];
    }

    const renderGalleryImage = () => {
        if (!activeProject || !galleryImage) {
            return;
        }

        const images = activeProject.images || [];
        const image = images[activeImageIndex];

        if (!image) {
            return;
        }

        galleryImage.src = image.src;
        galleryImage.alt = image.alt || activeProject.title;
        galleryCaption.textContent = image.caption || activeProject.title;

        if (galleryCounter) {
            galleryCounter.textContent = `${activeImageIndex + 1} / ${images.length}`;
        }

        galleryDots?.querySelectorAll('.gallery-dot').forEach((dot, index) => {
            dot.classList.toggle('is-active', index === activeImageIndex);
        });
    };

    const buildGalleryDots = () => {
        if (!galleryDots || !activeProject) {
            return;
        }

        galleryDots.innerHTML = '';

        (activeProject.images || []).forEach((image, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'gallery-dot';
            dot.setAttribute('aria-label', `Go to screenshot ${index + 1}`);
            dot.addEventListener('click', () => {
                activeImageIndex = index;
                renderGalleryImage();
            });
            galleryDots.appendChild(dot);
        });
    };

    const showGalleryImage = (index) => {
        if (!activeProject) {
            return;
        }

        const total = activeProject.images?.length || 0;

        if (total === 0) {
            return;
        }

        activeImageIndex = (index + total) % total;
        renderGalleryImage();
    };

    const closeGallery = () => {
        if (!galleryModal?.classList.contains('is-open')) {
            return;
        }

        galleryModal.classList.remove('is-open');
        galleryModal.setAttribute('aria-hidden', 'true');
        unlockScroll();
        galleryTrigger?.focus();
    };

    const openGallery = (index, trigger) => {
        const project = projects[index];

        if (!galleryModal || !project) {
            return;
        }

        activeProject = project;
        activeImageIndex = 0;
        galleryTrigger = trigger;

        if (galleryTitle) {
            galleryTitle.textContent = project.title;
        }

        galleryModal.classList.toggle('is-single', (project.images?.length || 0) <= 1);
        buildGalleryDots();
        renderGalleryImage();

        galleryModal.classList.add('is-open');
        galleryModal.setAttribute('aria-hidden', 'false');
        lockScroll();
        galleryModal.querySelector('.gallery-modal__close')?.focus();
    };

    document.querySelectorAll('[data-gallery-open]').forEach((trigger) => {
        trigger.addEventListener('click', () => {
            openGallery(Number(trigger.dataset.galleryOpen), trigger);
        });
    });

    galleryModal?.querySelectorAll('[data-gallery-close]').forEach((closer) => {
        closer.addEventListener('click', closeGallery);
    });

    galleryPrev?.addEventListener('click', () => showGalleryImage(activeImageIndex - 1));
    galleryNext?.addEventListener('click', () => showGalleryImage(activeImageIndex + 1));

    galleryModal?.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].screenX;
        touchStartY = event.changedTouches[0].screenY;
    }, { passive: true });

    galleryModal?.addEventListener('touchend', (event) => {
        const deltaX = event.changedTouches[0].screenX - touchStartX;
        const deltaY = event.changedTouches[0].screenY - touchStartY;

        if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY)) {
            return;
        }

        showGalleryImage(activeImageIndex + (deltaX < 0 ? 1 : -1));
    }, { passive: true });

    /* ---------------------------------------------------------------------
       Contact form feedback
    --------------------------------------------------------------------- */
    const contactForm = document.querySelector('.contact-form');

    contactForm?.addEventListener('submit', () => {
        const submitButton = contactForm.querySelector('button[type="submit"]');

        if (!submitButton || !contactForm.checkValidity()) {
            return;
        }

        submitButton.disabled = true;
        submitButton.style.opacity = '0.7';
        submitButton.innerHTML = 'Sending...';
    });

    /* ---------------------------------------------------------------------
       Real-time internet speed monitor
    --------------------------------------------------------------------- */
    const speedMonitor = document.getElementById('speedMonitor');

    if (speedMonitor) {
        const speedEndpoint = speedMonitor.dataset.endpoint || window.location.href;
        const speedValue = document.getElementById('speedValue');
        const speedInterval = 60000;
        const speedTimeout = 20000;
        let speedTimer = null;
        let isTestingSpeed = false;

        const setSpeedState = (state, message) => {
            speedMonitor.dataset.state = state;

            if (speedValue && speedValue.textContent !== message) {
                speedValue.textContent = message;
            }
        };

        const formatSpeed = (megabitsPerSecond) => {
            if (megabitsPerSecond >= 100) {
                return `${Math.round(megabitsPerSecond)} Mbps`;
            }

            if (megabitsPerSecond >= 10) {
                return `${megabitsPerSecond.toFixed(1)} Mbps`;
            }

            return `${megabitsPerSecond.toFixed(2)} Mbps`;
        };

        const showSpeedOffline = () => {
            setSpeedState('offline', 'Offline');
        };

        const sampleSpeed = async () => {
            if (isTestingSpeed || document.hidden) {
                return;
            }

            if (navigator.onLine === false) {
                showSpeedOffline();
                return;
            }

            isTestingSpeed = true;
            setSpeedState('testing', 'Testing…');

            const controller = new AbortController();
            const timeout = window.setTimeout(() => controller.abort(), speedTimeout);
            const url = `${speedEndpoint}${speedEndpoint.includes('?') ? '&' : '?'}speedtest=${Date.now()}`;
            const startedAt = performance.now();
            let headersAt = 0;
            let finishedAt = 0;
            let received = 0;

            try {
                const response = await fetch(url, {
                    cache: 'no-store',
                    signal: controller.signal,
                    headers: { 'Cache-Control': 'no-cache' },
                });

                if (!response.ok || !response.body) {
                    throw new Error('Speed test request failed');
                }

                headersAt = performance.now();

                const reader = response.body.getReader();

                while (true) {
                    const { done, value } = await reader.read();

                    if (done) {
                        break;
                    }

                    received += value.byteLength;
                }

                finishedAt = performance.now();

                const entries = performance.getEntriesByName(url, 'resource');
                const entry = entries[entries.length - 1];
                let bytes = received;
                let seconds = 0;

                if (entry && entry.encodedBodySize > 0) {
                    bytes = entry.encodedBodySize;
                }

                if (entry && entry.responseEnd > entry.responseStart) {
                    seconds = (entry.responseEnd - entry.responseStart) / 1000;
                }

                if (seconds <= 0) {
                    const bodyStartedAt = headersAt || startedAt;
                    seconds = (Math.max(finishedAt, bodyStartedAt) - bodyStartedAt) / 1000;
                }

                const megabitsPerSecond = (bytes * 8) / Math.max(seconds, 0.001) / 1000000;

                if (received === 0 || !Number.isFinite(megabitsPerSecond) || megabitsPerSecond <= 0) {
                    throw new Error('Speed test produced no usable timing');
                }

                setSpeedState('online', formatSpeed(megabitsPerSecond));
            } catch (error) {
                showSpeedOffline();
            } finally {
                window.clearTimeout(timeout);
                isTestingSpeed = false;
            }
        };

        const stopSpeedMonitor = () => {
            window.clearInterval(speedTimer);
            speedTimer = null;
        };

        const startSpeedMonitor = () => {
            if (speedTimer || document.hidden) {
                return;
            }

            sampleSpeed();
            speedTimer = window.setInterval(sampleSpeed, speedInterval);
        };

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopSpeedMonitor();
            } else {
                startSpeedMonitor();
            }
        });

        window.addEventListener('online', startSpeedMonitor);
        window.addEventListener('offline', () => {
            stopSpeedMonitor();
            showSpeedOffline();
        });

        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(startSpeedMonitor, { timeout: 4000 });
        } else {
            window.setTimeout(startSpeedMonitor, 2000);
        }
    }

    /* ---------------------------------------------------------------------
       Ambient starfield background
    --------------------------------------------------------------------- */
    const starCanvas = document.getElementById('starfield');

    if (starCanvas) {
        const starContext = starCanvas.getContext('2d');
        const starPalette = [
            [231, 211, 220],
            [201, 163, 182],
            [150, 170, 235],
            [190, 176, 230],
        ];
        const starColors = starPalette.map(([red, green, blue]) => `${red}, ${green}, ${blue}`);
        const starSprites = starPalette.map(([red, green, blue]) => {
            const sprite = document.createElement('canvas');
            const size = 32;
            sprite.width = size;
            sprite.height = size;

            const spriteContext = sprite.getContext('2d');
            const gradient = spriteContext.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
            gradient.addColorStop(0, `rgba(${red}, ${green}, ${blue}, 1)`);
            gradient.addColorStop(0.22, `rgba(${red}, ${green}, ${blue}, 0.55)`);
            gradient.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 0)`);

            spriteContext.fillStyle = gradient;
            spriteContext.fillRect(0, 0, size, size);

            return sprite;
        });

        const stars = [];
        const shootingStars = [];
        const flowParticles = [];
        let starfieldWidth = 0;
        let starfieldHeight = 0;
        let starfieldFrame = null;
        let starfieldResizeTimer = null;
        let starfieldLastTime = 0;
        let nextShootingStarAt = 0;

        const randomBetween = (min, max) => min + Math.random() * (max - min);

        const seedStarfield = () => {
            stars.length = 0;
            shootingStars.length = 0;
            flowParticles.length = 0;

            const density = starfieldWidth < 760 ? 10500 : 13500;
            const starCount = Math.min(120, Math.max(26, Math.round((starfieldWidth * starfieldHeight) / density)));

            for (let index = 0; index < starCount; index += 1) {
                stars.push({
                    x: Math.random() * starfieldWidth,
                    y: Math.random() * starfieldHeight,
                    radius: randomBetween(0.45, 1.5),
                    alpha: randomBetween(0.16, 0.62),
                    speed: randomBetween(0.18, 0.5),
                    drift: randomBetween(-0.08, 0.08),
                    twinkle: randomBetween(0.0004, 0.0013),
                    phase: Math.random() * Math.PI * 2,
                    sprite: starSprites[Math.floor(Math.random() * starSprites.length)],
                });
            }

            const flowCount = starfieldWidth < 760 ? 30 : 58;

            for (let index = 0; index < flowCount; index += 1) {
                const paletteIndex = Math.floor(Math.random() * starSprites.length);
                const vx = randomBetween(0.07, 0.26);
                const vy = randomBetween(-0.26, -0.07);

                flowParticles.push({
                    x: Math.random() * starfieldWidth,
                    y: Math.random() * starfieldHeight,
                    radius: randomBetween(1.2, 3.6),
                    alpha: randomBetween(0.05, 0.17),
                    vx,
                    vy,
                    speed: Math.max(Math.hypot(vx, vy), 0.001),
                    sway: randomBetween(0.00025, 0.0007),
                    phase: Math.random() * Math.PI * 2,
                    sprite: starSprites[paletteIndex],
                    color: starColors[paletteIndex],
                });
            }
        };

        const spawnShootingStar = () => {
            const isLeftward = Math.random() < 0.5;
            const angle = isLeftward
                ? Math.PI - randomBetween(0.55, 0.95)
                : randomBetween(0.55, 0.95);
            const speed = randomBetween(6, 10);
            const paletteIndex = Math.floor(Math.random() * starSprites.length);

            shootingStars.push({
                x: isLeftward
                    ? randomBetween(starfieldWidth * 0.55, starfieldWidth * 1.05)
                    : randomBetween(-starfieldWidth * 0.05, starfieldWidth * 0.45),
                y: randomBetween(-starfieldHeight * 0.15, starfieldHeight * 0.22),
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                angle,
                length: randomBetween(120, 230),
                width: randomBetween(1.2, 2),
                color: starColors[paletteIndex],
                sprite: starSprites[paletteIndex],
                age: 0,
                maxLife: randomBetween(1400, 2200),
            });
        };

        const drawFlowParticles = (time, animate, frameScale) => {
            flowParticles.forEach((particle) => {
                if (animate) {
                    particle.x += (particle.vx + Math.sin(time * particle.sway + particle.phase) * 0.08) * frameScale;
                    particle.y += (particle.vy + Math.cos(time * particle.sway * 0.8 + particle.phase) * 0.04) * frameScale;

                    if (particle.y < -40) {
                        particle.y = starfieldHeight + 40;
                        particle.x = Math.random() * starfieldWidth;
                    }

                    if (particle.x > starfieldWidth + 40) {
                        particle.x = -40;
                        particle.y = Math.random() * starfieldHeight;
                    } else if (particle.x < -40) {
                        particle.x = starfieldWidth + 40;
                        particle.y = Math.random() * starfieldHeight;
                    }
                }

                const twinkle = animate ? 0.62 + Math.sin(time * particle.sway * 3 + particle.phase) * 0.38 : 1;
                const alpha = Math.max(0, particle.alpha * twinkle);
                const size = particle.radius * 12;
                const trailLength = Math.min(particle.radius * 14, 42);
                const tailX = particle.x - (particle.vx / particle.speed) * trailLength;
                const tailY = particle.y - (particle.vy / particle.speed) * trailLength;

                starContext.lineCap = 'round';

                starContext.globalAlpha = 1;
                starContext.strokeStyle = `rgba(${particle.color}, ${alpha * 0.34})`;
                starContext.lineWidth = Math.max(1, particle.radius * 1.6);
                starContext.beginPath();
                starContext.moveTo(tailX, tailY);
                starContext.lineTo(particle.x, particle.y);
                starContext.stroke();

                starContext.strokeStyle = `rgba(${particle.color}, ${alpha * 0.8})`;
                starContext.lineWidth = Math.max(0.5, particle.radius * 0.55);
                starContext.beginPath();
                starContext.moveTo(tailX, tailY);
                starContext.lineTo(particle.x, particle.y);
                starContext.stroke();

                starContext.globalAlpha = alpha;
                starContext.drawImage(particle.sprite, particle.x - size / 2, particle.y - size / 2, size, size);
            });

            starContext.globalAlpha = 1;
        };

        const drawShootingStars = (animate, frameScale, delta) => {
            starContext.globalCompositeOperation = 'lighter';

            for (let index = shootingStars.length - 1; index >= 0; index -= 1) {
                const meteor = shootingStars[index];

                if (animate) {
                    meteor.age += delta;
                    meteor.x += meteor.vx * frameScale;
                    meteor.y += meteor.vy * frameScale;
                }

                const progress = meteor.age / meteor.maxLife;
                const isOffscreen =
                    meteor.y > starfieldHeight + 200 ||
                    meteor.x < -200 ||
                    meteor.x > starfieldWidth + 200;

                if (animate && (progress >= 1 || isOffscreen)) {
                    shootingStars.splice(index, 1);
                    continue;
                }

                const fade = Math.max(0, Math.min(progress / 0.12, (1 - progress) / 0.28, 1));
                const tailX = meteor.x - Math.cos(meteor.angle) * meteor.length;
                const tailY = meteor.y - Math.sin(meteor.angle) * meteor.length;
                const trail = starContext.createLinearGradient(tailX, tailY, meteor.x, meteor.y);
                trail.addColorStop(0, `rgba(${meteor.color}, 0)`);
                trail.addColorStop(0.62, `rgba(${meteor.color}, ${0.18 * fade})`);
                trail.addColorStop(1, `rgba(${meteor.color}, ${0.85 * fade})`);

                starContext.strokeStyle = trail;
                starContext.lineCap = 'round';

                starContext.globalAlpha = 0.28 * fade;
                starContext.lineWidth = meteor.width * 4;
                starContext.beginPath();
                starContext.moveTo(tailX, tailY);
                starContext.lineTo(meteor.x, meteor.y);
                starContext.stroke();

                starContext.globalAlpha = 1;
                starContext.lineWidth = meteor.width;
                starContext.beginPath();
                starContext.moveTo(tailX, tailY);
                starContext.lineTo(meteor.x, meteor.y);
                starContext.stroke();

                const glowSize = meteor.width * 18;
                starContext.globalAlpha = 0.9 * fade;
                starContext.drawImage(meteor.sprite, meteor.x - glowSize / 2, meteor.y - glowSize / 2, glowSize, glowSize);
            }

            starContext.globalAlpha = 1;
            starContext.globalCompositeOperation = 'source-over';
        };

        const drawStarfield = (time, animate, delta = 16.667) => {
            const frameScale = Math.min(delta / 16.667, 3);

            starContext.clearRect(0, 0, starfieldWidth, starfieldHeight);

            drawFlowParticles(time, animate, frameScale);

            stars.forEach((star) => {
                if (animate) {
                    star.y -= star.speed * frameScale;
                    star.x += star.drift * frameScale;

                    if (star.y < -12) {
                        star.y = starfieldHeight + 12;
                        star.x = Math.random() * starfieldWidth;
                    }

                    if (star.x < -12) {
                        star.x = starfieldWidth + 12;
                    } else if (star.x > starfieldWidth + 12) {
                        star.x = -12;
                    }
                }

                const twinkle = animate ? 0.72 + Math.sin(time * star.twinkle + star.phase) * 0.28 : 1;
                const size = star.radius * 9;

                starContext.globalAlpha = Math.max(0, star.alpha * twinkle);
                starContext.drawImage(star.sprite, star.x - size / 2, star.y - size / 2, size, size);
            });

            drawShootingStars(animate, frameScale, delta);

            starContext.globalAlpha = 1;
        };

        const renderStarfield = (time) => {
            starfieldFrame = null;

            const delta = starfieldLastTime ? Math.min(time - starfieldLastTime, 64) : 16.667;
            starfieldLastTime = time;

            if (time >= nextShootingStarAt) {
                spawnShootingStar();
                nextShootingStarAt = time + randomBetween(1900, 2100);
            }

            drawStarfield(time, true, delta);
            starfieldFrame = window.requestAnimationFrame(renderStarfield);
        };

        const stopStarfield = () => {
            if (starfieldFrame !== null) {
                window.cancelAnimationFrame(starfieldFrame);
                starfieldFrame = null;
            }

            starfieldLastTime = 0;
        };

        const startStarfield = () => {
            if (starfieldFrame !== null) {
                return;
            }

            starfieldLastTime = 0;
            starfieldFrame = window.requestAnimationFrame(renderStarfield);
        };

        const refreshStarfield = () => {
            stopStarfield();
            nextShootingStarAt = window.performance.now() + randomBetween(1000, 2000);
            drawStarfield(0, false);
            startStarfield();
        };

        const resizeStarfield = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            starfieldWidth = window.innerWidth;
            starfieldHeight = window.innerHeight;
            starCanvas.width = Math.round(starfieldWidth * dpr);
            starCanvas.height = Math.round(starfieldHeight * dpr);
            starContext.setTransform(dpr, 0, 0, dpr, 0, 0);
            seedStarfield();
            refreshStarfield();
        };

        resizeStarfield();

        window.addEventListener('resize', () => {
            window.clearTimeout(starfieldResizeTimer);
            starfieldResizeTimer = window.setTimeout(resizeStarfield, 150);
        }, { passive: true });
    }

    /* ---------------------------------------------------------------------
       Keyboard support and focus management
    --------------------------------------------------------------------- */
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
            closeLightbox();
            closeGallery();
        }

        if (!galleryModal?.classList.contains('is-open')) {
            return;
        }

        if (event.key === 'ArrowLeft') {
            showGalleryImage(activeImageIndex - 1);
        }

        if (event.key === 'ArrowRight') {
            showGalleryImage(activeImageIndex + 1);
        }

        if (event.key === 'Tab') {
            const focusable = Array.from(
                galleryModal.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')
            ).filter((element) => !element.hasAttribute('hidden'));

            if (!focusable.length) {
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });
})();
