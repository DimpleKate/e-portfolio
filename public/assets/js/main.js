(() => {
    'use strict';

    const body = document.body;
    const header = document.getElementById('siteHeader');
    const progressBar = document.getElementById('scrollProgress');
    const backToTop = document.getElementById('backToTop');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinkItems = Array.from(document.querySelectorAll('.nav-link'));
    const sections = Array.from(document.querySelectorAll('main section[id]'));
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
       Certificate lightbox
    --------------------------------------------------------------------- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxLink = document.getElementById('lightboxLink');
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

        if (lightboxLink) {
            const link = trigger.dataset.link || '';
            lightboxLink.hidden = link === '';
            lightboxLink.href = link;
        }

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
       Project filters
    --------------------------------------------------------------------- */
    const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
    const projectCards = Array.from(document.querySelectorAll('[data-category]'));

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            filterButtons.forEach((item) => {
                const active = item === button;
                item.classList.toggle('is-active', active);
                item.setAttribute('aria-pressed', active ? 'true' : 'false');
            });

            projectCards.forEach((card) => {
                const visible = filter === 'all' || card.dataset.category === filter;
                card.classList.toggle('is-hidden', !visible);
            });
        });
    });

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
