'use strict';
const contentDirectory = 'contents/';
const sectionNames = ['home', 'publications', 'ongoing', 'activities', 'awards'];

async function readText(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
    return response.text();
}

function prepareLinks(container) {
    container.querySelectorAll('a[href]').forEach(link => {
        if (/^https?:\/\//i.test(link.getAttribute('href'))) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }
    });
}

function startHeroAnimation() {
    const heading = document.getElementById('top-section-bg-text');
    const markup = heading.innerHTML;
    const accessibleText = heading.textContent.trim();
    // Clone the complete sentence to reserve exactly the same line wrapping.
    const reserve = document.createElement('span');
    reserve.className = 'typing-reserve';
    reserve.innerHTML = markup;
    reserve.setAttribute('aria-hidden', 'true');
    const display = document.createElement('span');
    display.className = 'typing-display';
    display.setAttribute('aria-hidden', 'true');
    const tokens = markup.trim().split(/\s+/);
    tokens.forEach((token, index) => {
        if (index) display.append(document.createTextNode(' '));
        const word = document.createElement('span');
        word.className = 'typing-word';
        word.innerHTML = token;
        display.append(word);
    });
    heading.replaceChildren(reserve, display);
    heading.setAttribute('aria-label', accessibleText);
    const words = [...display.children];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer;
    let cursor = 0;
    function tick() {
        words[cursor].classList.add('is-visible');
        cursor += 1;
        if (cursor < words.length) timer = setTimeout(tick, 500);
        else timer = setTimeout(() => {
            words.forEach(word => word.classList.remove('is-visible'));
            cursor = 0;
            timer = setTimeout(tick, 500);
        }, 3000);
    }
    function reset() {
        clearTimeout(timer);
        cursor = 0;
        words.forEach(word => word.classList.toggle('is-visible', reducedMotion.matches));
        if (!reducedMotion.matches) tick();
    }
    reducedMotion.addEventListener('change', reset);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) clearTimeout(timer);
        else reset();
    });
    reset();
}

async function typesetIfNeeded(container) {
    // MathJax is optional; ordinary content never waits for its CDN.
    if (!/\$|\\\(|\\\[/.test(container.textContent)) return;
    try {
        if (!window.MathJax) {
            window.MathJax = { tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] } };
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'static/js/tex-svg.js';
                script.onload = resolve;
                script.onerror = reject;
                document.head.append(script);
            });
        }
        await window.MathJax.startup?.promise;
        if (window.MathJax.typesetPromise) await window.MathJax.typesetPromise([container]);
    } catch (error) { console.warn('Optional math rendering unavailable', error); }
}

window.addEventListener('DOMContentLoaded', async () => {
    document.querySelectorAll('#navbarResponsive .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const menu = document.getElementById('navbarResponsive');
            if (window.bootstrap && menu.classList.contains('show')) {
                bootstrap.Collapse.getOrCreateInstance(menu).hide();
            }
        });
    });
    // Fetch configuration and all sections concurrently.
    const configuration = (async () => {
        try {
            const values = jsyaml.load(await readText(contentDirectory + 'config.yml'));
            Object.entries(values || {}).forEach(([key, value]) => {
                const element = document.getElementById(key);
                if (element) element.innerHTML = String(value);
            });
        } catch (error) { console.warn('Using default page configuration', error); }
        startHeroAnimation();
    })();
    marked.use({ mangle: false, headerIds: false });
    const sections = sectionNames.map(async name => {
        const container = document.getElementById(name + '-md');
        try {
            container.innerHTML = marked.parse(await readText(contentDirectory + name + '.md'));
            prepareLinks(container);
            container.querySelectorAll('.paper-details').forEach(details => {
                details.addEventListener('toggle', () => {
                    if (details.open) details.querySelectorAll('img[data-src]').forEach(img => {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    });
                });
            });
            void typesetIfNeeded(container);
        } catch (error) {
            container.innerHTML = '<p class="load-error">This section could not be loaded. Please refresh the page to try again.</p>';
            console.error(error);
        } finally { container.setAttribute('aria-busy', 'false'); }
    });
    prepareLinks(document);
    await Promise.allSettled([configuration, ...sections]);
    if (window.bootstrap) new bootstrap.ScrollSpy(document.body, { target: '#mainNav', offset: 95 });
});
