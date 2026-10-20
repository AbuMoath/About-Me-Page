/* ==========================================================
   Khaled Qamhan portfolio: vanilla JS, no dependencies.
   Only transform/opacity are animated for 60fps.
   ========================================================== */
(function () {
    'use strict';

    var root = document.documentElement;
    var body = document.body;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var $ = function (s, c) { return (c || document).querySelector(s); };
    var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

    /* ---------- Theme toggle ---------- */
    var themeBtn = $('#themeToggle');
    function setTheme(t) {
        root.setAttribute('data-theme', t);
        try { localStorage.setItem('theme', t); } catch (e) {}
        themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
        var meta = $('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', t === 'dark' ? '#0a0a0a' : '#f5f5f5');
    }
    setTheme(root.getAttribute('data-theme') || 'dark');
    themeBtn.addEventListener('click', function () {
        setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });

    $('#year').textContent = new Date().getFullYear();

    /* ---------- Split text into masked words ---------- */
    $$('[data-split]').forEach(function (el) {
        var words = el.textContent.trim().split(/\s+/);
        el.textContent = '';
        words.forEach(function (word, i) {
            var w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
            var wi = document.createElement('span'); wi.className = 'wi'; wi.style.setProperty('--i', i);
            wi.textContent = word;
            w.appendChild(wi);
            el.appendChild(w);
            if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
        });
    });

    /* ---------- Preloader ---------- */
    var preloader = $('#preloader');
    var nameEl = $('#preloaderName');
    var countEl = $('#preloaderCount');
    var barEl = $('#preloaderBar');
    var hero = $('.hero');

    nameEl.setAttribute('aria-hidden', 'true');
    var letters = nameEl.textContent;
    nameEl.textContent = '';
    letters.split('').forEach(function (c, i) {
        var s = document.createElement('span'); s.className = 'ch'; s.style.setProperty('--i', i);
        s.textContent = c === ' ' ? ' ' : c;
        nameEl.appendChild(s);
    });

    var started = false;
    function startSite() {
        if (started) return; started = true;
        preloader.classList.add('is-done');
        body.classList.remove('is-loading');
        setTimeout(function () { hero.classList.add('is-in'); }, reduceMotion ? 0 : 450);
        setTimeout(function () { preloader.style.display = 'none'; }, 1300);
    }

    (function runPreloader() {
        if (reduceMotion) { startSite(); return; }
        var duration = 1600, t0 = null;
        function tick(ts) {
            if (t0 === null) t0 = ts;
            var p = Math.min((ts - t0) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            countEl.textContent = Math.round(eased * 100);
            barEl.style.transform = 'scaleX(' + eased + ')';
            if (p < 1) requestAnimationFrame(tick); else setTimeout(startSite, 250);
        }
        requestAnimationFrame(tick);
        setTimeout(startSite, 4000); // safety net
    })();

    /* ---------- Scroll reveals + stagger + counters ---------- */
    $$('[data-stagger]').forEach(function (group) {
        Array.prototype.forEach.call(group.children, function (child, i) { child.style.setProperty('--i', i); });
    });
    $$('.skills > *, #projectGrid > *').forEach(function (el, i) { el.style.setProperty('--i', i % 3); });

    function runCounter(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        if (reduceMotion) { el.textContent = target; return; }
        var d = 1400, t0 = null;
        (function step(ts) {
            if (t0 === null) t0 = ts;
            var p = Math.min((ts - t0) / d, 1);
            el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(step);
        })(performance.now());
    }

    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                e.target.classList.add('in');
                $$('[data-count]', e.target).forEach(runCounter);
                io.unobserve(e.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
        $$('[data-reveal]').forEach(function (el) { io.observe(el); });
    } else {
        $$('[data-reveal]').forEach(function (el) { el.classList.add('in'); });
        $$('[data-count]').forEach(runCounter);
    }

    /* ---------- Scroll-driven effects (single rAF loop) ---------- */
    var progressBar = $('#progressBar');
    var header = $('#header');
    var timeline = $('#timeline');
    var timelineFill = $('#timelineFill');
    var tlItems = $$('.tl-item');
    var parallaxEls = $$('[data-parallax]');
    var lastY = 0, ticking = false;

    function onScroll() {
        var y = window.scrollY || window.pageYOffset;
        var max = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';

        header.classList.toggle('is-scrolled', y > 24);
        var menuOpen = header.classList.contains('is-menu-open');
        header.classList.toggle('is-hidden', !menuOpen && y > 400 && y > lastY + 4);
        if (y < lastY - 4) header.classList.remove('is-hidden');
        lastY = y;

        if (timeline) {
            var r = timeline.getBoundingClientRect();
            var vh = window.innerHeight;
            var p = Math.min(Math.max((vh * 0.65 - r.top) / r.height, 0), 1);
            timelineFill.style.setProperty('--p', p);
            tlItems.forEach(function (item) {
                var ir = item.getBoundingClientRect();
                item.classList.toggle('is-lit', ir.top < vh * 0.65);
            });
        }

        if (!reduceMotion) {
            parallaxEls.forEach(function (el) {
                var rect = el.getBoundingClientRect();
                var speed = parseFloat(el.getAttribute('data-parallax')) || 0.05;
                var offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -speed;
                el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
            });
        }
        ticking = false;
    }
    window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    /* ---------- Active nav link ---------- */
    var navLinks = $$('.nav a');
    var sections = navLinks.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
    if ('IntersectionObserver' in window) {
        var navIO = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                navLinks.forEach(function (a) {
                    var on = a.getAttribute('href') === '#' + e.target.id;
                    a.classList.toggle('is-active', on);
                    if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach(function (s) { navIO.observe(s); });
    }

    /* ---------- Mobile menu ---------- */
    var menuBtn = $('#menuBtn');
    var nav = $('#nav');
    function setMenu(open) {
        nav.classList.toggle('is-open', open);
        header.classList.toggle('is-menu-open', open);
        menuBtn.setAttribute('aria-expanded', open);
        menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        body.style.overflow = open ? 'hidden' : '';
    }
    menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
    navLinks.forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

    /* ---------- Card border glow (cursor-tracking) ---------- */
    $$('.card--glow').forEach(function (card) {
        card.addEventListener('pointermove', function (e) {
            var r = card.getBoundingClientRect();
            card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    });

    /* ---------- Custom cursor + magnetic buttons (fine pointers only) ---------- */
    if (finePointer && !reduceMotion) {
        root.classList.add('has-cursor');
        var cursor = $('#cursor');
        var dot = $('.cursor__dot', cursor);
        var ring = $('.cursor__ring', cursor);
        var mx = -100, my = -100, rx = -100, ry = -100;

        window.addEventListener('pointermove', function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
        (function loop() {
            rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
            dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
            ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
            requestAnimationFrame(loop);
        })();

        document.addEventListener('pointerover', function (e) {
            if (e.target.closest && e.target.closest('a, button, input, textarea, label, .card--glow')) cursor.classList.add('is-hover');
        });
        document.addEventListener('pointerout', function (e) {
            if (e.target.closest && e.target.closest('a, button, input, textarea, label, .card--glow')) cursor.classList.remove('is-hover');
        });
        window.addEventListener('pointerdown', function () { cursor.classList.add('is-down'); });
        window.addEventListener('pointerup', function () { cursor.classList.remove('is-down'); });

        $$('[data-magnetic]').forEach(function (el) {
            el.addEventListener('pointermove', function (e) {
                var r = el.getBoundingClientRect();
                var x = (e.clientX - (r.left + r.width / 2)) * 0.28;
                var y = (e.clientY - (r.top + r.height / 2)) * 0.35;
                el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
            });
            el.addEventListener('pointerleave', function () { el.style.transform = ''; });
        });
    }

    /* ---------- Contact form (static site: opens the visitor's mail app) ---------- */
    var form = $('#contactForm');
    var note = $('#formNote');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = form.elements.name, email = form.elements.email, msg = form.elements.message;
        var ok = true;
        [name, email, msg].forEach(function (f) {
            var valid = f.value.trim() !== '' && (f !== email || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value.trim()));
            f.setAttribute('aria-invalid', valid ? 'false' : 'true');
            if (!valid) ok = false;
        });
        if (!ok) { note.textContent = 'Please fill in every field with a valid email.'; return; }

        var subject = 'Portfolio enquiry from ' + name.value.trim();
        var bodyText = msg.value.trim() + '\n\n' + name.value.trim() + '\n' + email.value.trim();
        window.location.href = 'mailto:khaledqmhan@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(bodyText);
        note.textContent = 'Opening your email app. If nothing happens, write to khaledqmhan@gmail.com.';
    });
})();
